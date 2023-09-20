import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const nortifications = await prisma.nortification.findMany();
    return new NextResponse(JSON.stringify(nortifications), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const nortifications = await prisma.nortification.create({
      data: body,
    });
    return new NextResponse(JSON.stringify(nortifications), { status: 201 });
  } catch (err) {
    console.log("Error:", err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};
