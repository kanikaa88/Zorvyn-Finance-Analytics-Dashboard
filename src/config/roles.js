/**
 * Role-Based Access Control (RBAC) Configuration
 * Centralized permission management for scalability and maintainability
 * Supports three user roles with granular permissions
 */

const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin'
};

const PERMISSIONS = {
  // Financial records permissions
  READ_RECORDS: 'read:records',
  CREATE_RECORDS: 'create:records',
  UPDATE_RECORDS: 'update:records',
  DELETE_RECORDS: 'delete:records',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view:analytics',
  VIEW_INSIGHTS: 'view:insights',
  
  // Budget permissions
  READ_BUDGETS: 'read:budgets',
  CREATE_BUDGETS: 'create:budgets',
  UPDATE_BUDGETS: 'update:budgets',
  DELETE_BUDGETS: 'delete:budgets',
  
  // User management permissions
  MANAGE_USERS: 'manage:users'
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [
    PERMISSIONS.READ_RECORDS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.READ_BUDGETS
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.READ_RECORDS,
    PERMISSIONS.CREATE_RECORDS,
    PERMISSIONS.UPDATE_RECORDS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_INSIGHTS,
    PERMISSIONS.READ_BUDGETS,
    PERMISSIONS.CREATE_BUDGETS,
    PERMISSIONS.UPDATE_BUDGETS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.READ_RECORDS,
    PERMISSIONS.CREATE_RECORDS,
    PERMISSIONS.UPDATE_RECORDS,
    PERMISSIONS.DELETE_RECORDS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_INSIGHTS,
    PERMISSIONS.READ_BUDGETS,
    PERMISSIONS.CREATE_BUDGETS,
    PERMISSIONS.UPDATE_BUDGETS,
    PERMISSIONS.DELETE_BUDGETS,
    PERMISSIONS.MANAGE_USERS
  ]
};

// Helper function to check if a role has a specific permission
const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission
};
