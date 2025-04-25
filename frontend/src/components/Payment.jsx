import { usePayment } from "../context/PaymentContext";

const Payment = ({ amount }) => {
  const { initiatePayment } = usePayment();

  return (
    <button
      onClick={() => initiatePayment(amount)}
      className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
    >
      Pay Now
    </button>
  );
};

export default Payment;
