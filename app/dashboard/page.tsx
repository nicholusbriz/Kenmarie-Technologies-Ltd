import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect, but TypeScript needs this check
  }

  // Fetch user profile from your users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user initials for avatar fallback
  const getInitials = () => {
    const name = profile?.full_name || user.email || 'User'
    if (name.includes(' ')) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }

  const userInitials = getInitials()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        {/* Header with Profile Link */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-text-light">Welcome back, {profile?.full_name || user.email}</p>
          </div>
          
          {/* Profile Link with Avatar */}
          <Link 
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background-alt transition-colors duration-200 group"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-text-light">View Profile →</p>
            </div>
            
            {/* Avatar */}
            <div className="relative">
              {profile?.avatar_url ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary">
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.full_name || 'User'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-secondary">
                  <span className="text-sm font-bold text-text-white">
                    {userInitials}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="bg-background-alt p-6 rounded-lg border border-border mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Welcome to Kenmarie Technologies
              </h2>
              <p className="text-sm text-text-light">
                You are signed in as <span className="font-medium text-primary">{user.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/deploy"
              className="px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-custom hover:shadow-custom-lg"
            >
              🚀 Deploy
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}