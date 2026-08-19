import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/env/[projectId] - Get environment variables
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
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
  { params }: { params: Promise<{ projectId: string }> }
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

// DELETE /api/env/[projectId] - Delete environment variable (envId in request body)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = await createClient();
    const { projectId } = await params;
    const body = await request.json();
    const { envId } = body;
    
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

    if (!envId) {
      return NextResponse.json(
        { error: 'Missing required field: envId' },
        { status: 400 }
      );
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
}