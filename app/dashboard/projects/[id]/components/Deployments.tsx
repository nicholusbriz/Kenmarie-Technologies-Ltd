interface DeploymentsProps {
  projectId: string;
  deployments: any[];
  onTabChange: (tab: string) => void;
}

export default function Deployments({ projectId, deployments, onTabChange }: DeploymentsProps) {
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
    <div className="bg-background-alt p-6 rounded-lg border border-border">
      <h2 className="text-lg font-semibold text-primary mb-4">Deployment History</h2>
      {deployments.length === 0 ? (
        <p className="text-text-light text-sm">No deployments yet</p>
      ) : (
        <div className="space-y-3">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="p-4 bg-background rounded border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusColor(deployment.deployment_status)}`}
                  >
                    {deployment.deployment_status}
                  </span>
                  <span className="text-text-light text-sm">
                    {new Date(deployment.created_at).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onTabChange('logs')}
                  className="text-secondary hover:underline text-sm"
                >
                  View Logs →
                </button>
              </div>
              {deployment.commit_message && (
                <div className="text-sm text-text-light mt-2">
                  {deployment.commit_message}
                </div>
              )}
              {deployment.duration_seconds && (
                <div className="text-xs text-text-light mt-1">
                  Duration: {deployment.duration_seconds}s
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
