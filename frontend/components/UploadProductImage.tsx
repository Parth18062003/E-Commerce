"use client";

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

interface UploadProductImageProps {
  color: string;
  onImagesUpload: (color: string, urls: string[]) => void;
  initialImages?: string[];
}

const UploadProductImage: React.FC<UploadProductImageProps> = ({
  color,
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

  useEffect(() => {
    setUploadedImages(initialImages);
  }, [initialImages]);

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

  const handleUploadImages = async () => {
    if (newImageFiles.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary(newImageFiles);
      setUploadedImages(uploadedImageUrls);
      onImagesUpload(color, uploadedImageUrls);
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

  const handleCancel = () => {
    setShowConfirmation(false);
    setPreviewUrls([]);
    setNewImageFiles([]);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = previewUrls.findIndex((url) => url === active.id);
      const newIndex = previewUrls.findIndex((url) => url === over.id);

      const newPreviewUrls = Array.from(previewUrls);
      const newNewImageFiles = Array.from(newImageFiles);

      // Reorder previewUrls
      [newPreviewUrls[oldIndex], newPreviewUrls[newIndex]] = [newPreviewUrls[newIndex], newPreviewUrls[oldIndex]];
      // Reorder newImageFiles
      [newNewImageFiles[oldIndex], newNewImageFiles[newIndex]] = [newNewImageFiles[newIndex], newNewImageFiles[oldIndex]];

      setPreviewUrls(newPreviewUrls);
      setNewImageFiles(newNewImageFiles);
    }
  };

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
          <span>{uploadedImages.length > 0 ? `Replace Images for ${color}` : `Upload Images for ${color}`}</span>
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
