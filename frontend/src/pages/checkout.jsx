import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
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
        const res = await fetch("/api/cart/summary", {
          credentials: "include",
        });

        const data = await res.json();
        setSummary(data);
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

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
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

  if (!summary) return <p className="loading">Cart is empty.</p>;

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
            {summary.items.map((item, idx) => (
              <div key={idx} className="summary-item">

                <img
                  src={`https://cataas.com/cat?width=120&height=160&random=${idx}`}
                  alt={item.product}
                  className="summary-image"
                />

                <div className="summary-info">
                  <p className="summary-name">{item.product}</p>
                  <p className="summary-qty">Qty: {item.quantity}</p>
                </div>

                <p className="summary-price">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>

              </div>
            ))}
          </div>

          <div className="summary-break" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${Number(summary.subtotal).toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${Number(summary.shipping).toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>${Number(summary.tax).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${Number(summary.total).toFixed(2)}</span>
          </div>

        </aside>

      </div>
    </main>
  );
}