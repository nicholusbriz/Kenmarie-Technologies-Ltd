'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Deployment {
  id: string;
  project_id: string;
  deployment_status: 'pending' | 'building' | 'deploying' | 'deployed' | 'failed' | 'cancelled';
  commit_hash?: string;
  commit_message?: string;
  commit_author?: string;
  deployment_trigger: 'manual' | 'auto' | 'webhook';
  azure_deployment_id?: string;
  deployment_url?: string;
  error_message?: string;
  logs?: string;
  created_at: string;
  completed_at?: string;
  duration_seconds?: number;
}

export function useRealtimeProjectDeployments(projectId: string | null) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchDeployments = async () => {
      try {
        const { data, error } = await supabase
          .from('deployments')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDeployments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();

    // Subscribe to real-time deployment changes for this project
    const channel = supabase
      .channel(`project-${projectId}-deployments`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deployments',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeployments((prev) => [payload.new as Deployment, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDeployments((prev) =>
              prev.map((d) => (d.id === payload.new.id ? payload.new as Deployment : d))
            );
          } else if (payload.eventType === 'DELETE') {
            setDeployments((prev) => prev.filter((d) => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // Helper functions
  const latestDeployment = deployments.length > 0 ? deployments[0] : null;

  const getDeploymentsByStatus = (status: Deployment['deployment_status']) => {
    return deployments.filter((d) => d.deployment_status === status);
  };

  const getSuccessfulDeployments = () => getDeploymentsByStatus('deployed');
  const getFailedDeployments = () => getDeploymentsByStatus('failed');
  const getPendingDeployments = () => getDeploymentsByStatus('pending');
  const getBuildingDeployments = () => getDeploymentsByStatus('building');

  return {
    deployments,
    loading,
    error,
    latestDeployment,
    getDeploymentsByStatus,
    getSuccessfulDeployments,
    getFailedDeployments,
    getPendingDeployments,
    getBuildingDeployments,
  };
}