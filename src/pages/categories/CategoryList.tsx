import React, { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { CountryCode } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Loading } from '../../components/ui/Loading';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { CreateCategoryForm } from '../../components/categories/CreateCategoryForm';

interface CategoryListPageProps {
  selectedCountry: CountryCode;
}

export const CategoryListPage: React.FC<CategoryListPageProps> = ({ selectedCountry }) => {
  const { categories, loading, error } = useCategories(selectedCountry);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateCategory = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = (data: any) => {
    console.log('Creating category:', data);
    setShowCreateForm(false);
  };

  if (loading) {
    return <Loading text="Loading categories..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading categories</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Categories"
        description="Manage journey categories and classifications"
        breadcrumbs={[{ label: 'Categories' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        }
      />

      <div className="mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.categoryId}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {category.name}
                        </p>
                      </div>
                      {category.description && (
                        <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                      )}
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <CountryFlag countryCode={category.country} withName />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showCreateForm && (
        <CreateCategoryForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          initialCountry={selectedCountry}
        />
      )}
    </div>
  );
};