import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MapPin, Mail, Phone, ShoppingCart, Calendar } from "lucide-react";

import { formatDate } from "../utils/dateUtils";
import { useUserStore } from "../stores/useUserStore";

import EditProfileModal from "../components/User/EditProfileModal";
import ChangePasswordModal from "../components/User/ChangePasswordModal";

import PersonIcon from "../components/icons/PersonIcon";
import UserIcon from "../components/icons/UserIcon";

// TODO: work remains

const ProfilePage = () => {
  const { user, loading, updateUserProfile, changePassword } = useUserStore();

  const avatarUrl = user?.profilePicture || "/avatar.avif";

  const handleEditClick = () => {
    document.getElementById("edit_profile_modal").showModal();
  };

  const handleUpdateProfile = async (formData) => {
    try {
      toast.loading("Updating profile...", { id: "profileUpdate" });
      await updateUserProfile(formData);
      document.getElementById("edit_profile_modal").close();
      toast.success("Profile updated successfully", { id: "profileUpdate" });
    } catch (error) {
      document.getElementById("edit_profile_modal").close();

      const errorMsg =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg, { id: "profileUpdate" });
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      toast.loading("Updating password...", { id: "passwordChange" });
      await changePassword(passwordData);
      document.getElementById("change_password_modal").close();
      toast.success("Password updated successfully", {
        id: "passwordChange",
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update password";
      toast.error(errorMsg, { id: "passwordChange" });
      console.error("Password change error:", error);
    }
  };

  // Format full address for display
  const formatFullAddress = () => {
    if (!user?.address) return "No address provided";

    const { street, city, state, zipCode, country } = user.address;
    const parts = [];

    if (street) parts.push(street);
    if (city && state) parts.push(`${city}, ${state}`);
    else if (city) parts.push(city);
    else if (state) parts.push(state);
    if (zipCode) parts.push(zipCode);
    if (country && country !== "United States") parts.push(country);

    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  return (
    <main className="container mx-auto min-h-[80vh]">
      <header>
        <h1 className="text-primary mb-4 text-center text-3xl font-bold">
          Welcome,{" "}
          {user?.role === "superadmin"
            ? `Master ${user?.fname}`
            : user?.role === "admin"
              ? `Admin ${user?.fname}`
              : `${user?.fname}`}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <aside className="card bg-base-200 shadow-xl">
          <figure className="px-10 pt-10">
            <div className="avatar">
              <div className="w-32 rounded-full">
                <img src={avatarUrl} alt={user?.fname || "User"} />
              </div>
            </div>
          </figure>
          <div className="card-body items-center text-center">
            <button className="btn btn-primary w-42" onClick={handleEditClick}>
              Edit Profile
            </button>
            <button
              className="btn btn-info w-42"
              onClick={() =>
                document.getElementById("change_password_modal").showModal()
              }
            >
              Change Password
            </button>
          </div>
        </aside>

        {/* Personal Information */}
        <section className="lg:col-span-2">
          <article className="card bg-base-200 mb-8 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 border-b pb-2 text-xl">
                <UserIcon className="size-5" />
                Personal Information
              </h2>

              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Full Name</div>
                  <div className="stat-value text-lg">
                    {user?.fname} {user?.lname}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Email</div>
                  <div className="stat-value flex items-center gap-2 text-lg">
                    <Mail size={16} /> {user?.email}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Phone</div>
                  <div className="stat-value flex items-center gap-2 text-lg">
                    <Phone size={16} /> {user?.phone}
                  </div>
                </div>
              </div>

              {/* Address Information with Icon */}
              <div className="mt-6">
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <MapPin size={18} />
                  Shipping Address
                </h3>
                <address className="bg-base-300 rounded-lg p-4 not-italic">
                  {formatFullAddress()}
                </address>
              </div>
            </div>
          </article>

          {/* Account Information */}
          <article className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 border-b pb-2 text-xl">
                <PersonIcon className="size-5" />
                Account Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card bg-base-300">
                  <div className="card-body p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <ShoppingCart size={18} />
                      Cart Items
                    </h3>
                    <p>{user?.cartItems?.length || 0} items</p>
                    <Link to="/cart" className="link link-primary text-sm">
                      View cart
                    </Link>
                  </div>
                </div>

                <div className="card bg-base-300">
                  <div className="card-body p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Calendar size={18} />
                      Member Since
                    </h3>
                    <p>
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>

      <EditProfileModal
        user={user}
        loading={loading}
        onSave={handleUpdateProfile}
      />

      <ChangePasswordModal loading={loading} onSave={handleChangePassword} />
    </main>
  );
};

export default ProfilePage;
