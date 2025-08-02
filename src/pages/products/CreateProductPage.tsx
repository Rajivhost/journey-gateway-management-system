import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { CreateProductForm } from '../../components/products/CreateProductForm';
import { useProducts } from '../../hooks/useProducts';
import { CreateCreditProductInput } from '../../types/products';

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateCreditProductInput) => {
    setIsSubmitting(true);
    try {
      const product = await createProduct(data);
      navigate(`/products/${product.productId}`);
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Create Credit Product"
        description="Set up a new credit-based product with pricing and allocation rules"
        breadcrumbs={[
          { label: 'Products', path: '/products' },
          { label: 'Create Product' }
        ]}
        actions={
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        }
      />

      <div className="mt-6">
        <CreateProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};