'use client';

import { useState, useEffect } from 'react';

interface EnvironmentProps {
  projectId: string;
  initialEnvVars: any[];
  onEnvVarsChange: (envVars: any[]) => void;
}

export default function Environment({ projectId, initialEnvVars, onEnvVarsChange }: EnvironmentProps) {
  const [envVars, setEnvVars] = useState(initialEnvVars);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    is_secret: true
  });

  useEffect(() => {
    setEnvVars(initialEnvVars);
  }, [initialEnvVars]);

  const handleAddEnvVar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.value) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/env/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Error adding environment variable: ' + (error.error || 'Unknown error'));
        return;
      }

      const newEnvVar = await response.json();
      const updatedEnvVars = [...envVars, newEnvVar];
      setEnvVars(updatedEnvVars);
      onEnvVarsChange(updatedEnvVars);
      setShowAddForm(false);
      setFormData({ key: '', value: '', is_secret: true });
    } catch (error) {
      console.error('Error adding environment variable:', error);
      alert('Error adding environment variable');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnvVar = async (envVarId: string) => {
    if (!confirm('Delete this environment variable?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/env/${projectId}/${envVarId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Error deleting environment variable');
        return;
      }

      const updatedEnvVars = envVars.filter(env => env.id !== envVarId);
      setEnvVars(updatedEnvVars);
      onEnvVarsChange(updatedEnvVars);
    } catch (error) {
      console.error('Error deleting environment variable:', error);
      alert('Error deleting environment variable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-alt p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Environment Variables</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Variable'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddEnvVar} className="mb-4 p-4 bg-background rounded-lg border border-border">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Key</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-3 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                placeholder="e.g., API_KEY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">Value</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                placeholder="e.g., your-secret-value"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.is_secret}
                onChange={(e) => setFormData({ ...formData, is_secret: e.target.checked })}
                className="rounded border-border"
              />
              <span>Keep secret (hidden in UI)</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Variable'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-background border border-border hover:border-secondary text-sm font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {envVars.length === 0 ? (
        <p className="text-text-light text-sm">No environment variables configured</p>
      ) : (
        <div className="space-y-2">
          {envVars.map((env) => (
            <div
              key={env.id}
              className="flex items-center justify-between p-3 bg-background rounded border border-border"
            >
              <div className="flex-1">
                <div className="font-mono text-sm">{env.key}</div>
                <div className="text-text-light text-sm">
                  {env.is_secret ? '••••••••' : env.value}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  env.is_secret ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {env.is_secret ? 'Secret' : 'Public'}
                </span>
                <button
                  onClick={() => handleDeleteEnvVar(env.id)}
                  disabled={loading}
                  className="text-text-light hover:text-danger transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
