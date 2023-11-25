import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { type File, type Repository } from "@prisma/client";
import { api } from "~/utils/api";
import { ScrollArea } from "../ui/scroll-area";

export type RepoSidebarProps = {
  repo: Repository;
};

function FileRow({ file }: { file: File }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        <Button className="text-sm font-semibold">{file.url}</Button>
      </div>
    </div>
  );
}

export function RepoSidebar({ repo }: RepoSidebarProps) {
  const { data: files, isLoading } = api.repo.getFiles.useQuery({
    repoId: repo.id,
  });

  if (isLoading) return <>Loading...</>;

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {files?.map((file) => <FileRow key={file.id} file={file} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
