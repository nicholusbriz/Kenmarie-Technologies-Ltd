import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    const { data: deployment, error } = await supabase
      .from('deployments')
      .select(`
        *,
        projects!inner (
          user_id
        )
      `)
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
}