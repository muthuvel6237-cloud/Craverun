import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminOwners.css";

function AdminOwners() {
  const token = localStorage.getItem("adminToken");
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    async function loadOwners() {
      try {
        const res = await API.get("/admin/owners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOwners(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load owners");
      }
    }

    loadOwners();
  }, [token]);

  return (
    <div className="admin-owners-page">
      <h1>Restaurant Owners</h1>

      <div className="owners-table">
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
            {owners.map((owner) => (
              <tr key={owner._id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.phone}</td>
                <td>{new Date(owner.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOwners;