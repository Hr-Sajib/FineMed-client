
"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faShieldHeart, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useGetReviewQuery } from "@/redux/features/reveiw/reveiwApi";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useAppSelector } from "@/redux/hooks";
import moment from "moment";
import { toast } from "sonner";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Label, Input, Textarea } from "@/components/ui/Field";

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
    <Card className="animate-pulse">
      <div className="mb-4 flex justify-center">
        <div className="h-6 w-6 rounded-full bg-paper-deep"></div>
      </div>
      <div className="mx-auto mb-4 h-4 w-3/4 rounded bg-paper-deep"></div>
      <div className="mx-auto mb-4 h-4 w-1/2 rounded bg-paper-deep"></div>
      <div className="mb-4 flex justify-center">
        <div className="h-5 w-24 rounded bg-paper-deep"></div>
      </div>
      <div className="mb-4 flex justify-center gap-4">
        <div className="h-5 w-20 rounded bg-paper-deep"></div>
        <div className="h-5 w-32 rounded bg-paper-deep"></div>
      </div>
      <div className="mx-auto h-4 w-16 rounded bg-paper-deep"></div>
    </Card>
  );
};

// Inline "write a review" panel — the standalone /review route was folded
// into this section so reviews aren't a dedicated route anymore; viewing
// and submitting reviews now both happen right here on the home page.
const WriteReviewPanel = () => {
  const thankYouRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const userEmail = user?.userEmail || "";

  const { data: ordersData } = useGetMyOrdersQuery(undefined, { skip: !userEmail });
  const orderCount = ordersData?.data?.length || 0;

  const [userName, setUserName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [starCount, setStarCount] = useState(1);
  const [showThankYou, setShowThankYou] = useState(false);
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();

  if (!userEmail) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
          <FontAwesomeIcon icon={faShieldHeart} className="h-5 w-5" />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">Share your experience</h3>
        <p className="mt-1 text-sm text-muted">Log in to write a review of your recent order.</p>
        <Button href="/login" className="mt-4">
          Log in to review
        </Button>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCount < 1) {
      toast.error("You cannot submit a review if you have never ordered.");
      return;
    }
    try {
      const reviewData = { userEmail, userName, reviewText, orderCount, starCount };
      const result = await createReview(reviewData).unwrap();
      if (result.success) {
        toast.success("Review submitted successfully!");
        setUserName("");
        setReviewText("");
        setStarCount(1);
        setShowThankYou(true);
        thankYouRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="mx-auto max-w-lg" padding="lg">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
          <FontAwesomeIcon icon={faShieldHeart} className="h-5 w-5" />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">Share your experience</h3>
        <p className="mt-1 text-sm text-muted">Tell other patients about your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" onChange={() => setShowThankYou(false)}>
        <div>
          <Label htmlFor="reviewUserName" required>
            Name
          </Label>
          <Input
            id="reviewUserName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label required>Star Rating</Label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStarCount(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className="cursor-pointer text-2xl leading-none"
              >
                <FontAwesomeIcon
                  icon={star <= starCount ? faStarSolid : faStarRegular}
                  className={star <= starCount ? "text-amber" : "text-border"}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="reviewText" required>
            Review
          </Label>
          <Textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={4}
            placeholder="Write your review here..."
          />
        </div>
        <Button type="submit" fullWidth loading={reviewLoading}>
          {reviewLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>

      {showThankYou && (
        <div ref={thankYouRef} className="mt-6 rounded-xl bg-pharmacy-light p-4 text-center">
          <p className="font-display text-lg text-pharmacy-deep">Thank you for your review!</p>
        </div>
      )}
    </Card>
  );
};

const Review = () => {
  const { data: reviewData, isLoading, error } = useGetReviewQuery(undefined);

  const header = (
    <SectionHeading
      eyebrow="Testimonials"
      title="What say our clients?"
      align="left"
      className="mb-6"
    />
  );

  if (isLoading) {
    return (
      <div className="mx-auto mb-20 mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        {header}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !reviewData?.data?.length) {
    return (
      <div className="mx-auto mb-20 mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        {header}
        <p className="mb-12 text-center text-muted">No reviews available.</p>
        <div className="mt-16 border-t border-border pt-10">
          <WriteReviewPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-20 mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Testimonial title */}
      {header}
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet bg-border",
          bulletActiveClass: "swiper-pagination-bullet-active bg-pharmacy",
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
          <SwiperSlide key={review._id}>
            <Card hoverable className="h-full">
              {/* Client review */}
              <div className="mb-4 flex h-10 justify-center">
                <FontAwesomeIcon icon={faQuoteLeft} className="h-7 w-7 text-pharmacy" />
              </div>
              <p className="mb-4 text-center font-display text-lg italic text-ink">
                &ldquo;{review.reviewText}&rdquo;
              </p>
              <div className="mb-4 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={index < review.starCount ? faStarSolid : faStarRegular}
                    className={index < review.starCount ? "text-amber" : "text-border"}
                  />
                ))}
              </div>
              {/* User info */}
              <div className="mb-4 flex items-center justify-center gap-3">
                <h4 className="text-base font-medium text-ink">{review.userName}</h4>
                <span className="text-border">|</span>
                <p className="text-sm text-muted">{review.userEmail}</p>
              </div>
              <p className="mx-auto mb-2 w-fit rounded-full bg-pharmacy-light px-3 py-1 text-xs font-medium text-pharmacy-deep">
                Total Orders {review.orderCount || 0}
              </p>
              <p className="text-center font-mono text-sm text-pharmacy-deep">
                {moment(review.createdAt).format("MMMM D, YYYY")}
              </p>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-16 border-t border-border pt-10">
        <WriteReviewPanel />
      </div>
    </div>
  );
};

export default Review;
