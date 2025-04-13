import { PlusCircle, ShoppingBasket, Users } from "lucide-react";
import { useEffect, useState, lazy, Suspense } from "react";

// Lazy loaded dashboard components
const CreateProductForm = lazy(
  () => import("../../components/CreateProductForm"),
);
const ProductsList = lazy(() => import("../../components/ProductsList"));
const UsersList = lazy(() => import("../../components/UsersList"));
const Analytics = lazy(() => import("../../components/Analytics"));

import { useProductStore } from "../../stores/useProductStore";
import { useAdminStore } from "../../stores/useAdminStore";
import { useAnalyticsStore } from "../../stores/useAnalyticsStore";

const tabs = [
  {
    id: "analytics",
    label: "Analytics",
    icon: ShoppingBasket,
  },
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
    id: "users",
    label: "Users",
    icon: Users,
  },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const { getAllUsers } = useAdminStore();
  const { fetchProducts } = useProductStore();
  const { fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
    getAllUsers();
  }, [fetchAnalytics, fetchProducts, getAllUsers]);

  return (
    <div className="min-h-screen">
      <h1 className="text-success mt-10 text-center text-4xl font-extrabold">
        Admin Dashboard
      </h1>
      <div className="mt-10 flex justify-center">
        <div
          role="tablist"
          className="tabs tabs-border bg-base-300 flex-col gap-5 rounded-md px-5 font-bold sm:flex-row"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab tab-bordered ${
                activeTab === tab.id ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2 size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        }
      >
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "users" && <UsersList />}
      </Suspense>
    </div>
  );
};

export default AdminDashboard;
