import { PlusCircle, ShoppingBasket, Users, ShoppingCart } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";

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
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold">Management Dashboard</h1>

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            className="tabs tabs-bordered bg-base-300 flex-col gap-5 rounded-md px-5 font-bold sm:flex-row"
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

        <div className="bg-base-100 mt-8 rounded-lg p-6 shadow-md">
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
  );
};

export default AdminManagementPage;
