const fs = require('fs');
const path = require('path');

// ============================================================
// 1. PROJECTS API - GET all projects, POST create project
// ============================================================
const projectsRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects - Get all projects for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('deployment_status', status);
    }
    if (type) {
      query = query.eq('project_type', type);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_name, project_type, repository_url, repository_branch } = body;

    if (!project_name || !project_type || !repository_url) {
      return NextResponse.json(
        { error: 'Missing required fields: project_name, project_type, repository_url' },
        { status: 400 }
      );
    }

    const validTypes = ['nodejs', 'python', 'html'];
    if (!validTypes.includes(project_type)) {
      return NextResponse.json(
        { error: 'Invalid project_type. Must be nodejs, python, or html' },
        { status: 400 }
      );
    }

    const repoName = repository_url.replace('https://github.com/', '').replace('.git', '');

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        project_name,
        project_type,
        repository_url,
        repository_name: repoName,
        repository_branch: repository_branch || 'main',
        deployment_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// 2. SINGLE PROJECT API - GET, PUT, DELETE
// ============================================================
const singleProjectRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects/[id] - Get a single project with deployments and env vars
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin for viewing any project
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userRole?.role === 'admin' || userRole?.role === 'super_admin';

    // Build query
    let query = supabase.from('projects').select('*').eq('id', id);
    
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data: project, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project:', error);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    // Get deployments
    const { data: deployments } = await supabase
      .from('deployments')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get environment variables
    const { data: envVars } = await supabase
      .from('environment_variables')
      .select('id, key, is_secret, created_at')
      .eq('project_id', id);

    return NextResponse.json({
      ...project,
      deployments: deployments || [],
      environment_variables: envVars || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_name, project_type, repository_url, repository_branch } = body;

    // Check if project exists and belongs to user
    const { data: existing, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates: any = {};
    if (project_name) updates.project_name = project_name;
    if (project_type) updates.project_type = project_type;
    if (repository_url) updates.repository_url = repository_url;
    if (repository_branch) updates.repository_branch = repository_branch;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if project exists and belongs to user
    const { data: existing, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// 3. DEPLOY API - POST deploy a project
// ============================================================
const deployRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/projects/[id]/deploy - Deploy a project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get environment variables
    const { data: envVars } = await supabase
      .from('environment_variables')
      .select('*')
      .eq('project_id', id);

    // Create deployment record
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

    // Update project status
    await supabase
      .from('projects')
      .update({ deployment_status: 'pending' })
      .eq('id', id);

    // Start deployment process asynchronously
    startDeploymentProcess(deployment.id, project, envVars);

    return NextResponse.json({ 
      deploymentId: deployment.id,
      message: 'Deployment started successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Async deployment process
async function startDeploymentProcess(deploymentId: string, project: any, envVars: any[]) {
  const supabase = await createClient();
  
  try {
    // Update status to building
    await updateDeploymentStatus(deploymentId, 'building', 'Building application...');
    await updateProjectStatus(project.id, 'building');

    // Simulate build (replace with actual Azure deployment)
    await new Promise(resolve => setTimeout(resolve, 2000));
    await addDeploymentLog(deploymentId, '✅ Build complete');

    // Update status to deploying
    await updateDeploymentStatus(deploymentId, 'deploying', 'Deploying to Azure...');
    await updateProjectStatus(project.id, 'deploying');

    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    await addDeploymentLog(deploymentId, '✅ Deployment complete');

    const deploymentUrl = \`https://\${project.project_name.toLowerCase().replace(/\\s/g, '-')}-\${Date.now()}.azurewebsites.net\`;

    // Update to deployed
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
        logs: \`❌ Error: \${error.message || 'Deployment failed'}\`
      })
      .eq('id', deploymentId);

    await supabase
      .from('projects')
      .update({ deployment_status: 'failed' })
      .eq('id', project.id);
  }
}

// Helper functions
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
    .update({ logs: currentLogs + '\\n' + log })
    .eq('id', deploymentId);
}`;

// ============================================================
// 4. DEPLOYMENT LOGS API
// ============================================================
const logsRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/deployments/[id]/logs - Get deployment logs
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get deployment and verify ownership
    const { data: deployment, error } = await supabase
      .from('deployments')
      .select(\`
        *,
        projects!inner (
          user_id
        )
      \`)
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Deployment not found' }, { status: 404 });
      }
      console.error('Error fetching deployment:', error);
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }

    return NextResponse.json({
      deployment_id: id,
      status: deployment.deployment_status,
      logs: deployment.logs || '',
      error_message: deployment.error_message,
      created_at: deployment.created_at,
      completed_at: deployment.completed_at,
      duration_seconds: deployment.duration_seconds
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// 5. ENVIRONMENT VARIABLES API
// ============================================================
const envRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/env/[projectId] - Get environment variables
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = await createClient();
    const { projectId } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: envVars, error } = await supabase
      .from('environment_variables')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching env vars:', error);
      return NextResponse.json({ error: 'Failed to fetch environment variables' }, { status: 500 });
    }

    const maskedVars = envVars.map((env) => ({
      ...env,
      value: env.is_secret ? '••••••••' : env.value
    }));

    return NextResponse.json(maskedVars);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/env/[projectId] - Create environment variable
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = await createClient();
    const { projectId } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const { key, value, is_secret } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: key, value' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('environment_variables')
      .select('id')
      .eq('project_id', projectId)
      .eq('key', key)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Environment variable already exists' },
        { status: 400 }
      );
    }

    const { data: envVar, error } = await supabase
      .from('environment_variables')
      .insert({
        project_id: projectId,
        key,
        value,
        is_secret: is_secret !== undefined ? is_secret : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating env var:', error);
      return NextResponse.json({ error: 'Failed to create environment variable' }, { status: 500 });
    }

    return NextResponse.json({
      ...envVar,
      value: envVar.is_secret ? '••••••••' : envVar.value
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/env/[projectId]/[envId] - Delete environment variable
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; envId: string } }
) {
  try {
    const supabase = await createClient();
    const { projectId, envId } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('environment_variables')
      .delete()
      .eq('id', envId)
      .eq('project_id', projectId);

    if (error) {
      console.error('Error deleting env var:', error);
      return NextResponse.json({ error: 'Failed to delete environment variable' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// 6. ADMIN USERS API
// ============================================================
const adminUsersRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userRole || !['admin', 'super_admin'].includes(userRole.role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(\`full_name.ilike.%\${search}%, github_username.ilike.%\${search}%\`);
    }
    if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]/role - Update user role (Super Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userRole || userRole.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden - Super Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, admin, or super_admin' },
        { status: 400 }
      );
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// 7. ADMIN PROJECTS API
// ============================================================
const adminProjectsRouteContent = `import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/projects - Get all projects (Admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userRole || !['admin', 'super_admin'].includes(userRole.role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    let query = supabase
      .from('projects')
      .select(\`
        *,
        users!inner (
          id,
          full_name,
          email
        )
      \`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('deployment_status', status);
    }
    if (type) {
      query = query.eq('project_type', type);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

// ============================================================
// CREATE ALL API FILES
// ============================================================

const API_BASE = path.join(process.cwd(), 'app', 'api');

// Ensure api directory exists
if (!fs.existsSync(API_BASE)) {
  fs.mkdirSync(API_BASE, { recursive: true });
}

// Define API routes to create
const apis = [
  // Projects
  { path: ['projects'], content: projectsRouteContent, file: 'route.ts' },
  { path: ['projects', '[id]'], content: singleProjectRouteContent, file: 'route.ts' },
  { path: ['projects', '[id]', 'deploy'], content: deployRouteContent, file: 'route.ts' },
  
  // Deployments
  { path: ['deployments', '[id]', 'logs'], content: logsRouteContent, file: 'route.ts' },
  
  // Environment Variables
  { path: ['env', '[projectId]'], content: envRouteContent, file: 'route.ts' },
  
  // Admin
  { path: ['admin', 'users'], content: adminUsersRouteContent, file: 'route.ts' },
  { path: ['admin', 'projects'], content: adminProjectsRouteContent, file: 'route.ts' },
];

// Create each API route
apis.forEach(({ path: pathParts, content, file }) => {
  let currentPath = API_BASE;
  
  pathParts.forEach((folder) => {
    currentPath = path.join(currentPath, folder);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath, { recursive: true });
    }
  });
  
  const filePath = path.join(currentPath, file);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 All API routes created successfully!');
console.log('\n📁 Created API routes:');
console.log('  - /api/projects (GET, POST)');
console.log('  - /api/projects/[id] (GET, PUT, DELETE)');
console.log('  - /api/projects/[id]/deploy (POST)');
console.log('  - /api/deployments/[id]/logs (GET)');
console.log('  - /api/env/[projectId] (GET, POST, DELETE)');
console.log('  - /api/admin/users (GET, PUT)');
console.log('  - /api/admin/projects (GET)');

console.log('\n🔒 All APIs are protected with authentication checks:');
console.log('  - All APIs require valid user session');
console.log('  - Admin APIs require admin or super_admin role');
console.log('  - User can only access their own projects');
console.log('  - RLS policies in database provide additional security');

console.log('\n📝 API Flow:');
console.log('  1. GET /api/projects → Fetch user projects');
console.log('  2. POST /api/projects → Create project');
console.log('  3. POST /api/projects/[id]/deploy → Deploy to Azure');
console.log('  4. GET /api/deployments/[id]/logs → Get deployment logs');
console.log('  5. GET /api/admin/users → Admin only - view all users');
console.log('  6. GET /api/admin/projects → Admin only - view all projects');