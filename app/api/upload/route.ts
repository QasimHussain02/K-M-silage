import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    formData.append("file", buffer, file.name);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

    const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: formData.getHeaders(), // very important for axios
      }
    );

    return NextResponse.json(cloudinaryRes.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
