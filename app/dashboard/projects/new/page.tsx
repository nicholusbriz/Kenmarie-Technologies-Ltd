'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

export default function NewProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
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

  const fetchRepositories = async () => {
    setFetchingRepos(true);
    try {
      const response = await fetch('/api/github/repositories');
      const data = await response.json();
      
      if (!response.ok) {
        alert('Error fetching repositories: ' + (data.error || 'Unknown error'));
        return;
      }
      
      setRepositories(data);
      setShowRepoSelector(true);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      alert('Error fetching repositories from GitHub');
    } finally {
      setFetchingRepos(false);
    }
  };

  const handleRepositorySelect = (repo: any) => {
    setFormData({
      ...formData,
      project_name: repo.name,
      repository_url: repo.clone_url,
      repository_branch: repo.default_branch || 'main'
    });
    setShowRepoSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error creating project: ' + (data.error || 'Unknown error'));
        setLoading(false);
        return;
      }

      router.push(`/dashboard/projects/${data.id}`);
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
          {/* Import from GitHub */}
          <div className="bg-background-alt p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-1">Import from GitHub</h3>
                <p className="text-xs text-text-light">Select a repository to auto-fill project details</p>
              </div>
              <button
                type="button"
                onClick={fetchRepositories}
                disabled={fetchingRepos}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchingRepos ? 'Fetching...' : '📥 Import Repos'}
              </button>
            </div>

            {/* Repository Selector */}
            {showRepoSelector && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-primary mb-2">
                  Select Repository
                </label>
                <div className="max-h-60 overflow-y-auto border border-border rounded-md bg-background">
                  {repositories.length === 0 ? (
                    <div className="p-4 text-sm text-text-light text-center">No repositories found</div>
                  ) : (
                    repositories.map((repo) => (
                      <button
                        key={repo.id}
                        type="button"
                        onClick={() => handleRepositorySelect(repo)}
                        className="w-full text-left px-4 py-3 hover:bg-background-alt border-b border-border last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-primary text-sm">{repo.full_name}</div>
                            {repo.description && (
                              <div className="text-xs text-text-light mt-1 truncate max-w-md">{repo.description}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-light">
                            {repo.language && (
                              <span className="px-2 py-0.5 bg-background-alt rounded">{repo.language}</span>
                            )}
                            <span className="text-xs">{repo.default_branch}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowRepoSelector(false)}
                  className="mt-2 text-xs text-text-light hover:text-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

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
                  className={`
                    p-4 border-2 rounded-lg text-center transition-all
                    ${formData.project_type === type.value
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:border-secondary/50'}
                  `}
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
              className={`
                px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-colors
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
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
}