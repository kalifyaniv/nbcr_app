import React, { createContext, useState, useContext, useEffect } from 'react';
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
});

export const useRepository = () => useContext(RepositoryContext);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { githubClient } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () => {
    if (!githubClient) return;
    
    setLoading(true);
    try {
      const githubRepos = await githubClient.getRepositories();
      const { data: dbRepos } = await supabase
        .from('repositories')
        .select('*');

      const mappedRepos: Repository[] = githubRepos.map(repo => {
        const dbRepo = dbRepos?.find(r => r.full_name === repo.full_name);
        return {
          id: repo.id.toString(),
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || '',
          isNbcrEnabled: dbRepo?.is_nbcr_enabled || false,
          defaultBranch: repo.default_branch,
          nbcrEnabledBranches: dbRepo?.nbcr_enabled_branches || [],
          avatarUrl: repo.owner.avatar_url,
          updatedAt: repo.updated_at,
        };
      });

      setRepositories(mappedRepos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRepository = (id: string) => {
    const repo = repositories.find(r => r.id === id) || null;
    setSelectedRepository(repo);
  };

  const toggleNbcrForRepository = async (id: string) => {
    const repo = repositories.find(r => r.id === id);
    if (!repo) return;

    const isNbcrEnabled = !repo.isNbcrEnabled;
    const nbcrEnabledBranches = isNbcrEnabled 
      ? [...repo.nbcrEnabledBranches, repo.defaultBranch]
      : [];

    const { error } = await supabase
      .from('repositories')
      .upsert({
        id,
        full_name: repo.fullName,
        is_nbcr_enabled: isNbcrEnabled,
        nbcr_enabled_branches: nbcrEnabledBranches,
      });

    if (error) {
      console.error('Error updating repository:', error);
      return;
    }

    setRepositories(repos =>
      repos.map(r =>
        r.id === id
          ? { ...r, isNbcrEnabled, nbcrEnabledBranches }
          : r
      )
    );

    if (selectedRepository?.id === id) {
      setSelectedRepository(prev =>
        prev ? { ...prev, isNbcrEnabled, nbcrEnabledBranches } : null
      );
    }
  };

  const toggleNbcrForBranch = async (repoId: string, branch: string) => {
    const repo = repositories.find(r => r.id === repoId);
    if (!repo) return;

    const branchExists = repo.nbcrEnabledBranches.includes(branch);
    const nbcrEnabledBranches = branchExists
      ? repo.nbcrEnabledBranches.filter(b => b !== branch)
      : [...repo.nbcrEnabledBranches, branch];

    const { error } = await supabase
      .from('repositories')
      .upsert({
        id: repoId,
        full_name: repo.fullName,
        is_nbcr_enabled: nbcrEnabledBranches.length > 0,
        nbcr_enabled_branches: nbcrEnabledBranches,
      });

    if (error) {
      console.error('Error updating repository branches:', error);
      return;
    }

    setRepositories(repos =>
      repos.map(r =>
        r.id === repoId
          ? {
              ...r,
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
              isNbcrEnabled: nbcrEnabledBranches.length > 0,
              nbcrEnabledBranches,
            }
          : null
      );
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
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};