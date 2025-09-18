import {DataAPIClient} from "@datastax/astra-db-ts";
import OpenAI from "openai";
import dotenv from "dotenv";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

type SimilarityMetric=
    "dot_product" | "cosine" | "euclidean"
    
  {/*Cosine Similarity: This is the angle between two vectors. 
    It's often the default because it tells you how similar two vectors are regardless of their length.
     You don't have to normalize the vectors (scaling them down to unit length), but it's good practice. I
     t just compares the "direction" of the vectors. */}

  {/* Dot Product: This is a bit simpler. It's just multiplying corresponding components and adding them up.
     It's faster than cosine, but if the vectors aren't normalized, the length of the vectors can influence the result. 
     So usually, you normalize them first. */}

  {/* Euclidean Distance: This is the "straight-line" distance between two vectors. 
    It's like measuring the actual physical distance in multi-dimensional space.
     It doesn't care about the angle, just how far apart the points are.*/}


const {ASTRA_DB_TOKEN,ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,ASTRA_DB_ENDPOINT,
    OPENAI_API_KEY} = process.env;


    const openai = new OpenAI({apiKey:OPENAI_API_KEY});

    const f1Data = [
        "https://en.wikipedia.org/wiki/Formula_One",
        "https://www.formula1.com/",
        "https://x.com/f1",
        "https://www.espn.com/f1/"
    ]

    const client = new DataAPIClient(ASTRA_DB_TOKEN);
    const db = client.db(ASTRA_DB_ENDPOINT as string,{keyspace:ASTRA_DB_NAMESPACE});
    const results = new RecursiveCharacterTextSplitter({
        chunkSize:512,
        chunkOverlap:100
    });

    const createCollection = async (similarityMetric:SimilarityMetric = "dot_product")=>{
        await db.createCollection(ASTRA_DB_COLLECTION as string, {
            vector:{
                dimension:1536,
                metric:similarityMetric
            }
        })
    }