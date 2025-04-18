import {
  PlusCircle,
  ShoppingBasket,
  Users,
  ShoppingCart,
  LayoutDashboard,
  BarChart4,
} from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

// Lazy loaded components
const CreateProductForm = lazy(
  () => import("../../components/CreateProductForm"),
);
const ProductsList = lazy(() => import("../../components/ProductsList"));
const UsersList = lazy(() => import("../../components/UsersList"));
const AdminOrdersPage = lazy(() => import("./AdminOrdersPage"));

import { useProductStore } from "../../stores/useProductStore";
import { useAdminStore } from "../../stores/useAdminStore";
import { useAdminOrderStore } from "../../stores/useAdminOrderStore";
import LoadingSpinner from "../../components/LoadingSpinner";

const tabs = [
  {
    id: "create",
    label: "Create Product",
    icon: PlusCircle,
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBasket,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
];

const AdminManagementPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const { getAllUsers } = useAdminStore();
  const { fetchProducts } = useProductStore();
  const { fetchAllOrders } = useAdminOrderStore();

  useEffect(() => {
    // Load data based on active tab
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      getAllUsers();
    } else if (activeTab === "orders") {
      fetchAllOrders();
    }
  }, [activeTab, fetchProducts, getAllUsers, fetchAllOrders]);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        {/* Enhanced Header Section */}
        <div className="card bg-base-100 border-b-primary mb-8 overflow-hidden border-b">
          <div className="card-body p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <BarChart4 className="text-primary size-8 md:size-10" />
                <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
                  Management Dashboard
                </h1>
              </div>
              <Link
                to="/dashboard"
                className="btn btn-sm md:btn-md btn-primary"
              >
                <LayoutDashboard className="mr-2 size-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Improved Tabs Section */}
        <div className="flex justify-center">
          <div className="tabs-boxed bg-base-300 rounded-box flex w-full flex-wrap justify-evenly gap-1 p-2 shadow-md md:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
                  activeTab === tab.id
                    ? "text-primary border-primary border-b-2"
                    : "hover:bg-base-200"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon
                  className={`size-4 md:size-5 ${activeTab === tab.id ? "text-primary" : ""}`}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "create" ? "New" : tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-base-300 my-8 rounded-lg shadow-lg">
          <div className="card-body p-4 md:p-6">
            <Suspense
              fallback={
                <div className="flex justify-center p-12">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {activeTab === "create" && <CreateProductForm />}
              {activeTab === "products" && <ProductsList />}
              {activeTab === "orders" && <AdminOrdersPage />}
              {activeTab === "users" && <UsersList />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementPage;
