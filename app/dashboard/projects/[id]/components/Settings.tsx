'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsProps {
  projectId: string;
  project: any;
}

export default function Settings({ projectId, project }: SettingsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project and all its data? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/dashboard/projects');
      } else {
        alert('Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProjectSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: formData.get('project_name'),
          repository_url: formData.get('repository_url'),
        }),
      });

      if (!response.ok) {
        alert('Error saving project settings');
      } else {
        alert('Project settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving project settings:', error);
      alert('Error saving project settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAzureSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          azure_resource_group: formData.get('azure_resource_group'),
          azure_app_service: formData.get('azure_app_service'),
          azure_subscription_id: formData.get('azure_subscription_id'),
        }),
      });

      if (!response.ok) {
        alert('Error saving Azure settings');
      } else {
        alert('Azure settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving Azure settings:', error);
      alert('Error saving Azure settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-background-alt p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4">Project Settings</h2>
        <form onSubmit={handleSaveProjectSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Project Name</label>
            <input
              name="project_name"
              type="text"
              defaultValue={project.project_name}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Repository URL</label>
            <input
              name="repository_url"
              type="url"
              defaultValue={project.repository_url}
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-background-alt p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4">Azure Configuration</h2>
        <form onSubmit={handleSaveAzureSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Resource Group</label>
            <input
              name="azure_resource_group"
              type="text"
              defaultValue={project.azure_resource_group || ''}
              placeholder="e.g., my-resource-group"
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">App Service Name</label>
            <input
              name="azure_app_service"
              type="text"
              defaultValue={project.azure_app_service || ''}
              placeholder="e.g., my-app-service"
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Subscription ID</label>
            <input
              name="azure_subscription_id"
              type="text"
              defaultValue={project.azure_subscription_id || ''}
              placeholder="e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Azure Settings'}
          </button>
        </form>
      </div>

      <div className="bg-background-alt p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-danger mb-4">Danger Zone</h2>
        <button
          onClick={handleDeleteProject}
          disabled={loading}
          className="px-4 py-2 bg-danger hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete Project'}
        </button>
      </div>
    </div>
  );
}
