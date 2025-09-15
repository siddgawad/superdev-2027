import dotenv from "dotenv";
dotenv.config();

type Props={
    defaultModel?:string
};

export const cfg = ({ defaultModel = "openai:gpt-4o-mini" }: Props = {}) => {
return{
    defaultModel,
    get openaiKey(){
        const key = process.env.OPENAI_API_KEY;
        if (!key) {
          throw new Error("Missing OPENAI_API_KEY in environment");
        }
        return key;
    }
}

}