"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0066E6", "#0B2A55", "#16A34A", "#F59E0B", "#EF4444", "#7C3AED"];

export function AnalyticsChart({
  type,
  data,
  xKey,
  yKey,
  nameKey,
}: {
  type: "bar" | "line" | "donut";
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  nameKey?: string;
}) {
  if (type === "donut") {
    return (
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={nameKey || xKey}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#0066E6"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={yKey} fill="#0066E6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
