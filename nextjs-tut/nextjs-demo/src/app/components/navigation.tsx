"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navigation = ()=>{
    const pathName = usePathname();

    return(
    <nav className="bg-gray-800 p-4 mb-2">
            <Link href="/" className={pathName==="/"?"mr-4 font-bold":"text-blue-500 mr-4"}>Home</Link>
            <Link href="/about" className={pathName==="/about"?"mr-4 font-bold":"text-blue-500 mr-4"}>About</Link>
            <Link href="/products/1" className={pathName==="/products/1"?"mr-4 font-bold":"text-blue-500 mr-4"}>Product 1</Link> 
        </nav>
    )
}