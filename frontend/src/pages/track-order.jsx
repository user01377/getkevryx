import React, { useState } from "react";
import "../styles/track-order.css";

export default function TrackOrder() {
    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const trackOrder = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8000/order-info",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

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
        <main className="track-order">
            <div className="track-order-container">
                <h1>Track Your Order</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {loading ? "Searching..." : "Track Order"}
                    </button>
                </form>

                {orders.length > 0 && (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="order-card"
                            >
                                <h2>Order #{order.id}</h2>

                                <p>
                                    Status: {order.status}
                                </p>

                                <p>
                                    Total: ${order.total}
                                </p>

                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.product} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}