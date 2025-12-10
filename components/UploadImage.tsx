"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUrl(data.secure_url);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload}>Upload</button>
      {url && <Image src={url} alt="Uploaded" className="w-64 mt-4" />}
    </div>
  );
}
