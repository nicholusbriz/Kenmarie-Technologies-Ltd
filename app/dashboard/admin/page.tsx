'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Shield, Users, FolderKanban, Activity } from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Redirect if not admin
  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [userLoading, isAdmin, router]);

  // Fetch users with TanStack Query
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: isAdmin,
  });

  // Fetch projects with TanStack Query
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: isAdmin,
  });

  // Subscribe to user changes
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase
      .channel('admin-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, queryClient, supabase]);

  // Subscribe to project changes
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase
      .channel('admin-projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, queryClient, supabase]);

  if (userLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-secondary/10 rounded-lg">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-text-light">Manage users and projects</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-medium text-text-light">Total Users</h3>
            </div>
            <p className="text-2xl font-bold text-primary">{users.length}</p>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <FolderKanban className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-medium text-text-light">Total Projects</h3>
            </div>
            <p className="text-2xl font-bold text-primary">{projects.length}</p>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-medium text-text-light">System Status</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* Users with Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Users & Projects</h2>
          {loadingUsers ? (
            <div className="text-center py-8 text-text-light">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-text-light">No users found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user: any) => (
                <div key={user.id} className="bg-background-alt rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-lg">{user.full_name || 'N/A'}</h3>
                      <p className="text-sm text-text-light">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.roles?.name === 'super_admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : user.roles?.name === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.roles?.name || 'user'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-text-light mb-2">
                      {user.projects?.length || 0} project{(user.projects?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {user.projects && user.projects.length > 0 ? (
                    <div className="space-y-2">
                      {user.projects.map((project: any) => (
                        <div key={project.id} className="bg-background p-3 rounded border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-primary">{project.project_name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              project.deployment_status === 'deployed' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {project.deployment_status || 'Not deployed'}
                            </span>
                          </div>
                          <p className="text-xs text-text-light">{project.project_type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-light italic">No projects yet</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-light">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Table */}
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">Projects</h2>
          {loadingProjects ? (
            <div className="text-center py-8 text-text-light">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-text-light">No projects found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-alt border-b border-border">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Name</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Owner</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project: any) => (
                    <tr key={project.id} className="border-b border-border hover:bg-background-alt transition-colors">
                      <td className="p-3 font-medium">{project.project_name}</td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 bg-background-alt rounded text-xs font-mono">
                          {project.project_type}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-text-light">{project.user_id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.deployment_status === 'deployed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {project.deployment_status || 'Not deployed'}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-text-light">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
