import React, { useEffect, useMemo} from "react";
import { data } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
  LineChart,
  Line, PieChart, Pie, Cell
} from "recharts";

const COLORS = [
    "#1E3A8A", // deep blue
    "#3B82F6", // bright blue
    "#334155", // dark gray (slate)
    "#94A3B8", // medium gray
    "#8B5E34", // deep brown
    "#B07D62", // mocha
    "#DDB892", // tan
    "#EAD7C0", // beige
    "#F7E6CF"  // linen
  ];
  
  
const fmt$ = (n) =>
  (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const Tip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
  
    return (
      <div style={{
        background: "#0f172a",
        color: "white",
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,.2)"
      }}>
        <div style={{ opacity: 0.8, marginBottom: 4 }}>{label}</div>
  
        {payload.map((p, i) => {
          const name = p.name ?? p.dataKey;
          const val = Number(p.value) || 0;
          const color = p.fill || p.color || "white";
  
          return (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                display: "inline-block",
                width: 8, height: 8, borderRadius: 9999, background: color
              }} />
              <span style={{ textTransform: "capitalize" }}>{name}:</span>
              <strong style={{ marginLeft: 4 }}>{fmt$(val)}</strong>
            </div>
          );
        })}
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
  const dataByMonth = new Map()
  const dataByCategory = new Map()

  const presentDay = new Date();
  for (let i = 5; i >= 0; i--) {
    const newMonth = new Date(presentDay.getFullYear(), presentDay.getMonth() - i);
    dataByMonth.set(monthKey(newMonth), {gain: 0, loss: 0, total: 0});
  }

  for (const expense of expenses) {
    const month = monthKey(expense.date);
    const data = dataByMonth.get(month);

    if (expense.value < 0) {
        data.loss -= expense.value;
        const added = expense.value * -1;
        if (!dataByCategory.has(expense.category)){
            dataByCategory.set(expense.category, {loss: added});
        } else {
            const categoryData = dataByCategory.get(expense.category);
            categoryData.loss -= expense.value;
        }
    } else {
        data.gain += expense.value;
    }

    data.total += expense.value;
  }

    const dataArray = Array.from(dataByMonth, ([month, stats]) => ({
        month,
        ...stats
    }));

    const pieData = Array.from(dataByCategory, ([name, stats]) => ({
        name,
        value: stats.loss,
    }));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "grid",
        gap: 8,
        fontSize: "10px",    
        filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2))",
      }}
    >
        {type === "gainloss" && <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    width="100%" 
                    height="100%" 
                    data={dataArray}
                    margin={{
                        top: 15,
                        right: 40,
                        left: 0,
                        bottom: 5,
                    }}>
                    <Bar dataKey="gain" fill="rgb(96 176 96)" />
                    <Bar dataKey="loss" fill="rgb(205 73 78)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<Tip />} cursor={{ fill: "rgba(0,0,0,0.05)"}}/>
                    </BarChart>
            </ResponsiveContainer>
        </>}

        {type === "total" && <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                width="100%" 
                height="100%" 
                data={dataArray}
                margin={{
                    top: 15,
                    right: 40,
                    left: 0,
                    bottom: 5,
                }}>
                <Line strokeWidth={3} type="monotone" dataKey="total" fill="rgb(55, 92, 167)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<Tip />}/>
                </LineChart>
        </ResponsiveContainer>
        </>}

        {type === "category" && <>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" 
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={1}
                        >
                        {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<Tip />}/>
                    <Legend 
                        layout="vertical"
                        align="left"
                        iconType="circle"
                        wrapperStyle={{ left: 15, top: "50%", transform: "translateY(-50%)", lineHeight: "20px"}}/>
                    
                </PieChart>
            </ResponsiveContainer>
      </>}
    </div>
  );
}
