import { NextResponse } from "next/server";
import prisma from "@/utils/db";  // Make sure your Prisma client is imported correctly

export async function GET() {
  try {
    const testUser = await prisma.user.create({
      data: {
        id: "test-id-123",  // Use a simple hardcoded ID
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        profileImage: "https://example.com/test-avatar.png",
      },
    });

    console.log("Test user created: ", testUser);

    return NextResponse.json({ message: "User created successfully!", user: testUser });
  } catch (error) {
    console.error("Error creating test user: ", error);
    return NextResponse.json({ message: "Error creating user.", error }, { status: 500 });
  }
}
