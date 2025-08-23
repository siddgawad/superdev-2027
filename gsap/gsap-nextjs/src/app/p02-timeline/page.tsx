"use client"

import {gsap} from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function P02Timeline(){
    const scope = useRef<HTMLDivElement|null>(null);
    const tlRef = useRef<HTMLDivElement|null>(null);

    useGSAP(()=>{
        const q = gsap.utils.selector(scope);
        //buidfign timeline 

        const tl = gsap.timeline({
            defaults:{duration:0.6,ease:"power3-out"}
        })
    })
} 