import { useState } from "react";
import Button from "@/components/common_components/Button";
import Input from "@/components/common_components/Input";
import bgImage from "@/assets/AuthBackgroundImg.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { getApiErrorMessage } from "@/redux/utils/apiError";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken || "";
  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetToken) {
      setErrorMessage("Reset session invalid or expired. Please request a new OTP.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword({
        resetToken,
        newPassword,
      }).unwrap();

      if (response.success) {
        setSuccessMessage(response.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMessage(response.message || "Failed to reset password.");
      }
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-125 bg-white rounded-[10px] shadow-2xl p-8 sm:p-10 md:p-12 relative z-10 mx-auto">
        <div className="text-center mb-10">
          <h1 className="md:text-2xl text-xl text-(--primary-color) sm:text-3xl font-medium mb-2">
            Reset Password
          </h1>
          <p className="text-(--text-color-gray) text-sm sm:text-base">
            Set a new password for {email ? <span className="font-medium text-gray-900">{email}</span> : "your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="flex justify-center pt-2">
            <Link
              to="/login"
              className="text-sm font-normal text-(--primary-color) hover:opacity-80 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
