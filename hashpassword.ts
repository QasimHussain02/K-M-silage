// hashPassword.ts
import bcrypt from "bcrypt";

const password: string = "Admin@123"; // <-- Replace with your desired password
const saltRounds: number = 10;

export async function hashPassword(): Promise<void> {
  try {
    const hashed: string = await bcrypt.hash(password, saltRounds);
    console.log("Plain password:", password);
    console.log("Hashed password:", hashed);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}
