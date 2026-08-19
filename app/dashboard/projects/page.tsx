'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

export default function ProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
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
      .channel('projects-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Projects</h1>
            <p className="text-text-light">Manage your deployment projects</p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors"
          >
            + New Project
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text-light">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-light mb-4">No projects yet</p>
            <Link
              href="/dashboard/projects/new"
              className="text-secondary hover:underline"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt border-b border-border">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-primary">Name</th>
                  <th className="text-left p-3 text-sm font-semibold text-primary">Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-primary">Status</th>
                  <th className="text-left p-3 text-sm font-semibold text-primary">Created</th>
                  <th className="text-left p-3 text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border hover:bg-background-alt transition-colors">
                    <td className="p-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-secondary hover:underline font-medium"
                      >
                        {project.project_name}
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-text-light">
                      <span className="px-2 py-1 bg-background-alt rounded text-xs font-mono">
                        {project.project_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.deployment_status)}`}
                      >
                        {project.deployment_status || 'Not deployed'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-text-light">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-xs text-secondary hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-xs text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}