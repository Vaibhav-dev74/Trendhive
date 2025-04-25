import React from "react";

const Pay = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Payment Page</h1>
      <p className="mt-2 text-lg text-gray-700">
        Complete your payment securely.
      </p>
      <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg">
        Pay Now
      </button>
    </div>
  );
};

export default Pay;
