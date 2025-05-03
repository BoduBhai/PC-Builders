import React, { useEffect } from "react";
import useForm from "../../hooks/useForm";
import FormInput from "../ui/forms/FormInput";
import Button from "../ui/forms/Button";

const EditProfileModal = ({ user, loading, onSave }) => {
  const initialFormData = {
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
  };

  const {
    values: editFormData,
    setValues: setEditFormData,
    handleChange,
    handleSubmit,
  } = useForm(initialFormData, onSave);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
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
    }
  }, [user, setEditFormData]);

  // Special handler for address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const addressField = name.split(".")[1];
    setEditFormData({
      ...editFormData,
      address: {
        ...editFormData.address,
        [addressField]: value,
      },
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

  const avatarUrl = user?.profilePicture || "/avatar.avif";

  if (!user) return null;

  return (
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
              onChange={handleChange}
              className="w-full"
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lname"
              placeholder="Your last name"
              value={editFormData.lname || ""}
              onChange={handleChange}
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
            onChange={handleChange}
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
              onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
                onChange={handleAddressChange}
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
            <Button variant="outline" className="mr-2" type="submit">
              Cancel
            </Button>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-primary" />
            ) : (
              <Button variant="primary" onClick={handleSubmit} type="button">
                Save Changes
              </Button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditProfileModal;
