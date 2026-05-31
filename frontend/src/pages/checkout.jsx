import React, { useEffect, useState } from "react";
import "../styles/checkout.css";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
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
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
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

    try {
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();

      alert("Order placed successfully!");

      console.log(data);

    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.product.price) * item.quantity,
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
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
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
                name="zip_code"
                placeholder="ZIP Code"
                value={formData.zip_code}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <div>
                <strong>{item.name}</strong>
                <p>Qty: {item.quantity}</p>
              </div>

              <span>
                $
                {(
                  parseFloat(item.product.price) * item.quantity
                ).toFixed(2)}
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