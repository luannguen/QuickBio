import type { Article } from './api.types';

export const articleService = {
  async getArticlesByUserId(_userId: string): Promise<Article[]> {
    return [];
  },
  async getArticleById(_id: string): Promise<Article | null> {
    return null;
  },
  async createArticle(_userId: string, _payload: Partial<Article>): Promise<Article | null> {
    return null;
  },
  async updateArticle(_id: string, _payload: Partial<Article>): Promise<Article | null> {
    return null;
  },
  async deleteArticle(_id: string): Promise<boolean> {
    return false;
  },
  async getPublicArticles(_userId?: string | null): Promise<(Article & { profiles?: { full_name: string } })[]> {
    return [];
  },
  async getPublicArticleBySlug(_slug: string): Promise<(Article & { profiles?: { full_name: string } }) | null> {
    return null;
  },
  async adminGetAllArticles(): Promise<(Article & { profiles?: { full_name: string, email: string } })[]> {
    return [];
  },
  async adminModerateArticle(_id: string, _action: 'approved' | 'warned' | 'suspended', _warningMessage?: string): Promise<boolean> {
    return false;
  }
};
