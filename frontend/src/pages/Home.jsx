import { Link } from "react-router-dom";
import "../App.css";

const products = [
  {
    title: "CraveRun Food Delivery",
    subtitle: "Customer app and website",
    text: "Browse food, restaurants, coupons, cart, checkout, orders, invoices, reviews and live tracking.",
    href: "/food-delivery",
    app: "/customer/home",
  },
  {
    title: "CraveRun Partner",
    subtitle: "Restaurant owner app and website",
    text: "Restaurant setup, menu management, order handling, payments, commission and owner payout tracking.",
    href: "/restaurant-partner",
    app: "/owner/dashboard",
  },
  {
    title: "CraveRun Delivery Partner",
    subtitle: "Delivery jobs app and website",
    text: "Delivery partner registration, login, assigned orders, job status and earnings-ready delivery workflow.",
    href: "/delivery-partner",
    app: "/delivery/dashboard",
  },
];

function Home() {
  return (
    <main className="product-hub">
      <header className="hub-header">
        <Link className="brand-lockup" to="/">
          <img src="/logo.png" alt="CraveRun" />
          <span>Crave<span>Run</span></span>
        </Link>
        <nav>
          <Link to="/food-delivery">Food Delivery</Link>
          <Link to="/restaurant-partner">Restaurant Partner</Link>
          <Link to="/delivery-partner">Delivery Partner</Link>
        </nav>
      </header>

      <section className="hub-hero">
        <span className="eyebrow">Three apps. One CraveRun platform.</span>
        <h1>CraveRun</h1>
        <p>
          Split into dedicated customer, restaurant owner, and delivery partner websites and app experiences
          for Android, iOS and web.
        </p>
      </section>

      <section className="hub-product-grid">
        {products.map((product) => (
          <article className="hub-product-card" key={product.title}>
            <span>{product.subtitle}</span>
            <h2>{product.title}</h2>
            <p>{product.text}</p>
            <div>
              <Link to={product.href}>Open website</Link>
              <Link to={product.app}>Open app</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Home;
