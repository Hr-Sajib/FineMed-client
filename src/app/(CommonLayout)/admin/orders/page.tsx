
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useVerifyPrescriptionMutation,
} from "@/redux/features/order/orderApi";
import { setOrders, IOrder } from "@/redux/features/order/orderSlice";
import { selectMedicines } from "@/redux/features/medicine/medicineSlice";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTruckMedical,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { Select } from "@/components/ui/Field";

const Orders = () => {
  const dispatch = useDispatch();
  const medicines = useSelector(selectMedicines).medicines;
  const { data: ordersData, refetch: refetchOrders } = useGetAllOrdersQuery();
  const [updateOrder, { isLoading: updateLoading, error: updateError }] = useUpdateOrderMutation();
  const [verifyPrescription, { isLoading: verifyLoading }] = useVerifyPrescriptionMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Set orders in store
  useEffect(() => {
    if (ordersData?.data) {
      // GET /orders returns products.productId populated as a full object;
      // the orders slice's IOrder type still models it as a plain string id.
      dispatch(setOrders(ordersData.data as unknown as IOrder[]));
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

  // Handle verifying an order's prescription
  const handleVerifyPrescription = async (orderId: string) => {
    try {
      await verifyPrescription(orderId).unwrap();
      toast.success("Prescription verified");
      await refetchOrders();
    } catch (error) {
      toast.error("Failed to verify prescription");
      console.error("Error verifying prescription:", error);
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

  const statusBadgeVariant: Record<(typeof statusOptions)[number], "warning" | "brand" | "neutral" | "success"> = {
    pending: "warning",
    processing: "brand",
    shipped: "neutral",
    delivered: "success",
  };

  return (
    <div className="min-h-[70vh] space-y-8 mb-10 max-w-7xl mx-auto">
      {/* Orders Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <SectionHeading eyebrow="Fulfillment" title="All Orders" />
        </div>
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-light bg-amber-light/60 px-4 py-3 text-sm text-ink-soft">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
          <p>
            Status automatically moves from <b className="text-ink">Pending</b> to{" "}
            <b className="text-ink">Processing</b> once payment completes. Orders that need a
            prescription stay locked until you verify it below.
          </p>
        </div>
        {ordersData?.data && ordersData?.data.length > 0 ? (
          <>
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-paper-deep">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        User
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Products
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Prescription
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-paper-deep/50 transition-colors align-top">
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-ink font-medium">
                            <FontAwesomeIcon icon={faTruckMedical} className="h-3.5 w-3.5 text-pharmacy" />
                            {order.userEmail}
                          </span>
                          <p className="mt-0.5 font-mono text-xs text-muted">{order.contactNumber}</p>
                        </td>
                        <td className="py-3 px-4 text-sm text-ink-soft">
                          {order?.products?.map((product, index) => {
                            // GET /orders populates products.productId as a full
                            // product object ({ _id, name, ... }), not a string id.
                            const productObj = product.productId as unknown as
                              | { _id: string; name: string; [key: string]: unknown }
                              | string;
                            const productName =
                              (productObj && typeof productObj === "object"
                                ? productObj.name
                                : undefined) ||
                              medicines.find(
                                (m) =>
                                  m._id ===
                                  (typeof productObj === "string" ? productObj : productObj?._id)
                              )?.name ||
                              "Unknown";
                            return (
                              <p key={`${order._id}-${index}`}>
                                {productName} <span className="font-mono text-xs text-muted">×{product.quantity}</span>
                              </p>
                            );
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {order.prescriptionImageLink ? (
                            <div className="space-y-1.5">
                              <Link href={order.prescriptionImageLink} target="_blank">
                                <Image
                                  src={order.prescriptionImageLink}
                                  alt="Prescription"
                                  style={{ objectFit: "cover" }}
                                  height={40}
                                  width={40}
                                  className="h-10 w-10 rounded-lg border border-border"
                                />
                              </Link>
                              {order.prescriptionRequired && !order.prescriptionVarified ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="!px-2.5 !py-1 text-xs"
                                  loading={verifyLoading}
                                  onClick={() => handleVerifyPrescription(order._id)}
                                >
                                  Verify
                                </Button>
                              ) : order.prescriptionRequired ? (
                                <Badge variant="success">Verified</Badge>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-muted">No prescription</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value as "pending" | "processing" | "shipped" | "delivered"
                              )
                            }
                            disabled={
                              updateLoading ||
                              (order.prescriptionRequired && !order.prescriptionVarified)
                            }
                            title={
                              order.prescriptionRequired && !order.prescriptionVarified
                                ? "Verify the prescription before updating the order status"
                                : undefined
                            }
                            className="!w-auto !py-1.5 !pr-9 text-sm"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </Select>
                          <div className="mt-1.5">
                            <Badge variant={statusBadgeVariant[order.status]}>{order.status}</Badge>
                          </div>
                          {updateError && (
                            <p className="text-rx text-xs mt-1">Failed to update status</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-pharmacy-light hover:text-pharmacy-deep"
                }`}
                aria-label="Previous page"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-pharmacy text-white"
                      : "bg-surface border border-border text-ink-soft hover:bg-pharmacy-light hover:text-pharmacy-deep"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface border border-border text-ink-soft ${
                  currentPage === totalPages
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
          <p className="text-center text-muted mt-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
