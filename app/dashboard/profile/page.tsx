import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function ProfilePage() {
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        {/* Profile Header with Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
          {/* Avatar */}
          <div className="relative">
            {profile?.avatar_url ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary">
                <Image
                  src={profile.avatar_url}
                  alt={profile?.full_name || 'User'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-secondary">
                <span className="text-2xl font-bold text-text-white">
                  {userInitials}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {profile?.full_name || 'User'}
            </h1>
            <p className="text-text-light text-sm">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-medium text-secondary bg-secondary-50 px-2 py-0.5 rounded">
              Authenticated via GitHub
            </span>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
                <p className="text-sm">{profile?.full_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">User ID</label>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">Last Sign In</label>
                <p className="text-sm">{new Date(user.last_sign_in_at || '').toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-1">Created At</label>
                <p className="text-sm">{new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}