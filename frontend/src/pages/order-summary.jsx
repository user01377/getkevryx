import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/order-summary.css";

export default function OrderSummaryPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/order-summary/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        setOrder(data);
        setSummary(data.summary);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="order-loading">Loading order...</p>;
  if (!order) return <p className="order-loading">Order not found.</p>;
  
  return (
    <main className="order-page">
      <div className="order-container">

        {/* HEADER */}
        <div className="order-header">
          <h1>Order Confirmation</h1>
          <p className="order-meta">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        {/* BODY */}
        <div className="order-content">

          {/* LEFT: ITEMS */}
        <div className="order-items">
        {(order.items || []).map((item, idx) => (
            <div className="order-item" key={idx}>

            {/* IMAGE */}
            <img
                className="order-item-image"
                src={`https://cataas.com/cat?width=300&height=400&random=${item.product}`}
                alt={item.product}
            />

            {/* INFO */}
            <div className="order-item-info">
                <p className="order-item-name">{item.product}</p>
                <p className="order-item-qty">Qty {item.quantity}</p>
            </div>

            {/* PRICE */}
            <div className="order-item-price">
                ${(Number(item.price) * item.quantity).toFixed(2)}
            </div>

            </div>
        ))}
        </div>

          {/* RIGHT: SUMMARY */}
          <aside className="order-summary">

            <div className="summary-row">
              <span>Status</span>
              <span className="status">{order.status}</span>
            </div>

            <div className="summary-break" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>${Number(order.shipping).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
            
          </aside>

        </div>

      </div>
    </main>
  );
}