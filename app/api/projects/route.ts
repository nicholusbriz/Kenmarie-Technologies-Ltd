import { createClient } from '@/lib/supabase/server';
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
}