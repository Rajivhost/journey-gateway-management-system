import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ProductDetail } from '../../components/products/ProductDetail';
import { EditProductForm } from '../../components/products/EditProductForm';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { EditProductInput } from '../../types/products';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id || '');
  const { updateProduct, deleteProduct } = useProducts();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data: EditProductInput) => {
    if (!product) return;
    
    setIsSubmitting(true);
    try {
      await updateProduct(product.productId, data);
      setShowEditForm(false);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(product.productId);
        navigate('/products');
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleAddPrice = () => {
    // This will be handled by the ProductDetail component
    console.log('Add price plan');
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={product ? product.name : 'Product Details'}
        description={product ? `Credit-based product • ${product.country}` : 'Loading product information...'}
        breadcrumbs={[
          { label: 'Products', path: '/products' },
          { label: product ? product.name : 'Product Details' }
        ]}
        actions={
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        }
      />

      <div className="mt-6">
        <ProductDetail
          key={refreshKey}
          product={product}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddPrice={handleAddPrice}
          onRefresh={handleRefresh}
        />
      </div>

      {showEditForm && product && (
        <EditProductForm
          product={product}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};