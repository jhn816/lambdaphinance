import React, { useEffect, useMemo} from "react";
import { data } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from "recharts";

const sample = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

const fmt$ = (n) =>
  (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Simple, clean tooltip
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a",
      color: "white",
      padding: "8px 10px",
      borderRadius: 10,
      fontSize: 12,
      boxShadow: "0 6px 20px rgba(0,0,0,.2)"
    }}>
      <div style={{ opacity: .8, marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{fmt$(payload[0].value)}</div>
    </div>
  );
};

const monthKey = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`; // e.g., "2025-08"
  };

export default function ExpenseChart({expenses, type}) {
  const avg = useMemo(() => {
    const s = sample.reduce((a, c) => a + c.value, 0);
    return s / sample.length;
  }, []);

  const dataByMonth = new Map()
  const presentDay = new Date();
  for (let i = 0; i < 6; i++) {
    const newMonth = new Date(presentDay.getFullYear(), presentDay.getMonth() - i);
    dataByMonth.set(monthKey(newMonth), {gain: 0, loss: 0, total: 0})
  }

  for (const expense of expenses) {
    const month = monthKey(expense.date);
    const data = dataByMonth.get(month);

    if (expense.value < 0) {
        data.loss -= expense.value;
    } else {
        data.gain += expense.value;
    }

    data.total += expense.value;
  }

  const dataArray = Array.from(dataByMonth, ([month, stats]) => ({
    month,
    ...stats
  }));

  console.log(dataArray);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "grid",
        gap: 8,
        fontSize: "10px"
      }}
    >
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                width="100%" 
                height="100%" 
                data={dataArray}
                margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}>
            {type === "gainloss" && <>
            <Bar dataKey="gain" fill="#12b412" />
            <Bar dataKey="loss" fill="#f35858" />
            </>}
            {type === "total" && <Bar dataKey="total" fill="rgb(55, 92, 167)" />}
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
