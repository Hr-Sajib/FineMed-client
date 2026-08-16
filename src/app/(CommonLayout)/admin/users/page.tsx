
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { setAllUsers, selectAllUsers } from "@/redux/features/allUsers/allUserSlice";
import { selectOrders, setOrders, IOrder } from "@/redux/features/order/orderSlice";
import { useGetAllOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetAllReviewsQuery, useDeleteReviewByIdMutation } from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faUser, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

const Users = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const orders = useSelector(selectOrders);
  const { data: allUsersRes } = useGetAllUserQuery();
  const { data: ordersData } = useGetAllOrdersQuery();
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useGetAllReviewsQuery();
  const [deleteReviewById, { isLoading: deleteLoading }] = useDeleteReviewByIdMutation();
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const pageSize = 6;

  // Set users in store
  useEffect(() => {
    if (allUsersRes?.data) {
      const users = Array.isArray(allUsersRes.data)
        ? allUsersRes.data
        : [allUsersRes.data];
      dispatch(setAllUsers(users));
    }
  }, [allUsersRes, dispatch]);

  // Set orders in store (this page can be loaded directly without ever
  // visiting /admin/orders, so the orders slice may otherwise be empty)
  useEffect(() => {
    if (ordersData?.data) {
      // GET /orders returns products.productId populated as a full object;
      // the orders slice's IOrder type still models it as a plain string id.
      dispatch(setOrders(ordersData.data as unknown as IOrder[]));
    }
  }, [ordersData, dispatch]);

  // Compute order counts for all users
  const orderCounts = allUsers.reduce((acc, user) => {
    const userOrders = orders.filter((order) => order.userEmail === user.email);
    acc[user._id!] = userOrders.length;
    return acc;
  }, {} as Record<string, number>);

  // Handle review deletion
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReviewById(reviewId).unwrap();
      toast.success("Review deleted successfully");
      await refetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
    }
  };

  // Pagination logic for Users
  const usersTotalPages = Math.ceil(allUsers.length / pageSize);
  const paginatedUsers = allUsers.slice(
    (usersCurrentPage - 1) * pageSize,
    usersCurrentPage * pageSize
  );

  // Pagination logic for Reviews
  const reviewsTotalPages = Math.ceil((reviewsData?.data?.length || 0) / pageSize);
  const paginatedReviews = reviewsData?.data?.slice(
    (reviewsCurrentPage - 1) * pageSize,
    reviewsCurrentPage * pageSize
  ) || [];

  const handleUsersPageChange = (page: number) => {
    setUsersCurrentPage(page);
  };

  const handleUsersPrevious = () => {
    if (usersCurrentPage > 1) {
      setUsersCurrentPage(usersCurrentPage - 1);
    }
  };

  const handleUsersNext = () => {
    if (usersCurrentPage < usersTotalPages) {
      setUsersCurrentPage(usersCurrentPage + 1);
    }
  };

  const handleReviewsPageChange = (page: number) => {
    setReviewsCurrentPage(page);
  };

  const handleReviewsPrevious = () => {
    if (reviewsCurrentPage > 1) {
      setReviewsCurrentPage(reviewsCurrentPage - 1);
    }
  };

  const handleReviewsNext = () => {
    if (reviewsCurrentPage < reviewsTotalPages) {
      setReviewsCurrentPage(reviewsCurrentPage + 1);
    }
  };

  return (
    <div className="min-h-[70vh] space-y-12 mb-10 max-w-7xl mx-auto">
      {/* Users Table */}
      <div>
        <SectionHeading eyebrow="Directory" title="All Users" className="mb-6" />
        {allUsers && allUsers.length > 0 ? (
          <>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-paper-deep">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Email
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Phone
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Address
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Total Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-paper-deep/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-ink font-medium whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5 text-pharmacy" />
                            {user.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-ink-soft whitespace-nowrap">{user.email}</td>
                        <td className="py-3 px-4 text-sm font-mono text-ink-soft whitespace-nowrap">{user.phone}</td>
                        <td className="py-3 px-4 text-sm text-ink-soft">{user.address}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          <Badge variant={orderCounts[user._id!] ? "success" : "neutral"}>
                            {orderCounts[user._id!] ?? 0}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {/* Users Pagination Controls */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={handleUsersPrevious}
                disabled={usersCurrentPage === 1}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  usersCurrentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Previous page"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: usersTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleUsersPageChange(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    usersCurrentPage === page
                      ? "bg-pharmacy text-white"
                      : "bg-surface border border-border text-ink-soft hover:bg-pharmacy-light hover:text-pharmacy-deep"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleUsersNext}
                disabled={usersCurrentPage === usersTotalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  usersCurrentPage === usersTotalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Next page"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-4">No users found.</p>
        )}
      </div>

      {/* Reviews Table */}
      <div>
        <SectionHeading eyebrow="Feedback" title="All Reviews" className="mb-6" />
        {reviewsLoading ? (
          <p className="text-center text-muted mt-4">Loading reviews...</p>
        ) : reviewsData?.data && reviewsData.data.length > 0 ? (
          <>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-paper-deep">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        User Email
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Review
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Stars
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Orders
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedReviews.map((review) => (
                      <tr key={review._id} className="hover:bg-paper-deep/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-ink-soft whitespace-nowrap">{review.userEmail}</td>
                        <td className="py-3 px-4 text-sm text-ink max-w-xs">{review.reviewText}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          <Badge variant="warning" icon={<FontAwesomeIcon icon={faStar} />}>
                            {review.starCount}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-ink-soft whitespace-nowrap">{review.orderCount}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="destructive"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            loading={deleteLoading}
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {/* Reviews Pagination Controls */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={handleReviewsPrevious}
                disabled={reviewsCurrentPage === 1}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  reviewsCurrentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Previous page"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: reviewsTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleReviewsPageChange(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    reviewsCurrentPage === page
                      ? "bg-pharmacy text-white"
                      : "bg-surface border border-border text-ink-soft hover:bg-pharmacy-light hover:text-pharmacy-deep"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleReviewsNext}
                disabled={reviewsCurrentPage === reviewsTotalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  reviewsCurrentPage === reviewsTotalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Next page"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-4">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
