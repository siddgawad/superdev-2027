"use client"

import {startTransition, useMemo, useState, useTransition} from "react";

const ITEMS: string[] = Array.from(
    { length: 20000 }, (_,i)=>`Item ${i+1}`
);

// stupid heavy filter - put here on purtpsoe 

function expensiveFilter(items:string[], query: string): string[]{
    const lower = query.toLowerCase();

    let result = items.filter((items)=>items.toLowerCase().includes(lower));

    //extra useless work to slow it down further 
    for(let i=0; i<150;i++){
        result = [...result].sort();
    }

    return result;
}

export function SearchConcurrentDemo(){
    const [inputValue, setInputValue] = useState<string>("");
    const [query,setQuery] = useState<string>("");
    const [isPending,setIsPending] = useTransition();

    const filteredItems = useMemo(()=>{
        console.log("Recomputing filteredItems for query: ", query);
        if(!query) return ITEMS;
        return expensiveFilter(ITEMS,query);
    },[query]);

    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        const value = event?.target.value;

        //urgent reflect typing immediately 
        setInputValue(value);

        //non urgent: heavy compute 
        startTransition(()=>{
            setQuery(value);
        });

    }


    return(
        <section style ={{marginTop:"2rem"}}>
            <h2>concurrent search demo</h2>
            <p style={{maxWidth: 600}}>
                Type to filter a large list. The input should stay responsive while the results update.
            </p>

            <input
            value={inputValue}
            onChange={handleChange}
            placeholder="Type to search..."
            style={{padding:"0.5 rem", width: "100%", maxWidth: "320px", marginBottom:"0.5 rem"}}
            />

            {isPending && (<p style={{fontSize: "0.9rem", color: "#555" }}>Updating results...</p>)}

            <p>Showing first 20 of <strong>{filteredItems.length}</strong> items</p>
            <ul>{filteredItems.slice(0,20).map((item)=>(
                <li key={item}>{item}</li>
            ))}</ul>

      

        </section>
    )
}