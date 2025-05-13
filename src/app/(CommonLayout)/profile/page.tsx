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

// Separate Components
const PersonalInformation = ({ name, email, setName, setEmail, handleUpdate, isUpdating }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4 text-center">Personal Information</h2>
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
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
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
  <div className="w-full">
    <h3 className="text-lg font-semibold mb-3">My Orders</h3>
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
  const [activeTab, setActiveTab] = useState("personal"); // State for active tab

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

  // Log the orders result to console
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
        <div className="min-h-[70vh] flex items-center justify-center text-red-500">
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
        <div className="min-h-[70vh] flex items-center justify-center text-red-500">
          Error: {(ordersQueryError as any)?.data?.message || "Failed to fetch orders."}
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[80vh] bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "personal" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Personal Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "password" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Password Change
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === "orders" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "personal" && (
            <PersonalInformation
              name={name}
              email={email}
              setName={setName}
              setEmail={setEmail}
              handleUpdate={handleUpdate}
              isUpdating={isUpdating}
            />
          )}
          {activeTab === "password" && (
            <PasswordChange
              oldPassword={oldPassword}
              newPassword={newPassword}
              setOldPassword={setOldPassword}
              setNewPassword={setNewPassword}
              handleChangePassword={handleChangePassword}
              isChangingPassword={isChangingPassword}
            />
          )}
          {activeTab === "orders" && <MyOrders myOrders={myOrders} />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;