import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminCustomer.css";

function AdminCustomers() {
  const token = localStorage.getItem("adminToken");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await API.get("/admin/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCustomers(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load customers");
      }
    }

    loadCustomers();
  }, [token]);

  return (
    <div className="admin-customers-page">
      <h1>Customers</h1>

      <div className="customer-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomers;