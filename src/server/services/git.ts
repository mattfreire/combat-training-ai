import { simpleGit } from 'simple-git';

export const gitService = {
  async cloneRepo(repoUrl: string) {
    const repo = simpleGit();
    const sourceFolderName = this.getNameFromURL(repoUrl)
    if (!sourceFolderName) throw new Error(`Source folder name not found for repo ${repoUrl}`)
    const path = process.cwd() + '/tmp/repos/' + sourceFolderName
    try {
      await repo.clone(repoUrl, path)
    }
    catch (e) {
      const clonedRepo = simpleGit(path)
      await clonedRepo.pull()
    }
    return {
      path,
      sourceFolderName
    }
  },
  getNameFromURL(gitUrl: string) {
    const match = gitUrl.match(/github\.com\/([^\/]+)\/([^\.]+)/);
    if (match) {
        const [, username, projectName] = match;
        return `${username}_${projectName}`
    } else {
        throw new Error('Invalid GitHub URL format');
    }
  }
}
