
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { MessageSquareQuote } from "lucide-react";
import { useGetReviewQuery } from "@/redux/features/reveiw/reveiwApi";
import moment from "moment";

// Define the review interface
interface TReview {
  _id: string;
  userName: string;
  userEmail: string;
  reviewText: string;
  starCount: number;
  orderCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Skeleton component for a single review card
const ReviewCardSkeleton = () => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white animate-pulse">
      <div className="flex justify-center mb-4">
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="flex justify-center mb-4">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="flex justify-center gap-4 mb-4">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
    </div>
  );
};

const Review = () => {
  const { data: reviewData, isLoading, error } = useGetReviewQuery(undefined);

  if (isLoading) {
    return (
      <div className="container bg-white mx-auto p-4 mb-20 mt-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-[#16a085] px-4">
          <span className="text-[#16a085]">What say</span> our client?
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !reviewData?.data?.length) {
    return (
      <div className="container bg-white mx-auto p-4 mb-20 mt-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-[#16a085] px-4">
          <span className="text-[#16a085]">What say</span> our client?
        </h2>
        <p className="text-center text-gray-500">No reviews available.</p>
      </div>
    );
  }

  return (
    <div className="container bg-white mx-auto p-4 mb-20 mt-10">
      {/* Testimonial title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-[#16a085] px-4">
        <span className="text-[#16a085]">What say</span> our client?
      </h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet bg-gray-300",
          bulletActiveClass: "swiper-pagination-bullet-active bg-[#16a085]",
        }}
        modules={[Pagination]}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="pb-12"
      >
        {/* Client review card */}
        {reviewData.data.map((review: TReview) => (
          <SwiperSlide
            key={review._id}
            className="p-6 border border-gray-100 bg-[#e6f4f1] rounded-lg shadow-lg  hover:shadow-xl transition-shadow duration-300 hover:scale-105"
          >
            {/* Client review */}
            <div className="flex justify-center mb-4 h-10">
              <MessageSquareQuote className="text-[#16a085] h-8 w-8" />
            </div>
            <p className="text-center mb-4 italic font-bold text-blue-500">
            &ldquo;{review.reviewText}&rdquo;
            </p>
            <div className="flex justify-center mb-4">
              <span className="text-yellow-500 text-lg flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>
                    {index < review.starCount ? "★" : "☆"}
                  </span>
                ))}
              </span>
            </div>
            {/* User info */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <h4 className="text-lg text-gray-800">
              {review.userName}
              </h4>
              <span className="text-gray-400">|</span>
              <p className="text-sm text-gray-500">{review.userEmail}</p>
            </div>
            <p className="text-sm text-gray-600 text-center mb-2 bg-white rounded-full">
              Total Orders {review.orderCount || 0}
            </p>
            <p className="text-xl text-[#16a085] text-center">
              {moment(review.createdAt).format("MMMM D, YYYY")}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Review;
