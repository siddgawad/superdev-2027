"use client"

import { useState } from "react";

export function AutoBatchDemo(){
    const [count,setCount] = useState<number>(0);
    const [flag,setFlag] = useState<boolean>(false);

    console.log("AutoBatchDemo render");

    function handleClick(){
        //sync updates
        setCount((c)=>c+1);
        setFlag((f)=>!f);

        //async updates 
        setTimeout(()=>{
            setCount((c)=>c+1);
            setFlag((f)=>!f);

        },500);
    }

    return(
        <section style={{marginBottom:"2rem"}}>
            <h2>Automatic Batching</h2>
            <p>Count: {count}</p>
            <p>Flag: {flag}</p>
            <button onClick={handleClick}>Update async + sync</button>
            <p style = {{fontSize:"0.85rem", opacity:0.7}}>
                Open DevTools to watach render logs
            </p>
        </section>
    )
}