/* eslint-disable react/no-unescaped-entities */
'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="container lg:w-[80vw] w-[95vw] mx-auto lg:h-[700px] h-[40vh] overflow-hidden mb-20"> 
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}
      >
        {/* Slide 1 */}
        <SwiperSlide className="relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="https://plus.unsplash.com/premium_photo-1672759455911-d51421fe442c?q=80&w=1416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Premium Healthcare Products"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute z-20 text-white inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-5xl font-bold mb-6 max-w-2xl drop-shadow-lg">Healthcare Solutions</h2>
            <p className="text-xl mb-8 max-w-xl drop-shadow-lg">Discover our wide range of high-quality medicines</p>
            <Link href="/shop" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl">
              Browse All Medicines
            </Link>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide className="relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Trusted Pharmacy"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute z-20 text-white inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-5xl font-bold mb-6 max-w-2xl drop-shadow-lg">Your Trusted Pharmacy</h2>
            <p className="text-xl mb-8 max-w-xl drop-shadow-lg">Authentic medicines delivered to your doorstep</p>
            <Link href="/shop" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl">
              Browse All Medicines
            </Link>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide className="relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Healthcare Essentials"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute z-20 text-white inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-5xl font-bold mb-6 max-w-2xl drop-shadow-lg">Healthcare Essentials</h2>
            <p className="text-xl mb-8 max-w-xl drop-shadow-lg">Everything you need for your family's wellbeing</p>
            <Link href="/shop" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl">
              Browse All Medicines
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
