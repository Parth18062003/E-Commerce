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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { PencilOff, Trash2 } from "lucide-react";
import Notification from "./ui/notification";
import Image from "next/image";
import Loading from "@/app/loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

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
  const loading = useSelector(
    (state: RootState) => state.product.loading.fetchProducts
  );
  const error = useSelector((state: RootState) => state.product.error);
  const [deleting, setDeleting] = useState(false);
  const productsPerPage = 10;
  const totalPages = useSelector(
    (state: RootState) => state.product.totalPages
  );
  useEffect(() => {
    const isProductsCached =
      products.length > 0 &&
      products.length >= productsPerPage * (currentPage - 1);

    if (!isProductsCached) {
      dispatch(fetchProducts(currentPage - 1));
    }
  }, [dispatch, currentPage, products]); // Add products as a dependency

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setSelectedProduct(null);
  };

  const addNotification = (
    text: string,
    type: "info" | "success" | "error"
  ) => {
    setNotifications((prev) => [{ id: Math.random(), text, type }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (loading)
    return (
      <div className="text-center">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-zinc-100 text-black">
      <h1 className="text-3xl font-bold mb-6 text-zinc-800">All Products</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="border border-zinc-300 p-4">Sr. No.</TableHead>
            <TableHead className="border border-zinc-300 p-4">ID</TableHead>
            <TableHead className="border border-zinc-300 p-4">Name</TableHead>
            <TableHead className="border border-zinc-300 p-4">SKU</TableHead>
            <TableHead className="border border-zinc-300 p-4">Price</TableHead>
            <TableHead className="border border-zinc-300 p-4">Stock</TableHead>
            <TableHead className="border border-zinc-300 p-4">Discount</TableHead>
            <TableHead className="border border-zinc-300 p-4">Dimensions</TableHead>
            <TableHead className="border border-zinc-300 p-4">Weight</TableHead>
            <TableHead className="border border-zinc-300 p-4">Main Image</TableHead>
            <TableHead className="border border-zinc-300 p-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id} className="hover:bg-zinc-50">
              <TableCell className="border border-zinc-300 p-4">{index + 1}</TableCell>
              <TableCell
                className="border border-zinc-300 p-4 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {product.id.length > 10
                  ? `${product.id.substring(0, 10)}...`
                  : product.id}
              </TableCell>
              <TableCell
                className="border border-zinc-300 p-4 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-zinc-600">{product.brand}</div>
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">{product.sku}</TableCell>
              <TableCell className="border border-zinc-300 p-4">
                ${product.price.toFixed(2)}
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">
                {product.stockQuantity}
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">
                {product.discount}%
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">
                {product.dimensions}
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">{product.weight}</TableCell>
              <TableCell className="border border-zinc-300 p-4">
                <Image
                  src={product.colorOptionImages[product.colorOptions[0]][0]}
                  alt={product.name}
                  height={256}
                  width={256}
                  className="w-20 h-20 object-cover rounded"
                />
              </TableCell>
              <TableCell className="border border-zinc-300 p-4">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="mt-6 p-4 border border-zinc-300 rounded bg-white shadow">
            <DialogTitle className="text-xl font-bold mb-2 text-black">
              Product Details
            </DialogTitle>
            <div className="flex items-start">
              <Image
                src={
                  selectedProduct.colorOptionImages[
                    selectedProduct.colorOptions[0]
                  ][0]
                }
                alt={selectedProduct.name}
                height={512}
                width={512}
                className="w-32 h-32 object-cover rounded mr-4"
              />
              <DialogDescription>
                <p>
                  <strong>ID:</strong> {selectedProduct.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>Brand:</strong> {selectedProduct.brand}
                </p>
                <p>
                  <strong>Description:</strong> {selectedProduct.description}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedProduct.price.toFixed(2)}
                </p>
                <p>
                  <strong>SKU:</strong> {selectedProduct.sku}
                </p>
                <p>
                  <strong>Stock Quantity:</strong>{" "}
                  {selectedProduct.stockQuantity}
                </p>
                <p>
                  <strong>Discount:</strong> {selectedProduct.discount}%
                </p>
                <p>
                  <strong>Dimensions:</strong> {selectedProduct.dimensions}
                </p>
                <p>
                  <strong>Weight:</strong> {selectedProduct.weight}
                </p>
              </DialogDescription>
            </div>
            <DialogFooter>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(selectedProduct)}
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete TableHeadis product?
            </DialogDescription>
          </DialogHeader>
          <DialogActions
            handleCancel={handleCancel}
            handleConfirm={confirmDelete}
          />
        </DialogContent>
      </Dialog>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 mr-2 bg-zinc-300 rounded-md hover:bg-zinc-400 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 ml-2 bg-zinc-300 rounded-md hover:bg-zinc-400 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

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

interface DialogActionsProps {
  handleCancel: () => void;
  handleConfirm: () => void;
  deleting?: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  handleCancel,
  handleConfirm,
  deleting,
}) => (
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
