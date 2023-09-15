import { useState } from "react";
import AddressForm from "./AddressForm";

const CheckoutForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Adding states for card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Handle payment method here with card details

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] p-4 lg:px-20 xl:px-40 flex flex-col gap-8">
      {/* Add card details input fields */}
      <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" />
      <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="Expiry Date" />
      <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" />
      <input type="text" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} placeholder="Card Holder Name" />

      {/* <AddressForm /> */}
      <button disabled={isLoading} id="submit" className="bg-red-500 text-white p-4 rounded-md w-28">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
