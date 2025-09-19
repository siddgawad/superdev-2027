import Image from "next/image"
import f1logo from "../../public/f1logo.avif"
import React from "react"

export default function Navbar() {
    return(
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
            <div className="flex items-center p-4">
                <div className="mr-4">
                    <Image src={f1logo} width={60} height={60} alt="f1GPT Logo" />
                </div>
                <h1 className="text-xl font-bold text-red-600">All Things Formula 1</h1>
            </div>
        </div>
    )
}