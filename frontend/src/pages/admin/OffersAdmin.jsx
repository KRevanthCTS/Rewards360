import React, { useEffect, useState } from "react";
import api from "../../api/client";
import "../../styles/offersAdmin.css";

export default function OffersAdmin() {
  const [items, setItems] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [o, setO] = useState({
    title: "",
    category: "",
    description: "",
    costPoints: 0,
    imageUrl: "",
    tierLevel: "",
    startDate: "",
    endDate: "",
  });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const load = async () => {
    try {
      const { data } = await api.get("/admin/offers");
      setItems(data);
    } catch (e) {
      setErr("Failed to load offers");
    }
  };
  useEffect(() => {
    load();
  }, []);
  const validate = () => {
    if (!o.title.trim()) return "Title is required";
    // Category may be empty to indicate the offer applies to ALL categories
    // (leave blank for All categories)
    if (!o.description.trim()) return "Description is required";
    if (Number.isNaN(Number(o.costPoints)) || Number(o.costPoints) < 0)
      return "Cost points must be a non-negative number";
    return "";
  };
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    try {
      const payload = { ...o };
      // If tierLevel is empty string, treat as null (All tiers)
      if (!payload.tierLevel) payload.tierLevel = null;
      // If category is empty or whitespace, treat as null (All categories)
      if (!payload.category || !payload.category.trim()) payload.category = null;
      await api.post("/admin/offers", payload);
      setMsg("Offer created successfully");
      setO({
        title: "",
        category: "",
        description: "",
        costPoints: 0,
        imageUrl: "",
        tierLevel: "",
        startDate: "",
        endDate: "",
      });
      load();
    } catch (ex) {
      setErr("Failed to create offer");
    }
  };
  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Create Offer</h3>
        <form onSubmit={submit}>
          <label>Title</label>
          <input
            className="input"
            placeholder="e.g., Festive 15% Off"
            value={o.title}
            onChange={(e) => setO((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <label>Category</label>
          <input
            className="input"
            placeholder="e.g., Electronics (leave blank for All categories)"
            value={o.category}
            onChange={(e) => setO((p) => ({ ...p, category: e.target.value }))}
          />
          <label>Description</label>
          <textarea
            className="input"
            placeholder="Short description visible to users"
            value={o.description}
            onChange={(e) =>
              setO((p) => ({ ...p, description: e.target.value }))
            }
          />
          <label>Cost Points</label>
          <input
            className="input"
            type="number"
            placeholder="e.g., 350"
            value={o.costPoints}
            onChange={(e) =>
              setO((p) => ({
                ...p,
                costPoints: parseInt(e.target.value || 0, 10),
              }))
            }
          />
          <label>Tier Level</label>
          <select
            className="input"
            value={o.tierLevel}
            onChange={(e) => setO((p) => ({ ...p, tierLevel: e.target.value }))}
          >
            <option value="">All</option>
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
          </select>
          <label>Start Date</label>
          <input
            className="input"
            type="date"
            min={today}
            value={o.startDate}
            onChange={(e) => setO((p) => ({ ...p, startDate: e.target.value }))}
          />
          <label>End Date</label>
          <input
            className="input"
            type="date"
            min={o.startDate || today}
            value={o.endDate}
            onChange={(e) => setO((p) => ({ ...p, endDate: e.target.value }))}
          />
          <label>Image URL (optional)</label>
          <input
            className="input"
            placeholder="https://..."
            value={o.imageUrl}
            onChange={(e) => setO((p) => ({ ...p, imageUrl: e.target.value }))}
          />
          {err && (
            <div className="error" style={{ marginTop: 6 }}>
              {err}
            </div>
          )}
          {msg && (
            <div className="badge" style={{ marginTop: 6 }}>
              {msg}
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button className="button">Create Offer</button>
          </div>
        </form>
      </div>
      <div className="card">
        <h3>Offers</h3>
        {items?.length === 0 ? (
          <p>No offers yet. Create one on the left.</p>
        ) : (
          <div className="offers-grid">
            {items.map((i) => (
              <div key={i.id} className="offer-card">
                {i.imageUrl && (
                  <img
                    src={i.imageUrl}
                    alt={i.title}
                    className="offer-card-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="offer-card-body">
                  <div className="offer-card-header">
                    <h4>{i.title}</h4>
                    {i.active ? (
                      <span className="badge badge-active">Active</span>
                    ) : (
                      <span className="badge badge-inactive">Inactive</span>
                    )}
                  </div>
                  <div className="offer-field">
                    <span className="field-label">ID:</span>
                    <span className="field-value">{i.id}</span>
                  </div>
                  <div className="offer-field">
                    <span className="field-label">Category:</span>
                    <span className="field-value">{i.category}</span>
                  </div>
                  <div className="offer-field">
                    <span className="field-label">Description:</span>
                    <span className="field-value">{i.description}</span>
                  </div>
                  <div className="offer-meta">
                    <span className="badge">{i.costPoints} pts</span>
                    <span className="badge">Tier: {i.tierLevel || "All"}</span>
                  </div>
                  <div className="offer-actions">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        try {
                          await api.put(`/admin/offers/${i.id}/toggle`);
                          load();
                        } catch (e) {
                          console.error(e);
                          setErr(
                            e?.response?.data?.message || "Failed to toggle"
                          );
                        }
                      }}
                    >
                      {i.active ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        if (!window.confirm("Delete this offer?")) return;
                        try {
                          await api.delete(`/admin/offers/${i.id}`);
                          load();
                        } catch (e) {
                          console.error(e);
                          setErr(
                            e?.response?.data?.message || "Failed to delete"
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
