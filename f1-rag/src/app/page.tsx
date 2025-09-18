"use client"
import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { Message, MessageContent } from '@/components/ai-elements/message';
import  Navbar  from "@/components/Nav";

export default function Page(){
  const [noMessages,setNoMessages] = useState(false);
  const [input,setInput] = useState();

async function handleSubmit(){

}

async function handleInputChange(){

}

  return(
    <div>
      <div>
        <Navbar />
      </div>
      <section>
        {noMessages? (<>
        <p>Ultimate Page for Formula One Super Fans! Ask f1GPT Anything.</p>
        <br />
        {/*<PromptSuggestionRow /> */}
        </>):(<>
        {/*map mesages to text bubbles */}
        </>)}
        <form onSubmit={handleSubmit}>
          <input onChange={handleInputChange} value={input} placeholder='Ask anything'/>
          <button type="submit" />
        </form>
      </section>

    </div>
  )
}