import { connectToDatabase } from "@/lib/mongo";
import User from "@/models/users";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    await connectToDatabase();

    const body: { name: string; email: string; password: string } =
      await request.json();
    const { name, email, password } = body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success
    return new Response(JSON.stringify({ message: "User created", user }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Could not create user" }), {
      status: 500,
    });
  }
};
