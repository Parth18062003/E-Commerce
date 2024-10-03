// components/ListUsers.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUsers } from "../store/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Alert } from "./ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import DeleteConfirmDialog from "./ui/deleteDialog";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

const ListUsers: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error, totalPages } = useSelector(
    (state: RootState) => state.user
  );
  const [page, setPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersData = async (page: number) => {
      try {
        const resultAction = await dispatch(fetchUsers(page));
        if (fetchUsers.fulfilled.match(resultAction)) {
          const cachedData = JSON.parse(localStorage.getItem("users") || "{}");
          cachedData[page] = resultAction.payload.content;
          localStorage.setItem("users", JSON.stringify(cachedData));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const cachedUsers = localStorage.getItem("users");
    if (cachedUsers) {
      const cachedData = JSON.parse(cachedUsers);
      const usersForPage = cachedData[page] || [];
      if (usersForPage.length > 0) {
        dispatch({ type: "user/setUsers", payload: usersForPage });
      } else {
        fetchUsersData(page);
      }
    } else {
      fetchUsersData(page);
    }
  }, [page, dispatch]);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/users/delete-profile/${id}`);
      // Refetch users after deletion
      await dispatch(fetchUsers(page)); // This will update the Redux store
      updateLocalStorageAfterDelete(id); // Update local storage
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const updateLocalStorageAfterDelete = (id: string) => {
    const cachedData = JSON.parse(localStorage.getItem("users") || "{}");
    // Update local storage to remove the user from the current page
    cachedData[page] = cachedData[page].filter((user: User) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(cachedData));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleRefresh = async () => {
    localStorage.removeItem("users");
    await dispatch(fetchUsers(0)); // Fetch users for the first page
    setPage(0); // Reset to the first page
  };  

  const openDeleteDialog = (id: string) => {
    setUserIdToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = (confirmText: string) => {
    if (userIdToDelete && confirmText === "delete") {
      handleDeleteUser(userIdToDelete);
      setIsDialogOpen(false);
      setUserIdToDelete(null); // Reset user ID after delete
    }
  };

  if (loading) {
    return <p className="text-red-500 font-bold">Loading users...</p>;
  }

  return (
    <div className="p-6 bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>
      {error && <Alert>{error}</Alert>}
      {users.length > 0 ? (
        <Table className="min-w-full divide-y divide-zinc-700">
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.address}, {user.city}, {user.state}, {user.country}, {user.postalCode}</TableCell>
                <TableCell>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => openDeleteDialog(user.id)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No users found.</p>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className="mr-2">
          Previous
        </Button>
        <Button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
          Next
        </Button>
      </div>
      <Button onClick={handleRefresh} className="mt-4">
        Refresh
      </Button>

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ListUsers;
