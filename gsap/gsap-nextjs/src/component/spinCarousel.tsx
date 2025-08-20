"use client"

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define the card type
interface Card {
  id: number;
  title: string;
  bg: string;
  image: string;
}

const SpinCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Sample data - replace with your images/content

  
  const cards = [
    {id:1,title:"img1",image:"gsap/gsap-nextjs/public/assets/img1.png",  bg: "bg-red-500"},
    {id:2,title:"img2",image:"gsap/gsap-nextjs/public/assets/img2.png",bg: "bg-blue-500"},
    {id:3,title:"img3",image:"gsap/gsap-nextjs/public/assets/img3.png",bg: "bg-purple-50"},
    {id:4,title:"img4",image:"gsap/gsap-nextjs/public/assets/img4.png",bg: "bg-yellow-50"},
    {id:5,title:"img5",image:"gsap/gsap-nextjs/public/assets/img5.jpg",bg: "bg-pink-500"},
]


  useEffect(() => {
    const container = containerRef.current;
    const cardElements = cardsRef.current;
    
    if (!container || cardElements.length === 0) return;

    const numCards = cardElements.length;
    const radius = 500;
    let currentActiveIndex = 0;

    // Function to calculate position based on angle
    const getCardPosition = (index:number, rotationOffset:number = 0) => {
      const angle = ((index / numCards) * Math.PI * 2) + rotationOffset;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y, angle };
    };

    // Set initial positions
    cardElements.forEach((card, index) => {
      const { x, y } = getCardPosition(index);
      const isActive = index === 0;
      
      gsap.set(card, {
        x: x,
        y: y,
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1.1 : 0.7,
        zIndex: isActive ? 100 : 10 - Math.abs(index),
        rotationY: isActive ? 0 : 45, // 3D tilt for inactive cards
        transformOrigin: "center center",
        transformStyle: "preserve-3d"
      });
    });

    // Create scroll trigger
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const rotationOffset = progress * Math.PI * 2; // Full rotation
        
        // Calculate which card should be at the front (top position)
        const frontIndex = Math.round(progress * (numCards - 1));
        
        cardElements.forEach((card, index) => {
          const { x, y } = getCardPosition(index, rotationOffset);
          
          // Calculate distance from front position to determine visibility
          let distanceFromFront = Math.abs(index - frontIndex);
          if (distanceFromFront > numCards / 2) {
            distanceFromFront = numCards - distanceFromFront;
          }
          
          const isActive = distanceFromFront === 0;
          const opacity = isActive ? 1 : 0;
          const scale = isActive ? 1.1 : Math.max(0.5, 1 - (distanceFromFront * 0.15));
          const blur = isActive ? 0 : Math.min(8, distanceFromFront * 2);
          const rotY = isActive ? 0 : Math.min(60, distanceFromFront * 20);
          
          gsap.to(card, {
            x: x,
            y: y,
            opacity: opacity,
            scale: scale,
            rotationY: rotY,
            filter: `blur(${blur}px)`,
            zIndex: isActive ? 100 : 50 - distanceFromFront * 10,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        // Update active card indicator
        const newActiveIndex = Math.round(((1 - progress) * (numCards - 1)) % numCards);
        if (newActiveIndex !== currentActiveIndex) {
          currentActiveIndex = newActiveIndex;
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Spacer to create scroll space before carousel */}
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <h1 className="text-4xl font-bold text-white">Scroll Down for Carousel</h1>
      </div>
      
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative h-screen sticky flex items-center justify-center bg-gray-900"
      >
        {/* Center point indicator */}
        <div className="absolute w-4 h-4 bg-white rounded-full z-20"></div>
        
        {/* Cards */}
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="absolute w-64 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white transform-gpu border border-gray-700"
          >
            {/* Image container */}
            <div className="w-48 h-48 mb-4 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
              />
              <div className="hidden w-full h-full bg-gray-600 items-center justify-center text-4xl">
                🖼️
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm opacity-80 text-center px-4">
              This is {card.title} with some description text that explains the content.
            </p>
            
            {/* Card number indicator */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <p className="text-lg font-semibold mb-2">Scroll to spin the carousel</p>
          <div className="animate-bounce">⬇️</div>
        </div>
      </div>
      
      {/* Spacer to create scroll space after carousel */}
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <h1 className="text-4xl font-bold text-white">End of Carousel</h1>
      </div>
    </div>
  );
};

export default SpinCarousel;