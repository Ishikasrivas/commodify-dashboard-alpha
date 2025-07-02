import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db } from '@/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export const AddProduct: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    supplier: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Beverages',
    'Seasonings',
    'Grains',
    'Dairy',
    'Meat',
    'Vegetables',
    'Fruits',
    'Snacks',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const status =
        Number(formData.quantity) === 0
          ? 'out-of-stock'
          : Number(formData.quantity) <= 5
          ? 'low-stock'
          : 'in-stock';

      await addDoc(collection(db, 'products'), {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        supplier: formData.supplier.trim(),
        description: formData.description.trim(),
        updated_at: serverTimestamp(),
        status: status,
      });

      toast({
        title: t('addProduct.productSavedSuccess'),
        description: `${formData.name} has been added to the inventory.`,
      });

      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: t('common.error'),
        description: t('addProduct.saveFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/products')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{t('addProduct.title')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('addProduct.productName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('addProduct.enterProductName')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('addProduct.productCategory')} *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-background ${
                    errors.category ? 'border-red-500' : 'border-input'
                  }`}
                >
                  <option value="">{t('addProduct.enterCategory')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t('addProduct.productPrice')} ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder={t('addProduct.enterPrice')}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('addProduct.productQuantity')} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder={t('addProduct.enterQuantity')}
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">{t('addProduct.supplierName')} *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder={t('addProduct.enterSupplier')}
                className={errors.supplier ? 'border-red-500' : ''}
              />
              {errors.supplier && (
                <p className="text-sm text-red-500">{errors.supplier}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <Alert>
              <AlertDescription>
                All fields marked with * are required. Make sure to provide accurate information for proper inventory management.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/products')}
                disabled={isLoading}
              >
                {t('addProduct.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('addProduct.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t('addProduct.save')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
