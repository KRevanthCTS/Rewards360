import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../styles/Offer.css";

export default function Offers() {
  const { user, offers, redeemOffer, loading, redemptions } = useUser();
  const [confirm, setConfirm] = useState(null);
  const [category, setCategory] = useState("All");

  if (loading || !user) return <div className="offers-page">Loading...</div>;

  const open = (o) => setConfirm(o);
  const close = () => setConfirm(null);

  // Build a quick lookup of redeemed offer titles to disable redeems that already happened
  const redeemedTitles = new Set((redemptions || []).map((r) => r.offerTitle));

  const redeem = async () => {
    if (!confirm) return;
    try {
      await redeemOffer(confirm.id, "Online");
      setConfirm(null);
      alert("Redemption confirmed! Check Redemptions page.");
    } catch (error) {
      alert("Failed to redeem offer. Please try again.");
    }
  };

  return (
    <div className="offers-page">
      {/* ===== HERO header with bg image and enhanced user/balance styling ===== */}
      <div className="o-hero">
        <div className="o-hero-overlay">
          <div className="o-hero-row">
            <div>
              <h3 className="o-hero-title">Member Offers</h3>
              <div className="o-hero-sub">
                <span className="o-user-chip">
                  <span className="o-user-dot" />
                  {user.name}
                </span>
                <span className="o-sep">•</span>
                <span className="o-tier">
                  Tier:&nbsp;
                  <strong>{user.profile?.loyaltyTier || "Bronze"}</strong>
                </span>
              </div>
            </div>

            <div
              className="o-hero-balance-badge"
              title="Current Points Balance"
            >
              <span className="o-balance-label">Balance</span>
              <span className="o-balance-value">
                {user.profile?.pointsBalance ?? 0}
              </span>
              <span className="o-balance-unit">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Offers grid ===== */}
      {/* Simple inline-styled category filter (non-complex) */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          margin: "18px 0",
          width: "100%",
        }}
      >
        <label style={{ fontWeight: 600 }}>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          {/* derive categories from offers; assume offers may have a `category` field */}
          <option value="All">All</option>
          {Array.from(
            new Set(offers.map((o) => o.category).filter(Boolean)),
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="o-grid">
        {offers
          .filter(
            (o) => category === "All" || !o.category || o.category === category,
          )
          .map((o) => (
            <div className="o-card o-offer" key={o.id}>
              <div className="o-img-wrap">
                <img className="o-img" src={o.imageUrl} alt={o.title} />
              </div>
              <div className="o-body">
                <h4 className="o-card-title">{o.title}</h4>
                <p className="o-desc">{o.description}</p>
                <div className="o-row">
                  <span className="o-pill">
                    Cost: <strong>{o.costPoints}</strong> pts
                  </span>
                  {redeemedTitles.has(o.title) ? (
                    <button
                      className="o-btn"
                      disabled
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                    >
                      Redeemed
                    </button>
                  ) : (
                    <button
                      className="o-btn"
                      onClick={() => open(o)}
                      disabled={user?.profile?.pointsBalance < o.costPoints}
                      style={{
                        opacity:
                          user?.profile?.pointsBalance < o.costPoints ? 0.6 : 1,
                      }}
                    >
                      Redeem
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* ===== Centered modal with image & attractive layout ===== */}
      {confirm && (
        <div className="o-modal-backdrop" onClick={close} aria-hidden="true">
          <div
            className="o-modal-card o-card"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm Redemption"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="o-modal-grid">
              <div className="o-modal-img-wrap">
                <img
                  className="o-modal-img"
                  src={confirm.imageUrl}
                  alt={confirm.title}
                />
              </div>

              <div className="o-modal-body">
                <h4 className="o-card-title">{confirm.title}</h4>
                <p className="o-desc">{confirm.description}</p>

                <div className="o-modal-meta">
                  <div className="o-meta-row">
                    <span className="o-meta-label">Cost</span>
                    <span className="o-meta-value">
                      {confirm.costPoints} pts
                    </span>
                  </div>
                  <div className="o-meta-row">
                    <span className="o-meta-label">Store</span>
                    <span className="o-meta-value">Online</span>
                  </div>
                </div>

                <div className="o-modal-actions">
                  <button className="o-btn" onClick={redeem}>
                    Confirm &amp; Redeem
                  </button>
                  <button className="o-btn o-btn-ghost" onClick={close}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
