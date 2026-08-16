"use client";
import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHeart, faTruckMedical, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: faShieldHeart,
    title: "Verified sourcing",
    description: "Every medicine is sourced from licensed manufacturers and checked for authenticity.",
  },
  {
    icon: faTruckMedical,
    title: "Fast, careful delivery",
    description: "Orders are packed and shipped with cold-chain and handling care where it matters.",
  },
  {
    icon: faHeartPulse,
    title: "Care you can reach",
    description: "Our pharmacists and support team are a message away, every day of the week.",
  },
];

export default function AboutUs() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-[400px] w-full lg:w-3/4">
              <Image
                data-aos="zoom-in"
                src="https://i.postimg.cc/fTRNVQCv/buyMed.jpg"
                alt="About Image 1"
                fill
                className="rounded-tr-2xl rounded-bl-2xl object-cover shadow-[var(--shadow-card)]"
                sizes="(max-width: 1024px) 100vw, 75vw"
              />
            </div>

            <div className="absolute -bottom-20 left-5 hidden h-[250px] w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] xl:block">
              <Image
                data-aos="zoom-in"
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About Image 2"
                fill
                className="rounded-tr-2xl rounded-bl-2xl border-t-8 border-r-8 border-t-surface border-r-surface object-cover shadow-[var(--shadow-card-hover)]"
                sizes="(max-width: 1536px) 25vw, 384px"
              />
            </div>
          </div>

          <div data-aos="fade-right" className="flex flex-col text-center lg:text-left">
            <SectionHeading
              eyebrow="Our story"
              title="About FineMed"
              description="At FineMed, we are dedicated to providing safe, reliable, and affordable medications to everyone. Our mission is to make healthcare accessible through our trusted online pharmacy platform."
              align="left"
              className="mx-auto lg:mx-0"
            />

            <div className="mt-8 space-y-5">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
                    <FontAwesomeIcon icon={feature.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
