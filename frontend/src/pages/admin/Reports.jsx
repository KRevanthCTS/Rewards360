import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import * as XLSX from "xlsx"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  
import '../../styles/report.css';
import api from '../../api/client';

/* ---------------- Analytics Dashboard ---------------- */
function AnalyticsDashboard() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/analytics/kpis')
      .then(res => {
        const data = res.data;
        setKpis([
          { label: 'Users', value: data.users || 0 },
          { label: 'Offers', value: data.offers || 0 },
          { label: 'Redemptions', value: data.redemptions || 0 },
          { label: 'Redemption Rate (%)', value: data.redemptionRate ? data.redemptionRate.toFixed(2) : '0.00' }
        ]);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error:", err);
        setError('Failed to load analytics data.');
        setLoading(false);
      });
  }, []);

  const pieData = {
    labels: ['Users', 'Offers', 'Redemptions'],
    datasets: [
      {
        data: [
          parseInt(kpis[0]?.value) || 0,
          parseInt(kpis[1]?.value) || 0,
          parseInt(kpis[2]?.value) || 0
        ],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
        hoverOffset: 4
      }
    ]
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">📊 Analytics Dashboard</h2>
      {error && <div style={{color: 'red', padding: '10px', marginBottom: '10px'}}>{error}</div>}
      {loading ? (
        <div>Loading analytics data...</div>
      ) : (
        <>
          <div className="reports-grid">
            {kpis.map((k, i) => (
              <div key={i} className="reports-card">
                <p className="reports-label">{k.label}</p>
                <p className="reports-value">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="reports-chart">
            <Pie data={pieData} />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Report Generator ---------------- */
function ReportGenerator() {
  const [metric, setMetric] = useState('users');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState(null);

  const exportAnalyticsData = async (format) => {
    setExporting(true);
    setMessage(null);
    let endpoint = "";
    let header = [];
    let rows = [];

    if (metric === "reports") endpoint = "/analytics/reports";
    else if (metric === "users") endpoint = "/analytics/users";
    else if (metric === "offers") endpoint = "/analytics/offers";
    else if (metric === "redemptions") endpoint = "/analytics/redemptions";

    try {
      const res = await api.get(endpoint);
      const data = res.data;

      if (!data || data.length === 0) {
        setMessage(`No ${metric} data available to export.`);
        setExporting(false);
        return;
      }

      if (metric === "reports") {
        header = ["ID", "Metric", "Date Range", "Generated At"];
        rows = data.map(r => [r.id || '', r.metric || '', r.dateRange || '', r.generatedAt || '']);
      } else if (metric === "users") {
        header = ["ID", "Name", "Email", "Phone", "Role", "Created At"];
        rows = data.map(u => [u.id || '', u.name || '', u.email || '', u.phone || '', u.role || '', u.createdAt || '']);
      } else if (metric === "offers") {
        header = ["ID", "Title", "Category", "Description", "Cost Points", "Active", "Created At", "Tier Level"];
        rows = data.map(o => [o.id || '', o.title || '', o.category || '', o.description || '', o.costPoints || 0, o.active ? 'Yes' : 'No', o.createdAt || '', o.tierLevel || 'All']);
      } else if (metric === "redemptions") {
        header = ["ID", "Confirmation Code", "Transaction ID", "Date", "Cost Points", "Offer Title", "Store"];
        rows = data.map(r => [r.id || '', r.confirmationCode || '', r.transactionId || '', r.date || '', r.costPoints || 0, r.offerTitle || '', r.store || '']);
      }

      if (format === "csv") {
        const csv = [header, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${metric}-history.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "excel") {
        const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${metric} History`);
        XLSX.writeFile(workbook, `${metric}-history.xlsx`);
      } else if (format === "pdf") {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text(`${metric} History`, 14, 15);

        autoTable(doc, {
          head: [header],
          body: rows,
          startY: 25,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [79, 70, 229] },
        });

        doc.save(`${metric}-history.pdf`);
      }
      
      setMessage(`Successfully exported ${metric} data as ${format.toUpperCase()}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Export error:", err);
      setMessage(`Failed to export ${metric} data. Error: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="reports-generator">
      <h2 className="reports-title">📑 Report Generation</h2>
      <p className="reports-note">Select a dataset and export in your preferred format.</p>
      
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: message.includes('Failed') ? '#fee' : '#efe',
          color: message.includes('Failed') ? '#c00' : '#060',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div className="reports-grid">
        <select className="reports-select" value={metric} onChange={e => setMetric(e.target.value)}>
          <option value="users">Users</option>
          <option value="offers">Offers</option>
          <option value="redemptions">Redemptions</option>
          <option value="reports">Reports</option>
        </select>
      </div>

      <div className="reports-actions">
        <button 
          className="reports-btn-outline" 
          onClick={() => exportAnalyticsData('pdf')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
        <button 
          className="reports-btn-outline" 
          onClick={() => exportAnalyticsData('excel')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export Excel'}
        </button>
        <button 
          className="reports-btn-outline" 
          onClick={() => exportAnalyticsData('csv')}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Main Analytics Page ---------------- */
export default function Reports() {
  return (
    <div className="reports-page">
      <AnalyticsDashboard />
      <ReportGenerator />
    </div>
  );
}
