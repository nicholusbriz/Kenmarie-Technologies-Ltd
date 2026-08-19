'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

export default function DeployPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch user's projects
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        if (data) setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to project changes
    const channel = supabase
      .channel('deploy-page-projects')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setProjects((prev) =>
            prev.map((p) => (p.id === payload.new.id ? payload.new : p))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-700';
      case 'building':
        return 'bg-blue-100 text-blue-700';
      case 'deploying':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Deploy</h1>
        <p className="text-text-light mb-8">Deploy your applications to Azure</p>

        {/* Projects Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">Your Projects</h2>
          {loading ? (
            <div className="text-center py-12 text-text-light">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-background-alt rounded-lg border border-border">
              <p className="text-text-light mb-4">No projects yet</p>
              <Link
                href="/dashboard/projects/new"
                className="text-secondary hover:underline"
              >
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-background-alt p-4 rounded-lg border border-border hover:border-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-lg font-semibold text-primary hover:text-secondary transition-colors"
                      >
                        {project.project_name}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-background rounded text-xs font-mono">
                          {project.project_type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getStatusColor(project.deployment_status)}`}
                        >
                          {project.deployment_status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-text-light mb-3">
                    {project.repository_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="flex-1 px-3 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors text-center"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}