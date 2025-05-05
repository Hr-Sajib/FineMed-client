"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { MessageSquareQuote } from "lucide-react";

interface Review {
  id: string;
  reviewText: string;
  userName: string;
  userEmail: number;
}
import { useGetReviewQuery } from "@/redux/features/reveiw/reveiwApi";
import moment from "moment";

interface TReview {
  _id: string;
  userName: string;
  userEmail: string;
  reviewText: string;
  starCount: number;
  orderCount?: number; // optional if not always present
  createdAt: string;
  updatedAt: string;
}

const Review = () => {
  const { data: reviewData } = useGetReviewQuery(undefined);

  console.log(reviewData);

  return (
    <div className="container bg-white mx-auto p-4 mb-20 mt-10">
      {/* testimonial title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 border-l-4 border-[#16a085] px-4">
        <span className="text-[#16a085]">What say</span> our client?
      </h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 bg-white lg:grid-cols-3"
      >
        {/* client riview card */}
        {reviewData?.data?.map((review: TReview) => (
          <SwiperSlide
            className="p-4 rounded-lg shadow-2xl bg-white mb-12 h-20"
            key={review?._id}
          >
            {/* client review */}
            <div className="flex justify-center">
              <p className="flex gap-4">
                <MessageSquareQuote className="text-[#16a085] mb-4" />
                Review:{review?.reviewText}
              </p>
            </div>
            <p className="mb-2 flex justify-center">
              <span className="text-yellow-500 ml-2 flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>
                    {index < review?.starCount ? "★" : "☆"}
                  </span>
                ))}
              </span>
            </p>
            {/* rating date */}
            <div className="flex justify-center items-center gap-4">
              <h4 className="text-xl mb-2">{review?.userName}</h4> |
              <p className="mb-2">Email: {review?.userEmail}</p>
            </div>
            <p className="mb-2 flex justify-center">
              Total Order: {review?.orderCount}
            </p>
            <p className="mb-2 text-xs flex justify-center text-teal-600">
              Date: {moment(review?.createdAt).format("MMMM D, YYYY")}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Review;
