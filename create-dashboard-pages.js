const fs = require('fs');
const path = require('path');

// ============================================================
// 1. DEPLOY PAGE - /dashboard/deploy
// ============================================================
const deployPageContent = `'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useRealtimeDeployment } from '@/hooks/useRealtimeDeployment';

export default function DeployPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [deploymentId, setDeploymentId] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const supabase = createClient();

  // Get real-time deployment updates
  const { status, logs, url, error } = useRealtimeDeployment(deploymentId);

  // Fetch user's projects
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
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
          filter: \`user_id=eq.\${user.id}\`
        },
        (payload) => {
          setProjects((prev) =>
            prev.map((p) => (p.id === payload.new.id ? payload.new : p))
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleDeploy = async () => {
    if (!selectedProjectId) return;

    setIsDeploying(true);
    setDeploymentId(null);

    try {
      const response = await fetch(\`/api/projects/\${selectedProjectId}/deploy\`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.deploymentId) {
        setDeploymentId(data.deploymentId);
      } else {
        alert('Failed to start deployment');
        setIsDeploying(false);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Error starting deployment');
      setIsDeploying(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Deploy</h1>
        <p className="text-text-light mb-8">Deploy your applications to Azure</p>

        {/* Project Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            Select Project to Deploy
          </label>
          <select
            className="w-full max-w-md px-4 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name} ({project.project_type})
              </option>
            ))}
          </select>
        </div>

        {/* Deploy Button */}
        <div className="mb-8">
          <button
            onClick={handleDeploy}
            disabled={!selectedProjectId || isDeploying}
            className={\`
              px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-colors
              \${!selectedProjectId || isDeploying ? 'opacity-50 cursor-not-allowed' : ''}
            \`}
          >
            {isDeploying ? 'Deploying...' : '🚀 Deploy'}
          </button>
          {selectedProject && (
            <span className="ml-4 text-sm text-text-light">
              Deploying: {selectedProject.project_name}
            </span>
          )}
        </div>

        {/* Deployment Status */}
        {(status || deploymentId) && (
          <div className="bg-background-alt p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Status:</span>
              <span
                className={\`px-2 py-1 rounded text-sm \${ 
                  status === 'deployed' ? 'bg-green-100 text-green-700' :
                  status === 'failed' ? 'bg-red-100 text-red-700' :
                  status === 'building' || status === 'deploying' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }\`}
              >
                {status || 'Starting...'}
              </span>
              {isDeploying && (
                <span className="text-sm text-blue-600 animate-pulse">● Live</span>
              )}
            </div>

            {/* Live Logs */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-primary mb-2">Live Logs</h4>
              <div className="bg-background p-3 rounded border border-border max-h-60 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-text-light/50">
                    {isDeploying ? 'Waiting for logs...' : 'No logs yet'}
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="text-text-light border-b border-border/50 py-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <span className="font-semibold text-red-700">❌ Error:</span>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Deployment URL */}
            {url && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="font-semibold text-green-700">✅ Deployment successful!</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1 text-secondary hover:underline"
                >
                  {url}
                </a>
              </div>
            )}

            {/* Reset button when done */}
            {(status === 'deployed' || status === 'failed') && (
              <button
                onClick={() => {
                  setDeploymentId(null);
                  setIsDeploying(false);
                }}
                className="mt-4 text-sm text-secondary hover:underline"
              >
                Clear Status
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}`;

// ============================================================
// 2. PROJECTS LIST PAGE - /dashboard/projects
// ============================================================
const projectsPageContent = `'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';

export default function ProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
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
          filter: \`user_id=eq.\${user.id}\`
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

    return () => supabase.removeChannel(channel);
  }, [user]);

  const getStatusColor = (status) => {
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

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      alert('Error deleting project: ' + error.message);
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
                        href={\`/dashboard/projects/\${project.id}\`}
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
                        className={\`px-2 py-1 rounded text-xs font-medium \${getStatusColor(project.deployment_status)}\`}
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
                          href={\`/dashboard/projects/\${project.id}\`}
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
}`;

// ============================================================
// 3. NEW PROJECT PAGE - /dashboard/projects/new
// ============================================================
const newProjectPageContent = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';

export default function NewProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: 'nodejs',
    repository_url: '',
    repository_branch: 'main'
  });
  const supabase = createClient();

  const projectTypes = [
    { value: 'nodejs', label: 'Node.js', icon: '⚡' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '📄' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          project_name: formData.project_name,
          project_type: formData.project_type,
          repository_url: formData.repository_url,
          repository_branch: formData.repository_branch || 'main',
          deployment_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        alert('Error creating project: ' + error.message);
        setLoading(false);
        return;
      }

      router.push(\`/dashboard/projects/\${data.id}\`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating project');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/projects"
            className="text-text-light hover:text-secondary transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">New Project</h1>
        </div>
        <p className="text-text-light mb-8">Create a new deployment project</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="w-full px-4 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="My Awesome App"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Project Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, project_type: type.value })}
                  className={\`
                    p-4 border-2 rounded-lg text-center transition-all
                    \${formData.project_type === type.value
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:border-secondary/50'}
                  \`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Repository URL */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Repository URL *
            </label>
            <input
              type="url"
              required
              value={formData.repository_url}
              onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
              className="w-full px-4 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Branch
            </label>
            <input
              type="text"
              value={formData.repository_branch}
              onChange={(e) => setFormData({ ...formData, repository_branch: e.target.value })}
              className="w-full px-4 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="main"
            />
            <p className="text-xs text-text-light mt-1">Default: main</p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className={\`
                px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-colors
                \${loading ? 'opacity-50 cursor-not-allowed' : ''}
              \`}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <Link
              href="/dashboard/projects"
              className="text-text-light hover:text-secondary transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}`;

// ============================================================
// 4. PROJECT DETAIL PAGE - /dashboard/projects/[id]
// ============================================================
const projectDetailPageContent = `'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [envVars, setEnvVars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user || !id) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch project
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      setProject(projectData);

      // Fetch deployments
      const { data: deploymentsData } = await supabase
        .from('deployments')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      setDeployments(deploymentsData || []);

      // Fetch env vars
      const { data: envData } = await supabase
        .from('environment_variables')
        .select('*')
        .eq('project_id', id);

      setEnvVars(envData || []);
      setLoading(false);
    };

    fetchData();

    // Subscribe to project updates
    const projectChannel = supabase
      .channel(\`project-detail-\${id}\`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: \`id=eq.\${id}\`
        },
        (payload) => {
          setProject(payload.new);
        }
      )
      .subscribe();

    // Subscribe to deployment updates
    const deploymentChannel = supabase
      .channel(\`project-deployments-\${id}\`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deployments',
          filter: \`project_id=eq.\${id}\`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeployments((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDeployments((prev) =>
              prev.map((d) => (d.id === payload.new.id ? payload.new : d))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannel);
      supabase.removeChannel(deploymentChannel);
    };
  }, [id, user]);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const response = await fetch(\`/api/projects/\${id}/deploy\`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!data.deploymentId) {
        alert('Failed to start deployment');
      }
    } catch (error) {
      console.error('Deploy error:', error);
      alert('Error starting deployment');
    } finally {
      setDeploying(false);
    }
  };

  const getStatusColor = (status) => {
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

  if (loading) {
    return <div className="text-center py-12 text-text-light">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-text-light">Project not found</p>
        <Link href="/dashboard/projects" className="text-secondary hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/projects"
            className="text-text-light hover:text-secondary transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">{project.project_name}</h1>
          <span className="px-2 py-1 bg-background-alt rounded text-xs font-mono text-text-light">
            {project.project_type}
          </span>
        </div>

        {/* Status & Deploy */}
        <div className="bg-background-alt p-4 rounded-lg border border-border mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Status:</span>
              <span
                className={\`px-2 py-1 rounded text-sm \${getStatusColor(project.deployment_status)}\`}
              >
                {project.deployment_status || 'Not deployed'}
              </span>
              {project.deployment_url && (
                <a
                  href={project.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline text-sm"
                >
                  View App →
                </a>
              )}
            </div>
            <button
              onClick={handleDeploy}
              disabled={deploying}
              className={\`
                px-6 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors
                \${deploying ? 'opacity-50 cursor-not-allowed' : ''}
              \`}
            >
              {deploying ? 'Deploying...' : '🚀 Deploy'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Environment Variables */}
          <div className="bg-background-alt p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-3">Environment Variables</h3>
            {envVars.length === 0 ? (
              <p className="text-text-light text-sm">No environment variables</p>
            ) : (
              <div className="space-y-2">
                {envVars.map((env) => (
                  <div
                    key={env.id}
                    className="flex items-center justify-between p-2 bg-background rounded border border-border text-sm"
                  >
                    <span className="font-mono">{env.key}</span>
                    <span className="text-text-light font-mono">
                      {env.is_secret ? '••••••••' : env.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deployment History */}
          <div className="bg-background-alt p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-3">Deployment History</h3>
            {deployments.length === 0 ? (
              <p className="text-text-light text-sm">No deployments yet</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="p-2 bg-background rounded border border-border text-sm">
                    <div className="flex items-center justify-between">
                      <span
                        className={\`px-2 py-0.5 rounded text-xs \${getStatusColor(deployment.deployment_status)}\`}
                      >
                        {deployment.deployment_status}
                      </span>
                      <span className="text-text-light text-xs">
                        {new Date(deployment.created_at).toLocaleString()}
                      </span>
                    </div>
                    {deployment.commit_message && (
                      <div className="text-xs text-text-light mt-1">
                        {deployment.commit_message}
                      </div>
                    )}
                    {deployment.deployment_url && (
                      <a
                        href={deployment.deployment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-secondary hover:underline"
                      >
                        View →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Project */}
        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={async () => {
              if (!confirm('Delete this project and all its data?')) return;
              const { error } = await supabase.from('projects').delete().eq('id', id);
              if (!error) {
                router.push('/dashboard/projects');
              }
            }}
            className="text-danger hover:text-red-600 text-sm transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}`;

// ============================================================
// 5. DEPLOYMENT LOGS PAGE - /dashboard/projects/[id]/logs
// ============================================================
const logsPageContent = `'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DeploymentLogsPage() {
  const { id } = useParams();
  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;

    const fetchDeployment = async () => {
      const { data } = await supabase
        .from('deployments')
        .select('*')
        .eq('id', id)
        .single();

      setDeployment(data);
      setLoading(false);
    };

    fetchDeployment();

    // Subscribe to deployment updates
    const channel = supabase
      .channel(\`deployment-logs-\${id}\`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deployments',
          filter: \`id=eq.\${id}\`
        },
        (payload) => {
          setDeployment(payload.new);
          if (payload.new.logs) {
            setLogs((prev) => [...prev, payload.new.logs]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-text-light">Loading...</div>;
  }

  if (!deployment) {
    return (
      <div className="text-center py-12">
        <p className="text-text-light">Deployment not found</p>
        <Link href="/dashboard/projects" className="text-secondary hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={\`/dashboard/projects/\${deployment.project_id}\`}
            className="text-text-light hover:text-secondary transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-primary">Deployment Logs</h1>
          <span
            className={\`px-2 py-1 rounded text-sm \${ 
              deployment.deployment_status === 'deployed' ? 'bg-green-100 text-green-700' :
              deployment.deployment_status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }\`}
          >
            {deployment.deployment_status}
          </span>
        </div>

        <div className="bg-background-alt p-4 rounded-lg border border-border">
          <div className="mb-4 text-sm text-text-light">
            <span>Started: {new Date(deployment.created_at).toLocaleString()}</span>
            {deployment.completed_at && (
              <span className="ml-4">Completed: {new Date(deployment.completed_at).toLocaleString()}</span>
            )}
            {deployment.duration_seconds && (
              <span className="ml-4">Duration: {deployment.duration_seconds}s</span>
            )}
          </div>

          <div className="bg-background p-4 rounded border border-border font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 && !deployment.error_message ? (
              <div className="text-text-light/50">No logs yet. Waiting for deployment output...</div>
            ) : (
              <>
                {logs.map((log, i) => (
                  <div key={i} className="text-text-light py-0.5 border-b border-border/20">
                    {log}
                  </div>
                ))}
                {deployment.error_message && (
                  <div className="text-red-600 mt-2 p-2 bg-red-50 rounded">
                    ❌ Error: {deployment.error_message}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

// ============================================================
// 6. REALTIME HOOK - hooks/useRealtimeDeployment.ts
// ============================================================
const realtimeHookContent = `'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeDeployment(deploymentId: string | null) {
  const [status, setStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!deploymentId) return;

    const channel = supabase
      .channel(\`deployment-\${deploymentId}\`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deployments',
          filter: \`id=eq.\${deploymentId}\`
        },
        (payload) => {
          const newData = payload.new;
          setStatus(newData.deployment_status);

          if (newData.deployment_url) {
            setUrl(newData.deployment_url);
          }

          if (newData.error_message) {
            setError(newData.error_message);
          }

          if (newData.logs) {
            setLogs((prev) => [...prev, newData.logs]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deploymentId]);

  return { status, logs, url, error };
}

export default useRealtimeDeployment;`;

// ============================================================
// CREATE ALL FILES AND FOLDERS
// ============================================================

const DASHBOARD_DIR = path.join(process.cwd(), 'app', 'dashboard');

// Ensure dashboard directory exists
if (!fs.existsSync(DASHBOARD_DIR)) {
  fs.mkdirSync(DASHBOARD_DIR, { recursive: true });
}

// Define pages to create
const pages = [
  { path: ['deploy'], content: deployPageContent, file: 'page.tsx' },
  { path: ['projects'], content: projectsPageContent, file: 'page.tsx' },
  { path: ['projects', 'new'], content: newProjectPageContent, file: 'page.tsx' },
];

// Create each page
pages.forEach(({ path: pathParts, content, file }) => {
  let currentPath = DASHBOARD_DIR;
  
  pathParts.forEach((folder) => {
    currentPath = path.join(currentPath, folder);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath, { recursive: true });
    }
  });
  
  const filePath = path.join(currentPath, file);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
});

// Create dynamic [id] folder
const dynamicDir = path.join(DASHBOARD_DIR, 'projects', '[id]');
if (!fs.existsSync(dynamicDir)) {
  fs.mkdirSync(dynamicDir, { recursive: true });
}

// Project detail page
fs.writeFileSync(path.join(dynamicDir, 'page.tsx'), projectDetailPageContent);
console.log(`✅ Created: ${path.join(dynamicDir, 'page.tsx')}`);

// Deployment logs page
const logsDir = path.join(dynamicDir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
fs.writeFileSync(path.join(logsDir, 'page.tsx'), logsPageContent);
console.log(`✅ Created: ${path.join(logsDir, 'page.tsx')}`);

// Create hooks directory and file
const hooksDir = path.join(process.cwd(), 'hooks');
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}
fs.writeFileSync(path.join(hooksDir, 'useRealtimeDeployment.ts'), realtimeHookContent);
console.log(`✅ Created: ${path.join(hooksDir, 'useRealtimeDeployment.ts')}`);

console.log('\n🎉 All dashboard pages created successfully!');
console.log('\n📁 Created files:');
console.log('  - app/dashboard/deploy/page.tsx');
console.log('  - app/dashboard/projects/page.tsx');
console.log('  - app/dashboard/projects/new/page.tsx');
console.log('  - app/dashboard/projects/[id]/page.tsx');
console.log('  - app/dashboard/projects/[id]/logs/page.tsx');
console.log('  - hooks/useRealtimeDeployment.ts');
console.log('\n📝 Don\'t forget to:');
console.log('  1. Create the deployment API route: app/api/projects/[id]/deploy/route.ts');
console.log('  2. Make sure your useUser hook exists at hooks/useUser.ts');
console.log('  3. Test by visiting /dashboard');