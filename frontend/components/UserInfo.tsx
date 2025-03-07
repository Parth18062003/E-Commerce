"use client";

import useUser from "@/hooks/useUser";
import { updateUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { z } from "zod";
import { UpdateUserSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import UserSecurity from "./UserSecurity";
import ProfileImageUpload from "./ProfileImageUpload";
import { toast } from "sonner";

type UpdateUserData = z.infer<typeof UpdateUserSchema>;

const UserInfo = () => {
  const { loading, error } = useUser();
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
  });

  const [originalData, setOriginalData] = useState<UpdateUserData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateUserData | null>(null);

  useEffect(() => {
    if (reduxUser) {
      const {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        address,
        city,
        state,
        country,
        postalCode,
        profileImageUrl,
      } = reduxUser;

      reset({
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        address,
        city,
        state,
        country,
        postalCode,
      });
      setOriginalData({
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        address,
        city,
        state,
        country,
        postalCode,
      });
    }
  }, [reduxUser, reset]);

  const onSubmit: SubmitHandler<UpdateUserData> = async (data) => {
    if (JSON.stringify(data) === JSON.stringify(originalData)) {
      toast.info("No changes detected.");
      return; // Ensure this returns void
    }
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleUpdate = async (data: UpdateUserData) => {
    if (!reduxUser) return;

    const userId = reduxUser.id;
    const url = `http://192.168.29.159:8081/api/v1/users/update-profile/${userId}`;
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    try {
      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(updateUser(response.data));
      setIsEditing(false);
      setOriginalData(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      setApiError(error.message);
    } else {
      toast.error("An unexpected error occurred");
      setApiError("An unexpected error occurred.");
    }
  };

  const handleConfirm = async () => {
    if (pendingData) {
      await handleUpdate(pendingData);
      setPendingData(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return <p className="text-center">Loading user data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!reduxUser) {
    return <p className="text-center">User not found. Please log in again.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl rounded-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center">
          <CardTitle className="text-3xl font-bold text-left text-zinc-900 dark:text-zinc-200">
            {reduxUser.firstName}'s Profile
          </CardTitle>
          <ProfileImageUpload
            defaultImageUrl={reduxUser?.profileImageUrl}
            userId={reduxUser?.id}
          />
        </CardHeader>

        <CardContent className="mt-2 p-4 dark rounded-lg text-zinc-950 dark:text-zinc-200">
          <UserDetails
            originalData={originalData}
            register={register}
            errors={errors}
            isEditing={isEditing}
          />
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 p-6">
          <EditButton
            isEditing={isEditing}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            setIsEditing={setIsEditing}
          />
        </CardFooter>
        <div className="p-3">
          <UserSecurity />
        </div>
        {apiError && <p className="text-red-500 text-center">{apiError}</p>}
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes?
            </DialogDescription>
          </DialogHeader>
          <DialogActions
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ProfileImage component with type annotations
interface ProfileImageProps {
  profileImage: string;
  handleProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// UserDetails component with type annotations
interface UserDetailsProps {
  originalData: UpdateUserData | null;
  register: any; // Replace 'any' with the specific type from react-hook-form if known
  errors: Record<string, any>; // Adjust based on your error structure
  isEditing: boolean;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  originalData,
  register,
  errors,
  isEditing,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(originalData || {}).map(([key, value]) => {
      const inputKey = key as keyof UpdateUserData;
      return (
        <div key={inputKey}>
          <label className="block">
            <strong>
              {inputKey.charAt(0).toUpperCase() + inputKey.slice(1)}:
            </strong>
          </label>
          <Input
            {...register(inputKey)}
            name={inputKey}
            defaultValue={value}
            className="mt-1"
            disabled={!isEditing}
          />
          {isEditing && errors[inputKey] && (
            <span className="text-red-500">{errors[inputKey].message}</span>
          )}
        </div>
      );
    })}
  </div>
);

// EditButton component with type annotations
interface EditButtonProps {
  isEditing: boolean;
  handleSubmit: (
    callback: SubmitHandler<UpdateUserData>
  ) => (data?: any) => Promise<void>;
  onSubmit: SubmitHandler<UpdateUserData>; // Keep this as it is
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditButton: React.FC<EditButtonProps> = ({
  isEditing,
  handleSubmit,
  onSubmit,
  setIsEditing,
}) => (
  <button
    className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 dark:bg-zinc-100 px-6 font-medium text-zinc-50 dark:text-zinc-950 shadow-lg shadow-zinc-800/20 dark:shadow-zinc-200/20 transition active:scale-95"
    onClick={() => {
      if (isEditing) {
        handleSubmit(onSubmit)(); // Ensure handleSubmit is called with onSubmit
      }
      setIsEditing((prev) => !prev);
    }}
  >
    {isEditing ? "Save" : "Edit"}
  </button>
);

// DialogActions component with type annotations
interface DialogActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  handleCancel,
  handleConfirm,
}) => (
  <div className="flex justify-end mt-4 space-x-3">
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-800 px-6 font-medium text-zinc-200 shadow-lg shadow-zinc-500/20 transition active:scale-95"
      onClick={handleCancel}
    >
      Cancel
    </button>
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-200 px-6 font-medium text-zinc-800 shadow-lg shadow-zinc-100/20 transition active:scale-95"
      onClick={handleConfirm}
    >
      Save
    </button>
  </div>
);

export default UserInfo;
