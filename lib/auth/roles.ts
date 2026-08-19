import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface UserWithRole {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  roles?: {
    name: UserRole
  }
}

/**
 * Get current user with role (Server Component)
 * Use this when you need the user's role
 */
export async function getCurrentUserWithRole() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, roles(name)')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
    roles: profile?.roles || { name: 'user' as UserRole }
  } as UserWithRole
}

/**
 * Check if user has admin or super_admin role (Server Component)
 * Use this for admin pages
 */
export async function requireAdmin() {
  const user = await getCurrentUserWithRole()
  
  if (!user) {
    redirect('/login')
  }

  if (!user.roles?.name || !['admin', 'super_admin'].includes(user.roles.name)) {
    redirect('/dashboard')
  }

  return user
}

/**
 * Check if user has super_admin role (Server Component)
 * Use this for settings/admin only pages
 */
export async function requireSuperAdmin() {
  const user = await getCurrentUserWithRole()
  
  if (!user) {
    redirect('/login')
  }

  if (!user.roles?.name || user.roles.name !== 'super_admin') {
    redirect('/admin')
  }

  return user
}

/**
 * Just check if user is authenticated (Server Component)
 * Only use this if you're not using middleware protection
 * Since you have middleware, you probably don't need this
 */
export async function requireAuth() {
  const user = await getCurrentUserWithRole()
  
  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * Check if current user has a specific role (Server Component)
 */
export async function hasRole(role: UserRole | UserRole[]) {
  const user = await getCurrentUserWithRole()
  
  if (!user || !user.roles?.name) return false

  const roles = Array.isArray(role) ? role : [role]
  return roles.includes(user.roles.name)
}

/**
 * Check if user is admin or super_admin (Server Component)
 */
export async function isAdmin() {
  return hasRole(['admin', 'super_admin'])
}

/**
 * Check if user is super_admin (Server Component)
 */
export async function isSuperAdmin() {
  return hasRole('super_admin')
}

/**
 * Helper function to get role name from user object (backwards compatibility)
 */
export function getUserRole(user: UserWithRole | null): UserRole {
  return user?.roles?.name || 'user'
}