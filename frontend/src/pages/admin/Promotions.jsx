import React, { useState } from "react";
import { Link } from "react-router-dom";
// import images from the project's src PUBLIC folder
import img6 from "../../PUBLIC/img6.webp";
import img2 from "../../PUBLIC/img2.webp";
import gift1 from "../../PUBLIC/gift1.jpg";
import img3 from "../../PUBLIC/img3.webp";
import "../../styles/promotions.css";


export default function Promotions() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getApiBase = () => {
    if (typeof window !== "undefined" && window.REACT_APP_API_URL) {
      return String(window.REACT_APP_API_URL).replace(/\/$/, "");
    }
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_API_URL
    ) {
      return String(process.env.REACT_APP_API_URL).replace(/\/$/, "");
    }
    return "http://localhost:8080"; // default API base URL
  };

  async function fetchAnalytics() {
    setLoading(true);
    setError(null);
    try {
      const base = getApiBase();
      const url = `${base}/api/admin/analytics`;

      const headers = { Accept: "application/json" };
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url, { headers });

      if (res.status === 401 || res.status === 403) {
        throw new Error(
          `Unauthorized (status ${res.status}). Ensure you are logged in as ADMIN.`,
        );
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text.slice(0, 300)}`);
      }

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          "Expected JSON but received non-JSON response: " + text.slice(0, 300),
        );
      }

      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.offers)
          ? data.offers
          : [];
      const normalized = list.map((o) => ({
        id: o.id ?? o._id ?? null,
        title: o.title ?? "",
        category: o.category ?? "",
        costPoints: o.costPoints ?? o.cost_points ?? 0,
      }));
      setAnalytics(normalized);
    } catch (err) {
      setError(err?.message || "Unknown error");
      setAnalytics([]);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    {
      name: "Electronics",
      description: "Gadgets, devices, and tech accessories deals.",
      image: img2,
    },
    {
      name: "Home & Family",
      description: "Savings on home essentials.",
      image: img3,
    },
    {
      name: "Lifestyle",
      description: "Wellness, home, and leisure offers.",
      image: img3,
    },
    {
      name: "Entertainment",
      description: "Discounts on movies, music.",
      image: img3,
    },
    {
      name: "Travel",
      description: "Exclusive offers on flights, hotels, car rentals.",
      image: gift1,
    },
    {
      name: "Wellness",
      description: "Health and wellness deals including fitness.",
      image: img6,
    },
  ];

  return (
    <div className="promotions">
      <div className="grid cols-3 top-grid">
        <div className="card">
          <h3>Create Offer Campaign</h3>
          <p>Quickly design and launch a new promotional campaign.</p>
          <Link className="button" to="/admin/offers">
            Create Offer
          </Link>
        </div>

        <div className="card">
          <h3>Analytics</h3>
          <p>High-level metrics of ongoing campaigns.</p>

          <button className="button" onClick={fetchAnalytics}>
            Open Analytics
          </button>

          {loading && <div style={{ marginTop: 8 }}>Loading analytics...</div>}
          {error && (
            <div style={{ marginTop: 8, color: "red" }}>Error: {error}</div>
          )}
        </div>

        <div className="card">
          <h3>View All Offers</h3>
          <p>Access all available offers in one view.</p>
          <Link className="button" to="/admin/offers">
            Display Offers
          </Link>
        </div>
      </div>

      <section className="section categories-section">
        <h3>Offer Categories</h3>
        <div className="grid cols-3 categories-grid">
          {categories.map((c) => {
            const to = `/admin/offers?category=${encodeURIComponent(
              c.name,
            )}&description=${encodeURIComponent(c.description)}`;
            return (
              <div
                className="card category-card"
                key={c.name}
                style={{ backgroundImage: `url(${c.image})` }}
              >
                <div className="card-overlay">
                  <h4>{c.name}</h4>
                  <p>{c.description}</p>
                  <Link className="button button-large" to={to}>
                    Create Offer
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section analytics-section">
        <h3>Analytics</h3>
        <div className="analytics-wrapper">
          {analytics.length > 0 ? (
            <div className="table-scroll">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th className="th">ID</th>
                    <th className="th">Title</th>
                    <th className="th">Category</th>
                    <th className="th">Cost Points</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((a) => (
                    <tr key={a.id ?? `${a.title}-${a.costPoints}`}>
                      <td className="td">{a.id}</td>
                      <td className="td">{a.title}</td>
                      <td className="td">{a.category}</td>
                      <td className="td">{a.costPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="empty-note">
                No analytics to show. Click "Open Analytics".
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
