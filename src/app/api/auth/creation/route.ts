import prisma from "@/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Creating user on local db with GET...");
  
    const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("Kinde User: ", user);
  console.log("User email: ", user.email);


  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong in blocknote/src/app/api/auth/creation/route.ts");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
    console.log("dbuser info: " , dbUser)
  }

  return NextResponse.redirect(
    process.env.NODE_ENV === "production"
      ? "https://localhost:3000/dashboard" //change when moving to production!!
      : "http://localhost:3000/dashboard"
  );
}

// dont forget to tell kinde that this route handler exists and what it does
// .env enviroment variables!!