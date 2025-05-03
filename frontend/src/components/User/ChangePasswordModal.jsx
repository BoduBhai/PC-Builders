import React from "react";
import useForm from "../../hooks/useForm";
import FormInput from "../ui/forms/FormInput";
import Button from "../ui/forms/Button";

const ChangePasswordModal = ({ loading, onSave }) => {
  const initialFormData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Form validation function
  const validatePasswordForm = (values) => {
    const errors = {};

    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (values.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    return errors;
  };

  const {
    values: passwordData,
    handleChange,
    handleSubmit,
    errors,
    resetForm,
  } = useForm(
    initialFormData,
    (values) => {
      // Only save if no validation errors
      if (Object.keys(errors).length === 0) {
        onSave({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
      }
    },
    validatePasswordForm,
  );

  return (
    <dialog
      id="change_password_modal"
      className="modal modal-bottom sm:modal-middle"
      onClose={resetForm}
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
            onChange={handleChange}
            required
          />

          {/* New Password */}
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
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
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <Button
              variant="outline"
              className="mr-2"
              onClick={resetForm}
              type="submit"
            >
              Cancel
            </Button>
            {loading ? (
              <span className="loading loading-spinner loading-xl text-info" />
            ) : (
              <Button variant="info" onClick={handleSubmit} type="button">
                Update Password
              </Button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ChangePasswordModal;
