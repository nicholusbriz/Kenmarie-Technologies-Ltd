'use client';

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserWithRole, UserRole } from '@/lib/auth/roles'

export function useUser() {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole>('user')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setUser(null)
          setRole('user')
          setLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('id, full_name, avatar_url, roles(name)')
          .eq('id', authUser.id)
          .single()

        // Handle both array and object return types from Supabase
        const rolesData = profile?.roles;
        const roleName = Array.isArray(rolesData) && rolesData.length > 0 
          ? rolesData[0].name 
          : (rolesData as any)?.name;
        
        const userWithRole: UserWithRole = {
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          roles: { name: (roleName as UserRole) || 'user' }
        }

        setUser(userWithRole)
        setRole((roleName as UserRole) || 'user')
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
        setRole('user')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
        setRole('user')
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    role,
    loading,
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
    isAuthenticated: !!user,
    hasRole: (roles: UserRole | UserRole[]) => {
      const roleList = Array.isArray(roles) ? roles : [roles]
      return roleList.includes(role)
    }
  }
}