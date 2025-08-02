import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EditProductForm } from '../../components/products/EditProductForm';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { EditProductInput } from '../../types/products';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id || '');
  const { updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EditProductInput) => {
    if (!product) return;
    
    setIsSubmitting(true);
    try {
      await updateProduct(product.productId, data);
      navigate(`/products/${product.productId}`);
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p className="font-medium">Error loading product</p>
          <p className="mt-1 text-sm">{error?.message || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Edit Product"
        description={`Editing ${product.name}`}
        breadcrumbs={[
          { label: 'Products', path: '/products' },
          { label: product.name, path: `/products/${product.productId}` },
          { label: 'Edit' }
        ]}
        actions={
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </button>
        }
      />

      <div className="mt-6">
        <div className="max-w-2xl mx-auto">
          <EditProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};