'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

type TabType = 'deploy' | 'overview' | 'environment' | 'deployments' | 'logs' | 'settings';

// Tab configuration - text only, no icons
const ALL_TABS: { id: TabType; label: string }[] = [
  { id: 'deploy', label: 'Deploy' },
  { id: 'overview', label: 'Overview' },
  { id: 'environment', label: 'Environment' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'logs', label: 'Logs' },
  { id: 'settings', label: 'Settings' },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [envVars, setEnvVars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('deploy');
  const supabase = createClient();

  useEffect(() => {
    if (!user || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();
        
        setProject(data);
        setDeployments(data.deployments || []);
        setEnvVars(data.environment_variables || []);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to project updates
    const projectChannel = supabase
      .channel(`project-detail-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${id}`
        },
        (payload) => {
          setProject(payload.new);
        }
      )
      .subscribe();

    // Subscribe to deployment updates
    const deploymentChannel = supabase
      .channel(`project-deployments-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deployments',
          filter: `project_id=eq.${id}`
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
      const response = await fetch(`/api/projects/${id}/deploy`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.deploymentId) {
        setDeploying(false);
      } else {
        alert('Failed to start deployment');
        setDeploying(false);
      }
    } catch (error) {
      console.error('Deploy error:', error);
      alert('Error starting deployment');
      setDeploying(false);
    }
  };

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
    <div className="flex flex-col h-screen">
      {/* Header - Fixed with Back Button and Project Info */}
      <div className="bg-background border-b border-border shadow-sm z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <Link
              href="/dashboard/projects"
              className="text-text-light hover:text-secondary transition-colors text-sm sm:text-base"
            >
              ←
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-primary truncate">
              {project.project_name}
            </h1>
            <span className="px-2 py-0.5 bg-background-alt rounded text-xs font-mono text-text-light flex-shrink-0">
              {project.project_type}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(project.deployment_status)}`}>
              {project.deployment_status || 'Not deployed'}
            </span>
          </div>

          {/* Navigation Tabs - Text Only, Mobile Optimized */}
          <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            <div className="flex gap-0.5 sm:gap-1 border-b border-border min-w-max sm:min-w-0">
              {ALL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-text-light hover:text-primary'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-background-alt">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {activeTab === 'deploy' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Deploy</h2>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className={`
                    px-4 sm:px-6 py-2 sm:py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-colors text-sm sm:text-base
                    ${deploying ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {deploying ? 'Deploying...' : '🚀 Deploy Now'}
                </button>
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
              {project.deployment_url && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <span className="font-semibold text-green-700">✅ Deployed at:</span>
                  <a
                    href={project.deployment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1 text-secondary hover:underline break-all text-sm"
                  >
                    {project.deployment_url}
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Project Overview</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light">Project Name</label>
                  <p className="text-primary break-all">{project.project_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Project Type</label>
                  <p className="text-primary capitalize">{project.project_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Repository</label>
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline break-all text-sm"
                  >
                    {project.repository_url}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Branch</label>
                  <p className="text-primary">{project.repository_branch || 'main'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Status</label>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project.deployment_status)}`}>
                    {project.deployment_status || 'Not deployed'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Total Deployments</label>
                  <p className="text-primary">{deployments.length}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Environment Variables</label>
                  <p className="text-primary">{envVars.length}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Created</label>
                  <p className="text-primary">{new Date(project.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'environment' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Environment Variables</h2>
              {envVars.length === 0 ? (
                <p className="text-text-light text-sm sm:text-base">No environment variables configured yet.</p>
              ) : (
                <div className="space-y-2">
                  {envVars.map((env) => (
                    <div key={env.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 p-3 bg-background-alt rounded border border-border">
                      <span className="font-mono text-sm break-all">{env.key}</span>
                      <span className="font-mono text-sm text-text-light">
                        {env.is_secret ? '••••••••' : env.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Deployment Logs</h2>
              {deployments.length === 0 ? (
                <p className="text-text-light text-sm sm:text-base">No deployments yet.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="p-3 sm:p-4 bg-background-alt rounded border border-border">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(deployment.deployment_status)}`}>
                          {deployment.deployment_status}
                        </span>
                        <span className="text-xs text-text-light">
                          {new Date(deployment.created_at).toLocaleString()}
                        </span>
                      </div>
                      {deployment.commit_message && (
                        <div className="mt-1 text-sm text-text-light">
                          {deployment.commit_message}
                        </div>
                      )}
                      {deployment.logs && (
                        <div className="mt-2 p-2 bg-background rounded font-mono text-xs text-text-light max-h-32 overflow-y-auto whitespace-pre-wrap break-all">
                          {deployment.logs}
                        </div>
                      )}
                      {deployment.error_message && (
                        <div className="mt-2 text-sm text-red-600">
                          ❌ {deployment.error_message}
                        </div>
                      )}
                      {deployment.deployment_url && (
                        <a
                          href={deployment.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-secondary hover:underline block"
                        >
                          View Deployment →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'deployments' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Deployment History</h2>
              {deployments.length === 0 ? (
                <p className="text-text-light text-sm sm:text-base">No deployments yet.</p>
              ) : (
                <div className="space-y-3">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="p-3 sm:p-4 bg-background-alt rounded border border-border">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(deployment.deployment_status)}`}>
                          {deployment.deployment_status}
                        </span>
                        <span className="text-xs text-text-light">
                          {new Date(deployment.created_at).toLocaleString()}
                        </span>
                      </div>
                      {deployment.commit_hash && (
                        <div className="mt-1 text-xs font-mono text-text-light break-all">
                          Commit: {deployment.commit_hash.substring(0, 8)}
                        </div>
                      )}
                      {deployment.commit_message && (
                        <div className="mt-1 text-sm text-text-light break-all">
                          {deployment.commit_message}
                        </div>
                      )}
                      {deployment.duration_seconds && (
                        <div className="mt-1 text-xs text-text-light">
                          Duration: {deployment.duration_seconds}s
                        </div>
                      )}
                      {deployment.deployment_url && (
                        <a
                          href={deployment.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-secondary hover:underline block break-all"
                        >
                          View Deployment →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-background rounded-lg border border-border shadow-custom p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Project Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light">Project ID</label>
                  <p className="text-sm font-mono text-text-light break-all">{project.id}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this project and all its data?')) return;
                      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                      if (response.ok) {
                        router.push('/dashboard/projects');
                      } else {
                        alert('Failed to delete project');
                      }
                    }}
                    className="px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-md transition-colors text-sm"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}