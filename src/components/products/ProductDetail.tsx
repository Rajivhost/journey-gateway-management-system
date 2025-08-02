import React, { useState } from 'react';
import { 
  CreditCard, Users, RefreshCw, Clock, DollarSign, 
  Edit, Trash2, Plus, MoreVertical, CheckCircle, 
  XCircle, Calendar, TrendingUp, Activity
} from 'lucide-react';
import { Product, CreditCarryOverPolicy } from '../../types/products';
import { Loading } from '../ui/Loading';
import { CreatePriceForm } from './CreatePriceForm';
import { usePrices } from '../../hooks/usePrices';

interface ProductDetailProps {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  onEdit: () => void;
  onDelete: () => void;
  onAddPrice: () => void;
  onRefresh?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  loading,
  error,
  onEdit,
  onDelete,
  onAddPrice,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'analytics'>('overview');
  const [showCreatePriceForm, setShowCreatePriceForm] = useState(false);
  const [isSubmittingPrice, setIsSubmittingPrice] = useState(false);
  
  const { createPrice } = usePrices(product?.productId || '');

  if (loading) {
    return <Loading text="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading product</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">Product not found</p>
        <p className="mt-1 text-sm">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCarryOverPolicyDescription = (policy: CreditCarryOverPolicy, value?: number) => {
    switch (policy) {
      case CreditCarryOverPolicy.NONE:
        return 'Credits expire and do not carry over';
      case CreditCarryOverPolicy.FULL:
        return 'All unused credits carry over to the next period';
      case CreditCarryOverPolicy.PERCENTAGE:
        return `${value || 0}% of unused credits carry over`;
      case CreditCarryOverPolicy.CAPPED:
        return `Up to ${value || 0} credits can carry over`;
      default:
        return 'Unknown policy';
    }
  };

  const handleAddPrice = () => {
    setShowCreatePriceForm(true);
  };

  const handleCreatePriceSubmit = async (data: any) => {
    setIsSubmittingPrice(true);
    try {
      await createPrice({
        productId: product.productId,
        ...data
      });
      setShowCreatePriceForm(false);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to create price:', error);
    } finally {
      setIsSubmittingPrice(false);
    }
  };

  const mockStats = {
    activeSubscriptions: 28,
    totalRevenue: 2100000,
    creditsIssued: 140000,
    creditsUsed: 98500,
    averageUsage: 85.2
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Product Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
          </div>
          <div className="flex items-center space-x-2">
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
            <button 
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Product Name</h4>
              <p className="mt-1 text-sm text-gray-900">{product.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Product Type</h4>
              <p className="mt-1 text-sm text-gray-900">Credit-Based</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <p className="mt-1 text-sm text-gray-900">{product.country}</p>
            </div>
            
            {product.description && (
              <div className="sm:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm text-gray-900">{product.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>Last Updated: {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Allocation Card */}
      {product.creditAllocation && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <RefreshCw className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Credit Allocation</h3>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Initial Credits</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {product.creditAllocation.initialCredits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Credits given on signup</p>
              </div>
              
              {product.creditAllocation.renewalCredits && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Renewal Credits</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {product.creditAllocation.renewalCredits.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Credits given on renewal</p>
                </div>
              )}
              
              {product.creditAllocation.expiryPeriod && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Credit Expiry</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {product.creditAllocation.expiryPeriod}
                  </p>
                  <p className="text-xs text-gray-500">Days until expiry</p>
                </div>
              )}
              
              <div className="sm:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium text-gray-500">Carry-Over Policy</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {getCarryOverPolicyDescription(
                    product.creditAllocation.carryOverPolicy,
                    product.creditAllocation.carryOverValue
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
                  <dd className="text-lg font-medium text-gray-900">{mockStats.activeSubscriptions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(mockStats.totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Credits Issued</dt>
                  <dd className="text-lg font-medium text-gray-900">{mockStats.creditsIssued.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Usage Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{mockStats.averageUsage}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pricing Plans</h3>
        <button
          onClick={handleAddPrice}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Price Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {product.prices.map((price) => (
          <div key={price.priceId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{price.name}</h4>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(price.unitAmount || 0)}
                  </span>
                  {price.recurring && (
                    <span className="ml-1 text-sm text-gray-500">
                      /{price.recurring.interval.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900 capitalize">{price.priceType.toLowerCase().replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Billing Scheme</span>
                  <span className="text-gray-900 capitalize">{price.billingScheme.toLowerCase().replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    price.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {price.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {price.recurring && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interval</span>
                      <span className="text-gray-900 capitalize">
                        Every {price.recurring.intervalCount} {price.recurring.interval.toLowerCase()}
                        {price.recurring.intervalCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {price.recurring.trialPeriodDays && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trial Period</span>
                        <span className="text-gray-900">{price.recurring.trialPeriodDays} days</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Created {formatDate(price.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {product.prices.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pricing plans</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a pricing plan for this product.</p>
          <div className="mt-6">
            <button
              onClick={handleAddPrice}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Price Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">
          Detailed analytics and usage reports will be available here.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Credit-based product • {product.country}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </button>
            
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: CreditCard },
              { id: 'pricing', name: 'Pricing', icon: DollarSign },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'pricing' && renderPricingTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>

      {/* Create Price Form Modal */}
      {showCreatePriceForm && (
        <CreatePriceForm
          productId={product.productId}
          onClose={() => setShowCreatePriceForm(false)}
          onSubmit={handleCreatePriceSubmit}
          isSubmitting={isSubmittingPrice}
        />
      )}
    </div>
  );
};