
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllOrdersQuery, useUpdateOrderMutation } from "@/redux/features/order/orderApi";
import { setOrders } from "@/redux/features/order/orderSlice";
import { selectMedicines } from "@/redux/features/medicine/medicineSlice";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const Orders = () => {
  const dispatch = useDispatch();
  const medicines = useSelector(selectMedicines).medicines;
  const { data: ordersData, refetch: refetchOrders } = useGetAllOrdersQuery();
  const [updateOrder, { isLoading: updateLoading, error: updateError }] = useUpdateOrderMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Set orders in store
  useEffect(() => {
    if (ordersData?.data) {
      dispatch(setOrders(ordersData.data));
    }
  }, [ordersData, dispatch]);

  // Pagination logic
  const totalPages = Math.ceil((ordersData?.data?.length || 0) / pageSize);
  const paginatedOrders = ordersData?.data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  ) || [];

  // Handle status change and update the order
  const handleStatusChange = async (
    orderId: string,
    newStatus: "pending" | "processing" | "shipped" | "delivered"
  ) => {
    try {
      await updateOrder({ orderId, data: { status: newStatus } }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      await refetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const statusOptions = ["pending", "processing", "shipped", "delivered"] as const;

  return (
    <div className="min-h-[70vh] p-6 space-y-12 mb-10">
      {/* Orders Table */}
      <div>
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">All Orders</h2>
        <h3 className="text-center text-red-900">
          Automatically updates from <b className="text-red-700">Pending</b> to{" "}
          <b className="text-red-700">Processing</b> if payment is complete
        </h3>
        <h3 className="text-center text-red-900">
          Only proceed further to update orders if <b className="text-red-700">prescription</b> checked and verified
        </h3>
        {ordersData?.data && ordersData?.data.length > 0 ? (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="min-w-full bg-white table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      User Email
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      User Phone
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Products
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Prescription (Click to open)
                    </th>
                    <th className="w-1/5 py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{order.userEmail}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.contactNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order?.products?.map((product, index) => {
                          const productName =
                            medicines.find((m) => m._id === product.productId)?.name || "Unknown";
                          return (
                            <div key={`${order._id}-${index}`}>
                              <p>
                                {productName} <b>X{product.quantity}</b>
                              </p>
                            </div>
                          );
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.prescriptionImageLink ? (
                          <Link href={order.prescriptionImageLink}>
                            <Image
                              src={order.prescriptionImageLink}
                              alt="Prescription"
                              style={{ objectFit: "cover" }}
                              height={30}
                              width={40}
                              className="border-2 border-black h-10 w-10 rounded-sm"
                            />
                          </Link>
                        ) : (
                          "No Prescription"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as "pending" | "processing" | "shipped" | "delivered"
                            )
                          }
                          disabled={updateLoading}
                          className={`px-2 py-1 rounded text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        {updateError && (
                          <p className="text-red-500 text-xs mt-1">Failed to update status</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
