import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout handles redirect, but TypeScript needs this check
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Account Settings</h2>
            <p className="text-sm text-text-light mb-4">
              Manage your account preferences and security settings.
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Update Email
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Manage Linked Accounts
              </button>
            </div>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Preferences</h2>
            <p className="text-sm text-text-light mb-4">
              Customize your dashboard experience.
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Notification Settings
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Theme Settings
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Language Settings
              </button>
            </div>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Danger Zone</h2>
            <p className="text-sm text-text-light mb-4">
              Irreversible and destructive actions.
            </p>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="w-full px-4 py-2 text-sm bg-danger hover:bg-red-600 text-white rounded-md transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}