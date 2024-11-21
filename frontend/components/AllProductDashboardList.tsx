"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, Product } from "@/store/productSlice";
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
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Notification from "./ui/notification";
import Image from "next/image";
import Loading from "@/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = useSelector((state: RootState) => state.product.products);
  const cachedProducts = useSelector(
    (state: RootState) => state.product.productsCache[currentPage]
  );
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
    // Check if the products for the current page are already in the cache
    const isProductsCached = cachedProducts && cachedProducts.length > 0;

    // If products for the current page are not cached, fetch them
    if (!isProductsCached) {
      dispatch(fetchProducts({ page: currentPage - 1, size: productsPerPage }));
    }
  }, [dispatch, currentPage, cachedProducts, productsPerPage]);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/product/edit-product/${id}`);
  };

  const handleDelete = (product: Product) => {
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
    if (newPage >= 0 && newPage <= totalPages) {
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

  const removeNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
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
            <TableHead className="border border-zinc-300 p-4">Sr.No.</TableHead>
            <TableHead className="border border-zinc-300 p-4">ID</TableHead>
            <TableHead className="border border-zinc-300 p-4">Name</TableHead>
            <TableHead className="border border-zinc-300 p-4">SKU</TableHead>
            <TableHead className="border border-zinc-300 p-4">Price</TableHead>
            <TableHead className="border border-zinc-300 p-4">Stock</TableHead>
            <TableHead className="border border-zinc-300 p-4">
              Discount
            </TableHead>
            <TableHead className="border border-zinc-300 p-4">
              Dimensions
            </TableHead>
            <TableHead className="border border-zinc-300 p-4">Weight</TableHead>
            <TableHead className="border border-zinc-300 p-4">
              Main Image
            </TableHead>
            <TableHead className="border border-zinc-300 p-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const imageSrc =
              product.variants[0]?.colorOptionImages[0] || "/default-image.jpg";
            const totalStock = product.variants[0]?.sizes.reduce(
              (total: number, size: { stockQuantity: number }) =>
                total + size.stockQuantity,
              0
            );
            const formattedPrice = formatPrice(product.price);

            return (
              <TableRow key={product.id} className="hover:bg-zinc-50">
                <TableCell className="border border-zinc-300 p-4">
                  {index + 1}
                </TableCell>
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
                <TableCell className="border border-zinc-300 p-4">
                  {product.sku}
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  {formattedPrice}
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  {totalStock}
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  {product.discount}%
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  {product.dimensions}
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  {product.weight}
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    height={256}
                    width={256}
                    className="w-20 h-20 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="border border-zinc-300 p-4">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="bg-zinc-500 text-white px-2 py-1 rounded mr-2 hover:bg-zinc-600 transition"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    <Trash2 />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
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
                  selectedProduct.variants[0]?.colorOptionImages[0] ||
                  "/default-image.jpg"
                }
                alt={selectedProduct.name}
                height={512}
                width={512}
                className="w-32 h-32 object-cover rounded mr-4"
              />
              <DialogDescription className="flex flex-col">
                <span>
                  <strong>ID:</strong> {selectedProduct.id}
                </span>
                <span>
                  <strong>Name:</strong> {selectedProduct.name}
                </span>
                <span>
                  <strong>Brand:</strong> {selectedProduct.brand}
                </span>
                <span>
                  <strong>Description:</strong> {selectedProduct.description}
                </span>
                <span>
                  <strong>Price:</strong> {formatPrice(selectedProduct.price)}
                </span>
                <span>
                  <strong>SKU:</strong> {selectedProduct.sku}
                </span>
                <span>
                  <strong>Stock Quantity:</strong>{" "}
                  {selectedProduct.variants[0]?.sizes.reduce(
                    (total: number, size: { stockQuantity: number }) =>
                      total + size.stockQuantity,
                    0
                  )}
                </span>
                <span>
                  <strong>Discount:</strong> {selectedProduct.discount}%
                </span>
                <span>
                  <strong>Dimensions:</strong> {selectedProduct.dimensions}
                </span>
                <span>
                  <strong>Weight:</strong> {selectedProduct.weight}
                </span>
                <span>
                  <strong>Material:</strong> {selectedProduct.material}
                </span>
                <span>
                  <strong>Release Date:</strong> {selectedProduct.releaseDate}
                </span>
                <span>
                  <strong>Gender:</strong> {selectedProduct.gender}
                </span>
                <span>
                  <strong>Type:</strong> {selectedProduct.type}
                </span>
                <span>
                  <strong>Rating:</strong> {selectedProduct.rating}
                  {" | "}
                  {selectedProduct.reviewCount} (reviews)
                </span>
                <span>
                  <strong>Product URL:</strong>{" "}
                  <a
                    href={selectedProduct.productURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedProduct.productURL}
                  </a>
                </span>
              </DialogDescription>
            </div>
            <DialogFooter>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          id={notif.id}
          text={notif.text}
          type={notif.type}
          removeNotif={() => removeNotif(notif.id)}
        />
      ))}

      {showConfirmDialog && (
        <Dialog open={showConfirmDialog} onOpenChange={handleCancel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Confirm Delete
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the product{" "}
                <strong>{selectedProduct?.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`${
                  deleting ? "bg-red-300" : "bg-red-500"
                } text-white px-4 py-2 rounded hover:bg-red-600 transition`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="mt-4 flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center text-zinc-700 p-1 rounded-full hover:bg-zinc-400 disabled:bg-zinc-300 transition-colors"
          aria-label="Previous page"
        >
          <span className="font-semibold text-lg"><ChevronLeft /></span>
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {/* First Page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-full hover:bg-zinc-100 transition-colors"
              >
                1
              </button>
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
            </>
          )}

          {/* Previous Pages */}
          {currentPage > 1 && currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-full hover:bg-zinc-100 transition-colors"
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current Page */}
          <span className="px-3 py-2 text-sm font-semibold text-white bg-zinc-500 rounded-lg">
            {currentPage}
          </span>

          {/* Next Pages */}
          {currentPage < totalPages && currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {currentPage + 1}
            </button>
          )}

          {/* Last Page */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="px-3 py-2 text-sm text-gray-500">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center text-zinc-700 p-1 hover:bg-zinc-400 rounded-full disabled:bg-zinc-300 transition-colors"
          aria-label="Next page"
        >
          <span className="font-semibold text-lg"><ChevronRight /></span>
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
