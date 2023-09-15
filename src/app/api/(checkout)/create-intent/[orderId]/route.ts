import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (order) {
    // Remove Stripe logic here
    /*const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: { intent_id: paymentIntent.id },
    });*/

    // Mockup a clientSecret
    const clientSecret = "mocked_client_secret";

    return new NextResponse(JSON.stringify({ clientSecret }), { status: 200 });
  }

  return new NextResponse(JSON.stringify({ message: "Order not found!" }), { status: 404 });
}
