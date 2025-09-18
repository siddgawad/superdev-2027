import Image from "next/image"
import f1logo from "../../public/f1logo.avif"
import React from "react"

export default function Navbar(){
    return(
        <div>
            <div className="fixed top-0 my-4 mx-2 flex">
                <div>
                <Image src={f1logo} width="250" alt="f1GPT Logo" />
                </div>
                <h1>All Things Formula 1</h1>
            </div>
            
        </div>
    )
}