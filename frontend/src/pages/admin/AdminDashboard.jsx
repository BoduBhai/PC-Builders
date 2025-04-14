import { useEffect, lazy, Suspense } from "react";
import { Settings } from "lucide-react";
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
    <div className="min-h-screen pt-[61px]">
      <h1 className="text-success mt-10 text-center text-4xl font-extrabold">
        Admin Dashboard
      </h1>

      <div className="container mx-auto px-4 py-8">
        {/* Management Section Link */}
        <div className="mb-8 flex justify-end">
          <Link to="/admin/management" className="btn btn-primary">
            <Settings className="mr-2" size={18} />
            Management Section
          </Link>
        </div>

        {/* Main Analytics Section */}
        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Analytics Overview</h2>
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
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
