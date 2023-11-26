import { type File } from "@prisma/client";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useDojo } from "~/context/repo";
import { api } from "~/utils/api";

function FileViewerPlaceholder() {
  return (
    <Textarea
      disabled
      placeholder="Select a file to view its contents"
      className="h-full flex-1 cursor-not-allowed flex-col p-4 opacity-50"
    />
  );
}

function FileViewerSkeleton() {
  return (
    <Skeleton className="h-full flex-1 flex-col p-4">
      <Textarea
        disabled
        placeholder="Loading file contents..."
        className="h-full flex-1 cursor-not-allowed flex-col p-4 opacity-50"
      />
    </Skeleton>
  );
}

function FileTextarea({ file }: { file: File }) {
  const { data: contents, isLoading } = api.repo.getFileContent.useQuery({
    fileId: file.id,
  });

  if (isLoading) {
    return <FileViewerSkeleton />;
  }

  console.log(contents);

  return <Textarea value={contents} className="h-full flex-1 flex-col p-4" />;
}

export function FileViewer() {
  const { file, repo } = useDojo();

  if (!file || !repo) {
    return <FileViewerPlaceholder />;
  }

  return <FileTextarea file={file} />;
}
