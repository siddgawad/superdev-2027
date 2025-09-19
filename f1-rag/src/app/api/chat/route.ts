import OpenAI from "openai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
}

const {
    ASTRA_DB_TOKEN,
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_ENDPOINT,
    OPENAI_API_KEY
} = process.env;

// OpenAI client for embeddings
const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
});

// Astra DB client
const client = new DataAPIClient(ASTRA_DB_TOKEN as string);
const db = client.db(ASTRA_DB_ENDPOINT as string, { keyspace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    console.log("🚀 API route called");
    let docContext = "";

    try {
        const { messages }: { messages: Message[] } = await req.json();
        console.log("📨 Messages received:", messages?.length);
        
        const latestMessage = messages[messages.length - 1]?.content;
        console.log("💬 Latest message:", latestMessage);

        if (!latestMessage) {
            console.log("❌ No message provided");
            return new Response("No message provided", { status: 400 });
        }

        try {
            console.log("🔍 Creating embedding...");
            // Create embedding for the latest message
            const embedding = await openaiClient.embeddings.create({
                model: "text-embedding-3-small",
                input: latestMessage,
                encoding_format: "float"
            });
            console.log("✅ Embedding created");

            console.log("🔎 Querying Astra DB...");
            // Query Astra DB for relevant documents
            const collection = db.collection(ASTRA_DB_COLLECTION as string);
            const cursor = collection.find({}, {
                sort: { $vector: embedding.data[0].embedding },
                limit: 10
            });
            const documents = await cursor.toArray();
            console.log("📊 Documents found:", documents?.length);

            // Extract text from documents
            const docsMap = documents?.map(doc => doc.text);
            docContext = docsMap?.join('\n') || '';
            console.log("📝 Context length:", docContext.length, "characters");

        } catch (dbError) {
            console.log("❌ Error querying db:", dbError);
            docContext = "";
        }

        // Create system message with context
        const systemMessage = {
            role: "system" as const,
            content: `You are an AI assistant who knows everything about Formula One. Use below context to augment what you know about formula one racing. 
            The context will provide you with the most recent page data from wikipedia, the official F1 website and others. If the context does not include
            the information or answer you need, answer based on your existing knowledge and do not mention the source of your information or what the context does or does not include.
            Format responses using markdown where applicable and do not return images.
            -------------------------------------------------------------------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            --------------------------------------------------------------------------------`
        };

        // Combine system message with user messages (excluding system messages from frontend)
        const userMessages = messages.filter((msg: Message) => msg.role !== 'system');
        const allMessages = [systemMessage, ...userMessages];
        console.log("🤖 Calling OpenAI with", allMessages.length, "messages");

        // Stream the response using AI SDK
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            messages: allMessages,
            temperature: 0.7,
            maxRetries: 3,
        });

        console.log("✅ OpenAI response created, returning stream");
        return result.toTextStreamResponse();

    } catch (error) {
        console.error("💥 Error in API route:", error);
        return new Response(`Internal server error: ${error}`, { status: 500 });
    }
}