import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  status?: string;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(data);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('products.title')}</h1>
        <Button onClick={() => navigate('/products/add')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addProduct')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('products.inventoryList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('products.noProductsFound')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">{t('products.name')}</th>
                  <th className="p-2">{t('products.category')}</th>
                  <th className="p-2">{t('products.price')}</th>
                  <th className="p-2">{t('products.quantity')}</th>
                  <th className="p-2">{t('products.supplier')}</th>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
