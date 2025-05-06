
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { setAllUsers, selectAllUsers } from "@/redux/features/allUsers/allUserSlice";
import { selectOrders } from "@/redux/features/order/orderSlice";
import { useGetAllReviewsQuery, useDeleteReviewByIdMutation } from "@/redux/features/review/reviewApi";
import { toast } from "sonner";

const Users = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const orders = useSelector(selectOrders);
  const { data: allUsersRes } = useGetAllUserQuery();
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
    <div className="min-h-[70vh] p-6 space-y-12 mb-10">
      {/* Users Table */}
      <div>
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">All Users</h2>
        {allUsers && allUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="min-w-full bg-white table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Address
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Total Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.address}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{orderCounts[user._id!]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Users Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handleUsersPrevious}
                disabled={usersCurrentPage === 1}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  usersCurrentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: usersTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleUsersPageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    usersCurrentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleUsersNext}
                disabled={usersCurrentPage === usersTotalPages}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  usersCurrentPage === usersTotalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>

      {/* Reviews Table */}
      <div>
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">All Reviews</h2>
        {reviewsLoading ? (
          <p className="text-center text-gray-500 mt-4">Loading reviews...</p>
        ) : reviewsData?.data && reviewsData.data.length > 0 ? (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="min-w-full bg-white table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      User Email
                    </th>
                    <th className="w-2/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Review
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Star Count
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Order Count
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews.map((review) => (
                    <tr key={review._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{review.userEmail}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{review.reviewText}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{review.starCount}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{review.orderCount}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={deleteLoading}
                          className={`bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600 transition ${
                            deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Reviews Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handleReviewsPrevious}
                disabled={reviewsCurrentPage === 1}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  reviewsCurrentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: reviewsTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleReviewsPageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    reviewsCurrentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleReviewsNext}
                disabled={reviewsCurrentPage === reviewsTotalPages}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  reviewsCurrentPage === reviewsTotalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
