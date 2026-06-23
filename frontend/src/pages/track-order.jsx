import React, { useState } from "react";
import "../styles/track-order.css";

export default function TrackOrder() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/order-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await trackOrder();
  };

  return (
    <main className="track-page page">
      <div className="track-container">

        <h1 className="track-title">Track Your Order</h1>

        <form className="track-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {orders.length === 0 && !loading && (
          <p className="empty-state">No orders found.</p>
        )}

        {orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">

                <div className="order-header">
                  <h2>Order #{order.id}</h2>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-meta">
                  <p>Total: ${Number(order.total).toFixed(2)}</p>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.product}</span>
                      <span>× {item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}