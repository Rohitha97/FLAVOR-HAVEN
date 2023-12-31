import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// GET SINGLE PRODUCT
// export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   const { id } = params;

//   try {
//     const product = await prisma.product.findUnique({
//       where: {
//         id: id,
//       },
//     });

//     return new NextResponse(JSON.stringify(product), { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
//   }
// };

// DELETE SINGLE PRODUCT
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      await prisma.nortification.delete({
        where: {
          id: id,
        },
      });

      return new NextResponse(JSON.stringify("Nortification has been deleted!"), {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
  }
  return new NextResponse(JSON.stringify({ message: "You are not allowed!" }), {
    status: 403,
  });
};

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      const body: { status: boolean } = await req.json();
      console.log("Received request with body:", body);

      await prisma.nortification.updateMany({
        data: {
          status: false,
        },
      });

      // Update the status of the record with the given id to true
      const nortification = await prisma.nortification.update({
        where: {
          id: id,
        },
        data: {
          status: true,
        },
      });
      console.log("Updated nortification:", nortification);

      return new NextResponse(JSON.stringify(nortification), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
  }
  return new NextResponse(JSON.stringify({ message: "You are not allowed!" }), {
    status: 403,
  });
};
