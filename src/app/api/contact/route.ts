import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const contacts = await prisma.contacts.findMany({});
    return new NextResponse(JSON.stringify(contacts), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    const contacts = await prisma.contacts.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });
    console.log("Created contacts:", contacts);
    return new NextResponse(JSON.stringify(contacts), { status: 201 });
  } catch (err) {
    console.error("Error:", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};
