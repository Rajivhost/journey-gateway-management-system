import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ProductList } from '../../components/products/ProductList';

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/products/new');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Credit Products"
        description="Manage your credit-based products and pricing plans"
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Product
          </button>
        }
      />

      <div className="mt-6">
        <ProductList onCreateNew={handleCreateNew} />
      </div>
    </div>
  );
};