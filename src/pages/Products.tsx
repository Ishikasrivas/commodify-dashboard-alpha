
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Package,
  Filter
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Organic Coffee Beans',
        category: 'Beverages',
        price: 24.99,
        quantity: 150,
        supplier: 'Green Mountain Co.',
        description: 'Premium organic coffee beans from sustainable farms',
        lastUpdated: '2024-01-15',
        status: 'in-stock'
      },
      {
        id: '2',
        name: 'Premium Tea Leaves',
        category: 'Beverages',
        price: 18.50,
        quantity: 8,
        supplier: 'Tea Gardens Ltd.',
        description: 'High-quality loose leaf tea varieties',
        lastUpdated: '2024-01-14',
        status: 'low-stock'
      },
      {
        id: '3',
        name: 'Specialty Spices Set',
        category: 'Seasonings',
        price: 32.00,
        quantity: 0,
        supplier: 'Spice World Inc.',
        description: 'Curated collection of exotic spices',
        lastUpdated: '2024-01-13',
        status: 'out-of-stock'
      },
      {
        id: '4',
        name: 'Himalayan Salt',
        category: 'Seasonings',
        price: 12.75,
        quantity: 200,
        supplier: 'Mountain Minerals',
        description: 'Pure pink Himalayan rock salt',
        lastUpdated: '2024-01-12',
        status: 'in-stock'
      },
      {
        id: '5',
        name: 'Quinoa Grain',
        category: 'Grains',
        price: 15.99,
        quantity: 45,
        supplier: 'Healthy Grains Co.',
        description: 'Organic quinoa for healthy meals',
        lastUpdated: '2024-01-11',
        status: 'in-stock'
      }
    ];
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <Button 
          onClick={() => navigate('/products/add')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, categories, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge className={getStatusColor(product.status)}>
                  {getStatusText(product.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span>
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p className={`font-bold ${product.quantity < 10 ? 'text-red-600' : 'text-foreground'}`}>
                    {product.quantity}
                  </p>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Supplier:</span>
                <p className="text-muted-foreground">{product.supplier}</p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(product.lastUpdated).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Package className="h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first product.'
              }
            </p>
            <Button onClick={() => navigate('/products/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
