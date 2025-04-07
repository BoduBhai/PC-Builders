import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { user, loading, updateUserProfile, changePassword } = useUserStore();
  const [editFormData, setEditFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const avatarUrl = user?.profilePicture || "/avatar1.png";

  const handleEditClick = () => {
    setEditFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profilePicture: user?.profilePicture || null,
    });
    document.getElementById("edit_profile_modal").showModal();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
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
      toast.success("Profile updated successfully", { id: "profileUpdate" });
      document.getElementById("edit_profile_modal").close();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg, { id: "profileUpdate" });

      console.error("Profile update error:", error);
    }
  };

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    } else if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      toast.loading("Updating password...", { id: "passwordChange" });

      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      document.getElementById("change_password_modal").close();
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully", { id: "passwordChange" });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update password";
      toast.error(errorMsg, { id: "passwordChange" });
      console.error("Password change error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary mb-8 text-center text-3xl font-bold">
        Welcome,{" "}
        {user?.role === "admin" ? `Admin ${user?.name}` : `${user?.name}`}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="card bg-base-100 shadow-xl">
          <figure className="px-10 pt-10">
            <div className="avatar">
              <div className="w-32 rounded-full">
                <img src={avatarUrl} alt={user?.name || "User"} />
              </div>
            </div>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">{user?.name}</h2>

            {/* <div className="card-actions mt-4 justify-center"></div> */}
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

        {/* User Information */}
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
                  <div className="stat-value text-lg">{user?.name}</div>
                </div>

                {/* // TODO: Username */}

                <div className="stat">
                  <div className="stat-title">Email</div>
                  <div className="stat-value text-lg">{user?.email}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Phone</div>
                  <div className="stat-value text-lg">{user?.phone}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 font-semibold">Address</div>
                <div className="bg-base-200 rounded-lg p-3">
                  {user?.address || "No address provided"}
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
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
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
                    alt={user?.name || "User"}
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
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Full Name</span>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="input input-bordered w-full"
                value={editFormData.name || ""}
                onChange={handleEditChange}
              />
            </label>

            {/* Phone */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Your phone number"
                className="input input-bordered w-full"
                value={editFormData.phone || ""}
                onChange={handleEditChange}
              />
            </label>

            {/* Address */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Address</span>
              </div>
              <textarea
                name="address"
                className="textarea textarea-bordered w-full"
                rows="3"
                placeholder="Your address"
                value={editFormData.address || ""}
                onChange={handleEditChange}
              ></textarea>
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {loading ? (
                <span className="loading loading-spinner loading-xl text-primary" />
              ) : (
                <>
                  <button className="btn btn-outline mr-2">Cancel</button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Save Changes
                  </button>
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
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Current Password</span>
              </div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter your current password"
                className="input input-bordered mt-2 w-full"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>

            {/* New Password */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">New Password</span>
              </div>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className="input input-bordered mt-2 w-full"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <div className="label">
                <span className="label-text-alt text-gray-500">
                  Must be at least 6 characters
                </span>
              </div>
            </label>

            {/* Confirm New Password */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Confirm New Password</span>
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                className="input input-bordered mt-2 w-full"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {loading ? (
                <span className="loading loading-spinner loading-xl text-info" />
              ) : (
                <>
                  <button className="btn btn-outline mr-2">Cancel</button>
                  <button
                    className="btn btn-info"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </button>
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
