
"use client";

import { addToCart } from "@/redux/features/cart/cartSlice";
import { useGetMedicineQuery } from "@/redux/features/medicine/featureMedicineApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IMedicine } from "@/types";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PriceTag from "@/components/ui/PriceTag";
import SectionHeading from "@/components/ui/SectionHeading";

// Skeleton component for a single medicine card
const MedicineCardSkeleton = () => {
  return (
    <div className="border border-gray-200 shadow-md rounded-md overflow-hidden p-4 animate-pulse">
      <div className="relative w-full h-[200px] mb-4 rounded-md overflow-hidden bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex gap-0">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex gap-0 mt-1">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-6"></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-28"></div>
      </div>
    </div>
  );
};

export default function FeaturedProducts() {
  // Destructure the nested data field and rename it to medicineData
  const {
    data: { data: medicineData = [] } = {},
    isLoading,
    error,
  } = useGetMedicineQuery(undefined);
  const [quantity] = useState(1);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // console.log("data: ",medicineData)
  const handleAddToCart = (medicine: IMedicine) => {
    if (!medicine) {
      toast.error("Failed to add to cart: Medicine data is missing");
      return;
    }

    dispatch(
      addToCart({
        _id: medicine._id!,
        name: medicine.name,
        price: medicine.price,
        quantity,
        stockQuantity: medicine.quantity || 1,
        image: medicine.image,
        prescriptionRequired: medicine.prescriptionRequired,
        generic: medicine.generic,
        brand: medicine.brand,
        form: medicine.form,
        category: medicine.category,
        description: medicine.description,
        simptoms: medicine.simptoms,
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate,
      })
    );
    toast.success(`${medicine.name} added to cart!`);
  };

      // Initialize AOS animations
      useEffect(() => {
        Aos.init({
          duration: 600,
          once: true,
          offset: 20,
        });
      }, []);

  if (isLoading) {
    return (
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Handpicked" title="Featured Medicine" className="mb-8" />
          {/* Skeleton Grid */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
            {[...Array(4)].map((_, index) => (
              <MedicineCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div>Error loading medicines</div>;

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Handpicked" title="Featured Medicine" className="mb-8" />

        {/* 🧾 Medicines Grid */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
          {medicineData.slice(0,12).map((medicine: IMedicine) => {
            const isInCart = cartItems.some((item) => item._id === medicine._id);
            const isOutOfStock = medicine.quantity === 0;

            return (
              <div
                data-aos="zoom-in"
                key={medicine._id}
                className="flex flex-col bg-paper border border-border rounded-2xl shadow-[var(--shadow-card)] overflow-hidden p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative w-full h-[180px] mb-4 rounded-xl overflow-hidden bg-paper-deep">
                  <Image
                    src={medicine.image}
                    alt={medicine.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                </div>

                <h3 className="font-display font-semibold text-lg text-ink mb-2 truncate" title={medicine.name}>
                  {medicine.name}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="brand">{medicine.generic}</Badge>
                  <Badge variant="neutral">{medicine.category}</Badge>
                  {medicine.prescriptionRequired && <Badge variant="danger">Rx Required</Badge>}
                </div>

                <PriceTag value={medicine.price} className="mt-auto" />

                <div className="flex items-center justify-between gap-2 mt-4">
                  <Button href={`/medicine/${medicine._id}`} variant="outline" size="sm">
                    Details
                  </Button>
                  <Button
                    size="sm"
                    disabled={isInCart || isOutOfStock}
                    onClick={() => handleAddToCart(medicine)}
                  >
                    {isInCart ? "Added" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/shop" variant="secondary" icon={<FontAwesomeIcon icon={faArrowRight} />} iconPosition="right">
            View More Medicine
          </Button>
        </div>
      </div>
    </section>
  );
}
