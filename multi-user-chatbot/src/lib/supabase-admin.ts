import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL as string;
const role_key = process.env.DB_ROLE_KEY as string;

export const supabaseAdmin = createClient(
    url,role_key
    );
    