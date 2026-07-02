import React, { useEffect, useState } from "react";
import "../styles/shopping-cart.css";
import { Link } from "react-router-dom";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch cart route
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", {
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
      await fetch(`/api/cart/item/${itemId}`, {
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
      await fetch(`/api/cart/item/${itemId}`, {
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
      <h1>Your shopping cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">

                <img
                  src={`https://cataas.com/cat?width=400&height=600&random=${item.product.id}`}
                  alt={item.product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-content">

                  <div className="cart-item-info">
                    <h3 className="cart-item-name">
                      {item.product.name}
                    </h3>

                    <p className="cart-item-price">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <span className="section-label">QUANTITY</span>
                    
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        −
                      </button>

                      <span className="qty-number">
                        {item.quantity}
                      </span>
                
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
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

                </div>

                <div className="item-total">
                  $
                  {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </div>

              </div>
            ))}
          </div>

          <p className="checkout-link">
            <Link to="/checkout">Checkout</Link>
          </p>
        </>
      )}
    </div>
  </main>
);
}
