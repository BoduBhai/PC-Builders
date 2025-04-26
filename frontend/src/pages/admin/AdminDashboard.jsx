import { useEffect, lazy, Suspense } from "react";
import { BarChart4, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

// Lazy loaded dashboard component
const Analytics = lazy(() => import("../../components/Analytics"));

import { useAnalyticsStore } from "../../stores/useAnalyticsStore";

const AdminDashboard = () => {
  const { fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen">
      <div className="card bg-base-100 border-b-primary overflow-hidden border-b">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <BarChart4 className="text-primary size-8 md:size-10" />
              <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
                Analytics Overview
              </h1>
            </div>
            <Link to="/admin/management" className="btn btn-primary">
              <Settings className="mr-2" size={18} />
              Management Section
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-base-100 rounded-lg shadow-lg">
          <Suspense
            fallback={
              <div className="flex justify-center">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            }
          >
            <Analytics />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
