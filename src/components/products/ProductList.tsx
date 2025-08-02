import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MoreVertical, Edit, Trash2, 
  CreditCard, CheckCircle, XCircle, Plus, Eye
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/products';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface ProductListProps {
  onCreateNew: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onCreateNew }) => {
  const { products, loading, error, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !showActiveOnly || product.active;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading products</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Create your first credit-based product to get started with billing and subscriptions."
        icon={<CreditCard className="w-8 h-8 text-gray-400" />}
        actionLabel="Create Product"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active only</span>
              </label>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'name' | 'created' | 'updated');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created-desc">Newest first</option>
                <option value="created-asc">Oldest first</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="updated-desc">Recently updated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.productId} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      {product.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Initial Credits</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.creditAllocation?.initialCredits?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Starting Price</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.prices[0] ? formatCurrency(product.prices[0].unitAmount || 0) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pricing Options</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.prices.length} plan{product.prices.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Updated {formatDate(product.updatedAt)}
                </span>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/products/${product.productId}`}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  
                  <Link
                    to={`/products/${product.productId}/edit`}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Edit product"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products match your filters</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};