'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';

export default function NewProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(true);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    repository_url: '',
    repository_branch: 'main'
  });
  const supabase = createClient();

  const projectTypes = [
    { value: 'nodejs', label: 'Node.js', icon: '⚡' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '📄' }
  ];

  // Automatically fetch repositories when component mounts
  useEffect(() => {
    if (user) {
      fetchRepositories();
    }
  }, [user]);

  const fetchRepositories = async () => {
    setFetchingRepos(true);
    try {
      const response = await fetch('/api/github/repositories');
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error fetching repositories:', data.error);
        setRepositories([]);
        return;
      }
      
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setRepositories([]);
    } finally {
      setFetchingRepos(false);
    }
  };

  const handleRepositorySelect = (repo: any) => {
    setSelectedRepo(repo);
    setFormData({
      ...formData,
      project_name: repo.name,
      repository_url: repo.clone_url,
      repository_branch: repo.default_branch || 'main'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate all required fields
    if (!formData.project_name || !formData.project_type || !formData.repository_url) {
      alert('Please fill in all required fields');
      return;
    }

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/projects"
              className="text-text-light hover:text-secondary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-primary">Create New Project</h1>
              <p className="text-sm text-text-light mt-1">Deploy your application from a GitHub repository</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Repository Section */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Select Repository <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-text-light mb-3">Choose a repository from your GitHub account</p>
            
            {fetchingRepos ? (
              <div className="flex items-center justify-center py-8 bg-background-alt rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>
                  <span className="text-sm text-text-light">Loading repositories...</span>
                </div>
              </div>
            ) : repositories.length === 0 ? (
              <div className="text-center py-8 bg-background-alt rounded-lg border border-border">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm text-text-light">No repositories found</p>
                <p className="text-xs text-text-light mt-1">Make sure you have repositories in your GitHub account</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => handleRepositorySelect(repo)}
                      className={`
                        w-full text-left px-4 py-3 border-b border-border last:border-b-0 
                        transition-all duration-200 hover:bg-background-alt cursor-pointer
                        ${selectedRepo?.id === repo.id ? 'bg-secondary/5 border-l-4 border-l-secondary' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-primary text-sm truncate">
                              {repo.full_name}
                            </span>
                            {repo.private && (
                              <span className="px-2 py-0.5 text-xs bg-background-alt text-text-light rounded">
                                Private
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <div className="text-xs text-text-light mt-1 truncate">
                              {repo.description}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-1.5">
                            {repo.language && (
                              <span className="text-xs text-text-light flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                {repo.language}
                              </span>
                            )}
                            <span className="text-xs text-text-light">
                              📦 {repo.default_branch || 'main'}
                            </span>
                            <span className="text-xs text-text-light">
                              ⭐ {repo.stargazers_count || 0}
                            </span>
                          </div>
                        </div>
                        {selectedRepo?.id === repo.id ? (
                          <span className="text-secondary text-sm font-medium ml-3">✓ Selected</span>
                        ) : (
                          <span className="ml-3 px-3 py-1 text-xs bg-primary hover:bg-primary-light text-white rounded transition-colors">
                            Select
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Project Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="Enter project name"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none"
                >
                  <option value="" disabled>Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Repository URL */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Repository URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.repository_url}
                  onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.repository_branch}
                  onChange={(e) => setFormData({ ...formData, repository_branch: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background-alt border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder="main"
                />
                <p className="text-xs text-text-light mt-1">Default: main</p>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Link
              href="/dashboard/projects"
              className="px-6 py-2.5 text-sm font-medium text-text-light hover:text-primary transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.project_name || !formData.project_type || !formData.repository_url}
              className={`
                px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all
                ${loading || !formData.project_name || !formData.project_type || !formData.repository_url 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-custom hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}