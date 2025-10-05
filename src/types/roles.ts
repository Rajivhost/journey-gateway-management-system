export enum Permission {
  // Dashboard permissions
  DASHBOARD_VIEW = 'DASHBOARD_VIEW',
  
  // Gateway permissions
  GATEWAYS_VIEW = 'GATEWAYS_VIEW',
  GATEWAYS_CREATE = 'GATEWAYS_CREATE',
  GATEWAYS_EDIT = 'GATEWAYS_EDIT',
  GATEWAYS_DELETE = 'GATEWAYS_DELETE',
  GATEWAYS_MANAGE_MENUS = 'GATEWAYS_MANAGE_MENUS',
  
  // Journey permissions
  JOURNEYS_VIEW = 'JOURNEYS_VIEW',
  JOURNEYS_CREATE = 'JOURNEYS_CREATE',
  JOURNEYS_EDIT = 'JOURNEYS_EDIT',
  JOURNEYS_DELETE = 'JOURNEYS_DELETE',
  JOURNEYS_PUBLISH = 'JOURNEYS_PUBLISH',
  JOURNEYS_ARCHIVE = 'JOURNEYS_ARCHIVE',
  
  // Session permissions
  SESSIONS_VIEW = 'SESSIONS_VIEW',
  SESSIONS_TERMINATE = 'SESSIONS_TERMINATE',
  SESSIONS_ANALYTICS = 'SESSIONS_ANALYTICS',
  
  // Provider permissions
  PROVIDERS_VIEW = 'PROVIDERS_VIEW',
  PROVIDERS_CREATE = 'PROVIDERS_CREATE',
  PROVIDERS_EDIT = 'PROVIDERS_EDIT',
  PROVIDERS_DELETE = 'PROVIDERS_DELETE',
  PROVIDERS_APPROVE = 'PROVIDERS_APPROVE',
  PROVIDERS_REJECT = 'PROVIDERS_REJECT',
  
  // Product permissions
  PRODUCTS_VIEW = 'PRODUCTS_VIEW',
  PRODUCTS_CREATE = 'PRODUCTS_CREATE',
  PRODUCTS_EDIT = 'PRODUCTS_EDIT',
  PRODUCTS_DELETE = 'PRODUCTS_DELETE',
  PRODUCTS_MANAGE_PRICING = 'PRODUCTS_MANAGE_PRICING',
  
  // Carrier permissions
  CARRIERS_VIEW = 'CARRIERS_VIEW',
  CARRIERS_CREATE = 'CARRIERS_CREATE',
  CARRIERS_EDIT = 'CARRIERS_EDIT',
  CARRIERS_DELETE = 'CARRIERS_DELETE',
  
  // Category permissions
  CATEGORIES_VIEW = 'CATEGORIES_VIEW',
  CATEGORIES_CREATE = 'CATEGORIES_CREATE',
  CATEGORIES_EDIT = 'CATEGORIES_EDIT',
  CATEGORIES_DELETE = 'CATEGORIES_DELETE',
  
  // Payment permissions
  PAYMENTS_VIEW = 'PAYMENTS_VIEW',
  PAYMENTS_MANAGE = 'PAYMENTS_MANAGE',
  BILLING_VIEW = 'BILLING_VIEW',
  
  // Settings permissions
  SETTINGS_VIEW = 'SETTINGS_VIEW',
  SETTINGS_GENERAL = 'SETTINGS_GENERAL',
  SETTINGS_FEATURES = 'SETTINGS_FEATURES',
  SETTINGS_APPEARANCE = 'SETTINGS_APPEARANCE',
  SETTINGS_SECURITY = 'SETTINGS_SECURITY',
  SETTINGS_PRICING = 'SETTINGS_PRICING',
  
  // User management permissions
  USERS_VIEW = 'USERS_VIEW',
  USERS_CREATE = 'USERS_CREATE',
  USERS_EDIT = 'USERS_EDIT',
  USERS_DELETE = 'USERS_DELETE',
  USERS_MANAGE_ROLES = 'USERS_MANAGE_ROLES',
  
  // Role management permissions
  ROLES_VIEW = 'ROLES_VIEW',
  ROLES_CREATE = 'ROLES_CREATE',
  ROLES_EDIT = 'ROLES_EDIT',
  ROLES_DELETE = 'ROLES_DELETE',
  ROLES_ASSIGN_PERMISSIONS = 'ROLES_ASSIGN_PERMISSIONS',
  
  // System permissions
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  AUDIT_LOGS_VIEW = 'AUDIT_LOGS_VIEW',
  SIMULATOR_ACCESS = 'SIMULATOR_ACCESS'
}

export enum RoleType {
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM'
}

export interface Role {
  roleId: string;
  name: string;
  description?: string;
  type: RoleType;
  permissions: Permission[];
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface UserRole {
  userRoleId: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;
}

export interface PermissionGroup {
  groupId: string;
  name: string;
  description: string;
  permissions: Permission[];
  icon: string;
}

// Form schemas
import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).min(1, 'At least one permission is required'),
  isActive: z.boolean().default(true),
});

export const editRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).min(1, 'At least one permission is required'),
  isActive: z.boolean(),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  roleId: z.string().min(1, 'Role is required'),
  expiresAt: z.string().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type EditRoleInput = z.infer<typeof editRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;