import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

interface RatingImageUploadProps {
  onUploadComplete: (imageUrls: string[]) => void; // Callback for when image upload is complete
}

const RatingImageUpload: React.FC<RatingImageUploadProps> = ({ onUploadComplete }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setNewFiles(files);
    setPreviewUrls(newUrls);
    setShowConfirmation(true);
  };

  const uploadImagesToCloudinary = async (files: File[]) => {
    const imageUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "HypeHouse_ReviewImages");
      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        imageUrls.push(response.data.secure_url);
      } catch (error) {
        throw new Error("Image upload failed.");
      }
    }
    return imageUrls;
  };

  const handleUpload = async () => {
    if (newFiles.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary(newFiles);
      onUploadComplete(uploadedImageUrls); // Notify parent component
      setShowConfirmation(false);
      setPreviewUrls([]); // Clear previews
      setNewFiles([]); // Clear new files
    } catch (error) {
      console.error("Failed to upload images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPreviewUrls([]); // Clear previews
    setNewFiles([]); // Clear new files
  };

  return (
    <>
      <div className="relative mb-4">
        {previewUrls.map((url, index) => (
          <CldImage
            key={index}
            src={url}
            alt={`Preview ${index + 1}`}
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-contain border-2 border-zinc-800 dark:border-zinc-200"
          />
        ))}
        <input
          type="file"
          id="imageUploadInput"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="absolute right-0 bottom-0 hidden"
        />
        <Button
          onClick={() => document.getElementById("imageUploadInput")?.click()}
          className="absolute right-0 bottom-0 rounded-full p-1"
          size="icon"
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Image Upload</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to upload these images for your review?
          </DialogDescription>
          <div className="flex justify-center">
            {previewUrls.map((url, index) => (
              <CldImage
                key={index}
                src={url}
                alt={`New Review Image ${index + 1}`}
                width={200}
                height={200}
                className="w-36 h-36 rounded-full object-contain border-2 border-zinc-800 dark:border-zinc-200"
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RatingImageUpload;
