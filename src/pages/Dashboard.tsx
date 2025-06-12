// src/pages/Dashboard.tsx
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const sampleData = [
  { name: 'Jan', traffic: 4000, store: 2400, subscribers: 2400, unsubscribe: 200 },
  { name: 'Feb', traffic: 3000, store: 1398, subscribers: 2210, unsubscribe: 300 },
  { name: 'Mar', traffic: 2000, store: 9800, subscribers: 2290, unsubscribe: 150 },
  { name: 'Apr', traffic: 2780, store: 3908, subscribers: 2000, unsubscribe: 400 },
  { name: 'May', traffic: 1890, store: 4800, subscribers: 2181, unsubscribe: 350 },
  { name: 'Jun', traffic: 2390, store: 3800, subscribers: 2500, unsubscribe: 300 },
  { name: 'Jul', traffic: 3490, store: 4300, subscribers: 2100, unsubscribe: 250 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const cardClass = "rounded-2xl p-6 bg-background shadow-lg border border-border text-foreground";

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Estimated Earning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$112,893.00</p>
            <p className="text-sm text-green-500">+70.5% ↑ from last month</p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Estimated Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">+112,893.00</p>
            <p className="text-sm text-green-500">+70.5% ↑ compared to previous</p>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProgressBar label="All Traffic" value={93} color="red" />
            <ProgressBar label="Your Store" value={93} color="purple" />
            <ProgressBar label="User Subscriber" value={93} color="green" />
            <ProgressBar label="Unsubscribe" value={93} color="orange" />
          </CardContent>
        </Card>
      </div>

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle>Traffic Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Bar dataKey="traffic" fill="#00FF00" name="All Traffic" />
              <Bar dataKey="store" fill="#B800FF" name="Your Store" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="subscribers" stroke="#00FF00" name="User Subscriber" />
              <Line type="monotone" dataKey="unsubscribe" stroke="#FFA500" name="User Unsubscribe" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-muted h-2 rounded-full mt-1">
        <div
          className={`h-2 rounded-full`}
          style={{
            width: `${value}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    </div>
  );
}
