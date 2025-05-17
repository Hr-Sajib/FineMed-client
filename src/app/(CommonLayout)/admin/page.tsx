
"use client";

import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useGetAllMedicinesQuery } from "@/redux/features/medicine/medicineApi";
import { useGetAllOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { setAllUsers, selectAllUsers } from "@/redux/features/allUsers/allUserSlice";
import { setOrders, selectOrders } from "@/redux/features/order/orderSlice";
import { setMedicines, selectMedicines } from "@/redux/features/medicine/medicineSlice";
import { useEffect } from "react";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDefaultPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const allUsers = useSelector(selectAllUsers);
  const orders = useSelector(selectOrders);
  const medicines = useSelector(selectMedicines).medicines;

  // Debugging Step 1: Verify user authentication
  // - Check if user exists and has role 'admin'
  // - Open browser DevTools > Console to see user data
  // - If redirected to /login, ensure user is logged in as admin
  console.log("Current user:", user);

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Fetch data
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUserQuery();
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetAllOrdersQuery();
  const { data: medicinesData, isLoading: medicinesLoading, error: medicinesError } = useGetAllMedicinesQuery({});

  if (usersError || ordersError || medicinesError) {
    console.error("API errors:", { usersError, ordersError, medicinesError });
  }

  // Set users in store
  useEffect(() => {
    if (usersData?.data) {
      const users = Array.isArray(usersData.data) ? usersData.data : [usersData.data];
      dispatch(setAllUsers(users));
    }
  }, [usersData, dispatch]);

  // Set orders in store
  useEffect(() => {
    if (ordersData?.data) {
      dispatch(setOrders(ordersData.data));
    }
  }, [ordersData, dispatch]);

  // Set medicines in store
  useEffect(() => {
    if (medicinesData?.data) {
      dispatch(setMedicines(medicinesData.data));
    }
  }, [medicinesData, dispatch]);

  // Handle empty data
  useEffect(() => {
    if (allUsers.length === 0 && !usersData) {
      dispatch(setAllUsers([]));
    }
    if (orders.length === 0 && !ordersData) {
      dispatch(setOrders([]));
    }
    if (medicines.length === 0 && !medicinesData) {
      dispatch(setMedicines([]));
    }
  }, [allUsers.length, orders.length, medicines.length, usersData, ordersData, medicinesData, dispatch]);

  // Calculate stats using Redux data
  const userStats = {
    total: allUsers.length || 0,
    byRole: {
      admin: allUsers.filter((u) => u.role === "admin").length || 0,
      user: allUsers.filter((u) => u.role === "user").length || 0,
    },
  };

  const orderStats = {
    total: orders.length || 0,
    byStatus: {
      pending: orders.filter((o) => o.status === "pending").length || 0,
      processing: orders.filter((o) => o.status === "processing").length || 0,
      shipped: orders.filter((o) => o.status === "shipped").length || 0,
      delivered: orders.filter((o) => o.status === "delivered").length || 0,
    },
  };

  const medicineStats = {
    total: medicines.length || 0,
    byCategory: {
      Antibiotic: medicines.filter((m) => m.category === "Antibiotic").length || 0,
      Painkiller: medicines.filter((m) => m.category === "Painkiller").length || 0,
      Antacid: medicines.filter((m) => m.category === "Antacid").length || 0,
      Antiseptic: medicines.filter((m) => m.category === "Antiseptic").length || 0,
      Antiviral: medicines.filter((m) => m.category === "Antiviral").length || 0,
    },
  };


  // Bar chart data
  const barData = {
    labels: ["Users", "Orders", "Medicines"],
    datasets: [
      {
        label: "Total Counts",
        data: [userStats.total, orderStats.total, medicineStats.total],
        backgroundColor: "#0d9488", // teal-600
        borderColor: "#0a7466", // teal-700
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data
  const userPieData = {
    labels: ["Admin", "User"],
    datasets: [
      {
        data: [userStats.byRole.admin, userStats.byRole.user],
        backgroundColor: ["#0d9488", "#4dc0b5"], // teal-600, teal-400
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

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

  const medicinePieData = {
    labels: ["Antibiotic", "Painkiller", "Antacid", "Antiseptic", "Antiviral"],
    datasets: [
      {
        data: [
          medicineStats.byCategory.Antibiotic,
          medicineStats.byCategory.Painkiller,
          medicineStats.byCategory.Antacid,
          medicineStats.byCategory.Antiseptic,
          medicineStats.byCategory.Antiviral,
        ],
        backgroundColor: ["#0d9488", "#4dc0b5", "#b2e3d8", "#e6f4f1", "#2c7a7b"], // teal shades
        borderColor: "#fff",
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


  if (usersLoading || ordersLoading || medicinesLoading) {
    console.log("Loading states:", { usersLoading, ordersLoading, medicinesLoading });
    return (
      <div className="min-h-[70vh] py-12 px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (usersError || ordersError || medicinesError) {
    console.error("Rendering error state:", { usersError, ordersError, medicinesError });
    return (
      <div className="min-h-[70vh] py-12 px-6 lg:px-8 max-w-7xl mx-auto text-center text-red-600">
        Error loading dashboard data: {JSON.stringify(usersError || ordersError || medicinesError)}
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-12 px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Counts Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Total Counts</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Users by Role Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Users by Role</h3>
          <div className="h-64">
            <Pie data={userPieData} options={chartOptions} />
          </div>
        </div>

        {/* Orders by Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Orders by Status</h3>
          <div className="h-64">
            <Pie data={orderPieData} options={chartOptions} />
          </div>
        </div>

        {/* Medicines by Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Medicines by Category</h3>
          <div className="h-64">
            <Pie data={medicinePieData} options={chartOptions} />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Summary</h3>
          <ul className="space-y-2">
            <li className="text-gray-800">
              <span className="font-medium">Total Users:</span> {userStats.total}
            </li>
            <li className="text-gray-800">
              <span className="font-medium">Total Orders:</span> {orderStats.total}
            </li>
            <li className="text-gray-800">
              <span className="font-medium">Total Medicines:</span> {medicineStats.total}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDefaultPage;
