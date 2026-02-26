import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiwvtPwMX7oZvo9TuOgqB3TyaRiNGm2Cb-iILCwzY6bhLRNyDTno8ojgrQhGa4FeAadQ7DlH7Vr_q3/pub?single=true&output=csv&gid=";

const SHEET_IDS = {
  lifetimeRevenue: "1774294421",
  clients2023: "1624615474",
  clients2024: "620259654",
  clients2025: "303780733",
  clients2026: "514128140",
};

const FALLBACK_REVENUE = [
  { month: "Aug 2023", revenue: 949.71, netARR: 11396.52, grossARR: 13675.82 },
  { month: "Sep 2023", revenue: 1113.99, netARR: 13367.88, grossARR: 16441.36 },
  { month: "Oct 2023", revenue: 1985.76, netARR: 23829.12, grossARR: 28574.66 },
  { month: "Nov 2023", revenue: 1781.64, netARR: 21379.68, grossARR: 25656.58 },
  { month: "Dec 2023", revenue: 1950.00, netARR: 23400.00, grossARR: 28080.00 },
  { month: "Jan 2024", revenue: 2399.00, netARR: 28788.00, grossARR: 34545.60 },
  { month: "Feb 2024", revenue: 2102.00, netARR: 25224.00, grossARR: 30268.80 },
  { month: "Mar 2024", revenue: 3316.00, netARR: 39792.00, grossARR: 47750.40 },
  { month: "Apr 2024", revenue: 3285.00, netARR: 39420.00, grossARR: 47304.00 },
  { month: "May 2024", revenue: 3432.00, netARR: 41184.00, grossARR: 49420.80 },
  { month: "Jun 2024", revenue: 3392.00, netARR: 40704.00, grossARR: 48844.80 },
  { month: "Jul 2024", revenue: 3409.91, netARR: 40918.92, grossARR: 49022.66 },
  { month: "Aug 2024", revenue: 3356.38, netARR: 40276.56, grossARR: 48331.87 },
  { month: "Sep 2024", revenue: 4237.83, netARR: 50853.96, grossARR: 61024.35 },
  { month: "Oct 2024", revenue: 5085.40, netARR: 61024.80, grossARR: 73228.96 },
  { month: "Nov 2024", revenue: 5300.00, netARR: 63600.00, grossARR: 76320.00 },
  { month: "Dec 2024", revenue: 5300.00, netARR: 63600.00, grossARR: 76320.00 },
  { month: "Jan 2025", revenue: 5300.00, netARR: 63600.00, grossARR: 76320.00 },
  { month: "Feb 2025", revenue: 5350.00, netARR: 64200.00, grossARR: 77040.00 },
  { month: "Mar 2025", revenue: 4980.00, netARR: 59760.00, grossARR: 71712.00 },
  { month: "Apr 2025", revenue: 7435.00, netARR: 89220.00, grossARR: 107043.00 },
  { month: "May 2025", revenue: 6400.00, netARR: 76800.00, grossARR: 92160.00 },
  { month: "Jun 2025", revenue: 6467.00, netARR: 77604.00, grossARR: 93123.20 },
  { month: "Jul 2025", revenue: 5604.00, netARR: 67248.00, grossARR: 80697.60 },
  { month: "Aug 2025", revenue: 4315.00, netARR: 51780.00, grossARR: 62136.00 },
  { month: "Sep 2025", revenue: 1962.00, netARR: 23544.00, grossARR: 28252.80 },
  { month: "Oct 2025", revenue: 4045.29, netARR: 48543.48, grossARR: 58251.18 },
  { month: "Nov 2025", revenue: 3491.70, netARR: 41900.40, grossARR: 50279.68 },
  { month: "Dec 2025", revenue: 3791.32, netARR: 45495.84, grossARR: 54593.41 },
  { month: "Jan 2026", revenue: 5291.81, netARR: 63501.72, grossARR: 76201.01 },
  { month: "Feb 2026", revenue: 5041.81, netARR: 60501.72, grossARR: 72601.46 },
  { month: "Mar 2026", revenue: 9291.81, netARR: 111501.72, grossARR: 133801.46 },
  { month: "Apr 2026", revenue: 7541.81, netARR: 90501.72, grossARR: 108601.46 },
  { month: "May 2026", revenue: 7541.81, netARR: 90501.72, grossARR: 108601.46 },
];

const FALLBACK_CLIENTS = {
  2023: {
    Komerz: [0, 0, 0, 0, 0, 0, 0, 331.39, 663.99, 735.76, 531.64, 700],
    Upwork: [0, 0, 0, 0, 0, 0, 0, 618.32, 450, 0, 0, 0],
    Cocoba: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1250, 1250, 1250],
  },
  2024: {
    Komerz: [649, 652, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
    Cocoba: [1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250],
    QUOKKA: [500, 200, 200, 200, 200, 200, 200, 200, 200, 200, 0, 0],
    "Keep Sailing": [0, 0, 366, 335, 462.4, 468, 459.91, 406.38, 287.83, 287.83, 0, 0],
    "Pop-up Frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1350, 1350, 1350],
    "Venture Forge": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1000, 1000],
  },
  2025: {
    Komerz: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2500],
    Cocoba: [1250, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    QUOKKA: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 0],
    "Pop-up Frames": [1350, 1500, 1050, 1050, 1200, 1200, 350, 0, 0, 0, 0, 0],
    "Venture Forge": [1000, 1750, 2230, 2185, 1000, 1000, 1000, 0, 0, 0, 0, 0],
    "Barker Beds": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1845.44, 1291.81, 1291.81],
    Harken: [0, 0, 0, 2500, 2500, 2567, 2554, 2615, 262, 0, 0, 0],
  },
  2026: {
    Komerz: [2500, 2250, 2250, 2000, 2000, 0, 0, 0, 0, 0, 0, 0],
    "Barker Beds": [1291.81, 1291.81, 1291.81, 1291.81, 1291.81, 0, 0, 0, 0, 0, 0, 0],
    "Furniture Box": [1500, 1500, 1500, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Aqua Carpatica": [0, 0, 1250, 1250, 1250, 0, 0, 0, 0, 0, 0, 0],
    "Stormbrew Amazon": [0, 0, 3000, 3000, 3000, 0, 0, 0, 0, 0, 0, 0],
  },
};

const COLORS = ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"];

// Utility functions

// Proper CSV line parser — handles quoted fields containing commas (e.g. "£7,541.81")
const parseCSVLine = (line) => {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
};

const parseCSVValue = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/[£,\s]/g, "")) || 0;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "£0";
  return "£" + Math.round(value).toLocaleString();
};

const formatCurrencyDecimal = (value) => {
  if (value === null || value === undefined) return "£0";
  return "£" + value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Parse CSV data functions
const parseRevenueCSV = (csv) => {
  const lines = csv.split("\n").map((line) => line.trim()).filter((line) => line);
  const dataLines = lines.slice(4); // Skip first 4 lines (3 empty + 1 header)
  const data = [];

  dataLines.forEach((line) => {
    if (!line) return;
    const parts = parseCSVLine(line);
    if (parts.length < 2) return;

    const year = parseInt(parts[0]);
    const month = parts[2];
    const revenue = parseCSVValue(parts[3]);
    const netARR = parseCSVValue(parts[4]);
    const grossARR = parseCSVValue(parts[5]);

    if (!isNaN(year) && !isNaN(revenue) && month && revenue > 0) {
      data.push({
        month: `${month} ${year}`,
        revenue,
        netARR,
        grossARR,
        year,
      });
    }
  });

  return data.length > 0 ? data : null;
};

const parseClientsCSV = (csv) => {
  const lines = csv.split("\n").map((line) => line.trim()).filter((line) => line);
  const clients = {};

  let inClientSection = false;
  lines.forEach((line) => {
    if (!line) return;

    if (line.includes("INCOME SOURCE")) {
      inClientSection = true;
      return;
    }

    if (inClientSection && line.includes("TOTAL INCOME")) {
      inClientSection = false;
      return;
    }

    if (inClientSection) {
      const parts = parseCSVLine(line);
      if (parts.length < 15) return;

      const clientName = parts[1]?.trim();
      if (!clientName || clientName === "TBC" || clientName === "") return;

      const monthlyValues = [];
      for (let i = 0; i < 12; i++) {
        monthlyValues.push(parseCSVValue(parts[2 + i]));
      }

      clients[clientName] = monthlyValues;
    }
  });

  return Object.keys(clients).length > 0 ? clients : null;
};

// Component: KPI Card
const KpiCard = ({ label, value, trend, isPositive, icon }) => (
  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      {icon && <div className="text-gray-300">{icon}</div>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${isPositive === null ? "text-gray-500" : isPositive ? "text-emerald-600" : "text-red-600"}`}>
        <span>{isPositive === null ? "\u2192" : isPositive ? "\u2191" : "\u2193"}</span>
        <span>{trend}</span>
      </div>
    )}
  </div>
);

// Component: Pill Toggle
const PillToggle = ({ options, selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === opt ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// Component: Sidebar
const Sidebar = ({ activePage, setActivePage, isLiveData, lastUpdate }) => (
  <div className="w-56 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <p className="font-bold text-gray-900">Verbe</p>
          <p className="text-xs text-gray-500">Agency Pulse</p>
        </div>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActivePage("overview")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === "overview"
              ? "bg-slate-100 text-slate-800"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span className="font-medium">Overview</span>
        </button>

        <button
          onClick={() => setActivePage("clients")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === "clients"
              ? "bg-slate-100 text-slate-800"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <span className="font-medium">Clients</span>
        </button>
      </nav>
    </div>

    <div className="mt-auto p-6 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm mb-3">
        <div className={`w-2 h-2 rounded-full ${isLiveData ? "bg-emerald-500" : "bg-amber-500"}`} />
        <span className="text-gray-700 font-medium">{isLiveData ? "Live data" : "Cached data"}</span>
      </div>
      <p className="text-xs text-gray-500">{lastUpdate}</p>
    </div>
  </div>
);

// Component: Overview Page
const OverviewPage = ({ revenueData, clientsData, isLiveData }) => {
  const [selectedYear, setSelectedYear] = useState("All Time");

  const years = useMemo(() => {
    const uniqueYears = [...new Set(revenueData.map((d) => d.year))].sort((a, b) => a - b);
    return ["All Time", ...uniqueYears.map(String)];
  }, [revenueData]);

  const filteredRevenue = useMemo(() => {
    if (selectedYear === "All Time") return revenueData;
    return revenueData.filter((d) => d.year === parseInt(selectedYear));
  }, [revenueData, selectedYear]);

  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData.length > 1 ? revenueData[revenueData.length - 2] : null;

  const currentMonthRevenue = currentMonth?.revenue || 0;
  const previousMonthRevenue = previousMonth?.revenue || 0;
  const momChange = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;

  const ytdRevenue = useMemo(() => {
    const currentYear = currentMonth?.year;
    return revenueData.filter((d) => d.year === currentYear).reduce((sum, d) => sum + d.revenue, 0);
  }, [revenueData, currentMonth]);

  const lastYearRevenue = useMemo(() => {
    const lastYear = currentMonth?.year - 1;
    const lastYearData = revenueData.filter((d) => d.year === lastYear);
    if (lastYearData.length === 0) return 0;
    // Get same number of months as current year
    const currentYearMonths = revenueData.filter((d) => d.year === currentMonth?.year).length;
    return lastYearData.slice(0, currentYearMonths).reduce((sum, d) => sum + d.revenue, 0);
  }, [revenueData, currentMonth]);

  const yoyChange = lastYearRevenue > 0 ? ((ytdRevenue - lastYearRevenue) / lastYearRevenue) * 100 : 0;

  const trailing12M = useMemo(() => {
    const last12 = revenueData.slice(Math.max(0, revenueData.length - 12));
    return last12.reduce((sum, d) => sum + d.revenue, 0);
  }, [revenueData]);

  const currentNetARR = currentMonth?.netARR || 0;
  const bestMonth = useMemo(() => revenueData.reduce((max, d) => (d.revenue > max.revenue ? d : max)), [revenueData]);
  const worstMonth = useMemo(() => revenueData.reduce((min, d) => (d.revenue < min.revenue ? d : min)), [revenueData]);
  const currentGrossARR = currentMonth?.grossARR || 0;
  const lifetimeRevenue = useMemo(() => revenueData.reduce((sum, d) => sum + d.revenue, 0), [revenueData]);

  const [arrMode, setArrMode] = useState("net");

  const monthlyData = useMemo(() => {
    return filteredRevenue.map((d) => ({
      month: d.month.split(" ")[0].substring(0, 3),
      revenue: Math.round(d.revenue),
    }));
  }, [filteredRevenue]);

  const yoyData = useMemo(() => {
    const years = [...new Set(revenueData.map((d) => d.year))];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = {};

    years.forEach((year) => {
      const yearData = revenueData.filter((d) => d.year === year);
      yearData.forEach((d) => {
        const monthName = d.month.split(" ")[0].substring(0, 3);
        const monthIdx = months.indexOf(monthName);
        const key = `M${monthIdx + 1}`;
        if (!result[key]) result[key] = { month: monthName };
        result[key][`Year ${year}`] = Math.round(d.revenue);
      });
    });

    const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Object.values(result).sort((a, b) => mo.indexOf(a.month) - mo.indexOf(b.month));
  }, [revenueData]);

  const t12mData = useMemo(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const idx = Math.max(0, revenueData.length - 12 + i);
      months.push({
        month: revenueData[idx].month.split(" ")[0].substring(0, 3),
        revenue: Math.round(revenueData[idx].revenue),
      });
    }
    return months;
  }, [revenueData]);

  const arrData = useMemo(() => {
    return filteredRevenue.map((d) => ({
      month: d.month.split(" ")[0].substring(0, 3),
      net: Math.round(d.netARR),
      gross: Math.round(d.grossARR),
    }));
  }, [filteredRevenue]);

  const annualData = useMemo(() => {
    const years = [...new Set(revenueData.map((d) => d.year))];
    return years.map((year) => {
      const yearData = revenueData.filter((d) => d.year === year);
      const yearRevenue = yearData.reduce((sum, d) => sum + d.revenue, 0);
      const yearNetARR = yearData.length > 0 ? yearData.reduce((sum, d) => sum + d.netARR, 0) / yearData.length : 0;
      const yearGrossARR = yearData.length > 0 ? yearData.reduce((sum, d) => sum + d.grossARR, 0) / yearData.length : 0;
      return {
        year,
        revenue: Math.round(yearRevenue),
        netARR: Math.round(yearNetARR),
        grossARR: Math.round(yearGrossARR),
      };
    });
  }, [revenueData]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <PillToggle options={years} selected={selectedYear} onChange={setSelectedYear} />
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <KpiCard label="Current Month" value={formatCurrency(currentMonthRevenue)} trend={`${momChange > 0 ? "+" : ""}${momChange.toFixed(1)}% MoM`} isPositive={momChange === 0 ? null : momChange > 0} />
          <KpiCard label="YTD Revenue" value={formatCurrency(ytdRevenue)} trend={`${yoyChange > 0 ? "+" : ""}${yoyChange.toFixed(1)}% YoY`} isPositive={yoyChange === 0 ? null : yoyChange > 0} />
          <KpiCard label="Trailing 12M" value={formatCurrency(trailing12M)} />
          <KpiCard label="Current Net ARR" value={formatCurrency(currentNetARR)} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="#1e293b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Year-over-Year Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yoyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickFormatter={(m) => m.substring(0, 3)} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Legend />
                {[...new Set(yoyData.flatMap(d => Object.keys(d)))].filter((k) => k.startsWith("Year")).sort().map((key, idx) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trailing 12 Months</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={t12mData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#1e293b" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">ARR Overview</h3>
              <PillToggle options={["net", "gross"]} selected={arrMode} onChange={setArrMode} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={arrData}>
                <defs>
                  <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#334155" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#334155" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Area type="monotone" dataKey={arrMode} stroke="#334155" fillOpacity={1} fill="url(#colorArr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Year</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Total Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Avg Net ARR</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Avg Gross ARR</th>
                </tr>
              </thead>
              <tbody>
                {annualData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{row.year}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(row.revenue)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(row.netARR)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(row.grossARR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Best Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(bestMonth.revenue)}</p>
            <p className="text-xs text-gray-600 mt-2">{bestMonth.month}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Worst Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(worstMonth.revenue)}</p>
            <p className="text-xs text-gray-600 mt-2">{worstMonth.month}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Current Gross ARR</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentGrossARR)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Lifetime Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(lifetimeRevenue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Clients Page
const ClientsPage = ({ revenueData, clientsData, isLiveData }) => {
  const [selectedYear, setSelectedYear] = useState("All Time");

  const years = useMemo(() => {
    const uniqueYears = Object.keys(clientsData).map(Number).sort((a, b) => a - b);
    return ["All Time", ...uniqueYears.map(String)];
  }, [clientsData]);

  const filteredClients = useMemo(() => {
    if (selectedYear === "All Time") {
      const allClients = {};
      Object.values(clientsData).forEach((yearClients) => {
        Object.entries(yearClients).forEach(([name, months]) => {
          if (!allClients[name]) allClients[name] = 0;
          allClients[name] += months.reduce((sum, m) => sum + m, 0);
        });
      });
      return allClients;
    }
    return clientsData[parseInt(selectedYear)] || {};
  }, [clientsData, selectedYear]);

  const totalClientRevenue = useMemo(() =>
    Object.values(filteredClients).reduce((sum, val) => sum + (typeof val === "number" ? val : val.reduce((s, m) => s + m, 0)), 0),
    [filteredClients]
  );

  const clientCount = Object.keys(filteredClients).length;

  const topClient = useMemo(() => {
    let max = { name: "", revenue: 0 };
    Object.entries(filteredClients).forEach(([name, val]) => {
      const rev = typeof val === "number" ? val : val.reduce((s, m) => s + m, 0);
      if (rev > max.revenue) max = { name, revenue: rev };
    });
    return max;
  }, [filteredClients]);

  const avgPerClient = clientCount > 0 ? totalClientRevenue / clientCount : 0;

  const pieData = useMemo(() => {
    return Object.entries(filteredClients)
      .map(([name, val]) => ({
        name,
        value: typeof val === "number" ? val : val.reduce((s, m) => s + m, 0),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredClients]);

  const monthlyStackedData = useMemo(() => {
    if (selectedYear === "All Time") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((month, idx) => {
        const row = { month };
        Object.values(clientsData).forEach((yearClients) => {
          Object.entries(yearClients).forEach(([clientName, monthlyValues]) => {
            row[clientName] = (row[clientName] || 0) + (monthlyValues[idx] || 0);
          });
        });
        return row;
      });
    } else {
      const year = parseInt(selectedYear);
      const yearClients = clientsData[year] || {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      return months.map((month, idx) => {
        const row = { month };
        Object.entries(yearClients).forEach(([name, monthlyValues]) => {
          row[name] = monthlyValues[idx] || 0;
        });
        return row;
      });
    }
  }, [clientsData, selectedYear]);

  const clientRevenue = useMemo(() => {
    return Object.entries(filteredClients)
      .map(([name, val]) => ({
        name,
        revenue: typeof val === "number" ? val : val.reduce((s, m) => s + m, 0),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredClients]);

  const clientNames = useMemo(() => {
    if (selectedYear === "All Time") {
      const allNames = new Set();
      Object.values(clientsData).forEach((yearClients) => {
        Object.keys(yearClients).forEach((name) => allNames.add(name));
      });
      return Array.from(allNames);
    } else {
      const year = parseInt(selectedYear);
      return Object.keys(clientsData[year] || {});
    }
  }, [clientsData, selectedYear]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <PillToggle options={years} selected={selectedYear} onChange={setSelectedYear} />
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <KpiCard label="Total Clients" value={clientCount.toString()} />
          <KpiCard label="Total Revenue" value={formatCurrency(totalClientRevenue)} />
          <KpiCard label="Top Client" value={topClient.name} />
          <KpiCard label="Avg per Client" value={formatCurrency(avgPerClient)} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Client Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${formatCurrency(value)}`} outerRadius={80} fill="#1e293b" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Client Revenue Table</h3>
            <div className="overflow-y-auto max-h-80">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Client</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {clientRevenue.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{row.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue by Client ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyStackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Legend />
              {clientNames.slice(0, 8).map((client, idx) => (
                <Bar key={client} dataKey={client} stackId="a" fill={COLORS[idx % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function VerbeDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [revenueData, setRevenueData] = useState(FALLBACK_REVENUE);
  const [clientsData, setClientsData] = useState(FALLBACK_CLIENTS);
  const [isLiveData, setIsLiveData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let hasLiveRevenue = false;
        let hasLiveClients = false;

        // Fetch lifetime revenue
        const revenueUrl = BASE_URL + SHEET_IDS.lifetimeRevenue + "&output=csv";
        try {
          const revenueResponse = await fetch(revenueUrl);
          const revenueCSV = await revenueResponse.text();
          const parsedRevenue = parseRevenueCSV(revenueCSV);
          if (parsedRevenue && parsedRevenue.length > 0) {
            setRevenueData(parsedRevenue);
            hasLiveRevenue = true;
          }
        } catch (err) {
          console.error("Failed to fetch revenue data:", err);
        }

        // Fetch clients data for all years
        const clientsDataTemp = {};
        for (const [key, sheetId] of Object.entries(SHEET_IDS)) {
          if (key.startsWith("clients")) {
            const yearNum = parseInt(key.replace("clients", ""));
            try {
              const clientUrl = BASE_URL + sheetId + "&output=csv";
              const clientResponse = await fetch(clientUrl);
              const clientCSV = await clientResponse.text();
              const parsedClients = parseClientsCSV(clientCSV);
              if (parsedClients && Object.keys(parsedClients).length > 0) {
                clientsDataTemp[yearNum] = parsedClients;
                hasLiveClients = true;
              }
            } catch (err) {
              console.error(`Failed to fetch clients data for ${yearNum}:`, err);
            }
          }
        }

        if (Object.keys(clientsDataTemp).length > 0) {
          setClientsData(clientsDataTemp);
        }

        if (hasLiveRevenue || hasLiveClients) {
          setIsLiveData(true);
        }
      } catch (error) {
        console.error("Failed to fetch data, using fallback:", error);
        setIsLiveData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const lastUpdate = revenueData.length > 0 ? revenueData[revenueData.length - 1].month : "Unknown";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isLiveData={isLiveData} lastUpdate={lastUpdate} />

      {activePage === "overview" && <OverviewPage revenueData={revenueData} clientsData={clientsData} isLiveData={isLiveData} />}
      {activePage === "clients" && <ClientsPage revenueData={revenueData} clientsData={clientsData} isLiveData={isLiveData} />}
    </div>
  );
}
