import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Pencil, Trash2, Plus, Layers, X, ChevronDown, ChevronRight, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  status?: string;
  availableForBuying?: boolean;
}

type GroupBy = 'none' | 'category' | 'supplier';

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [supplierBuyingStatus, setSupplierBuyingStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        availableForBuying: true, // Default to true for existing products
        ...doc.data(),
      })) as Product[];

      setProducts(data);
      
      // Initialize supplier buying status
      const supplierStatus: Record<string, boolean> = {};
      data.forEach(product => {
        if (!supplierStatus.hasOwnProperty(product.supplier)) {
          // Set supplier status based on whether any product from this supplier is available for buying
          supplierStatus[product.supplier] = data
            .filter(p => p.supplier === product.supplier)
            .some(p => p.availableForBuying !== false);
        }
      });
      setSupplierBuyingStatus(supplierStatus);
    } catch (err) {
      toast({ title: t('products.failedToLoadProducts'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;

    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: t('products.productDeletedSuccess') });
    } catch (err) {
      toast({ title: t('products.deleteFailed'), variant: 'destructive' });
    }
  };

  const handleProductBuyingToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'products', productId), {
        availableForBuying: newStatus
      });

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, availableForBuying: newStatus }
          : product
      ));

      toast({ 
        title: newStatus ? t('products.productBuyingEnabled') : t('products.productBuyingDisabled')
      });
    } catch (err) {
      toast({ title: 'Failed to update buying status', variant: 'destructive' });
    }
  };

  const handleSupplierBuyingToggle = async (supplier: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const batch = writeBatch(db);
      
      // Get all products from this supplier
      const supplierProducts = products.filter(p => p.supplier === supplier);
      
      // Update all products from this supplier
      supplierProducts.forEach(product => {
        const productRef = doc(db, 'products', product.id);
        batch.update(productRef, { availableForBuying: newStatus });
      });

      await batch.commit();

      // Update local state
      setProducts(prev => prev.map(product => 
        product.supplier === supplier 
          ? { ...product, availableForBuying: newStatus }
          : product
      ));

      setSupplierBuyingStatus(prev => ({
        ...prev,
        [supplier]: newStatus
      }));

      toast({ 
        title: newStatus ? t('products.supplierBuyingEnabled') : t('products.supplierBuyingDisabled')
      });
    } catch (err) {
      toast({ title: 'Failed to update supplier buying status', variant: 'destructive' });
    }
  };

  const handleGroupBy = (type: GroupBy) => {
    if (groupBy === type) {
      setGroupBy('none');
      setExpandedGroups(new Set());
    } else {
      setGroupBy(type);
      // Auto-expand all groups when grouping is applied
      const groups = getGroupedProducts(type);
      setExpandedGroups(new Set(Object.keys(groups)));
    }
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getGroupedProducts = (type: GroupBy) => {
    if (type === 'none') return {};
    
    return products.reduce((groups, product) => {
      const key = type === 'category' ? product.category : product.supplier;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(product);
      return groups;
    }, {} as Record<string, Product[]>);
  };

  const renderGroupedTable = () => {
    const groupedProducts = getGroupedProducts(groupBy);
    
    return (
      <div className="space-y-4">
        {Object.entries(groupedProducts).map(([groupKey, groupProducts]) => (
          <div key={groupKey} className="border rounded-lg">
            <div 
              className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted/70 rounded-t-lg"
              onClick={() => toggleGroup(groupKey)}
            >
              <div className="flex items-center gap-2">
                {expandedGroups.has(groupKey) ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
                <h3 className="font-semibold text-lg">{groupKey}</h3>
                <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                  {groupProducts.length} {t('products.totalItems')}
                </span>
              </div>
              
              {/* Supplier-level toggle when grouped by supplier */}
              {groupBy === 'supplier' && (
                <div className="flex items-center gap-2 mr-4" onClick={(e) => e.stopPropagation()}>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t('products.availableForBuying')}:</span>
                  <Switch
                    checked={supplierBuyingStatus[groupKey] || false}
                    onCheckedChange={() => handleSupplierBuyingToggle(groupKey, supplierBuyingStatus[groupKey] || false)}
                    title={t('products.toggleBuyingStatus')}
                  />
                </div>
              )}
            </div>
            
            {expandedGroups.has(groupKey) && (
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">{t('products.name')}</th>
                      {groupBy !== 'category' && <th className="p-2">{t('products.category')}</th>}
                      <th className="p-2">{t('products.price')}</th>
                      <th className="p-2">{t('products.quantity')}</th>
                      {groupBy !== 'supplier' && <th className="p-2">{t('products.supplier')}</th>}
                      <th className="p-2">{t('products.availableForBuying')}</th>
                      <th className="p-2">{t('products.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{product.name}</td>
                        {groupBy !== 'category' && <td className="p-2">{product.category}</td>}
                        <td className="p-2">${product.price.toFixed(2)}</td>
                        <td className="p-2">{product.quantity}</td>
                        {groupBy !== 'supplier' && <td className="p-2">{product.supplier}</td>}
                        <td className="p-2">
                          <Switch
                            checked={product.availableForBuying !== false}
                            onCheckedChange={() => handleProductBuyingToggle(product.id, product.availableForBuying !== false)}
                            title={t('products.toggleBuyingStatus')}
                          />
                        </td>
                        <td className="p-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRegularTable = () => (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="p-2">{t('products.name')}</th>
          <th className="p-2 relative">
            <div className="flex items-center gap-2">
              {t('products.category')}
              <Button
                size="sm"
                variant={groupBy === 'category' ? 'default' : 'ghost'}
                onClick={() => handleGroupBy('category')}
                className="h-6 w-6 p-0"
                title={t('products.groupByCategory')}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </th>
          <th className="p-2">{t('products.price')}</th>
          <th className="p-2">{t('products.quantity')}</th>
          <th className="p-2 relative">
            <div className="flex items-center gap-2">
              {t('products.supplier')}
              <Button
                size="sm"
                variant={groupBy === 'supplier' ? 'default' : 'ghost'}
                onClick={() => handleGroupBy('supplier')}
                className="h-6 w-6 p-0"
                title={t('products.groupBySupplier')}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </th>
          <th className="p-2">{t('products.availableForBuying')}</th>
          <th className="p-2">{t('products.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b hover:bg-muted/50">
            <td className="p-2">{product.name}</td>
            <td className="p-2">{product.category}</td>
            <td className="p-2">${product.price.toFixed(2)}</td>
            <td className="p-2">{product.quantity}</td>
            <td className="p-2">{product.supplier}</td>
            <td className="p-2">
              <Switch
                checked={product.availableForBuying !== false}
                onCheckedChange={() => handleProductBuyingToggle(product.id, product.availableForBuying !== false)}
                title={t('products.toggleBuyingStatus')}
              />
            </td>
            <td className="p-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/products/edit/${product.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('products.title')}</h1>
        <div className="flex items-center gap-2">
          {groupBy !== 'none' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGroupBy('none')}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {t('products.clearGrouping')}
            </Button>
          )}
          <Button onClick={() => navigate('/products/add')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addProduct.title')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('products.inventoryList')}
            {groupBy !== 'none' && (
              <span className="text-sm font-normal text-muted-foreground">
                {t('products.groupBy')}: {groupBy === 'category' ? t('products.category') : t('products.supplier')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('products.noProductsFound')}</p>
          ) : groupBy !== 'none' ? (
            renderGroupedTable()
          ) : (
            renderRegularTable()
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
