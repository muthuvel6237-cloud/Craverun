import API from "../../api/axios";

function RazorpayButton({ amount }) {
  const handlePayment = async () => {
    const { data } = await API.post(
      "/payment/create-order",
      { amount }
    );

    const options = {
      key: "YOUR_KEY_ID",
      amount: data.amount,
      currency: data.currency,
      name: "CraveRun",
      description: "Food Order Payment",
      order_id: data.id,

      handler: function () {
        alert("Payment Successful");
      },

      theme: {
        color: "#ff4d29",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <button onClick={handlePayment}>
      Pay Now
    </button>
  );
}

export default RazorpayButton;