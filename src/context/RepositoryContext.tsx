import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  isNbcrEnabled: boolean;
  defaultBranch: string;
  nbcrEnabledBranches: string[];
  avatarUrl: string;
  updatedAt: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repositoryId: string;
  repositoryName: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  mergedAt: string | null;
  status: 'open' | 'merged' | 'closed';
  reviewStatus: 'pending' | 'approved' | 'changes_requested' | 'commented';
  reviewers: Array<{
    login: string;
    avatarUrl: string;
    status: 'pending' | 'approved' | 'changes_requested' | 'commented';
  }>;
  isMergedBeforeReview: boolean;
}

interface RepositoryContextType {
  repositories: Repository[];
  selectedRepository: Repository | null;
  pullRequests: PullRequest[];
  pendingReviews: PullRequest[];
  loading: boolean;
  selectRepository: (id: string) => void;
  toggleNbcrForRepository: (id: string) => Promise<void>;
  toggleNbcrForBranch: (repoId: string, branch: string) => Promise<void>;
  fetchRepositories: () => Promise<void>;
  fetchPullRequests: () => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextType>({
  repositories: [],
  selectedRepository: null,
  pullRequests: [],
  pendingReviews: [],
  loading: false,
  selectRepository: () => {},
  toggleNbcrForRepository: async () => {},
  toggleNbcrForBranch: async () => {},
  fetchRepositories: async () => {},
  fetchPullRequests: async () => {},
});

export const useRepository = () => useContext(RepositoryContext);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { githubClient, user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRepositories = useCallback(async () => {
    if (!githubClient || !user) return;
    
    setLoading(true);
    try {
      const githubRepos = await githubClient.getRepositories();
      const { data: dbRepos } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user.id);

      const mappedRepos: Repository[] = githubRepos.map(repo => {
        const dbRepo = dbRepos?.find(r => r.full_name === repo.full_name);
        return {
          id: dbRepo?.id || '', // Use the database ID if it exists
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || '',
          isNbcrEnabled: dbRepo?.is_nbcr_enabled || false,
          defaultBranch: repo.default_branch,
          nbcrEnabledBranches: dbRepo?.nbcr_enabled_branches || [],
          avatarUrl: repo.owner.avatar_url,
          updatedAt: repo.updated_at || new Date().toISOString(),
        };
      });

      setRepositories(mappedRepos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  }, [githubClient, user]);

  // Add useEffect to fetch repositories when githubClient becomes available
  useEffect(() => {
    if (githubClient && repositories.length === 0) {
      fetchRepositories();
    }
  }, [githubClient, repositories.length, fetchRepositories]);

  const fetchPullRequests = useCallback(async () => {
    if (!githubClient || !user) return;
    
    setLoading(true);
    try {
      const allPullRequests: PullRequest[] = [];
      
      // Fetch pull requests for each repository
      for (const repo of repositories) {
        const [owner, repoName] = repo.fullName.split('/');
        const prs = await githubClient.getPullRequests(owner, repoName);
        
        // Get reviews for each PR
        for (const pr of prs) {
          const reviews = await githubClient.getReviews(owner, repoName, pr.number);
          
          const mappedPR: PullRequest = {
            id: pr.id.toString(),
            number: pr.number,
            title: pr.title,
            repositoryId: repo.id,
            repositoryName: repo.fullName,
            author: {
              login: pr.user?.login || 'unknown',
              avatarUrl: pr.user?.avatar_url || '',
            },
            createdAt: pr.created_at,
            mergedAt: pr.merged_at,
            status: pr.merged_at ? 'merged' : pr.state === 'open' ? 'open' : 'closed',
            reviewStatus: reviews.length > 0 ? 'commented' : 'pending',
            reviewers: reviews.map(review => ({
              login: review.user?.login || 'unknown',
              avatarUrl: review.user?.avatar_url || '',
              status: review.state as 'pending' | 'approved' | 'changes_requested' | 'commented',
            })),
            isMergedBeforeReview: !!pr.merged_at && reviews.length === 0,
          };
          
          allPullRequests.push(mappedPR);
        }
      }
      
      setPullRequests(allPullRequests);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    } finally {
      setLoading(false);
    }
  }, [githubClient, user, repositories]);

  // Add useEffect to fetch pull requests when repositories are loaded
  useEffect(() => {
    if (repositories.length > 0) {
      fetchPullRequests();
    }
  }, [repositories, fetchPullRequests]);

  const selectRepository = (id: string) => {
    const repo = repositories.find(r => r.id === id) || null;
    setSelectedRepository(repo);
  };

  const toggleNbcrForRepository = async (id: string) => {
    const repo = repositories.find(r => r.id === id);
    if (!repo || !user) return;

    const isNbcrEnabled = !repo.isNbcrEnabled;
    const nbcrEnabledBranches = isNbcrEnabled 
      ? [...repo.nbcrEnabledBranches, repo.defaultBranch]
      : [];

    const { data, error } = await supabase
      .from('repositories')
      .upsert({
        name: repo.name,
        full_name: repo.fullName,
        description: repo.description,
        is_nbcr_enabled: isNbcrEnabled,
        default_branch: repo.defaultBranch,
        nbcr_enabled_branches: nbcrEnabledBranches,
        avatar_url: repo.avatarUrl,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating repository:', error);
      return;
    }

    if (data) {
      setRepositories(repos =>
        repos.map(r =>
          r.id === id
            ? { ...r, id: data.id, isNbcrEnabled, nbcrEnabledBranches }
            : r
        )
      );

      if (selectedRepository?.id === id) {
        setSelectedRepository(prev =>
          prev ? { ...prev, id: data.id, isNbcrEnabled, nbcrEnabledBranches } : null
        );
      }
    }
  };

  const toggleNbcrForBranch = async (repoId: string, branch: string) => {
    const repo = repositories.find(r => r.id === repoId);
    if (!repo || !user) return;

    const branchExists = repo.nbcrEnabledBranches.includes(branch);
    const nbcrEnabledBranches = branchExists
      ? repo.nbcrEnabledBranches.filter(b => b !== branch)
      : [...repo.nbcrEnabledBranches, branch];

    const { data, error } = await supabase
      .from('repositories')
      .upsert({
        name: repo.name,
        full_name: repo.fullName,
        description: repo.description,
        is_nbcr_enabled: nbcrEnabledBranches.length > 0,
        default_branch: repo.defaultBranch,
        nbcr_enabled_branches: nbcrEnabledBranches,
        avatar_url: repo.avatarUrl,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating repository branches:', error);
      return;
    }

    if (data) {
      setRepositories(repos =>
        repos.map(r =>
          r.id === repoId
            ? {
                ...r,
                id: data.id,
                isNbcrEnabled: nbcrEnabledBranches.length > 0,
                nbcrEnabledBranches,
              }
            : r
        )
      );

      if (selectedRepository?.id === repoId) {
        setSelectedRepository(prev =>
          prev
            ? {
                ...prev,
                id: data.id,
                isNbcrEnabled: nbcrEnabledBranches.length > 0,
                nbcrEnabledBranches,
              }
            : null
        );
      }
    }
  };

  // Filter for pending reviews
  const pendingReviews = pullRequests.filter(
    pr => pr.status === 'merged' && 
    pr.reviewStatus === 'pending' && 
    pr.isMergedBeforeReview
  );

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        selectedRepository,
        pullRequests,
        pendingReviews,
        loading,
        selectRepository,
        toggleNbcrForRepository,
        toggleNbcrForBranch,
        fetchRepositories,
        fetchPullRequests,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};