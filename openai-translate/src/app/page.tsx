

import { translateDemo } from "@/lib/chatModel";

export default async function Page(){


  const output = await translateDemo();


  return(
    <>
    <div className="bg-red-100 w-full min-h-screen p-4">
      <div className="font-bold bg-slate-900 flex justify-center p-4"> 
        <span>
          We will build a simple LLM application
        </span>
        </div>      
        <div className="bg-black">
          <h1>LangChain and OpenAI Demo</h1>
          <p>Italian translation</p>
          <span>{output}</span>
        </div>
    </div>
    </>
  )
}