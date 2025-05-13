"use client"
import Image from 'next/image';
import React from 'react'

export default function AboutUs() {
    return (
       <div  className='min-h-[70vh]'>
         <div className="grid grid-cols-1 lg:grid-cols-2 container mx-auto mt-10 gap-8 px-5">
          
          
          <div className="relative flex justify-center lg:justify-end">
        
            <div className="relative w-full lg:w-3/4 h-[400px]">
              <Image
              data-aos="zoom-in"
                src="https://i.postimg.cc/fTRNVQCv/buyMed.jpg"
                alt="About Image 1"
                fill
                className="rounded-tr-2xl rounded-bl-2xl object-cover"
                sizes="(max-width: 1024px) 100vw, 75vw"
              />
            </div>
            
          
            <div className="w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] h-[250px] absolute left-5 -bottom-20 hidden xl:block">
              <Image
              data-aos="zoom-in"
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About Image 2"
                fill
                className="rounded-tr-2xl rounded-bl-2xl border-t-8 border-r-8 border-t-white border-r-white shadow-lg object-cover"
                sizes="(max-width: 1536px) 25vw, 384px"
              />
            </div>
          </div>
    
          <div data-aos="fade-right" className="flex flex-col justify-center text-center lg:text-left">
            <h1 className="font-bold text-2xl underline mb-5 text-center">About FineMed</h1>
            <p className="max-w-3xl mx-auto lg:mx-0 px-6 font-semibold text-gray-500">
              At FineMed, we are dedicated to providing safe, reliable, and affordable 
              medications to everyone. Our mission is to make healthcare accessible 
              through our trusted online pharmacy platform.
            </p>
          </div>
        </div>
       </div>
    );
}