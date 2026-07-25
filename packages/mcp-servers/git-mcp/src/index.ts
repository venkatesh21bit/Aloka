import { Module, Tool, Injectable, NitroStack } from '@nitrostack/core';
import { z } from 'zod';
import { Sanitizer } from '@omnitrace/sanitizer';

@Injectable()
export class GitService {
  public async readFile(repo: string, commit: string, path: string): Promise<string> {
    return Sanitizer.scrub(`Mock file content for ${path} at ${commit} in ${repo}`);
  }

  public async createBranchAndPr(repo: string, base: string, branch: string, changes: any[], title: string, body?: string): Promise<string> {
    return Sanitizer.scrub(`PR Created: ${title} in ${repo} (Branch: ${branch})`);
  }
}

@Module({ providers: [GitService] })
export class GitServer {
  constructor(private readonly gitService: GitService) {}

  @Tool({
    name: 'read_file_at_commit',
    description: 'Fetches exact file contents at a given commit SHA',
    schema: z.object({ repo: z.string(), commit: z.string(), path: z.string() })
  })
  async readFileAtCommit(args: { repo: string, commit: string, path: string }) {
    return await this.gitService.readFile(args.repo, args.commit, args.path);
  }

  @Tool({
    name: 'create_branch_and_pr',
    description: 'Stage fix, create branch, and open Pull Request',
    schema: z.object({
      repo_slug: z.string(),
      base_branch: z.string().default('main'),
      new_branch: z.string(),
      file_changes: z.array(z.object({ path: z.string(), content: z.string() })),
      pr_title: z.string(),
      pr_body: z.string().optional()
    })
  })
  async createBranchAndPr(args: { repo_slug: string, base_branch: string, new_branch: string, file_changes: any[], pr_title: string, pr_body?: string }) {
    return await this.gitService.createBranchAndPr(args.repo_slug, args.base_branch, args.new_branch, args.file_changes, args.pr_title, args.pr_body);
  }
}

NitroStack.start(GitServer);
