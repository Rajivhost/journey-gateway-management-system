import { useState, useEffect } from 'react';
import { ApiScope, ScopeCategory, AccessLevel, CreateScopeInput, EditScopeInput } from '../types/scopes';

const mockScopes: ApiScope[] = [
  {
    scopeId: '1',
    name: 'Gateway Read Access',
    description: 'Read-only access to gateway information and configurations',
    scopeKey: 'gateways.read',
    category: ScopeCategory.GATEWAYS,
    accessLevels: [AccessLevel.READ],
    isActive: true,
    isSystem: true,
    apiEndpoints: ['/api/v1/gateways', '/api/v1/gateways/:id'],
    usageCount: 45,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    scopeId: '2',
    name: 'Gateway Write Access',
    description: 'Create and update gateway configurations',
    scopeKey: 'gateways.write',
    category: ScopeCategory.GATEWAYS,
    accessLevels: [AccessLevel.READ, AccessLevel.WRITE],
    isActive: true,
    isSystem: true,
    apiEndpoints: ['/api/v1/gateways', '/api/v1/gateways/:id'],
    usageCount: 23,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  }
];

export const useScopes = () => {
  const [scopes, setScopes] = useState<ApiScope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadScopes = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setScopes(mockScopes);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadScopes();
  }, []);

  const createScope = async (data: CreateScopeInput): Promise<ApiScope> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newScope: ApiScope = {
      scopeId: Date.now().toString(),
      ...data,
      isSystem: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScopes(prev => [...prev, newScope]);
    return newScope;
  };

  const updateScope = async (scopeId: string, data: EditScopeInput): Promise<ApiScope> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    setScopes(prev => prev.map(scope =>
      scope.scopeId === scopeId
        ? { ...scope, ...data, updatedAt: new Date().toISOString() }
        : scope
    ));

    const updated = scopes.find(s => s.scopeId === scopeId);
    if (!updated) throw new Error('Scope not found');

    return { ...updated, ...data, updatedAt: new Date().toISOString() };
  };

  const deleteScope = async (scopeId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setScopes(prev => prev.filter(scope => scope.scopeId !== scopeId));
  };

  const duplicateScope = async (scopeId: string): Promise<ApiScope> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const original = scopes.find(s => s.scopeId === scopeId);
    if (!original) throw new Error('Scope not found');

    const duplicated: ApiScope = {
      ...original,
      scopeId: Date.now().toString(),
      name: `${original.name} (Copy)`,
      scopeKey: `${original.scopeKey}_copy`,
      isSystem: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScopes(prev => [...prev, duplicated]);
    return duplicated;
  };

  return {
    scopes,
    loading,
    error,
    createScope,
    updateScope,
    deleteScope,
    duplicateScope
  };
};
