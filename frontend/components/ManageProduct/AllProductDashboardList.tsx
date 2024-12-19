"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, Product } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Loading from "@/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";

interface AllProductsProps {
  searchTerm: string;
}

const AllProducts: React.FC<AllProductsProps> = ({ searchTerm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
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
  const productsPerPage = 30;
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
        toast.success("Product deleted successfully.");
      } catch {
        toast.error("Failed to delete product.");
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

  const formatPrice = (price: number) => {
    // Format the number with commas as thousands separators
    const formattedPrice = price.toLocaleString("en-IN"); // 'en-IN' for Indian numbering system (1,24,532)

    return `$${formattedPrice}`;
  };

  const filteredProducts = products.filter(
    (product) =>
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <TableHead>Sr.No.</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Main Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product, index) => {
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
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  className=" cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.id.length > 10
                    ? `${product.id.substring(0, 10)}...`
                    : product.id}
                </TableCell>
                <TableCell
                  className=" cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-zinc-600">{product.brand}</div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formattedPrice}</TableCell>
                <TableCell>{totalStock}</TableCell>
                <TableCell>{product.discount}%</TableCell>
                <TableCell>{product.dimensions}</TableCell>
                <TableCell>{product.weight}</TableCell>
                <TableCell>
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    height={256}
                    width={256}
                    className="w-20 h-20 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
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
          <DialogContent className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-zinc-200 overflow-y-scroll max-h-screen text-black">
            <DialogTitle className="text-2xl font-semibold text-center mb-4">
              Product Details
            </DialogTitle>

            {/* Banner Image Section */}
            <div className="w-full h-64 mb-6">
              <Image
                src={
                  selectedProduct.variants[0]?.colorOptionImages[0] ||
                  "/default-image.jpg"
                }
                alt={selectedProduct.name}
                height={512}
                width={1024}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Product Details - Displayed in Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span>
                  <strong>Price:</strong> {selectedProduct.price}
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
                  <strong>Release Date:</strong> {selectedProduct.releaseDate}
                </span>
              </div>

              <div className="flex flex-col">
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
                  <strong>Gender:</strong> {selectedProduct.gender}
                </span>
                <span>
                  <strong>Type:</strong> {selectedProduct.type}
                </span>
              </div>

              <div className="flex flex-col">
                <span>
                  <strong>Rating:</strong> {selectedProduct.rating} |{" "}
                  {selectedProduct.reviewCount} reviews
                </span>
              </div>

              <div className="flex flex-col">
                <strong>Product URL:</strong>
                <a
                  href={selectedProduct.productURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {selectedProduct.productURL}
                </a>
              </div>
            </div>

            {/* Footer with Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-zinc-500 text-white px-6 py-2 rounded-lg hover:bg-zinc-600 transition"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                className="bg-zinc-500 text-white px-4 py-2 rounded hover:bg-zinc-600"
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
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center text-zinc-700 p-1 rounded-full hover:bg-zinc-400 disabled:bg-zinc-300 transition-colors"
          aria-label="Previous page"
        >
          <span className="font-semibold text-lg">
            <ChevronLeft />
          </span>
        </button>

        <div className="flex space-x-1">
          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-full hover:bg-zinc-100 transition-colors"
              >
                1
              </button>
              <span className="px-3 py-2 text-sm text-zinc-500">...</span>
            </>
          )}

          {currentPage > 1 && currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-full hover:bg-zinc-100 transition-colors"
            >
              {currentPage - 1}
            </button>
          )}

          <span className="px-3 py-2 text-sm font-semibold text-white bg-zinc-500 rounded-lg">
            {currentPage}
          </span>

          {currentPage < totalPages && currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-3 py-2 text-sm text-zinc-500">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center text-zinc-700 p-1 hover:bg-zinc-400 rounded-full disabled:bg-zinc-300 transition-colors"
          aria-label="Next page"
        >
          <span className="font-semibold text-lg">
            <ChevronRight />
          </span>
        </button>
      </div>
    </div>
  );
};

export default AllProducts; 