import { useState, useEffect } from 'react';
import { Role, Permission, RoleType, CreateRoleInput, EditRoleInput, PermissionGroup } from '../types/roles';

// Mock data for development
const mockRoles: Role[] = [
  {
    roleId: 'role_1',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    type: RoleType.SYSTEM,
    permissions: Object.values(Permission),
    isActive: true,
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    roleId: 'role_2',
    name: 'Gateway Manager',
    description: 'Manage gateways, carriers, and related configurations',
    type: RoleType.CUSTOM,
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.GATEWAYS_VIEW,
      Permission.GATEWAYS_CREATE,
      Permission.GATEWAYS_EDIT,
      Permission.GATEWAYS_MANAGE_MENUS,
      Permission.CARRIERS_VIEW,
      Permission.CARRIERS_CREATE,
      Permission.CARRIERS_EDIT,
      Permission.CATEGORIES_VIEW,
      Permission.CATEGORIES_CREATE,
      Permission.CATEGORIES_EDIT,
      Permission.SIMULATOR_ACCESS
    ],
    isActive: true,
    userCount: 5,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
    createdBy: 'admin_user'
  },
  {
    roleId: 'role_3',
    name: 'Service Provider Manager',
    description: 'Manage service providers and their registrations',
    type: RoleType.CUSTOM,
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.PROVIDERS_VIEW,
      Permission.PROVIDERS_CREATE,
      Permission.PROVIDERS_EDIT,
      Permission.PROVIDERS_APPROVE,
      Permission.PROVIDERS_REJECT,
      Permission.JOURNEYS_VIEW,
      Permission.SESSIONS_VIEW,
      Permission.SESSIONS_ANALYTICS
    ],
    isActive: true,
    userCount: 3,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-02-15T11:45:00Z',
    createdBy: 'admin_user'
  },
  {
    roleId: 'role_4',
    name: 'Journey Developer',
    description: 'Create and manage USSD journeys',
    type: RoleType.CUSTOM,
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.JOURNEYS_VIEW,
      Permission.JOURNEYS_CREATE,
      Permission.JOURNEYS_EDIT,
      Permission.JOURNEYS_PUBLISH,
      Permission.SESSIONS_VIEW,
      Permission.SIMULATOR_ACCESS,
      Permission.CATEGORIES_VIEW
    ],
    isActive: true,
    userCount: 8,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-20T16:20:00Z',
    createdBy: 'admin_user'
  },
  {
    roleId: 'role_5',
    name: 'Billing Administrator',
    description: 'Manage products, pricing, and billing',
    type: RoleType.CUSTOM,
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.PRODUCTS_VIEW,
      Permission.PRODUCTS_CREATE,
      Permission.PRODUCTS_EDIT,
      Permission.PRODUCTS_MANAGE_PRICING,
      Permission.PAYMENTS_VIEW,
      Permission.PAYMENTS_MANAGE,
      Permission.BILLING_VIEW,
      Permission.PROVIDERS_VIEW
    ],
    isActive: true,
    userCount: 2,
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-25T10:15:00Z',
    createdBy: 'admin_user'
  },
  {
    roleId: 'role_6',
    name: 'Read Only Analyst',
    description: 'View-only access for analytics and reporting',
    type: RoleType.CUSTOM,
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.GATEWAYS_VIEW,
      Permission.JOURNEYS_VIEW,
      Permission.SESSIONS_VIEW,
      Permission.SESSIONS_ANALYTICS,
      Permission.PROVIDERS_VIEW,
      Permission.PRODUCTS_VIEW,
      Permission.BILLING_VIEW
    ],
    isActive: false,
    userCount: 0,
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-02-28T09:30:00Z',
    createdBy: 'admin_user'
  }
];

const mockPermissionGroups: PermissionGroup[] = [
  {
    groupId: 'dashboard',
    name: 'Dashboard',
    description: 'Dashboard and overview access',
    icon: 'LayoutDashboard',
    permissions: [Permission.DASHBOARD_VIEW]
  },
  {
    groupId: 'gateways',
    name: 'Gateways',
    description: 'Gateway management and configuration',
    icon: 'Radio',
    permissions: [
      Permission.GATEWAYS_VIEW,
      Permission.GATEWAYS_CREATE,
      Permission.GATEWAYS_EDIT,
      Permission.GATEWAYS_DELETE,
      Permission.GATEWAYS_MANAGE_MENUS
    ]
  },
  {
    groupId: 'journeys',
    name: 'Journeys',
    description: 'Journey creation and management',
    icon: 'MapPin',
    permissions: [
      Permission.JOURNEYS_VIEW,
      Permission.JOURNEYS_CREATE,
      Permission.JOURNEYS_EDIT,
      Permission.JOURNEYS_DELETE,
      Permission.JOURNEYS_PUBLISH,
      Permission.JOURNEYS_ARCHIVE
    ]
  },
  {
    groupId: 'sessions',
    name: 'Sessions',
    description: 'User session monitoring and analytics',
    icon: 'Activity',
    permissions: [
      Permission.SESSIONS_VIEW,
      Permission.SESSIONS_TERMINATE,
      Permission.SESSIONS_ANALYTICS
    ]
  },
  {
    groupId: 'providers',
    name: 'Service Providers',
    description: 'Service provider management',
    icon: 'Building2',
    permissions: [
      Permission.PROVIDERS_VIEW,
      Permission.PROVIDERS_CREATE,
      Permission.PROVIDERS_EDIT,
      Permission.PROVIDERS_DELETE,
      Permission.PROVIDERS_APPROVE,
      Permission.PROVIDERS_REJECT
    ]
  },
  {
    groupId: 'products',
    name: 'Products & Pricing',
    description: 'Product and pricing management',
    icon: 'Package',
    permissions: [
      Permission.PRODUCTS_VIEW,
      Permission.PRODUCTS_CREATE,
      Permission.PRODUCTS_EDIT,
      Permission.PRODUCTS_DELETE,
      Permission.PRODUCTS_MANAGE_PRICING
    ]
  },
  {
    groupId: 'infrastructure',
    name: 'Infrastructure',
    description: 'Carriers and categories management',
    icon: 'Globe',
    permissions: [
      Permission.CARRIERS_VIEW,
      Permission.CARRIERS_CREATE,
      Permission.CARRIERS_EDIT,
      Permission.CARRIERS_DELETE,
      Permission.CATEGORIES_VIEW,
      Permission.CATEGORIES_CREATE,
      Permission.CATEGORIES_EDIT,
      Permission.CATEGORIES_DELETE
    ]
  },
  {
    groupId: 'payments',
    name: 'Payments & Billing',
    description: 'Payment and billing management',
    icon: 'CreditCard',
    permissions: [
      Permission.PAYMENTS_VIEW,
      Permission.PAYMENTS_MANAGE,
      Permission.BILLING_VIEW
    ]
  },
  {
    groupId: 'users',
    name: 'User Management',
    description: 'User and role management',
    icon: 'Users',
    permissions: [
      Permission.USERS_VIEW,
      Permission.USERS_CREATE,
      Permission.USERS_EDIT,
      Permission.USERS_DELETE,
      Permission.USERS_MANAGE_ROLES
    ]
  },
  {
    groupId: 'roles',
    name: 'Role Management',
    description: 'Role and permission management',
    icon: 'Shield',
    permissions: [
      Permission.ROLES_VIEW,
      Permission.ROLES_CREATE,
      Permission.ROLES_EDIT,
      Permission.ROLES_DELETE,
      Permission.ROLES_ASSIGN_PERMISSIONS
    ]
  },
  {
    groupId: 'settings',
    name: 'Settings',
    description: 'System settings and configuration',
    icon: 'Settings',
    permissions: [
      Permission.SETTINGS_VIEW,
      Permission.SETTINGS_GENERAL,
      Permission.SETTINGS_FEATURES,
      Permission.SETTINGS_APPEARANCE,
      Permission.SETTINGS_SECURITY,
      Permission.SETTINGS_PRICING
    ]
  },
  {
    groupId: 'system',
    name: 'System Administration',
    description: 'System-level administration',
    icon: 'Shield',
    permissions: [
      Permission.SYSTEM_ADMIN,
      Permission.AUDIT_LOGS_VIEW,
      Permission.SIMULATOR_ACCESS
    ]
  }
];

export const useRoles = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setRoles(mockRoles);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch roles'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const createRole = async (input: CreateRoleInput): Promise<Role> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRole: Role = {
      roleId: `role_${Date.now()}`,
      name: input.name,
      description: input.description,
      type: RoleType.CUSTOM,
      permissions: input.permissions,
      isActive: input.isActive,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user'
    };

    setRoles(prev => [newRole, ...prev]);
    return newRole;
  };

  const updateRole = async (roleId: string, input: EditRoleInput): Promise<Role> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRoles(prev => prev.map(role => 
      role.roleId === roleId 
        ? { 
            ...role, 
            ...input,
            updatedAt: new Date().toISOString()
          }
        : role
    ));

    const updatedRole = roles.find(r => r.roleId === roleId);
    if (!updatedRole) {
      throw new Error('Role not found');
    }
    
    return { ...updatedRole, ...input, updatedAt: new Date().toISOString() };
  };

  const deleteRole = async (roleId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setRoles(prev => prev.filter(role => role.roleId !== roleId));
  };

  const duplicateRole = async (roleId: string): Promise<Role> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const originalRole = roles.find(r => r.roleId === roleId);
    if (!originalRole) {
      throw new Error('Role not found');
    }

    const duplicatedRole: Role = {
      ...originalRole,
      roleId: `role_${Date.now()}`,
      name: `${originalRole.name} (Copy)`,
      type: RoleType.CUSTOM,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user'
    };

    setRoles(prev => [duplicatedRole, ...prev]);
    return duplicatedRole;
  };

  return { 
    roles, 
    loading, 
    error, 
    createRole, 
    updateRole, 
    deleteRole,
    duplicateRole
  };
};

export const useRole = (roleId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = mockRoles.find(r => r.roleId === roleId);
        if (found) {
          setRole(found);
        } else {
          throw new Error('Role not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch role'));
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId]);

  return { role, loading, error };
};

export const usePermissionGroups = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    const fetchPermissionGroups = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setPermissionGroups(mockPermissionGroups);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch permission groups'));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissionGroups();
  }, []);

  return { permissionGroups, loading, error };
};