
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
import { setOrders, selectOrders, IOrder } from "@/redux/features/order/orderSlice";
import { setMedicines, selectMedicines } from "@/redux/features/medicine/medicineSlice";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faTruckMedical, faCapsules } from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Categorical palette drawn from the Digital Apothecary tokens — pharmacy
// green as the dominant signature, rx red and amber as secondary accents,
// muted grays to round out longer category lists.
const CHART_COLORS = {
  pharmacy: "#0f7a4a",
  pharmacyDeep: "#0a5c37",
  pharmacyLight: "#8fcdac",
  rx: "#c6412f",
  amber: "#b8790f",
  muted: "#6b7a75",
  border: "#dbe6e0",
};

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
      // GET /orders returns products.productId populated as a full object;
      // the orders slice's IOrder type still models it as a plain string id.
      dispatch(setOrders(ordersData.data as unknown as IOrder[]));
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
      user: allUsers.filter((u) => u.role === "customer").length || 0,
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
        backgroundColor: CHART_COLORS.pharmacy,
        borderColor: CHART_COLORS.pharmacyDeep,
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Pie chart data
  const userPieData = {
    labels: ["Admin", "User"],
    datasets: [
      {
        data: [userStats.byRole.admin, userStats.byRole.user],
        backgroundColor: [CHART_COLORS.pharmacyDeep, CHART_COLORS.pharmacyLight],
        borderColor: "#fff",
        borderWidth: 2,
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
        backgroundColor: [CHART_COLORS.amber, CHART_COLORS.pharmacyLight, CHART_COLORS.muted, CHART_COLORS.pharmacy],
        borderColor: "#fff",
        borderWidth: 2,
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
        backgroundColor: [
          CHART_COLORS.pharmacy,
          CHART_COLORS.rx,
          CHART_COLORS.amber,
          CHART_COLORS.muted,
          CHART_COLORS.pharmacyLight,
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#3d4d47", font: { family: "var(--font-sans)" } },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#3d4d47" },
        grid: { color: "#dbe6e0" },
      },
      x: {
        ticks: { color: "#3d4d47" },
        grid: { display: false },
      },
    },
  };


  if (usersLoading || ordersLoading || medicinesLoading) {
    console.log("Loading states:", { usersLoading, ordersLoading, medicinesLoading });
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto">
        <SectionHeading eyebrow="Clinical Ops" title="Admin Overview" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-6 bg-paper-deep rounded w-1/2 mb-4"></div>
              <div className="h-40 bg-paper-deep rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (usersError || ordersError || medicinesError) {
    console.error("Rendering error state:", { usersError, ordersError, medicinesError });
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto text-center text-rx">
        Error loading dashboard data: {JSON.stringify(usersError || ordersError || medicinesError)}
      </div>
    );
  }

  const statTiles = [
    { label: "Total Users", value: userStats.total, icon: faUserGroup },
    { label: "Total Orders", value: orderStats.total, icon: faTruckMedical },
    { label: "Total Medicines", value: medicineStats.total, icon: faCapsules },
  ];

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto">
      <SectionHeading eyebrow="Clinical Ops" title="Admin Overview" className="mb-8" />

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {statTiles.map((tile) => (
          <Card key={tile.label} className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pharmacy-light text-pharmacy-deep">
              <FontAwesomeIcon icon={tile.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{tile.label}</p>
              <p className="font-mono text-2xl font-semibold text-ink">{tile.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Counts Bar Chart */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-pharmacy-deep mb-4">Total Counts</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>

        {/* Users by Role Pie Chart */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-pharmacy-deep mb-4">Users by Role</h3>
          <div className="h-64">
            <Pie data={userPieData} options={chartOptions} />
          </div>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-pharmacy-deep mb-4">Orders by Status</h3>
          <div className="h-64">
            <Pie data={orderPieData} options={chartOptions} />
          </div>
        </Card>

        {/* Medicines by Category Pie Chart */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-pharmacy-deep mb-4">Medicines by Category</h3>
          <div className="h-64">
            <Pie data={medicinePieData} options={chartOptions} />
          </div>
        </Card>

        {/* Summary Stats */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-pharmacy-deep mb-4">Summary</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm text-ink-soft">
              <span>Total Users</span>
              <span className="font-mono font-semibold text-ink">{userStats.total}</span>
            </li>
            <li className="flex items-center justify-between text-sm text-ink-soft">
              <span>Total Orders</span>
              <span className="font-mono font-semibold text-ink">{orderStats.total}</span>
            </li>
            <li className="flex items-center justify-between text-sm text-ink-soft">
              <span>Total Medicines</span>
              <span className="font-mono font-semibold text-ink">{medicineStats.total}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminDefaultPage;
