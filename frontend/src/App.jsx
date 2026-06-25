import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import {
  CustomerLanding,
  DeliveryPartnerLanding,
  PartnerLanding,
} from "./pages/MultiAppLanding";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerRevenue from "./pages/customer/OwnerRevenue";

import AddReview from "./pages/customer/AddReview";
import Favorites from "./pages/customer/Favorites";
import Notifications from "./pages/customer/Notifications";
import Coupons from "./pages/customer/Coupons";
import AdminAnalytics from "./pages/customer/AdminAnalytics";

import OrderSuccess from "./pages/customer/OrderSuccess";
import SearchFood from "./pages/customer/SearchFood";
import Checkout from "./pages/customer/Checkout";
import RestaurantList from "./pages/customer/RestaurantList";
import RestaurantProfile from "./pages/owner/RestaurantProfile";
import FoodManagement from "./pages/owner/FoodManagement";
import OwnerOrders from "./pages/owner/OwnerOrders";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerHome from "./pages/customer/CustomerHome";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/customer/Cart";
import CustomerProfile from "./pages/customer/CustomerProfile";
import OrderTracking from "./pages/customer/OrderTracking";
import RestaurantMenu from "./pages/customer/RestaurantMenu";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomer from "./pages/admin/AdminCustomer";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminRestaurant from "./pages/admin/AdminRestaurant";
import AdminOwners from "./pages/admin/AdminOwners";

import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryRegister from "./pages/delivery/DeliveryRegister";
import LiveTracking from "./pages/customer/LiveTracking";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food-delivery" element={<CustomerLanding />} />
        <Route path="/restaurant-partner" element={<PartnerLanding />} />
        <Route path="/delivery-partner" element={<DeliveryPartnerLanding />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/search" element={<SearchFood />} />
        <Route path="/customer/notifications" element={<Notifications />} />

        <Route path="/customer/restaurants" element={<RestaurantList />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/customer/orders/:id" element={<OrderTracking />} />
      <Route path="/owner/revenue" element={<OwnerRevenue />} />
      <Route
  path="/customer/live-tracking/:id"
  element={<LiveTracking />}
/>

        
        <Route path="/customer/order-success" element={<OrderSuccess />} />
        <Route path="/owner/restaurant" element={<RestaurantProfile />} />
        <Route path="/owner/foods" element={<FoodManagement />} />
        <Route path="/owner/orders" element={<OwnerOrders />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomer />} />
<Route path="/admin/orders" element={<AdminOrder />} />
<Route path="/admin/restaurants" element={<AdminRestaurant />} />
        <Route path="/admin/owners" element={<AdminOwners />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        

        <Route path="/delivery/login"element={<DeliveryLogin />}/>
        <Route path="/delivery/dashboard"element={<DeliveryDashboard />}/>
        <Route path="/delivery/register" element={<DeliveryRegister />} />
        <Route path="/customer/review/:restaurantId" element={<AddReview />} />
        <Route path="/customer/coupons" element={<Coupons />} />
        <Route
  path="/customer/favorites"
  element={<Favorites />}
/>
        <Route
  path="/customer/checkout"
  element={<Checkout />}
/>
        <Route
  path="/customer/restaurants/:id"
  element={<RestaurantMenu />}
/>
        <Route
  path="/owner/dashboard"
  element={
    <ProtectedRoute type="owner">
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/restaurant"
  element={
    <ProtectedRoute type="owner">
      <RestaurantProfile />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/foods"
  element={
    <ProtectedRoute type="owner">
      <FoodManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/orders"
  element={
    <ProtectedRoute type="owner">
      <OwnerOrders />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/orders"
  element={
    <ProtectedRoute type="customer">
      <CustomerOrders />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
