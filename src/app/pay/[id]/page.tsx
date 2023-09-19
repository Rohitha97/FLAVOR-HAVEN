"use client";
import { useState } from "react";

const PayPage = ({ params }: { params: { id: string } }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Adding states for card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  // State variables for in-shop payment
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { id } = params;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let response;
    response = await fetch(`http://localhost:3000/api/create-intent/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Being prepared!",
        orderId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = data.successUrl;
        } else {
          setMessage(data.message);
        }
      });

    // if (!response.ok) {
    //   console.error(`HTTP error! status: ${response.status}`);
    // } else {
    //   const data = await response.json();

    //   if (data.success) {
    //     setMessage(data.message);
    //   } else {
    //     setMessage(data.message);
    //   }
    // }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="flex justify-center mb-4">
        <button onClick={() => setPaymentMethod("card")} className={"px-4 py-2 mr-2 rounded text-white" + (paymentMethod === "card" ? " bg-blue-500" : " bg-gray-300")}>
          Card Payment
        </button>
        <button onClick={() => setPaymentMethod("inShop")} className={"px-4 py-2 ml-2 rounded text-white" + (paymentMethod === "inShop" ? " bg-blue-500" : " bg-gray-300")}>
          In-Shop Payment
        </button>
      </div>
      {/* Show the appropriate form based on the selected payment method */}
      {paymentMethod === "card" ? (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-number">
              Card Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card Number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiry-date">
              Expiry Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="expiry-date"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="Expiry Date"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
              CVV
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cvv"
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="CVV"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-holder-name">
              Card Holder Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="card-holder-name"
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder="Card Holder Name"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" + (isLoading ? " opacity-50 cursor-not-allowed" : "")}
              type="submit"
              disabled={isLoading}
            >
              Pay now
            </button>
          </div>
          {message && (
            <div className="text-red-500 pt-2 text-sm italic" id="payment-message">
              {message}
            </div>
          )}
        </form>
      ) : (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {/* In-Shop Payment form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"} type="submit" disabled={isLoading}>
              Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PayPage;
