import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import API from "../../api/axios";
import "./Invoice.css";

function Invoice() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await API.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const found = res.data.find((item) => item._id === id);
        setOrder(found);
      } catch {
        alert("Failed to load invoice");
      }
    }

    loadOrder();
  }, [id, token]);

  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CraveRun Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 45);
    doc.text(`Payment: ${order.paymentMethod}`, 20, 55);
    doc.text(`Address: ${order.deliveryAddress}`, 20, 65);

    let y = 85;
    doc.text("Items", 20, y);

    order.items.forEach((item) => {
      y += 10;
      doc.text(
        `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`,
        20,
        y
      );
    });

    y += 20;
    doc.setFontSize(16);
    doc.text(`Total: ₹${order.totalAmount}`, 20, y);

    doc.save(`CraveRun-Invoice-${order._id.slice(-6)}.pdf`);
  };

  if (!order) {
    return <div className="invoice-page">Loading invoice...</div>;
  }

  return (
    <div className="invoice-page">
      <div className="invoice-card">
        <h1>Invoice</h1>

        <p>Order #{order._id.slice(-6)}</p>
        <p>Total: ₹{order.totalAmount}</p>
        <p>Status: {order.orderStatus}</p>

        <button onClick={downloadInvoice}>Download PDF</button>
      </div>
    </div>
  );
}

export default Invoice;