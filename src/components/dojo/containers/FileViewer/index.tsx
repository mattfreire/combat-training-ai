import { type File } from "@prisma/client";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
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

function ContextMenuWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-full">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function FileTextarea({ file }: { file: File }) {
  const { data: contents, isLoading } = api.repo.getFileContent.useQuery({
    fileId: file.id,
  });

  if (isLoading) {
    return <FileViewerSkeleton />;
  }

  return (
    <ContextMenuWrapper>
      <Textarea value={contents} className="h-full flex-1 flex-col p-4" />
    </ContextMenuWrapper>
  );
}

export function FileViewer() {
  const { file, repo } = useDojo();

  if (!file || !repo) {
    return <FileViewerPlaceholder />;
  }

  return <FileTextarea file={file} />;
}
