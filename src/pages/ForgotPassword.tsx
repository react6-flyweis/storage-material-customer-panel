import { useState } from "react";
import Button from "@/components/common_components/Button";
import Input from "@/components/common_components/Input";
import bgImage from "@/assets/AuthBackgroundImg.jpg";
import { Link, useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import { getApiErrorMessage } from "@/redux/utils/apiError";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPassword({ email: email.trim() }).unwrap();
      if (response.success) {
        setSuccessMessage(
          response.message || "If that email exists, an OTP has been sent"
        );
        setStep("verify");
      } else {
        setErrorMessage(
          response.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp || otp.trim().length === 0) {
      setErrorMessage("Please enter a valid OTP.");
      return;
    }

    try {
      const response = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      }).unwrap();

      if (response.success && response.data?.resetToken) {
        navigate("/reset-password", {
          state: { resetToken: response.data.resetToken, email: email.trim() },
        });
      } else {
        setErrorMessage(response.message || "Invalid OTP");
      }
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPassword({ email: email.trim() }).unwrap();
      if (response.success) {
        setSuccessMessage(response.message || "OTP resent successfully");
      } else {
        setErrorMessage(response.message || "Failed to resend OTP.");
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
        {step === "request" ? (
          <>
            <div className="text-center mb-10">
              <h1 className="md:text-2xl text-xl text-(--primary-color) sm:text-3xl font-medium mb-2">
                Forgot Password?
              </h1>
              <p className="text-(--text-color-gray) text-sm sm:text-base">
                Enter your email address to receive an OTP verification code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <Input
                id="email"
                label="E-mail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              <Button type="submit" disabled={isForgotLoading}>
                {isForgotLoading ? "Sending OTP..." : "Send OTP"}
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
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="md:text-2xl text-xl text-(--primary-color) sm:text-3xl font-medium mb-2">
                Verify OTP
              </h1>
              <p className="text-(--text-color-gray) text-sm sm:text-base">
                Enter the OTP sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <Input
                id="otp"
                label="OTP Code"
                type="number"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  if (e.currentTarget.value.length > 6) {
                    e.currentTarget.value = e.currentTarget.value.slice(0, 6);
                  }
                }}
                required
              />

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              <Button type="submit" disabled={isVerifyLoading}>
                {isVerifyLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="flex items-center justify-between pt-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isForgotLoading}
                  className="text-(--primary-color) hover:opacity-80 transition-colors font-medium"
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex justify-center pt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  className="text-sm font-normal text-(--primary-color) hover:opacity-80 transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

