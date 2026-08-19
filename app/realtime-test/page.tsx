'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://lshmxyswfynkgxevdpqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaG14eXN3Znlua2d4ZXZkcHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4OTc0ODQsImV4cCI6MjA5OTQ3MzQ4NH0._D0G_u0S9UcZuigTLPKQTnSVxLjiu6xETNM_dCnddUc';

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function RealtimeTestPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to all changes on deployments table
    const channel = supabase
      .channel('test-deployments')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'deployments',
        },
        (payload) => {
          console.log('📦 Deployment event:', payload);
          setEvents(prev => [
            {
              id: Date.now(),
              type: payload.eventType,
              data: payload.new || payload.old,
              oldData: payload.old,
              time: new Date().toLocaleTimeString(),
              timestamp: new Date().toISOString()
            },
            ...prev
          ]);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          setStatus('✅ Connected');
          console.log('✅ Realtime subscription started! Listening for deployment changes...');
          console.log('🔄 Try inserting or updating a deployment in Supabase SQL Editor');
        }
        if (err) {
          setStatus('❌ Error');
          setConnectionError(err.message || 'Unknown error');
          console.error('❌ Subscription error:', err);
        }
      });

    // Subscribe to projects table as well
    const projectsChannel = supabase
      .channel('test-projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('📁 Project event:', payload);
          setEvents(prev => [
            {
              id: Date.now(),
              type: payload.eventType,
              table: 'projects',
              data: payload.new || payload.old,
              time: new Date().toLocaleTimeString(),
              timestamp: new Date().toISOString()
            },
            ...prev
          ]);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  // Function to insert a test deployment
  const insertTestDeployment = async () => {
    try {
      // First, get a project ID
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .limit(1);

      if (projectError) {
        console.error('Error fetching project:', projectError);
        alert('Error fetching project. Make sure you have at least one project.');
        return;
      }

      if (!projects || projects.length === 0) {
        alert('No projects found. Please create a project first.');
        return;
      }

      const projectId = projects[0].id;

      // Insert a test deployment
      const { data, error } = await supabase
        .from('deployments')
        .insert({
          project_id: projectId,
          deployment_status: 'pending',
          commit_hash: 'test-commit-' + Date.now(),
          commit_message: 'Test deployment from realtime test page',
          commit_author: 'Test User',
          deployment_trigger: 'manual'
        })
        .select();

      if (error) {
        console.error('Error inserting deployment:', error);
        alert('Error inserting deployment: ' + error.message);
        return;
      }

      console.log('✅ Test deployment inserted:', data);
      alert('✅ Test deployment inserted! Check the events list below.');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + (error as Error).message);
    }
  };

  // Function to update a deployment (change status)
  const updateTestDeployment = async () => {
    try {
      // Get the most recent pending deployment
      const { data: deployments, error: fetchError } = await supabase
        .from('deployments')
        .select('id, deployment_status')
        .eq('deployment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching deployment:', fetchError);
        alert('Error fetching deployment: ' + fetchError.message);
        return;
      }

      if (!deployments || deployments.length === 0) {
        alert('No pending deployments found. Insert a test deployment first.');
        return;
      }

      const deployment = deployments[0];
      const statuses = ['building', 'deploying', 'deployed', 'failed'];
      const currentIndex = statuses.indexOf(deployment.deployment_status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];

      // Update the deployment status
      const { data, error } = await supabase
        .from('deployments')
        .update({
          deployment_status: nextStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', deployment.id)
        .select();

      if (error) {
        console.error('Error updating deployment:', error);
        alert('Error updating deployment: ' + error.message);
        return;
      }

      console.log('✅ Deployment updated to:', nextStatus);
      alert(`✅ Deployment status updated to: ${nextStatus}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + (error as Error).message);
    }
  };

  // Clear events
  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Realtime Test</h1>
      
      {/* Status Card */}
      <div className="bg-background-alt p-4 rounded-lg border border-border mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-light">Status:</span>
          <span className={`font-semibold ${
            status === '✅ Connected' ? 'text-green-600' :
            status === '❌ Error' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {status}
          </span>
        </div>
        {connectionError && (
          <p className="text-sm text-red-600 mt-1">Error: {connectionError}</p>
        )}
        <p className="text-xs text-text-light mt-2">
          Make changes to the deployments table to see events below
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={insertTestDeployment}
          className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors"
        >
          Insert Test Deployment
        </button>
        <button
          onClick={updateTestDeployment}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
        >
          Update Deployment Status
        </button>
        <button
          onClick={clearEvents}
          className="px-4 py-2 bg-background-alt hover:bg-background border border-border text-text rounded-md transition-colors"
        >
          Clear Events
        </button>
      </div>

      {/* Events List */}
      <div className="bg-background-alt p-4 rounded-lg border border-border">
        <h2 className="font-semibold text-primary mb-3 flex items-center justify-between">
          <span>Events ({events.length})</span>
          <span className="text-xs text-text-light font-normal">
            {events.length > 0 ? 'Live updates' : 'Waiting for events...'}
          </span>
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`bg-background p-3 rounded border ${
                event.type === 'INSERT' ? 'border-green-200' :
                event.type === 'UPDATE' ? 'border-blue-200' :
                'border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-medium ${
                  event.type === 'INSERT' ? 'text-green-600' :
                  event.type === 'UPDATE' ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {event.type}
                </span>
                {event.table && (
                  <span className="text-xs text-text-light bg-background-alt px-2 py-0.5 rounded">
                    {event.table}
                  </span>
                )}
                <span className="text-text-light text-xs">{event.time}</span>
              </div>
              <pre className="mt-1 text-xs text-text-light overflow-x-auto">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-text-light text-sm text-center py-8">
              No events yet. Click "Insert Test Deployment" or make changes in Supabase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}