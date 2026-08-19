import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userRole } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single();

    // Handle both array and object return types from Supabase
    const rolesData = userRole?.roles;
    const roleName = Array.isArray(rolesData) && rolesData.length > 0 
      ? rolesData[0].name 
      : (rolesData as any)?.name;
    
    if (!userRole || !['admin', 'super_admin'].includes(roleName)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    let query = supabase
      .from('projects')
      .select(`
        *,
        users!inner (
          id,
          full_name,
          email
        )
      `)
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
}