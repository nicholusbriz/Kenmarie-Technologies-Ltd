'use client';

import { useState } from 'react';
import { useRealtimeDeployment } from '@/lib/hooks/useRealtimeDeployment';

interface DeployProps {
  projectId: string;
  project: any;
  onDeploy: () => void;
  isDeploying: boolean;
}

export default function Deploy({ projectId, project, onDeploy, isDeploying }: DeployProps) {
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const { status, logs, url, error } = useRealtimeDeployment(deploymentId);

  const handleDeployClick = async () => {
    setDeploymentId(null);
    await onDeploy();
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

  return (
    <div className="space-y-6">
      {/* Deployment Actions */}
      <div className="bg-background-alt p-4 md:p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4">Deployment Actions</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleDeployClick}
            disabled={isDeploying}
            className={`
              px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-colors
              ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isDeploying ? 'Deploying...' : '🚀 Deploy'}
          </button>
          {project.deployment_url && (
            <a
              href={project.deployment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors text-center"
            >
              View App →
            </a>
          )}
        </div>
        <div className="mt-4 text-sm text-text-light">
          <p>Current Status: <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(project.deployment_status)}`}>
            {project.deployment_status || 'pending'}
          </span></p>
        </div>
      </div>

      {/* Real-time Deployment Status */}
      {(status || deploymentId) && (
        <div className="bg-background-alt p-6 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold">Deployment Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm ${ 
                status === 'deployed' ? 'bg-green-100 text-green-700' :
                status === 'failed' ? 'bg-red-100 text-red-700' :
                status === 'building' || status === 'deploying' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}
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
                logs.map((log: string, i: number) => (
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
              }}
              className="mt-4 text-sm text-secondary hover:underline"
            >
              Clear Status
            </button>
          )}
        </div>
      )}

      {/* Deployment Info */}
      <div className="bg-background-alt p-4 md:p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4">Deployment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Repository</label>
            <p className="text-sm font-mono">{project.repository_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Branch</label>
            <p className="text-sm">{project.repository_branch}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Project Type</label>
            <p className="text-sm">{project.project_type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Last Deployed</label>
            <p className="text-sm">{project.deployed_at ? new Date(project.deployed_at).toLocaleString() : 'Never'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
