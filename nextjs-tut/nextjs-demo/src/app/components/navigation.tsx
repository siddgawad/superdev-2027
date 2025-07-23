"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton,UserButton, SignedIn,SignedOut} from "@clerk/nextjs"

export const Navigation = ()=>{
    const pathName = usePathname();

    return(
    <nav className="flex justify-center items-center p-4">
            <Link href="/" className={pathName==="/"?"mr-4 font-bold":"text-blue-500 mr-4"}>Home</Link>
            <Link href="/about" className={pathName==="/about"?"mr-4 font-bold":"text-blue-500 mr-4"}>About</Link>
            <Link href="/products/1" className={pathName==="/products/1"?"mr-4 font-bold":"text-blue-500 mr-4"}>Product 1</Link> 
        <SignedOut>
        <span className="mr-4 mb-1 font-bold">
            
            <SignInButton mode="modal" />
          </span>
        </SignedOut>
          <SignInButton>
          <UserButton />
          </SignInButton>
            
        </nav>
    )
}