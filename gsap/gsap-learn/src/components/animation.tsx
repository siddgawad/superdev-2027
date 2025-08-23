"use client"

import { useEffect,useRef } from "react"

export default function Animation(){

  // we define useRef to a variable and give it HTMLDivElemet or null as inital value
  const lastRef = useRef<HTMLDivElement|null>(null);
  // first we say callback is IntersectionObserverCallback and give entries and observer as paramters 
  const callback : IntersectionObserverCallback=(entries,observer)=>{ 
 for (const entry of entries){
  // then we say for entry of entries if entry is not Intersecting continue
  if(!entry.isIntersecting) continue;
    // then we set atrget elemment 
    const el = entry.target as HTMLDivElement;
    
  // adn then we define what styles toi rtmeove or what styles to add 
  el.classList.remove("opacity-0","translate-y-6","scale-[0.97]");
  el.classList.add("opacity-100","translate-y-0","scale-100")
  // finally we say oberser.unobserve(el)
  observer.unobserve(el);
}
  }

//useEffect hook
useEffect(()=>{
//we then use that useRef as current and assign our elemet to thast current useRef 
const el = lastRef.current;
//iof we dont have element then we return 
if(!el) return;

// then we define options as a vasribale and we define our paramteres sucha s root, rootMArgin, thershold 
const options = {
  root: null,
  rootMargin:"0px 0px -10px 0px",
  threshold : 0.5
}
//thern we define the obserever as new IntersectionObsercver and give apramters as callback and options 
const observer = new IntersectionObserver(callback,options);

//then we say observer.observe the element

observer.observe(el);
//return oberserver.disconnect
return()=>observer.disconnect();
//close the hook and add empty dependndency array
},[]);





    return(
        <>
         <div className="min-h-screen w-full bg-red-200 border-transparent rounded-2xl">
          <div className="h-[50vh] bg-black">
            01
          </div>
          <div className="h-[50vh] bg-red-700 flex justify-center items-center">
            <div className="h-[150px] w-[150px] bg-black">
    
            </div>
          </div>
          <div className="h-[50vh] bg-blue-500 flex justify-center items-center">
         
            <div className="h-[150px] w-[150px] bg-black">
    
    </div>
          </div>
          <div className="h-[50vh] bg-green-400 flex justify-center items-center">
          <div ref={lastRef}  id="lastBox" className="h-[150px] w-[150px] bg-black opacity-0 translate-y-6 scale-[0.97] transition-[transform,opacity]
          duration-700 will-change-transform">
    
    </div>
         
          </div>
         </div>
        </>
    )}