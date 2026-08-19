'use client';

import { useState } from 'react';

interface LogsProps {
  deployments: any[];
}

export default function Logs({ deployments }: LogsProps) {
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<any>(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchDeploymentLogs = async (deploymentId: string) => {
    setLoadingLogs(true);
    try {
      const response = await fetch(`/api/deployments/${deploymentId}/logs`);
      const data = await response.json();
      setDeploymentLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="bg-background-alt p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Deployment Logs</h2>
        <select
          value={selectedDeploymentId || ''}
          onChange={(e) => {
            const deploymentId = e.target.value;
            setSelectedDeploymentId(deploymentId);
            if (deploymentId) fetchDeploymentLogs(deploymentId);
          }}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="">Select deployment...</option>
          {deployments.map((deployment) => (
            <option key={deployment.id} value={deployment.id}>
              {new Date(deployment.created_at).toLocaleString()} - {deployment.deployment_status}
            </option>
          ))}
        </select>
      </div>
      {loadingLogs ? (
        <div className="text-center py-8 text-text-light">Loading logs...</div>
      ) : !deploymentLogs ? (
        <div className="text-center py-8 text-text-light">
          {deployments.length === 0 ? 'No deployments available' : 'Select a deployment to view logs'}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-text-light">
            <span>Status: {deploymentLogs.deployment_status}</span>
            <span>Started: {new Date(deploymentLogs.created_at).toLocaleString()}</span>
            {deploymentLogs.completed_at && (
              <span>Completed: {new Date(deploymentLogs.completed_at).toLocaleString()}</span>
            )}
            {deploymentLogs.duration_seconds && (
              <span>Duration: {deploymentLogs.duration_seconds}s</span>
            )}
          </div>
          <div className="bg-background p-4 rounded border border-border font-mono text-sm max-h-96 overflow-y-auto">
            {deploymentLogs.logs ? (
              deploymentLogs.logs.split('\n').map((log: string, i: number) => (
                <div key={i} className="text-text-light py-0.5 border-b border-border/20">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-text-light/50">No logs available</div>
            )}
          </div>
          {deploymentLogs.error_message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <span className="font-semibold text-red-700">❌ Error:</span>
              <p className="text-red-600 text-sm mt-1">{deploymentLogs.error_message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
