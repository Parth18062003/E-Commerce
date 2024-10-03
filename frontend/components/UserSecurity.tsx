"use client";

import React, { useState } from "react";
import { TransitionLink } from "./utils/TransitionLink";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { update2FAStatus } from "@/store/authSlice";
import Cookies from "js-cookie";
import axios from "axios";
import Notification from "./ui/notification";
import DeviceLogsComponent from "./DeviceLog";
import DeleteConfirmDialog from "./ui/deleteDialog";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
};

const UserSecurity = () => {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const loading = !reduxUser;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const router = useRouter();

  const toggle2FA = async () => {
    if (!reduxUser) return;

    const userId = reduxUser.id;
    const token = Cookies.get("token");
    const enable = !reduxUser.is2FAEnabled;

    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/users/update-2fa/${userId}`,
        null,
        {
          params: { enable },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        addNotification("Failed to update 2FA status", "error");
        throw new Error("Failed to update 2FA status");
      }

      dispatch(update2FAStatus(enable));
      addNotification(`2FA has been ${enable ? "enabled" : "disabled"} successfully.`, "success");
    } catch (error) {
      console.error(error);
      addNotification("There was an error updating the 2FA status. Please try again.", "error");
    }
  };

  const deleteUserAccount = async () => {
    if (!reduxUser) return;

    const userId = reduxUser.id;
    const token = Cookies.get("token");
    setIsDeleting(true);

    try {
      const response = await axios.delete(`http://localhost:8081/api/v1/users/delete-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        dispatch({ type: "auth/logout" });
        addNotification("Your account has been deleted successfully.", "success");
        router.push("/authentication/sign-up");
      } else {
        addNotification("Failed to delete account.", "error");
      }
    } catch (error) {
      console.error(error);
      addNotification("There was an error deleting your account. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteConfirm = (confirmText: string) => {
    if (confirmText === "delete") {
      deleteUserAccount();
      setIsDialogOpen(false);
    }
  };

  const addNotification = (text: string, type: "info" | "success" | "error") => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <>
      <div className="flex justify-start mt-10">
        <TransitionLink
          href="/authentication/forgot-password"
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-zinc-800 after:transition-transform after:duration-150 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
        >
          Reset Password
        </TransitionLink>
      </div>
      <div className="flex flex-col justify-between mt-4">
        {loading ? (
          <div className="text-white">Loading user information...</div>
        ) : (
          reduxUser && (
            <>
              <div className="flex justify-between">
                <div>
                  <span>User Created at: </span>
                  {new Date(reduxUser.createdAt).toLocaleString()}
                  <br />
                  <span>Last updated at: </span>
                  {new Date(reduxUser.updatedAt).toLocaleString()}
                </div>
                <div className="flex flex-col">
                  <span>
                    2FA Status:{" "}
                    <strong>{reduxUser.is2FAEnabled ? "Enabled" : "Disabled"}</strong>
                  </span>
                  <button
                    onClick={toggle2FA}
                    className={`inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 dark:bg-zinc-100 px-6 font-medium text-zinc-50 dark:text-zinc-950 shadow-lg shadow-zinc-800/20 dark:shadow-zinc-200/20 transition active:scale-95`}
                  >
                    {reduxUser.is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsDialogOpen(true)} // Open dialog
                  className={`inline-flex h-10 items-center justify-center rounded-md bg-red-500 text-white px-6 font-medium transition active:scale-95`}
                >
                  Delete My Account
                </button>
              </div>
            </>
          )
        )}
        {reduxUser && 
          <DeviceLogsComponent userId={reduxUser?.id || ""} firstName={reduxUser?.firstName || ""} />
        }
      </div>
      <Notifications notifications={notifications} removeNotification={removeNotification} />
      <DeleteConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

// Notifications component with type annotations
interface NotificationsProps {
  notifications: NotificationType[];
  removeNotification: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  removeNotification,
}) => (
  <div className="fixed top-2 right-2 z-50 pointer-events-none">
    {notifications.map((notif) => (
      <Notification
        key={notif.id}
        id={notif.id}
        text={notif.text}
        type={notif.type}
        removeNotif={removeNotification}
      />
    ))}
  </div>
);

export default UserSecurity;
