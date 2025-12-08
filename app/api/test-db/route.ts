import { connectToDatabase } from "@/lib/mongo";

export async function GET() {
  try {
    await connectToDatabase();
    return Response.json({ message: "DB Connected Successfully" });
  } catch (error) {
    return Response.json({ error: "DB Connection Failed", details: error });
  }
}
