import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { CountryCode, JourneyCategory } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { Loading } from '../ui/Loading';

interface ManageMenusFormProps {
  onClose: () => void;
  onSubmit: (formData: MenuFormData[]) => void;
  initialMenus: MenuFormData[];
  gatewayId: string;
  country: CountryCode;
}

export interface MenuFormData {
  menuText: string;
  position: number;
  categoryId?: string;
  description?: string;
  active: boolean;
}

export const ManageMenusForm: React.FC<ManageMenusFormProps> = ({
  onClose,
  onSubmit,
  initialMenus,
  gatewayId,
  country
}) => {
  const [menus, setMenus] = useState<MenuFormData[]>(initialMenus);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const { categories, loading: categoriesLoading } = useCategories(country);

  const validateMenus = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    menus.forEach((menu, index) => {
      const menuErrors: Record<string, string> = {};

      if (!menu.menuText.trim()) {
        menuErrors.menuText = 'Menu text is required';
        isValid = false;
      }

      if (Object.keys(menuErrors).length > 0) {
        newErrors[index] = menuErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateMenus()) {
      onSubmit(menus);
    }
  };

  const addNewMenu = () => {
    setMenus([
      ...menus,
      {
        menuText: '',
        position: menus.length + 1,
        active: true,
        description: ''
      }
    ]);
  };

  const removeMenu = (index: number) => {
    setMenus(menus.filter((_, i) => i !== index));
    // Update positions after removal
    setMenus(prev => 
      prev.map((menu, i) => ({
        ...menu,
        position: i + 1
      }))
    );
  };

  const updateMenu = (index: number, field: keyof MenuFormData, value: string | boolean) => {
    setMenus(prev => prev.map((menu, i) => 
      i === index ? { ...menu, [field]: value } : menu
    ));
    
    // Clear error when field is edited
    if (errors[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Gateway Menus</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 max-h-[calc(100vh-250px)] overflow-y-auto">
            {categoriesLoading ? (
              <Loading text="Loading categories..." />
            ) : (
              <div className="space-y-6">
                {menus.map((menu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {menu.position}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMenu(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Menu Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={menu.menuText}
                          onChange={(e) => updateMenu(index, 'menuText', e.target.value)}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm 
                            ${errors[index]?.menuText ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                        />
                        {errors[index]?.menuText && (
                          <p className="mt-1 text-sm text-red-600">{errors[index].menuText}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={menu.categoryId || ''}
                          onChange={(e) => updateMenu(index, 'categoryId', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">No Category</option>
                          {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={menu.description || ''}
                          onChange={(e) => updateMenu(index, 'description', e.target.value)}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-${index}`}
                          checked={menu.active}
                          onChange={(e) => updateMenu(index, 'active', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`active-${index}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNewMenu}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="inline-block h-4 w-4 mr-2" />
                  Add Menu Item
                </button>
              </div>
            )}
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
              <Save className="inline-block h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};