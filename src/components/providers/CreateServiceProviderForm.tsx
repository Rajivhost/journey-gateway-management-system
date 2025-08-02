import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload } from 'lucide-react';
import { CountryCode, CreateServiceProviderInput, createServiceProviderSchema } from '../../types';
import { CountrySelector } from '../ui/CountrySelector';

interface CreateServiceProviderFormProps {
  onClose: () => void;
  onSubmit: (data: CreateServiceProviderInput) => void;
  initialCountry: CountryCode;
}

export const CreateServiceProviderForm: React.FC<CreateServiceProviderFormProps> = ({
  onClose,
  onSubmit,
  initialCountry
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateServiceProviderInput>({
    resolver: zodResolver(createServiceProviderSchema),
    defaultValues: {
      country: initialCountry,
    }
  });

  const handleCountryChange = (country: CountryCode) => {
    setValue('country', country);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Service Provider</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Company Logo */}
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                  Company Logo URL
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="url"
                    id="logoUrl"
                    {...register('logoUrl')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://example.com/logo.png"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </button>
                </div>
                {errors.logoUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Recommended size: 200x200px. Supported formats: PNG, JPG, SVG</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <CountrySelector
                    value={watch('country')}
                    onChange={handleCountryChange}
                    label="Country"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    {...register('companyName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyRegistrationNumber"
                    {...register('companyRegistrationNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.companyRegistrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyRegistrationNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    {...register('website')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    {...register('businessType')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select business type</option>
                    <option value="Financial Technology">Financial Technology</option>
                    <option value="Payment Processing">Payment Processing</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Banking">Banking</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Cryptocurrency">Cryptocurrency</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700">
                    Year Established
                  </label>
                  <input
                    type="number"
                    id="yearEstablished"
                    min="1800"
                    max={new Date().getFullYear()}
                    {...register('yearEstablished', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.yearEstablished && (
                    <p className="mt-1 text-sm text-red-600">{errors.yearEstablished.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700">
                    Number of Employees
                  </label>
                  <select
                    id="numberOfEmployees"
                    {...register('numberOfEmployees')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5</option>
                    <option value="6-10">6-10</option>
                    <option value="11-25">11-25</option>
                    <option value="26-50">26-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-250">101-250</option>
                    <option value="251-500">251-500</option>
                    <option value="500+">500+</option>
                  </select>
                  {errors.numberOfEmployees && (
                    <p className="mt-1 text-sm text-red-600">{errors.numberOfEmployees.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700">
                    Annual Revenue
                  </label>
                  <select
                    id="annualRevenue"
                    {...register('annualRevenue')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select range</option>
                    <option value="Under $100K">Under $100K</option>
                    <option value="$100K - $500K">$100K - $500K</option>
                    <option value="$500K - $1M">$500K - $1M</option>
                    <option value="$1M - $5M">$1M - $5M</option>
                    <option value="$5M - $10M">$5M - $10M</option>
                    <option value="$10M+">$10M+</option>
                  </select>
                  {errors.annualRevenue && (
                    <p className="mt-1 text-sm text-red-600">{errors.annualRevenue.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register('address')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    id="operatingHours"
                    {...register('operatingHours')}
                    placeholder="e.g., Monday-Friday 9AM-5PM"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.operatingHours && (
                    <p className="mt-1 text-sm text-red-600">{errors.operatingHours.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    {...register('emergencyContact')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    {...register('contactPerson')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    {...register('contactEmail')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    {...register('contactPhone')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
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
              Create Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};