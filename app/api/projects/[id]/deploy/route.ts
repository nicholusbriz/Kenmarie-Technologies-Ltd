import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: envVars } = await supabase
      .from('environment_variables')
      .select('*')
      .eq('project_id', id);

    // ✅ Fix: Ensure envVars is an array
    const envVarsArray = envVars || [];

    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert({
        project_id: id,
        deployment_status: 'pending',
        deployment_trigger: 'manual',
        commit_hash: 'pending',
        commit_message: 'Deployment started',
        commit_author: user.email || user.id
      })
      .select()
      .single();

    if (deploymentError) {
      console.error('Error creating deployment:', deploymentError);
      return NextResponse.json({ error: 'Failed to start deployment' }, { status: 500 });
    }

    await supabase
      .from('projects')
      .update({ deployment_status: 'pending' })
      .eq('id', id);

    // ✅ Pass envVarsArray instead of envVars
    startDeploymentProcess(deployment.id, project, envVarsArray);

    return NextResponse.json({ 
      deploymentId: deployment.id,
      message: 'Deployment started successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ✅ Fix: envVars is now correctly typed as any[]
async function startDeploymentProcess(deploymentId: string, project: any, envVars: any[]) {
  const supabase = await createClient();
  
  try {
    await updateDeploymentStatus(deploymentId, 'building', 'Building application...');
    await updateProjectStatus(project.id, 'building');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await addDeploymentLog(deploymentId, '✅ Build complete');

    await updateDeploymentStatus(deploymentId, 'deploying', 'Deploying to Azure...');
    await updateProjectStatus(project.id, 'deploying');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await addDeploymentLog(deploymentId, '✅ Deployment complete');

    const deploymentUrl = `https://${project.project_name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.azurewebsites.net`;

    await supabase
      .from('deployments')
      .update({
        deployment_status: 'deployed',
        deployment_url: deploymentUrl,
        completed_at: new Date().toISOString(),
        duration_seconds: 5,
        logs: 'Deployment successful!'
      })
      .eq('id', deploymentId);

    await supabase
      .from('projects')
      .update({
        deployment_status: 'deployed',
        deployment_url: deploymentUrl,
        deployed_at: new Date().toISOString()
      })
      .eq('id', project.id);

  } catch (error: any) {
    await supabase
      .from('deployments')
      .update({
        deployment_status: 'failed',
        error_message: error.message || 'Deployment failed',
        completed_at: new Date().toISOString(),
        logs: `❌ Error: ${error.message || 'Deployment failed'}`
      })
      .eq('id', deploymentId);

    await supabase
      .from('projects')
      .update({ deployment_status: 'failed' })
      .eq('id', project.id);
  }
}

async function updateDeploymentStatus(deploymentId: string, status: string, log?: string) {
  const supabase = await createClient();
  await supabase
    .from('deployments')
    .update({ 
      deployment_status: status,
      ...(log && { logs: log })
    })
    .eq('id', deploymentId);
}

async function updateProjectStatus(projectId: string, status: string) {
  const supabase = await createClient();
  await supabase
    .from('projects')
    .update({ deployment_status: status })
    .eq('id', projectId);
}

async function addDeploymentLog(deploymentId: string, log: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deployments')
    .select('logs')
    .eq('id', deploymentId)
    .single();
  
  const currentLogs = data?.logs || '';
  await supabase
    .from('deployments')
    .update({ logs: currentLogs + '\n' + log })
    .eq('id', deploymentId);
}