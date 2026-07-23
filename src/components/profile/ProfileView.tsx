import { Camera, CircleAlert, MoveLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleSubtitle from "../common_components/TitleSubtitle";
import SuccessModal from "../common_components/SuccessModal";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/redux/api/authApi";

interface ProfileViewProps {
  onNavigate?: (view: "settings") => void;
}

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="p-5 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between mt-2 xl:mt-0">
        <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="space-y-2">
        <div className="h-7 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-72 bg-gray-100 rounded"></div>
      </div>

      {/* Profile Picture Section Skeleton */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-wrap items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0"></div>
        <div className="space-y-3 flex-1">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-9 w-36 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-48 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Basic Info Skeleton */}
      <div className="h-6 w-36 bg-gray-200 rounded my-1"></div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings Skeleton */}
      <div className="h-6 w-36 bg-gray-200 rounded"></div>
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
        <div className="h-4 w-64 bg-gray-100 rounded mb-4"></div>
        <div className="w-full md:w-1/2 pr-0 md:pr-3">
          <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
          <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const DEFAULT_AVATAR =
  "https://imgs.search.brave.com/C6AU3hqShumrOuZaswKHOeZBwOo-XeuuJnf7XZ-5QW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal9mcy1faEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9";

const ProfileView: React.FC<ProfileViewProps> = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileResponse, isLoading, error: getProfileError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const customer = profileResponse?.data?.customer;

  const [profilePicture, setProfilePicture] = useState<string>(DEFAULT_AVATAR);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    customerId: "",
    source: "",
    role: "Customer",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (customer) {
      const fullPhone =
        typeof customer.phone === "object" && customer.phone
          ? `${customer.phone.countryCode || ""} ${customer.phone.number || ""}`.trim()
          : typeof customer.phone === "string"
          ? customer.phone
          : "";

      setFormData((prev) => ({
        ...prev,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: fullPhone,
        company: customer.company || "",
        location: customer.location || "",
        customerId: customer.customerId || "",
        source: customer.source || "chat",
        role: "Customer",
      }));

      if (customer.photo) {
        setProfilePicture(customer.photo);
      }
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert("Only JPG, PNG, or GIF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setProfileErrorMessage("");

    try {
      const updateData: Record<string, unknown> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        location: formData.location,
        photo: profilePicture !== DEFAULT_AVATAR ? profilePicture : customer?.photo || null,
      };

      const response = await updateProfile(updateData).unwrap();

      if (response.success) {
        setModalTitle(response.message || "Profile Updated Successfully");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setProfileErrorMessage(
        errorObj?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMessage("");

    if (!passwordData.currentPassword) {
      setPasswordErrorMessage("Please enter your current password.");
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordErrorMessage("Please enter a new password.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      if (response.success) {
        setModalTitle(response.message || "Password Changed Successfully");
        setIsSuccessModalOpen(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setPasswordErrorMessage(
        errorObj?.data?.message || "Failed to change password. Please try again."
      );
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mt-2 xl:mt-0">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <MoveLeft className="w-4 h-4" />
            <p className="font-normal">Back</p>
          </button>
        </div>
        <button
          disabled={isUpdating}
          onClick={handleSaveProfile}
          className="md:px-4 ml-auto lg:mt-2 mt-4 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity md:text-sm text-xs font-normal min-w-[128px] w-fit disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <TitleSubtitle
        title="My Profile"
        subtitle="Update your personal information and security settings"
      />

      {getProfileError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Failed to load profile details.
        </div>
      )}

      {profileErrorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {profileErrorMessage}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-wrap items-center gap-6">
        <img
          src={profilePicture || DEFAULT_AVATAR}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 bg-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
          }}
        />
        <div className="space-y-2 flex flex-col flex-wrap">
          <h3 className="md:text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleProfilePictureClick}
              type="button"
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <p className="md:text-sm text-xs">Change Picture</p>
            </button>
            <span className="md:text-sm text-xs text-gray-400">
              JPG, PNG or GIF, Max size 2MB.
            </span>
          </div>
        </div>
      </div>

      <h3 className="md:text-lg font-semibold text-gray-900 my-1">
        Basic Information
      </h3>
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Company / Business Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Customer ID
            </label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed font-medium"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
            />
            <span className="text-xs text-gray-500">
              Role cannot be changed from this interface
            </span>
          </div>
        </div>
      </div>

      {/* Security Settings / Change Password Form */}
      <h3 className="md:text-lg font-semibold text-gray-900">
        Security Settings
      </h3>
      <form onSubmit={handleChangePasswordSubmit} className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
        {passwordErrorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {passwordErrorMessage}
          </div>
        )}

        <div className="w-full md:w-1/2 pr-0 md:pr-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-4 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity md:text-sm text-xs font-normal min-w-[140px] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Password Requirements Info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-(--text-color-primary-blue) font-medium md:text-sm text-xs">
          <CircleAlert className="w-5 h-5" />
          Password Requirements:
        </div>
        <ul className="space-y-2 md:text-sm text-xs text-(--text-color-primary-blue)">
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
      />
    </div>
  );
};

export default ProfileView;
