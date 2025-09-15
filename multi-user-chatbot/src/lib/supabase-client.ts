import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL as string;
const anon = process.env.DB_KEY as string;

if(!url) throw new Error("Missing url");
if(!anon) throw new Error("Incorrect secret_key");

export const supabase = createClient(
url,anon  
);

