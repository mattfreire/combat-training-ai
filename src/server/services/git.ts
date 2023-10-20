import { simpleGit } from 'simple-git';

export const gitService = {
  async cloneRepo(repoUrl: string) {
    const repo = simpleGit();
    const path = process.cwd() + '/tmp/repos/' + repoUrl.split('/').slice(-1)[0]
    try {
      await repo.clone(repoUrl, path)
    }
    catch (e) {
      const clonedRepo = simpleGit(path)
      await clonedRepo.pull()
    }
    return {
      path
    }
  }
}
