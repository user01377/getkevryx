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
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8000/cart", {
        credentials: "include",
      });

      const data = await res.json();
      setCartItems(data?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to place order");
      }

      const data = await res.json();

      alert("Order placed successfully!");

      navigate(`/order/${data.order_id}`);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) return <p>Loading checkout...</p>;

  return (
    <main className="checkout-page page">
      <div className="checkout-container">

        <div className="checkout-form-section">
          <h1>Checkout</h1>

          <form onSubmit={placeOrder} className="checkout-form">

            <div className="form-row">
              <input
                type="text"
                name="first"
                placeholder="First Name"
                value={formData.first}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="last"
                placeholder="Last Name"
                value={formData.last}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="zipcode"
                placeholder="ZIP Code"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="place-order-btn" disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <div>
                <strong>{item.product.name}</strong>
                <p>Qty: {item.quantity}</p>
              </div>

              <span>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>

      </div>
    </main>
  );
}