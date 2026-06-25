import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function getSavedCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function Cart() {
  const [cart, setCart] = useState(getSavedCart);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>My Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/customer/restaurants">Browse Restaurants</Link>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>

                <div className="qty-box">
                  <button type="button" onClick={() => decreaseQty(item.id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button type="button" onClick={() => increaseQty(item.id)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-total">
              <h2>Total: ₹{total}</h2>
              <Link to="/customer/checkout">Proceed to Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;