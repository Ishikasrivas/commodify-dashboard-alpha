
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Users,
  ShoppingCart
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '1,234',
      change: '+12%',
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+8%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Active Suppliers',
      value: '45',
      change: '+3%',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const recentActivity = [
    { action: 'Product Added', item: 'Organic Coffee Beans', time: '2 hours ago' },
    { action: 'Stock Updated', item: 'Premium Tea Leaves', time: '4 hours ago' },
    { action: 'New Supplier', item: 'Green Valley Farms', time: '1 day ago' },
    { action: 'Product Sold', item: 'Specialty Spices Set', time: '1 day ago' }
  ];

  const topProducts = [
    { name: 'Organic Coffee Beans', sales: 234, revenue: '$4,680' },
    { name: 'Premium Tea Leaves', sales: 187, revenue: '$3,740' },
    { name: 'Specialty Spices', sales: 156, revenue: '$3,120' },
    { name: 'Himalayan Salt', sales: 143, revenue: '$2,860' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <span className="font-bold text-green-600">{product.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <Package className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">View All Products</h3>
              <p className="text-sm text-muted-foreground">Manage your inventory</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">Sales Report</h3>
              <p className="text-sm text-muted-foreground">View detailed analytics</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <AlertTriangle className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">Check items running low</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
