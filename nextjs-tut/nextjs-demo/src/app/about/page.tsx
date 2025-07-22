"use client"

import { useRouter } from "next/navigation"

export default function Page(){
    const router = useRouter();

    return(
        <div>
            <h1>Hello - this is about page
                </h1>
                <button onClick={()=>router.push("/")} className="bg-blue-500 text-white p-2 rounded-md">Go home</button>
                </div>
    )
}