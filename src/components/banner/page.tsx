'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';

const slides = [
  {
    src: "/images/pexels-n-voitkevich-7615566.jpg",
    alt: "Assorted capsules and tablets laid out on a sage-green surface",
    eyebrow: "Trusted sourcing",
    title: "Healthcare Solutions",
    description: "Discover our wide range of high-quality medicines",
    priority: true,
  },
  {
    src: "/images/pexels-tamanna-rumee-52377920-7956963.jpg",
    alt: "Face masks and a variety of medicines on a teal background",
    eyebrow: "Family wellbeing",
    title: "Healthcare Essentials",
    description: "Everything you need to keep your family safe and well",
    priority: false,
  },
  {
    src: "/images/pexels-pixabay-208512.jpg",
    alt: "Blister packs of authentic branded medicine",
    eyebrow: "Genuine, always",
    title: "Your Trusted Pharmacy",
    description: "Authentic medicines delivered to your doorstep",
    priority: false,
  },
  {
    src: "/images/pexels-shutter-speed-29110700.jpg",
    alt: "Close-up of capsules and tablets ready for dispensing",
    eyebrow: "Care you can reach",
    title: "Care, Delivered Precisely",
    description: "Every order checked by our pharmacists before it ships",
    priority: false,
  },
];

const Banner = () => {
  return (
    <div
      data-aos="fade-up"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:h-[600px] h-[42vh] overflow-hidden mb-16 sm:mb-20"
      style={
        {
          "--swiper-pagination-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.45",
        } as React.CSSProperties
      }
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title} className="relative">
            <div className="absolute inset-0 z-10 bg-ink/55" />
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={slide.priority}
              sizes="100vw"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
                {slide.eyebrow}
              </span>
              <h2 className="font-display mb-4 max-w-2xl text-4xl font-semibold sm:text-5xl">
                {slide.title}
              </h2>
              <p className="mb-8 max-w-xl text-lg text-white/90 sm:text-xl">{slide.description}</p>
              <Button
                href="/shop"
                size="lg"
                icon={<FontAwesomeIcon icon={faArrowRight} />}
                iconPosition="right"
              >
                Browse All Medicines
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
