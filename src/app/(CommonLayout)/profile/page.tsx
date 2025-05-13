"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  setUser,
} from "@/redux/features/user/userSlice";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} from "@/redux/features/user/userApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { ProtectedRoute } from "@/components/protectedRoutes/ProtectedRouteProps";
import { toast } from "sonner";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Separate Components
const PersonalInformation = ({ name, email, setName, setEmail, handleUpdate, isUpdating }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-teal-700 mb-4">Personal Information</h3>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        className="mt-1 w-full border px-4 py-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="mt-1 w-full border px-4 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className="text-xs text-red-400">* Log in again with your new email after change</p>
    </div>
    <button
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      onClick={handleUpdate}
      disabled={isUpdating}
    >
      {isUpdating ? "Updating..." : "Update Profile"}
    </button>
  </div>
);

const PasswordChange = ({ oldPassword, newPassword, setOldPassword, setNewPassword, handleChangePassword, isChangingPassword }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-teal-700 mb-4">Change Password</h3>
    <input
      type="password"
      placeholder="Old Password"
      className="w-full mb-3 border px-4 py-2 rounded"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
    />
    <input
      type="password"
      placeholder="New Password"
      className="w-full mb-4 border px-4 py-2 rounded"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <button
      className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      onClick={handleChangePassword}
      disabled={isChangingPassword}
    >
      {isChangingPassword ? "Changing..." : "Change Password"}
    </button>
  </div>
);

const MyOrders = ({ myOrders }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-teal-700 mb-4">My Orders</h3>
    <h2 className="font-bold text-red-800 my-2">Status Pending means Unpaid</h2>
    {myOrders?.data && myOrders.data.length > 0 ? (
      <div>
        {myOrders?.data.map((order: any) => (
          <div key={order._id} className="mb-4 p-4 border rounded">
            <h4 className="text-md font-bold">Order ID: {order._id}</h4>
            <p className="text-sm text-gray-500">Creation Date: {order.createdAt.slice(0, 10)}</p>
            <p className="text-sm">Status: {order.status}</p>
            <div className="mt-2">
              <h5 className="font-semibold">Ordered Products:</h5>
              <ul className="list-disc pl-5">
                {order.products.map((product: any, index: number) => (
                  <li key={index} className="text-sm text-gray-700">
                    {product.productId?.name} (x{product.quantity})
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex">
              <p className="bg-green-900 px-2 text-white">Status</p>
              <p className="bg-green-100 px-2 border">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">You have no orders yet.</p>
    )}
  </div>
);

const Overview = ({ myOrders }: any) => {
  // Calculate order stats
  const orderStats = {
    total: myOrders?.data?.length || 0,
    byStatus: {
      pending: myOrders?.data?.filter((o: any) => o.status === "pending").length || 0,
      processing: myOrders?.data?.filter((o: any) => o.status === "processing").length || 0,
      shipped: myOrders?.data?.filter((o: any) => o.status === "shipped").length || 0,
      delivered: myOrders?.data?.filter((o: any) => o.status === "delivered").length || 0,
    },
  };

  // Calculate orders over time (last 6 months)
  const currentDate = new Date("2025-05-13"); // Current date: May 13, 2025
  const months: string[] = [];
  const orderCounts: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });
    months.push(monthYear);
    const count = myOrders?.data?.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    }).length || 0;
    orderCounts.push(count);
  }

  // Pie chart data for order status
  const orderPieData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered"],
    datasets: [
      {
        data: [
          orderStats.byStatus.pending,
          orderStats.byStatus.processing,
          orderStats.byStatus.shipped,
          orderStats.byStatus.delivered,
        ],
        backgroundColor: ["#0d9488", "#4dc0b5", "#b2e3d8", "#e6f4f1"], // teal shades
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for orders over time
  const barData = {
    labels: months,
    datasets: [
      {
        label: "Orders Placed",
        data: orderCounts,
        backgroundColor: "#0d9488", // teal-600
        borderColor: "#0a7466", // teal-700
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#1f2937" }, // gray-800
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#1f2937" },
      },
      x: {
        ticks: { color: "#1f2937" },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Order Status Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-teal-700 mb-4">Order Status Distribution</h3>
        <div className="h-64">
          <Pie data={orderPieData} options={chartOptions} />
        </div>
      </div>

      {/* Orders Over Time Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-teal-700 mb-4">Orders Over Time</h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-teal-700 mb-4">Summary</h3>
        <ul className="space-y-2">
          <li className="text-gray-800">
            <span className="font-medium">Total Orders:</span> {orderStats.total}
          </li>
          <li className="text-gray-800">
            <span className="font-medium">Pending:</span> {orderStats.byStatus.pending}
          </li>
          <li className="text-gray-800">
            <span className="font-medium">Delivered:</span> {orderStats.byStatus.delivered}
          </li>
        </ul>
      </div>
    </div>
  );
};

// Main UserDashboard Component
const UserDashboard = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectCurrentUser);
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const { data, isLoading, isError, error: queryError } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: isChangingPassword }] = useUpdatePasswordMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // Set default to overview

  // Sync API response with Redux and local states
  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
      setName(data.data.name);
      setEmail(data.data.email);
    }
  }, [data, dispatch]);

  // Fetching my orders
  const { data: myOrders, isLoading: ordersLoading, isError: ordersError, error: ordersQueryError } = useGetMyOrdersQuery();

  useEffect(() => {
    if (myOrders) {
      console.log("My Orders:", myOrders);
    }
  }, [myOrders]);

  useEffect(() => {
    console.log("Authenticated User:", authUser);
    console.log("User Data:", user);
  }, [authUser, user]);

  const handleUpdate = async () => {
    try {
      const res = await updateUser({ name, email }).unwrap();
      dispatch(setUser(res.data));
      toast("✅ Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "❌ Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      setOldPassword("");
      setNewPassword("");
      toast("✅ Password changed successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "❌ Failed to change password.");
    }
  };

  if (!authUser) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p>Please log in to view your dashboard.</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p>Loading user data...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (isError || error) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center text-red-600">
          Error: {(queryError as any)?.data?.message || error}
        </div>
      </ProtectedRoute>
    );
  }

  if (ordersLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center">
          <p>Loading your orders...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (ordersError) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center text-red-600">
          Error: {(ordersQueryError as any)?.data?.message || "Failed to fetch orders."}
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[70vh] bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-green-50 shadow-md h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">User Dashboard</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "overview" ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "personal" ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Personal Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "password" ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Password Change
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "orders" ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-12 px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">User Dashboard</h2>
          {activeTab === "overview" && <Overview myOrders={myOrders} />}
          {activeTab === "personal" && (
            <div className="">
              <div className="col-span-1  sm:col-span-2 lg:col-span-1">
                <PersonalInformation
                  name={name}
                  email={email}
                  setName={setName}
                  setEmail={setEmail}
                  handleUpdate={handleUpdate}
                  isUpdating={isUpdating}
                />
              </div>
            </div>
          )}
          {activeTab === "password" && (
            <div className="">
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <PasswordChange
                  oldPassword={oldPassword}
                  newPassword={newPassword}
                  setOldPassword={setOldPassword}
                  setNewPassword={setNewPassword}
                  handleChangePassword={handleChangePassword}
                  isChangingPassword={isChangingPassword}
                />
              </div>
            </div>
          )}
          {activeTab === "orders" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <MyOrders myOrders={myOrders} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;