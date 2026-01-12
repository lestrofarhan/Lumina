import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db"; // Adjust your DB import
import {User} from "@/models/User"; // Adjust your User model import

export async function POST(req: Request) {
  try {
    const { current, new: newPassword } = await req.json();

    // 1. Get current logged in user (Use your auth logic here)
    const userId = "your_logged_in_admin_id";

    await connectDB();
    const user = await User.findById(userId);

    // 2. Verify current password
    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password incorrect" },
        { status: 400 }
      );
    }

    // 3. Hash new password and save
    const hashedPass = await bcrypt.hash(newPassword, 12);
    user.password = hashedPass;
    await user.save();

    return NextResponse.json({ message: "Success" });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
