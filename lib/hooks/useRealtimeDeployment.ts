'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface DeploymentUpdate {
  id: string;
  project_id: string;
  deployment_status: 'pending' | 'building' | 'deploying' | 'deployed' | 'failed' | 'cancelled';
  deployment_url?: string;
  error_message?: string;
  logs?: string;
  commit_hash?: string;
  commit_message?: string;
  commit_author?: string;
  created_at: string;
  completed_at?: string;
  duration_seconds?: number;
}

export function useRealtimeDeployment(deploymentId: string | null) {
  const [deployment, setDeployment] = useState<DeploymentUpdate | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!deploymentId) {
      setLoading(false);
      return;
    }

    // Initial fetch
    const fetchDeployment = async () => {
      try {
        const { data, error } = await supabase
          .from('deployments')
          .select('*')
          .eq('id', deploymentId)
          .single();

        if (data) {
          setDeployment(data);
          setStatus(data.deployment_status);
          if (data.deployment_url) setUrl(data.deployment_url);
          if (data.error_message) setError(data.error_message);
          if (data.logs) setLogs(data.logs.split('\n').filter(Boolean));
        }
        if (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch deployment');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch deployment');
      } finally {
        setLoading(false);
      }
    };

    fetchDeployment();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`deployment-${deploymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deployments',
          filter: `id=eq.${deploymentId}`
        },
        (payload) => {
          const newData = payload.new as DeploymentUpdate;
          
          setDeployment(newData);
          setStatus(newData.deployment_status);
          
          if (newData.deployment_url) {
            setUrl(newData.deployment_url);
          }
          
          if (newData.error_message) {
            setError(newData.error_message);
          }
          
          if (newData.logs) {
            setLogs((prev) => [...prev, ...(newData.logs || '').split('\n').filter(Boolean)]);
          }
          
          // If deployment is complete, we can stop loading
          if (newData.deployment_status === 'deployed' || 
              newData.deployment_status === 'failed' || 
              newData.deployment_status === 'cancelled') {
            setLoading(false);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('Realtime subscription error:', err);
          setError('Connection error: ' + (err instanceof Error ? err.message : String(err)));
        }
      });

    // Cleanup on unmount or deploymentId change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [deploymentId]);

  const reset = () => {
    setStatus(null);
    setLogs([]);
    setUrl(null);
    setError(null);
    setDeployment(null);
    setLoading(true);
  };

  return {
    deployment,
    status,
    logs,
    url,
    error,
    loading,
    reset,
    isComplete: status === 'deployed' || status === 'failed' || status === 'cancelled',
    isPending: status === 'pending',
    isBuilding: status === 'building',
    isDeploying: status === 'deploying',
    isDeployed: status === 'deployed',
    isFailed: status === 'failed',
    isCancelled: status === 'cancelled',
  };
}

export default useRealtimeDeployment;