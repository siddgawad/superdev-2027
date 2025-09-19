import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

dotenv.config();

const {
    ASTRA_DB_TOKEN,
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_ENDPOINT,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const client = new DataAPIClient(ASTRA_DB_TOKEN);
const db = client.db(ASTRA_DB_ENDPOINT as string, { keyspace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200
});

// Comprehensive F1 Wikipedia page mapping
const f1WikipediaPages = {
    // Core F1 Pages
    core: [
        "Formula_One",
        "History_of_Formula_One", 
        "Formula_One_regulations",
        "Formula_One_car",
        "Formula_One_engine",
        "Formula_One_tyres"
    ],
    
    // Current Season & Championships
    current: [
        "2024_Formula_One_World_Championship",
        "2024_Formula_One_season",
        "2024_Formula_One_drivers'_standings",
        "2024_Formula_One_constructors'_standings",
        "List_of_Formula_One_World_Drivers'_Champions",
        "List_of_Formula_One_World_Constructors'_Champions"
    ],
    
    // Teams/Constructors (All Current Teams)
    teams: [
        "Red_Bull_Racing",
        "Scuderia_Ferrari", 
        "Mercedes-AMG_Petronas_Formula_One_Team",
        "McLaren_Formula_One_Team",
        "Aston_Martin_Formula_One_Team",
        "Alpine_F1_Team",
        "MoneyGram_Haas_F1_Team",
        "RB_Formula_One_Team",
        "Williams_Grand_Prix_Engineering",
        "Stake_F1_Team_Kick_Sauber"
    ],
    
    // Top Drivers (Current & Legends)
    drivers: [
        "Max_Verstappen",
        "Lewis_Hamilton", 
        "Charles_Leclerc",
        "Lando_Norris",
        "George_Russell",
        "Carlos_Sainz_Jr.",
        "Sergio_Pérez",
        "Fernando_Alonso",
        "Oscar_Piastri",
        "Alexander_Albon",
        "Lance_Stroll",
        "Yuki_Tsunoda",
        "Daniel_Ricciardo",
        "Nico_Hülkenberg",
        "Kevin_Magnussen",
        "Pierre_Gasly",
        "Esteban_Ocon",
        "Logan_Sargeant",
        "Valtteri_Bottas",
        "Zhou_Guanyu",
        // Legends
        "Michael_Schumacher",
        "Ayrton_Senna",
        "Alain_Prost",
        "Sebastian_Vettel",
        "Nico_Rosberg"
    ],
    
    // Circuits & Grand Prix
    circuits: [
        "List_of_Formula_One_circuits",
        "Monaco_Grand_Prix",
        "British_Grand_Prix", 
        "Italian_Grand_Prix",
        "Belgian_Grand_Prix",
        "Japanese_Grand_Prix",
        "Brazilian_Grand_Prix",
        "Australian_Grand_Prix",
        "Spanish_Grand_Prix",
        "Canadian_Grand_Prix",
        "United_States_Grand_Prix",
        "Mexican_Grand_Prix",
        "Singapore_Grand_Prix",
        "Dutch_Grand_Prix",
        "Miami_Grand_Prix",
        "Las_Vegas_Grand_Prix",
        "Qatar_Grand_Prix",
        "Saudi_Arabian_Grand_Prix",
        "Bahrain_Grand_Prix",
        "Emilia_Romagna_Grand_Prix",
        "Hungarian_Grand_Prix",
        "Austrian_Grand_Prix"
    ],
    
    // Technical & Strategy
    technical: [
        "Formula_One_racing",
        "Drag_reduction_system",
        "KERS",
        "ERS_(motor_racing)",
        "Formula_One_safety",
        "Pit_stop",
        "Formula_One_strategy",
        "Qualifying_(motorsport)",
        "Sprint_(motorsport)"
    ],
    
    // Business & Economics
    business: [
        "Formula_One_Group",
        "List_of_Formula_One_driver_salaries",
        "Economics_of_Formula_One",
        "Formula_One_sponsorship",
        "Formula_One_television_coverage"
    ],
    
    // Records & Statistics
    records: [
        "List_of_Formula_One_records",
        "List_of_Formula_One_driver_records", 
        "List_of_Formula_One_constructor_records",
        "List_of_Formula_One_race_winners",
        "List_of_Formula_One_pole_positions",
        "List_of_Formula_One_fastest_laps"
    ],
    
    // Women & Diversity
    diversity: [
        "Women_in_Formula_One",
        "List_of_female_Formula_One_drivers"
    ]
};

const stats = {
    pagesProcessed: 0,
    sectionsProcessed: 0,
    totalChunks: 0,
    errors: 0,
    startTime: Date.now(),
    processedPages: new Set<string>()
};

const createCollection = async () => {
    try {
        await db.createCollection(ASTRA_DB_COLLECTION as string, {
            vector: {
                dimension: 1536,
                metric: "cosine"
            }
        });
        console.log("✅ Collection created");
    } catch (error: unknown) {
        const err = error as { message?: string };
        if (err.message?.includes('already exists')) {
            console.log("✅ Collection already exists");
        } else {
            throw error;
        }
    }
};

// Wikipedia API approach for getting full content
const fetchWikipediaContent = async (pageTitle: string): Promise<string | null> => {
    try {
        // Get full page content via Wikipedia API
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext&titles=${encodeURIComponent(pageTitle)}`;
        
        const response = await axios.get(apiUrl, { timeout: 15000 });
        const pages = response.data.query.pages;
        
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];
        
        if (page.missing) {
            console.log(`⚠️ Page not found: ${pageTitle}`);
            return null;
        }
        
        return page.extract || null;
        
    } catch (error) {
        console.log(`❌ Error fetching ${pageTitle}: ${error}`);
        return null;
    }
};

// Advanced Wikipedia scraping for sections and links
const scrapeWikipediaPage = async (pageTitle: string): Promise<{ content: string; links: string[] }> => {
    try {
        const url = `https://en.wikipedia.org/wiki/${pageTitle}`;
        console.log(`🔍 Scraping: ${pageTitle}`);
        
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; F1Bot/1.0; Educational Research)'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Remove unwanted elements
        $('script, style, .navbox, .reflist, .citation, .reference, .mw-editsection').remove();
        
        let content = '';
        const discoveredLinks: string[] = [];
        
        // Extract main content sections
        $('.mw-parser-output').each((_: number, element: cheerio.Element) => {
            
            // Get all paragraphs and headings
            $(element).find('p, h2, h3, h4').each((_: number, el: cheerio.Element) => {
                const text = $(el).text().trim();
                if (text.length > 30) {
                    content += text + '\n\n';
                }
            });
            
            // Get table data (important for statistics, standings, etc.)
            $(element).find('.wikitable tr').each((_: number, row: cheerio.Element) => {
                const rowText = $(row).text().trim().replace(/\s+/g, ' ');
                if (rowText.length > 20) {
                    content += rowText + '\n';
                }
            });
            
            // Extract F1-related links for further crawling
            $(element).find('a[href^="/wiki/"]').each((_: number, link: cheerio.Element) => {
                const href = $(link).attr('href');
                if (href) {
                    const linkedPage = href.replace('/wiki/', '');
                    if (isF1Related(linkedPage) && !stats.processedPages.has(linkedPage)) {
                        discoveredLinks.push(linkedPage);
                    }
                }
            });
        });
        
        // Clean and format content
        content = content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .replace(/\[edit\]/g, '')
            .replace(/\[\d+\]/g, '')
            .trim();
            
        return { content, links: discoveredLinks };
        
    } catch (error) {
        console.log(`❌ Scraping failed for ${pageTitle}: ${error}`);
        return { content: '', links: [] };
    }
};

// Check if a page is F1 related
const isF1Related = (pageTitle: string): boolean => {
    const f1Keywords = [
        'formula', 'f1', 'grand_prix', 'racing', 'verstappen', 'hamilton', 'leclerc', 
        'ferrari', 'mercedes', 'red_bull', 'mclaren', 'championship', 'circuit',
        'driver', 'constructor', 'season', 'qualifying', 'pit', 'drs', 'ers'
    ];
    
    const lowerTitle = pageTitle.toLowerCase();
    return f1Keywords.some(keyword => lowerTitle.includes(keyword));
};

// Process and store content with enhanced metadata
const processAndStore = async (content: string, pageTitle: string, category: string) => {
    if (content.length < 200) return;
    
    try {
        const chunks = await splitter.splitText(content);
        const collection = db.collection(ASTRA_DB_COLLECTION as string);
        
        for (const [index, chunk] of chunks.entries()) {
            if (chunk.trim().length < 150) continue;
            
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            });
            
            await collection.insertOne({
                $vector: embedding.data[0].embedding,
                text: chunk,
                source: `Wikipedia: ${pageTitle}`,
                category: category,
                page_title: pageTitle,
                chunk_index: index,
                timestamp: new Date().toISOString(),
                relevance_score: calculateRelevance(chunk),
                url: `https://en.wikipedia.org/wiki/${pageTitle}`
            });
            
            stats.totalChunks++;
        }
        
        console.log(`✅ ${pageTitle} - ${chunks.length} chunks stored (${content.length} chars)`);
        
    } catch (error) {
        console.log(`❌ Storage error for ${pageTitle}: ${error}`);
        stats.errors++;
    }
};

// Calculate F1 relevance score with enhanced keywords
const calculateRelevance = (text: string): number => {
    const keywords = {
        // Drivers (high value)
        'verstappen': 15, 'hamilton': 15, 'leclerc': 12, 'norris': 12, 'russell': 10,
        'sainz': 10, 'perez': 10, 'alonso': 12, 'piastri': 10, 'ricciardo': 10,
        
        // Teams (high value)
        'ferrari': 10, 'mercedes': 10, 'red bull': 12, 'mclaren': 10, 'aston martin': 8,
        
        // Technical terms
        'formula 1': 15, 'f1': 12, 'grand prix': 10, 'championship': 8, 'qualifying': 6,
        'pit stop': 6, 'drs': 6, 'ers': 6, 'downforce': 6, 'aerodynamics': 6,
        
        // Business terms
        'salary': 12, 'contract': 8, 'sponsor': 6, 'revenue': 8, 'prize money': 10,
        
        // Racing terms
        'pole position': 8, 'fastest lap': 8, 'podium': 8, 'points': 6, 'standings': 8,
        'race win': 10, 'season': 6, 'circuit': 6, 'lap time': 6
    };
    
    let score = 0;
    const lowerText = text.toLowerCase();
    
    for (const [keyword, weight] of Object.entries(keywords)) {
        const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
        score += matches * weight;
    }
    
    return Math.min(score, 100);
};

// Crawl a category of pages
const crawlCategory = async (pages: string[], categoryName: string) => {
    console.log(`\n🏎️ Starting ${categoryName} category - ${pages.length} pages`);
    
    for (const pageTitle of pages) {
        if (stats.processedPages.has(pageTitle)) continue;
        
        stats.processedPages.add(pageTitle);
        
        // Try API first (faster and more reliable)
        let content = await fetchWikipediaContent(pageTitle);
        
        // If API fails or returns little content, try scraping
        if (!content || content.length < 500) {
            const scraped = await scrapeWikipediaPage(pageTitle);
            content = scraped.content;
            
            // Add discovered links for future processing (limited to avoid infinite crawling)
            if (stats.pagesProcessed < 150) {
                scraped.links.slice(0, 5).forEach(link => {
                    if (!stats.processedPages.has(link) && isF1Related(link)) {
                        pages.push(link);
                    }
                });
            }
        }
        
        if (content && content.length > 200) {
            await processAndStore(content, pageTitle, categoryName);
            stats.pagesProcessed++;
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Progress update
        if (stats.pagesProcessed % 10 === 0) {
            const elapsed = (Date.now() - stats.startTime) / 1000;
            console.log(`📊 Progress: ${stats.pagesProcessed} pages, ${stats.totalChunks} chunks, ${elapsed.toFixed(0)}s`);
        }
    }
};

// Progress monitoring
const startProgressMonitor = () => {
    const monitor = setInterval(() => {
        const elapsed = (Date.now() - stats.startTime) / 1000;
        const rate = stats.pagesProcessed / elapsed * 60; // pages per minute
        console.log(`\n📊 COMPREHENSIVE CRAWL STATUS:`);
        console.log(`   Pages processed: ${stats.pagesProcessed}`);
        console.log(`   Chunks stored: ${stats.totalChunks}`);
        console.log(`   Errors: ${stats.errors}`);
        console.log(`   Rate: ${rate.toFixed(1)} pages/min`);
        console.log(`   Elapsed: ${elapsed.toFixed(0)}s\n`);
    }, 45000); // Every 45 seconds
    
    return monitor;
};

const main = async () => {
    console.log("🏁 COMPREHENSIVE WIKIPEDIA F1 CRAWLER");
    console.log("Crawling ALL F1 content: History, Drivers, Teams, Circuits, Technical, Business...");
    console.log("=" .repeat(80));
    
    stats.startTime = Date.now();
    
    try {
        await createCollection();
        const monitor = startProgressMonitor();
        
        // Crawl all categories in order of importance
        await crawlCategory([...f1WikipediaPages.core], "Core F1");
        await crawlCategory([...f1WikipediaPages.current], "Current Season");
        await crawlCategory([...f1WikipediaPages.drivers], "Drivers");
        await crawlCategory([...f1WikipediaPages.teams], "Teams");
        await crawlCategory([...f1WikipediaPages.circuits], "Circuits & Races");
        await crawlCategory([...f1WikipediaPages.technical], "Technical");
        await crawlCategory([...f1WikipediaPages.business], "Business & Economics");
        await crawlCategory([...f1WikipediaPages.records], "Records & Stats");
        await crawlCategory([...f1WikipediaPages.diversity], "Diversity");
        
        clearInterval(monitor);
        
        const elapsed = (Date.now() - stats.startTime) / 1000;
        console.log("\n🏁 COMPREHENSIVE CRAWL COMPLETED!");
        console.log("=" .repeat(50));
        console.log(`📊 FINAL STATISTICS:`);
        console.log(`   Wikipedia pages processed: ${stats.pagesProcessed}`);
        console.log(`   Total content chunks: ${stats.totalChunks}`);
        console.log(`   Errors encountered: ${stats.errors}`);
        console.log(`   Total time: ${(elapsed/60).toFixed(1)} minutes`);
        console.log(`   Average: ${(stats.totalChunks/elapsed*60).toFixed(0)} chunks/min`);
        console.log("\n🎯 Your F1GPT now has COMPREHENSIVE Wikipedia knowledge!");
        
    } catch (error) {
        console.error("💥 Comprehensive crawler failed:", error);
        process.exit(1);
    }
};

main();