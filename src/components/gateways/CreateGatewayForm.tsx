import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CountryCode, JourneyGatewayType, Carrier } from '../../types';
import { CountrySelector } from '../ui/CountrySelector';
import { useCarriers } from '../../hooks/useCarriers';
import { Loading } from '../ui/Loading';

interface CreateGatewayFormProps {
  onClose: () => void;
  onSubmit: (formData: GatewayFormData) => void;
  initialCountry: CountryCode;
}

export interface GatewayFormData {
  name: string;
  carrierId: string;
  country: CountryCode;
  shortCode: string;
  gatewayType: JourneyGatewayType;
  description: string;
}

export const CreateGatewayForm: React.FC<CreateGatewayFormProps> = ({
  onClose,
  onSubmit,
  initialCountry
}) => {
  const [formData, setFormData] = useState<GatewayFormData>({
    name: '',
    carrierId: '',
    country: initialCountry,
    shortCode: '',
    gatewayType: JourneyGatewayType.MULTI_PROVIDER,
    description: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GatewayFormData, string>>>({});
  const { carriers, loading, error } = useCarriers(formData.country);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GatewayFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Gateway name is required';
    }
    
    if (!formData.carrierId) {
      newErrors.carrierId = 'Carrier is required';
    }
    
    if (!formData.shortCode.trim()) {
      newErrors.shortCode = 'Short code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof GatewayFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCountryChange = (country: CountryCode) => {
    setFormData(prev => ({ ...prev, country, carrierId: '' }));
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Gateway</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                <p className="font-medium">Error loading carriers</p>
                <p className="mt-1 text-sm">{error.message}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Gateway Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
                    ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <CountrySelector
                  value={formData.country}
                  onChange={handleCountryChange}
                  label="Country"
                />
              </div>
              
              <div>
                <label htmlFor="carrierId" className="block text-sm font-medium text-gray-700">
                  Carrier <span className="text-red-500">*</span>
                </label>
                {loading ? (
                  <Loading size="sm" text="Loading carriers..." />
                ) : (
                  <>
                    <select
                      id="carrierId"
                      name="carrierId"
                      value={formData.carrierId}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
                        ${errors.carrierId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    >
                      <option value="">Select Carrier</option>
                      {carriers.map((carrier) => (
                        <option key={carrier.carrierId} value={carrier.carrierId}>
                          {carrier.name} ({carrier.code})
                        </option>
                      ))}
                    </select>
                    {errors.carrierId && <p className="mt-1 text-sm text-red-600">{errors.carrierId}</p>}
                  </>
                )}
              </div>
              
              <div>
                <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">
                  Short Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="shortCode"
                  name="shortCode"
                  value={formData.shortCode}
                  onChange={handleChange}
                  placeholder="e.g. *123#, 8080"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
                    ${errors.shortCode ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                />
                {errors.shortCode && <p className="mt-1 text-sm text-red-600">{errors.shortCode}</p>}
              </div>
              
              <div>
                <label htmlFor="gatewayType" className="block text-sm font-medium text-gray-700">
                  Gateway Type
                </label>
                <select
                  id="gatewayType"
                  name="gatewayType"
                  value={formData.gatewayType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={JourneyGatewayType.MULTI_PROVIDER}>Multi Provider</option>
                  <option value={JourneyGatewayType.SINGLE_PROVIDER}>Single Provider</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Gateway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};