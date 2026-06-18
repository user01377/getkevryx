import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/cart", {
          credentials: "include",
        });
        const data = await res.json();
        setCartItems(data?.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.product?.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal * 0.1;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Checkout failed");

      navigate(`/order/${data.order_id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading">Loading checkout...</p>;

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">
          <h1 className="checkout-title">Checkout</h1>

          <form onSubmit={placeOrder} className="checkout-form">

            <div className="form-row">
              <input name="first" placeholder="First Name" onChange={handleChange} required />
              <input name="last" placeholder="Last Name" onChange={handleChange} required />
            </div>

            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="address" placeholder="Address" onChange={handleChange} required />

            <div className="form-row">
              <input name="city" placeholder="City" onChange={handleChange} required />
              <input name="state" placeholder="State" onChange={handleChange} required />
              <input name="zipcode" placeholder="ZIP" onChange={handleChange} required />
            </div>

            <button className="place-order-btn" disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

          </form>
        </div>

        {/* RIGHT */}
        <aside className="checkout-right">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">

                <img
                  src={`https://cataas.com/cat?width=120&height=160&random=${item.product?.id}`}
                  alt={item.product?.name}
                  className="summary-image"
                />

                <div className="summary-info">
                  <p className="summary-name">{item.product?.name}</p>
                  <p className="summary-qty">Qty: {item.quantity}</p>
                </div>

                <p className="summary-price">
                  ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>

              </div>
            ))}
          </div>

          <div className="summary-break" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

        </aside>

      </div>
    </main>
  );
}