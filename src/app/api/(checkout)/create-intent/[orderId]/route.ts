import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    // Ensure orderId and status is provided
    if (!orderId || !status) {
      return new NextResponse(JSON.stringify({ message: "orderId or status is missing in the request body." }), { status: 400 });
    }

    // Assume orderId is going to be stored in your payment details
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (order) {
      const intentId = Math.floor(Math.random() * 1000) + 1;
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: { status: status, intent_id: intentId.toString() },
      });

      const successUrl = `http://localhost:3000/success?payment_intent=${intentId}`;
      return new NextResponse(JSON.stringify({ success: true, clientSecret: intentId, successUrl }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({ success: false, message: "Order not found!" }), { status: 404 });
  } catch (error) {
    console.error("Server Error:", error);
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ success: false, message: "An error occurred on the server: " + error.message }), { status: 500 });
    } else {
      return new NextResponse(JSON.stringify({ success: false, message: "An error occurred on the server." }), { status: 500 });
    }
  }
}
