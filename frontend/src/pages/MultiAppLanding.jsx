import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const landingContent = {
  customer: {
    title: "CraveRun Food Delivery",
    eyebrow: "Customer order app and website",
    description:
      "Customers can browse restaurants, see food, search, use coupons, add to cart, pay, track orders and review restaurants.",
    manifest: "/manifest-customer.json",
    primary: { label: "Open customer app", href: "/customer/home" },
    secondary: { label: "Customer login", href: "/customer/login" },
    image: "/foods/biryani.png",
    stats: ["Food discovery", "Cart and checkout", "Live tracking"],
    features: [
      "Restaurant and food browsing",
      "Customer account, favourites and profile",
      "Coupons, checkout and payment setup",
      "Order history, invoice and live tracking",
    ],
  },
  partner: {
    title: "CraveRun Partner",
    eyebrow: "Restaurant owner app and website",
    description:
      "Restaurant owners manage their profile, menu, orders, payment split, platform commission and owner payout.",
    manifest: "/manifest-partner.json",
    primary: { label: "Open partner app", href: "/owner/dashboard" },
    secondary: { label: "Register restaurant", href: "/owner/register" },
    image: "/foods/pizza.png",
    stats: ["10% commission", "Menu management", "Payout tracking"],
    features: [
      "Restaurant profile and holiday mode",
      "Food item creation and availability",
      "Order status management",
      "Gross revenue, commission and payout view",
    ],
  },
  delivery: {
    title: "CraveRun Delivery Partner",
    eyebrow: "Delivery jobs app and website",
    description:
      "Delivery partners register for jobs, log in, view assigned orders, follow delivery details and complete deliveries.",
    manifest: "/manifest-delivery.json",
    primary: { label: "Open delivery app", href: "/delivery/dashboard" },
    secondary: { label: "Join as delivery partner", href: "/delivery/register" },
    image: "/foods/burger.png",
    stats: ["Delivery jobs", "Assigned orders", "Fast status"],
    features: [
      "Delivery partner registration and login",
      "Assigned order dashboard",
      "Delivery address and payment amount view",
      "Mobile-first workflow for Android and iOS",
    ],
  },
};

function useProductMeta(content) {
  useEffect(() => {
    document.title = `${content.title} - Android, iOS and Web`;
    let manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      manifest = document.createElement("link");
      manifest.rel = "manifest";
      document.head.appendChild(manifest);
    }
    manifest.setAttribute("href", content.manifest);
  }, [content]);
}

function ProductLanding({ type }) {
  const content = landingContent[type];
  useProductMeta(content);

  return (
    <main className={`split-landing ${type}`}>
      <header className="split-header">
        <Link className="brand-lockup" to="/">
          <img src="/logo.png" alt="CraveRun" />
          <span>Crave<span>Run</span></span>
        </Link>
        <nav>
          <Link to="/food-delivery">Food Delivery</Link>
          <Link to="/restaurant-partner">Partner</Link>
          <Link to="/delivery-partner">Delivery</Link>
        </nav>
      </header>

      <section className="split-hero">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div className="split-actions">
            <Link className="hero-primary" to={content.primary.href}>{content.primary.label}</Link>
            <Link className="hero-secondary" to={content.secondary.href}>{content.secondary.label}</Link>
          </div>
          <div className="store-row">
            <span>Android PWA</span>
            <span>iOS PWA</span>
            <span>Responsive website</span>
          </div>
        </div>

        <div className="split-phone">
          <div className="phone-frame product-phone">
            <div className="phone-status" />
            <h3>{content.title}</h3>
            <img src={content.image} alt="" />
            {content.stats.map((item) => <p key={item}>{item}</p>)}
          </div>
        </div>
      </section>

      <section className="split-feature-grid">
        {content.features.map((feature) => (
          <article key={feature}>
            <h2>{feature}</h2>
            <p>Available as a dedicated web flow and installable mobile-style app screen.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export function CustomerLanding() {
  return <ProductLanding type="customer" />;
}

export function PartnerLanding() {
  return <ProductLanding type="partner" />;
}

export function DeliveryPartnerLanding() {
  return <ProductLanding type="delivery" />;
}
