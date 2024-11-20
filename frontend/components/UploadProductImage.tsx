/* "use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext } from "@dnd-kit/core";

// Define the props for the component
interface UploadProductImageProps {
  color: string;
  variantIndex: number;
  onImagesUpload: (variantIndex: number, urls: string[]) => void;
  initialImages?: string[];
}

const UploadProductImage: React.FC<UploadProductImageProps> = ({
  color,
  variantIndex,
  onImagesUpload,
  initialImages = [],
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Update images when initialImages change
  useEffect(() => {
    setUploadedImages(initialImages);
  }, [initialImages]);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length < 3 || fileArray.length > 8) {
        setError("Please upload between 3 and 8 images.");
        return;
      }
      const previewUrlsArray = fileArray.map((file) => URL.createObjectURL(file));
      setNewImageFiles(fileArray);
      setPreviewUrls(previewUrlsArray);
      setShowConfirmation(true);
      setError(null);
    }
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async (files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "HypeHouse_Products");
      return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
    });

    const responses = await Promise.all(uploadPromises);
    return responses.map((response) => response.data.secure_url);
  };

  // Handle the upload confirmation
  const handleUploadImages = async () => {
    if (newImageFiles.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary(newImageFiles);
      setUploadedImages(uploadedImageUrls);
      onImagesUpload(variantIndex, uploadedImageUrls); // Pass both variantIndex and sizeIndex here
      setShowConfirmation(false);
      setPreviewUrls([]);
      setNewImageFiles([]);
    } catch (error) {
      console.error("Failed to upload product images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancellation of upload
  const handleCancel = () => {
    setShowConfirmation(false);
    setPreviewUrls([]);
    setNewImageFiles([]);
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = previewUrls.findIndex((url) => url === active.id);
      const newIndex = previewUrls.findIndex((url) => url === over.id);

      // Reorder images based on drag positions
      const newPreviewUrls = Array.from(previewUrls);
      [newPreviewUrls[oldIndex], newPreviewUrls[newIndex]] = [
        newPreviewUrls[newIndex],
        newPreviewUrls[oldIndex],
      ];
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Component for sortable images
  const SortableItem = ({ url }: { url: string }) => {
    const { setNodeRef, attributes, listeners, isDragging } = useSortable({ id: url });
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="rounded-lg border border-gray-300 dark:border-gray-600"
      >
        <CldImage
          src={url}
          alt={`New Product Image`}
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>
    );
  };

  return (
    <>
      <div className="relative mb-4">
        {uploadedImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {uploadedImages.map((url, index) => (
              <CldImage
                key={`uploaded-${index}`}
                src={url}
                alt={`Product Image ${index + 1}`}
                width={100}
                height={100}
                className="rounded-lg shadow-md border-2 border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">No Images Uploaded</p>
          </div>
        )}

        <input
          type="file"
          id={`imageUploadInput-${color}`}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => document.getElementById(`imageUploadInput-${color}`)?.click()}
          className="mt-2 w-full flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 text-white p-2 shadow-md"
        >
          <Camera className="w-5 h-5" />
          <span>
            {uploadedImages.length > 0 ? `Replace Images for ${color}` : `Upload Images for ${color}`}
          </span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Product Image Upload</DialogTitle>
            <DialogDescription>
              You're about to upload images for the <strong>{color}</strong> color option.
              {uploadedImages.length > 0 && " This will replace the existing images."}
            </DialogDescription>
          </DialogHeader>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={previewUrls} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-3 gap-2 my-4">
                {previewUrls.map((url) => (
                  <SortableItem key={url} url={url} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} className="w-1/2">
              Cancel
            </Button>
            <Button onClick={handleUploadImages} disabled={isLoading} className="w-1/2 bg-green-500">
              {isLoading ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadProductImage;
 */
import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import Image from "next/image";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { DndContext } from "@dnd-kit/core";

interface UploadProductImageProps {
  color: string;
  variantIndex: number;
  onImagesUpload: (variantIndex: number, urls: string[]) => void;
  initialImages?: string[];
}

const UploadProductImage: React.FC<UploadProductImageProps> = ({
  color,
  variantIndex,
  onImagesUpload,
  initialImages = [],
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Holds preview URLs
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages); // Holds uploaded images
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // Show the confirmation
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // Holds selected image files
  const [imageUrl, setImageUrl] = useState<string>(""); // For direct URL input
  const [urlMode, setUrlMode] = useState<boolean>(false); // Toggle between URL input and file upload mode

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileInputClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default button action or form submission (if within a form)
    event.preventDefault();
    // Trigger the input file element
    document.getElementById(`imageUploadInput-${color}`)?.click();
  };

  // Update images when initialImages change
  useEffect(() => {
    setUploadedImages(initialImages);
  }, [initialImages]);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length < 3 || fileArray.length > 8) {
        setError("Please upload between 3 and 8 images.");
        return;
      }
      const previewUrlsArray = fileArray.map((file) => URL.createObjectURL(file));
      setNewImageFiles(fileArray);
      setPreviewUrls(previewUrlsArray);
      setShowConfirmation(true);
      setError(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key
    }
  };

  // Upload images to Cloudinary (only for image uploads, not URLs)
  const uploadImagesToCloudinary = async (files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "HypeHouse_Products");
      return axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
    });

    const responses = await Promise.all(uploadPromises);
    return responses.map((response) => response.data.secure_url);
  };

  // Handle the upload confirmation for images (Cloudinary upload)
  const handleUploadImages = async () => {
    if (newImageFiles.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const uploadedImageUrls = await uploadImagesToCloudinary(newImageFiles); // Upload images to Cloudinary
      setUploadedImages(uploadedImageUrls); // Set the uploaded image URLs
      onImagesUpload(variantIndex, uploadedImageUrls); // Notify parent with the URLs after successful upload
      setPreviewUrls([]); // Clear preview URLs
      setNewImageFiles([]); // Clear the new image files
    } catch (error) {
      console.error("Failed to upload product images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };  

  // Handle URL input mode (adding image URLs directly)
  const handleAddUrlImage = () => {
    if (imageUrl.trim()) {
      setPreviewUrls((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  // Handle the confirmation for adding URLs (directly saving them)
  const handleConfirmUrlUpload = () => {
    if (previewUrls.length > 0) {
      // Directly pass the URLs to the parent function (onImagesUpload) without uploading to Cloudinary
      onImagesUpload(variantIndex, previewUrls);
      setPreviewUrls([]);
      setImageUrl(""); // Clear input after confirming
    }
  };

  // Handle cancelling the image upload or URL adding process
  const handleCancel = () => {
    setShowConfirmation(false);
    setPreviewUrls([]);
    setNewImageFiles([]);
    setImageUrl("");
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = previewUrls.findIndex((url) => url === active.id);
      const newIndex = previewUrls.findIndex((url) => url === over.id);

      // Reorder images based on drag positions
      const newPreviewUrls = Array.from(previewUrls);
      [newPreviewUrls[oldIndex], newPreviewUrls[newIndex]] = [
        newPreviewUrls[newIndex],
        newPreviewUrls[oldIndex],
      ];
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Component for sortable images
  const SortableItem = ({ url }: { url: string }) => {
    const { setNodeRef, attributes, listeners, isDragging } = useSortable({ id: url });
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="rounded-lg border border-gray-300 dark:border-gray-600"
      >
        <CldImage
          src={url}
          alt={`New Product Image`}
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>
    );
  };

  return (
    <>
      <div className="relative mb-4">
        {/* Display uploaded images or empty message */}
        <div className="relative mb-4">
          {/* Display uploaded images or image URLs */}
          {uploadedImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {uploadedImages.map((url, index) => {
                // Check if the URL is from Cloudinary (you can adjust this check based on your Cloudinary URL structure)
                const isCloudinaryUrl = url.includes("cloudinary.com");

                return isCloudinaryUrl ? (
                  // If Cloudinary URL, use CldImage component
                  <CldImage
                    key={`uploaded-${index}`}
                    src={url}
                    alt={`Product Image ${index + 1}`}
                    width={128}
                    height={128}
                    className="rounded-lg w-full shadow-md border-2 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  // If it's a regular URL, use a regular <img> tag
                  <div
                    key={`uploaded-${index}`}
                    className="rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <Image
                      src={url}
                      alt={`Product Image ${index + 1}`}
                      width={128}
                      height={128}
                      className="rounded-lg w-full"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">No Images Uploaded</p>
            </div>
          )}
        </div>

        {/* Button to trigger file input */}
        <input
          type="file"
          id={`imageUploadInput-${color}`}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          onKeyDown={handleKeyDown}
          disabled={urlMode} // Disable when URL mode is active
        />
        <Button
          onClick={handleFileInputClick}
          className="mt-2 w-full flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 text-white p-2 shadow-md"
          disabled={urlMode} // Disable button when URL mode is active
        >
          <Camera className="w-5 h-5" />
          <span>
            {uploadedImages.length > 0
              ? `Replace Images for ${color}`
              : `Upload Images for ${color}`}
          </span>
        </Button>

        {/* Toggle between URL input and file upload */}
        <div className="mt-4 flex space-x-4">
          <Button onClick={() => setUrlMode(true)} disabled={urlMode}>
            Add Image URLs
          </Button>
          <Button onClick={() => setUrlMode(false)} disabled={!urlMode}>
            Upload Images
          </Button>
        </div>

        {/* URL Input mode */}
        {urlMode && (
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border p-2 rounded-lg w-full"
              placeholder="Enter image URL"
            />
            <Button onClick={handleAddUrlImage} disabled={!imageUrl.trim()}>
              Add URL
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Show previews of the URLs added by the user */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2 my-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <Image
                src={url}
                alt={`Image Preview ${index + 1}`}
                className="rounded-lg w-full"
                width={128}
                height={128}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirmation button for image upload */}
      {newImageFiles.length > 0 && !urlMode && (
        <Button
          onClick={handleUploadImages}
          disabled={isLoading}
          className="w-full bg-green-500 mt-4"
        >
          {isLoading ? "Uploading..." : "Confirm Image Upload"}
        </Button>
      )}

      {/* Confirmation button for adding URLs directly */}
      {previewUrls.length > 0 && urlMode && (
        <Button
          onClick={handleConfirmUrlUpload}
          className="w-full mt-4 bg-green-500"
        >
          Confirm URL Upload
        </Button>
      )}

      {/* Cancel and reset the process */}
      <Button onClick={handleCancel} className="w-full mt-2">
        Cancel
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Product Image Upload</DialogTitle>
            <DialogDescription>
              You're about to upload images for the <strong>{color}</strong> color option.
              {uploadedImages.length > 0 && " This will replace the existing images."}
            </DialogDescription>
          </DialogHeader>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={previewUrls} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-3 gap-2 my-4">
                {previewUrls.map((url) => (
                  <SortableItem key={url} url={url} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} className="w-1/2">
              Cancel
            </Button>
            <Button onClick={handleUploadImages} disabled={isLoading} className="w-1/2 bg-green-500">
              {isLoading ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadProductImage;
