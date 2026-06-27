import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./CustomerHome.css";

const categories = [
  { name: "Pizza", img: "/foods/pizza.png" },
  { name: "Burger", img: "/foods/burger.png" },
  { name: "Biryani", img: "/foods/biryani.png" },
  { name: "Noodles", img: "/foods/noodles.png" },
  { name: "Drinks", img: "/foods/drink.png" },
  { name: "Sandwich", img: "/foods/sandwich.png" },
];

const trendingFoods = [
  { id: 1, name: "Cheesy Chicken Burger", img: "/foods/burger.png", price: 149, oldPrice: 189, rating: 4.6, offer: "20% off", restaurantId: 3 },
  { id: 2, name: "Farmhouse Pizza", img: "/foods/pizza.png", price: 299, oldPrice: 349, rating: 4.7, offer: "15% off", restaurantId: 2 },
  { id: 3, name: "Hyderabadi Biryani", img: "/foods/biryani.png", price: 199, oldPrice: 229, rating: 4.8, offer: "Best value", restaurantId: 1 },
  { id: 4, name: "Veg Street Noodles", img: "/foods/noodles.png", price: 129, oldPrice: 159, rating: 4.4, offer: "18% off", restaurantId: 1 },
];

const restaurants = [
  { id: 1, name: "Spice Hut Kitchen", type: "Biryani, North Indian, Chinese", time: "25-30 min", rating: 4.5, price: 250, mark: "SH" },
  { id: 2, name: "Pizza Point", type: "Pizza, Pasta, Italian", time: "20-25 min", rating: 4.4, price: 300, mark: "PP" },
  { id: 3, name: "Burger Bros", type: "Burgers, Wraps, Fries", time: "15-20 min", rating: 4.6, price: 200, mark: "BB" },
];

function CustomerHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = JSON.parse(localStorage.getItem("user") || "null");
  const cartCount = (JSON.parse(localStorage.getItem("cart") || "[]")).length;
  const [deliveryLocation, setDeliveryLocation] = useState("Tap to set location");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());

  const handleSearch = (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      navigate(`/customer/search?q=${encodeURIComponent(event.target.value.trim())}`);
    }
  };

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setDeliveryLocation("Location not supported");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setDeliveryLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setLoadingLocation(false);
      },
      () => {
        setDeliveryLocation("Allow location for faster delivery");
        setLoadingLocation(false);
      }
    );
  }, []);

  const toggleLike = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
    setLikedItems((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="customer-app-shell">
      <div className="app-status-spacer" />

      <header className="customer-app-header">
        <div className="header-row">
          <div>
            <span className="app-eyebrow">Hello, {customer?.name?.split(" ")[0] || "Food lover"}</span>
            <h1>What are you craving?</h1>
          </div>
          <div className="header-buttons">
            <Link to="/customer/notifications" className="round-button" aria-label="Notifications">
              <span className="bell-shape" />
              <i />
            </Link>
            <Link to="/customer/profile" className="profile-button" aria-label="Profile">
              {(customer?.name?.[0] || "C").toUpperCase()}
            </Link>
          </div>
        </div>

        <button className="location-pill" type="button" onClick={getLocation}>
          <span className="pin-dot" />
          <div>
            <small>{loadingLocation ? "Getting location" : "Deliver to"}</small>
            <strong>{deliveryLocation}</strong>
          </div>
          <b>Change</b>
        </button>
      </header>

      <main className="customer-app-content">
        <div className="sticky-search">
          <div className="app-search">
            <span />
            <input placeholder="Search biryani, pizza, burgers..." onKeyDown={handleSearch} />
            <button type="button" onClick={() => navigate("/customer/search")} aria-label="Filters">
              Filter
            </button>
          </div>
        </div>

        <section className="hero-offer-card">
          <div>
            <p>Owner-friendly restaurant deal</p>
            <h2>40% off first order</h2>
            <span>Fast checkout, clear payments, better restaurant tools.</span>
          </div>
          <button type="button" onClick={() => navigate("/customer/coupons")}>FIRST40</button>
          <img src="/foods/pizza.png" alt="" />
        </section>

        <section className="quick-stats">
          <article>
            <strong>No markups</strong>
            <span>clear pricing</span>
          </article>
          <article>
            <strong>25 min</strong>
            <span>avg delivery</span>
          </article>
          <article>
            <strong>4.8</strong>
            <span>rating</span>
          </article>
        </section>

        <section className="app-section">
          <div className="section-title">
            <h2>Top categories</h2>
            <Link to="/customer/restaurants">See all</Link>
          </div>
          <div className="category-scroll">
            {categories.map((category) => (
              <Link to="/customer/restaurants" className="category-tile" key={category.name}>
                <img src={category.img} alt={category.name} />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="app-section">
          <div className="section-title">
            <h2>Trending now</h2>
            <Link to="/customer/restaurants">See all</Link>
          </div>
          <div className="trending-scroll">
            {trendingFoods.map((food) => (
              <Link to={`/customer/restaurants/${food.restaurantId}`} className="trend-card" key={food.id}>
                <button
                  className={`heart-button ${likedItems.has(food.id) ? "is-liked" : ""}`}
                  type="button"
                  onClick={(event) => toggleLike(food.id, event)}
                  aria-label="Save favourite"
                >
                  {likedItems.has(food.id) ? "Saved" : "Save"}
                </button>
                <span className="offer-chip">{food.offer}</span>
                <img src={food.img} alt={food.name} />
                <div>
                  <h3>{food.name}</h3>
                  <p>
                    <strong>Rs {food.price}</strong>
                    <del>Rs {food.oldPrice}</del>
                    <span>{food.rating}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="app-section">
          <div className="section-title">
            <h2>Popular restaurants</h2>
            <Link to="/customer/restaurants">See all</Link>
          </div>
          <div className="restaurant-stack">
            {restaurants.map((restaurant) => (
              <Link to={`/customer/restaurants/${restaurant.id}`} className="restaurant-row" key={restaurant.id}>
                <div className="restaurant-avatar">{restaurant.mark}</div>
                <div className="restaurant-copy">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.type}</p>
                  <span>{restaurant.time} | {restaurant.rating} rating</span>
                </div>
                <div className="restaurant-price">
                  <strong>Rs {restaurant.price}</strong>
                  <small>for two</small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="delivery-motion-card">
          <div>
            <p>Live tracking</p>
            <h2>Food is moving fast</h2>
            <span>Track every order from kitchen to doorstep.</span>
          </div>
          <div className="route-line"><i /></div>
        </section>
      </main>

      <nav className="mobile-bottom-nav">
        <Link to="/customer/home" className={isActive("/customer/home") ? "active" : ""}>
          <span>Home</span>
        </Link>
        <Link to="/customer/search" className={isActive("/customer/search") ? "active" : ""}>
          <span>Search</span>
        </Link>
        <Link to="/customer/cart" className={isActive("/customer/cart") ? "active" : ""}>
          <span>Cart</span>
          {cartCount > 0 && <b>{cartCount}</b>}
        </Link>
        <Link to="/customer/orders" className={isActive("/customer/orders") ? "active" : ""}>
          <span>Orders</span>
        </Link>
        <Link to="/customer/profile" className={isActive("/customer/profile") ? "active" : ""}>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default CustomerHome;
