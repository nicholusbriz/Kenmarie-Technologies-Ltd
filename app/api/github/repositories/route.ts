import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/github/repositories - Fetch user's GitHub repositories
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's GitHub access token from the session
    const { data: { session } } = await supabase.auth.getSession();
    const githubToken = session?.provider_token || user.user_metadata?.provider_token;

    console.log('GitHub token check:', { 
      hasSession: !!session, 
      hasProviderToken: !!session?.provider_token,
      hasUserMetadata: !!user.user_metadata?.provider_token,
      userIdentities: user.identities?.length || 0
    });

    if (!githubToken) {
      return NextResponse.json({ error: 'No GitHub token found. Please re-authenticate with GitHub.' }, { status: 400 });
    }

    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch repositories from GitHub' }, { status: response.status });
    }

    const repositories = await response.json();

    // Format repositories for the frontend
    const formattedRepos = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      default_branch: repo.default_branch || 'main',
      description: repo.description,
      language: repo.language,
      updated_at: repo.updated_at,
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
