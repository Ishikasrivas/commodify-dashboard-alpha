import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const EditProduct = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    supplier: '',
    description: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      } else {
        toast({ title: t('addProduct.productNotFound'), variant: 'destructive' });
        navigate('/products');
      }
    };

    if (id) fetchProduct();
  }, [id, navigate, t]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const status =
        Number(formData.quantity) === 0
          ? 'out-of-stock'
          : Number(formData.quantity) <= 5
          ? 'low-stock'
          : 'in-stock';

      await updateDoc(doc(db, 'products', id!), {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        updated_at: serverTimestamp(),
        status,
      });

      toast({ title: t('addProduct.productUpdatedSuccess') });
      navigate('/products');
    } catch (err) {
      toast({ title: t('addProduct.updateFailed'), variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">{t('addProduct.editProduct')}</h2>
      <Input value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder={t('addProduct.enterProductName')} />
      <Input value={formData.category} onChange={e => handleChange('category', e.target.value)} placeholder={t('addProduct.enterCategory')} />
      <Input value={formData.price} onChange={e => handleChange('price', e.target.value)} placeholder={t('addProduct.enterPrice')} type="number" />
      <Input value={formData.quantity} onChange={e => handleChange('quantity', e.target.value)} placeholder={t('addProduct.enterQuantity')} type="number" />
      <Input value={formData.supplier} onChange={e => handleChange('supplier', e.target.value)} placeholder={t('addProduct.enterSupplier')} />
      <Input value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder={t('addProduct.enterDescription')} />
      <Button onClick={handleUpdate}>{t('addProduct.updateProduct')}</Button>
    </div>
  );
};

export default EditProduct;
