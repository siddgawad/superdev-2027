import React from "react"
import SpinCarousel from "@/component/spinCarousel"

export default function   Page(){
    return(
      <div className="page-content">
          <h1>Contact<sup>03</sup></h1>
          <div className="bg-red m-10 padding-10 border-transparent rounded-2xl">
            <SpinCarousel />
          </div>
      </div>
  
    )
  }