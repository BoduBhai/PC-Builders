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

  return (
    <dialog
      id="edit_profile_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">Edit Profile</h3>
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Profile Picture Upload */}

            <FormInput
              label="First Name"
              name="fname"
              value={editFormData.fname}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <FormInput
              label="Last Name"
              name="lname"
              value={editFormData.lname}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          <FormInput
            label="Phone Number"
            name="phone"
            value={editFormData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <h4 className="mt-4 font-semibold">Address Information</h4>
          <FormInput
            label="Street Address"
            name="address.street"
            value={editFormData.address.street}
            onChange={handleChange}
            placeholder="Enter your street address"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="City"
              name="address.city"
              value={editFormData.address.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            <FormInput
              label="State/Province"
              name="address.state"
              value={editFormData.address.state}
              onChange={handleChange}
              placeholder="Enter your state"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="ZIP/Postal Code"
              name="address.zipCode"
              value={editFormData.address.zipCode}
              onChange={handleChange}
              placeholder="Enter your ZIP code"
            />
            <FormInput
              label="Country"
              name="address.country"
              value={editFormData.address.country}
              onChange={handleChange}
              placeholder="Enter your country"
            />
          </div>

          <div className="modal-action">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document.getElementById("edit_profile_modal").close()
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default EditProfileModal;
