import React from 'react';
import { 
  CreditCard, Smartphone, Building, MoreVertical, 
  CheckCircle, Clock, AlertTriangle, Star 
} from 'lucide-react';
import { PaymentMethod, PaymentMethodType, PaymentMethodStatus } from '../../types/payments';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit: (paymentMethod: PaymentMethod) => void;
  onDelete: (paymentMethodId: string) => void;
  onSetDefault: (paymentMethodId: string) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onEdit,
  onDelete,
  onSetDefault
}) => {
  const getTypeIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CARD:
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case PaymentMethodType.MOBILE_MONEY:
        return <Smartphone className="h-6 w-6 text-green-600" />;
      case PaymentMethodType.BANK_ACCOUNT:
        return <Building className="h-6 w-6 text-purple-600" />;
    }
  };

  const getStatusBadge = (status: PaymentMethodStatus) => {
    switch (status) {
      case PaymentMethodStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case PaymentMethodStatus.PENDING_VERIFICATION:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case PaymentMethodStatus.EXPIRED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </span>
        );
      case PaymentMethodStatus.INACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        );
    }
  };

  const getDisplayInfo = () => {
    switch (paymentMethod.type) {
      case PaymentMethodType.CARD:
        return {
          title: `${paymentMethod.cardBrand?.toUpperCase()} •••• ${paymentMethod.cardLast4}`,
          subtitle: `Expires ${paymentMethod.cardExpiryMonth}/${paymentMethod.cardExpiryYear}`,
          details: paymentMethod.cardHolderName
        };
      case PaymentMethodType.MOBILE_MONEY:
        return {
          title: paymentMethod.mobileProvider || 'Mobile Money',
          subtitle: paymentMethod.phoneNumber,
          details: paymentMethod.accountName
        };
      case PaymentMethodType.BANK_ACCOUNT:
        return {
          title: paymentMethod.bankName || 'Bank Account',
          subtitle: `•••• ${paymentMethod.accountNumber?.slice(-4)}`,
          details: paymentMethod.accountHolderName
        };
    }
  };

  const displayInfo = getDisplayInfo();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {getTypeIcon(paymentMethod.type)}
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">{displayInfo.title}</h3>
              {paymentMethod.isDefault && (
                <Star className="h-4 w-4 text-yellow-500 ml-2 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-600">{displayInfo.subtitle}</p>
            {displayInfo.details && (
              <p className="text-sm text-gray-500">{displayInfo.details}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusBadge(paymentMethod.status)}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Added:</span>
          <span>{formatDate(paymentMethod.createdAt)}</span>
        </div>
        {paymentMethod.lastUsed && (
          <div className="flex justify-between">
            <span>Last used:</span>
            <span>{formatDate(paymentMethod.lastUsed)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onEdit(paymentMethod)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit
        </button>
        
        {!paymentMethod.isDefault && paymentMethod.status === PaymentMethodStatus.ACTIVE && (
          <button
            onClick={() => onSetDefault(paymentMethod.paymentMethodId)}
            className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Set Default
          </button>
        )}
        
        <button
          onClick={() => onDelete(paymentMethod.paymentMethodId)}
          className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};