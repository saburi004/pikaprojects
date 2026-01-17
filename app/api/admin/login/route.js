
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json(); // username here is likely email
    console.log("Received credentials:", { username });

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "Username and password are required" }),
        { status: 400 }
      );
    }

    // Assuming username identifies admin email or username
    const user = await User.findOne({ email: username }).select('+password');

    let isValid = false;
    if (user && user.roles.includes('admin')) {
      isValid = await bcrypt.compare(password, user.password);
    }

    console.log("Verification result:", isValid);

    if (isValid) {
      return new Response(
        JSON.stringify({ message: "Login successful" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/admin/login:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}