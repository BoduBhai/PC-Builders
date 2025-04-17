import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDate } from "../utils/dateUtils";
import FormInput from "../components/ui/forms/FormInput";
import Button from "../components/ui/forms/Button";
import useForm from "../hooks/useForm";
import { MapPin, Mail, Phone } from "lucide-react";

const ProfilePage = () => {
  const { user, loading, updateUserProfile, changePassword } = useUserStore();
  const [editFormData, setEditFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    profilePicture: null,
  });

  // Use our custom useForm hook for password change
  const {
    values: passwordData,
    handleChange: handlePasswordChange,
    handleSubmit: handlePasswordFormSubmit,
    setValues: setPasswordData,
    errors: passwordErrors,
    setErrors: setPasswordErrors,
  } = useForm(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    async (values) => {
      if (values.newPassword !== values.confirmPassword) {
        setPasswordErrors({
          confirmPassword: "Passwords don't match",
        });
        return;
      } else if (values.newPassword.length < 6) {
        setPasswordErrors({
          newPassword: "Password must be at least 6 characters",
        });
        return;
      }

      try {
        toast.loading("Updating password...", { id: "passwordChange" });

        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        document.getElementById("change_password_modal").close();
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Password updated successfully", {
          id: "passwordChange",
        });
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message || "Failed to update password";
        toast.error(errorMsg, { id: "passwordChange" });
        console.error("Password change error:", error);
      }
    },
  );

  const avatarUrl = user?.profilePicture || "/avatar.avif";

  const handleEditClick = () => {
    setEditFormData({
      fname: user?.fname || "",
      lname: user?.lname || "",
      phone: user?.phone || "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zipCode: user?.address?.zipCode || "",
        country: user?.address?.country || "United States",
      },
      profilePicture: user?.profilePicture || null,
    });
    document.getElementById("edit_profile_modal").showModal();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditFormData({
        ...editFormData,
        address: {
          ...editFormData.address,
          [addressField]: value,
        },
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({
          ...editFormData,
          profilePicture: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setEditFormData({
        ...editFormData,
        profilePicture: null,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      toast.loading("Updating profile...", { id: "profileUpdate" });
      await updateUserProfile(editFormData);
      document.getElementById("edit_profile_modal").close();
      toast.success("Profile updated successfully", { id: "profileUpdate" });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg, { id: "profileUpdate" });

      console.error("Profile update error:", error);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary mb-8 text-center text-3xl font-bold">
        Welcome,{" "}
        {user?.role === "superadmin"
          ? `Master ${user?.fname}`
          : user?.role === "admin"
            ? `Admin ${user?.fname}`
            : `${user?.fname}`}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="card bg-base-100 shadow-xl">
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
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 mb-8 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 border-b pb-2 text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
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
                <div className="bg-base-200 rounded-lg p-4">
                  {formatFullAddress()}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 border-b pb-2 text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Account Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Wishlist
                    </h3>
                    <p>{user?.wishlist?.length || 0} items</p>
                    <Link to="/wishlist" className="link link-primary text-sm">
                      View wishlist
                    </Link>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Cart Items
                    </h3>
                    <p>{user?.cartItems?.length || 0} items</p>
                    <Link to="/cart" className="link link-primary text-sm">
                      View cart
                    </Link>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Member Since
                    </h3>
                    <p>
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <dialog
        id="edit_profile_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <div className="flex flex-col gap-4 py-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-2">
              <div className="avatar">
                <div className="w-32 rounded-full">
                  <img
                    src={editFormData.profilePicture || avatarUrl}
                    alt={user?.fname || "User"}
                  />
                </div>
              </div>
              <div className="mt-4 flex w-full">
                <div className="flex w-1/4 flex-col items-center justify-center">
                  Change image
                </div>
                <div className="w-3/4">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <FormInput
                label="First Name"
                type="text"
                name="fname"
                placeholder="Your first name"
                value={editFormData.fname || ""}
                onChange={handleEditChange}
                className="w-full"
              />
              <FormInput
                label="Last Name"
                type="text"
                name="lname"
                placeholder="Your last name"
                value={editFormData.lname || ""}
                onChange={handleEditChange}
                className="w-full"
              />
            </div>

            {/* Phone */}
            <FormInput
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="01X XXXXXXX"
              pattern="[0-9]{10,11}"
              maxLength={11}
              value={editFormData.phone || ""}
              onChange={handleEditChange}
            />

            {/* Address Fields */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Street Address</span>
              </label>
              <input
                name="address.street"
                className="input input-bordered w-full"
                placeholder="Street address"
                value={editFormData.address?.street || ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  name="address.city"
                  className="input input-bordered w-full"
                  placeholder="City"
                  value={editFormData.address?.city || ""}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">State</span>
                </label>
                <input
                  name="address.state"
                  className="input input-bordered w-full"
                  placeholder="State"
                  value={editFormData.address?.state || ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Zip Code</span>
                </label>
                <input
                  name="address.zipCode"
                  className="input input-bordered w-full"
                  placeholder="Zip Code"
                  value={editFormData.address?.zipCode || ""}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Country</span>
                </label>
                <select
                  name="address.country"
                  className="select select-bordered w-full"
                  value={editFormData.address?.country || "United States"}
                  onChange={handleEditChange}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {loading ? (
                <span className="loading loading-spinner loading-xl text-primary" />
              ) : (
                <>
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </dialog>

      {/* Change Password Modal */}
      <dialog
        id="change_password_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Change Password</h3>
          <div className="flex flex-col gap-4 py-4">
            {/* Current Password */}
            <FormInput
              label="Current Password"
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            {/* New Password */}
            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
              error={passwordErrors.newPassword}
              className="mt-2"
            />
            <div className="mt-[-10px] text-xs text-gray-500">
              Must be at least 6 characters
            </div>

            {/* Confirm New Password */}
            <FormInput
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              error={passwordErrors.confirmPassword}
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              {loading ? (
                <span className="loading loading-spinner loading-xl text-info" />
              ) : (
                <>
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button variant="info" onClick={handlePasswordFormSubmit}>
                    Update Password
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePage;
