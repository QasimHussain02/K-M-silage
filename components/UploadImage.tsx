"use client";
import { useState, useImperativeHandle, forwardRef } from "react";

interface ImageUploadHandle {
  uploadImage: () => Promise<string | null>;
}

const ImageUpload = forwardRef<ImageUploadHandle>((_, ref) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  useImperativeHandle(ref, () => ({
    uploadImage: async () => {
      if (!file) return null;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data.secure_url || null;
    },
  }));

  return (
    <div className="space-y-4">
      <label htmlFor="file-input">
        <button
          type="button"
          onClick={() => document.getElementById("file-input")?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Image
        </button>
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
    </div>
  );
});

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
