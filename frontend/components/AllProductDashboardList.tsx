"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { PencilOff, Trash2 } from "lucide-react";
import Notification from "./ui/notification";
import Image from "next/image";

type NotificationType = {
  id: number;
  text: string;
  type: "info" | "success" | "error";
};

const AllProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);
  const [deleting, setDeleting] = useState(false);
  const productsPerPage = 10;

  useEffect(() => {
    const isProductsCached =
      products.length > 0 &&
      products.length >= productsPerPage * (currentPage - 1);

    if (!isProductsCached) {
      dispatch(fetchProducts(currentPage - 1));
    }
  }, [dispatch, currentPage, products, productsPerPage]);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/product/edit-product/${id}`);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    if (selectedProduct) {
      try {
        await dispatch(deleteProduct(selectedProduct.id)).unwrap();
        addNotification("Product deleted successfully.", "success");
      } catch {
        addNotification("Failed to delete product.", "error");
      } finally {
        setDeleting(false);
        setShowConfirmDialog(false);
        setSelectedProduct(null);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setSelectedProduct(null);
  };

  const addNotification = (text: string, type: "info" | "success" | "error") => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-zinc-100 text-black">
      <h1 className="text-3xl font-bold mb-6 text-zinc-800">All Products</h1>
      <table className="min-w-full border-collapse border border-zinc-200 bg-white shadow-lg">
        <thead>
          <tr className="bg-zinc-200">
            <th className="border border-zinc-300 p-4">ID</th>
            <th className="border border-zinc-300 p-4">Name</th>
            <th className="border border-zinc-300 p-4">SKU</th>
            <th className="border border-zinc-300 p-4">Price</th>
            <th className="border border-zinc-300 p-4">Stock</th>
            <th className="border border-zinc-300 p-4">Discount</th>
            <th className="border border-zinc-300 p-4">Dimensions</th>
            <th className="border border-zinc-300 p-4">Weight</th>
            <th className="border border-zinc-300 p-4">Main Image</th>
            <th className="border border-zinc-300 p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-zinc-50">
              <td
                className="border border-zinc-300 p-4 cursor-pointer text-blue-600"
                onClick={() => setSelectedProduct(product)}
              >
                {product.id.length > 10 ? `${product.id.substring(0, 10)}...` : product.id}
              </td>
              <td
                className="border border-zinc-300 p-4 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-zinc-600">{product.brand}</div>
              </td>
              <td className="border border-zinc-300 p-4">{product.sku}</td>
              <td className="border border-zinc-300 p-4">${product.price.toFixed(2)}</td>
              <td className="border border-zinc-300 p-4">{product.stockQuantity}</td>
              <td className="border border-zinc-300 p-4">{product.discount}%</td>
              <td className="border border-zinc-300 p-4">{product.dimensions}</td>
              <td className="border border-zinc-300 p-4">{product.weight}</td>
              <td className="border border-zinc-300 p-4">
                <Image
                  src={product.colorOptionImages[product.colorOptions[0]][0]}
                  alt={product.name}
                  height={256}
                  width={256}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="border border-zinc-300 p-4">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600 transition"
                >
                  <PencilOff />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <div className="mt-6 p-4 border border-zinc-300 rounded bg-white shadow">
          <h2 className="text-xl font-bold mb-2">Product Details</h2>
          <div className="flex items-start">
            <Image
              src={selectedProduct.colorOptionImages[selectedProduct.colorOptions[0]][0]}
              alt={selectedProduct.name}
              height={512}
              width={512}
              className="w-32 h-32 object-cover rounded mr-4"
            />
            <div>
              <p><strong>ID:</strong> {selectedProduct.id}</p>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Brand:</strong> {selectedProduct.brand}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p><strong>SKU:</strong> {selectedProduct.sku}</p>
              <p><strong>Stock Quantity:</strong> {selectedProduct.stockQuantity}</p>
              <p><strong>Discount:</strong> {selectedProduct.discount}%</p>
              <p><strong>Dimensions:</strong> {selectedProduct.dimensions}</p>
              <p><strong>Weight:</strong> {selectedProduct.weight}</p>
            </div>
          </div>
        </div>
      )}

      <Notifications notifications={notifications} removeNotification={removeNotification} />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>
          <DialogActions handleCancel={handleCancel} handleConfirm={confirmDelete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface NotificationsProps {
  notifications: NotificationType[];
  removeNotification: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, removeNotification }) => (
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

interface DialogActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
  deleting?: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({ handleCancel, handleConfirm, deleting }) => (
  <div className="flex justify-end mt-4 space-x-3">
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-800 px-6 font-medium text-zinc-200 shadow-lg transition active:scale-95"
      onClick={handleCancel}
    >
      Cancel
    </button>
    <button
      className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-200 px-6 font-medium text-zinc-800 shadow-lg transition active:scale-95"
      onClick={handleConfirm}
    >
      {deleting ? "Deleting..." : "Confirm Delete"}
    </button>
  </div>
);

export default AllProducts;
