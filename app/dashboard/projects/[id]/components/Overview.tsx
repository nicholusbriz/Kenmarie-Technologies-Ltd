interface OverviewProps {
  project: any;
  deployments: any[];
  envVars: any[];
}

export default function Overview({ project, deployments, envVars }: OverviewProps) {
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
      {/* Project Details */}
      <div className="bg-background-alt p-4 md:p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4">Project Details</h2>
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
            <label className="block text-sm font-medium text-text-light mb-1">Created</label>
            <p className="text-sm">{new Date(project.created_at).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Last Deployed</label>
            <p className="text-sm">{project.deployed_at ? new Date(project.deployed_at).toLocaleString() : 'Never'}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background-alt p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary">{deployments.length}</div>
          <div className="text-sm text-text-light">Total Deployments</div>
        </div>
        <div className="bg-background-alt p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary">{envVars.length}</div>
          <div className="text-sm text-text-light">Environment Variables</div>
        </div>
        <div className="bg-background-alt p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary">
            {deployments.filter(d => d.deployment_status === 'deployed').length}
          </div>
          <div className="text-sm text-text-light">Successful Deployments</div>
        </div>
      </div>
    </div>
  );
}
