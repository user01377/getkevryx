import React, { useEffect, useState } from "react";
import "../styles/shopping-cart.css";
import { Link } from "react-router-dom";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch cart route
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

  useEffect(() => {
    fetchCart();
  }, []);

  // update quantity route
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await fetch(`http://localhost:8000/cart/item/${itemId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/cart/item/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Calculate total
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;

  return (
    <main className="shopping-page page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>${item.product.price}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="item-total">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="cart-total">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
            </div>
          </div>
        )}
      </div>

      <p className="checkout-link"><Link to="/checkout">Checkout</Link></p>
    </main>
  );
}
