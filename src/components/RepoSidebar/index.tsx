import { cn } from "~/lib/utils";
import { type File, type Repository } from "@prisma/client";
import { api } from "~/utils/api";
import {
  Accordion,
  FileAccordionContent,
  FileAccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FileIcon } from "@radix-ui/react-icons";
import { FolderIcon } from "lucide-react";
import { useDojo } from "~/context/repo";

export type RepoSidebarProps = {
  repo: Repository;
};

function FileRow({ file }: { file: File }) {
  const { setFile } = useDojo();
  return (
    <div className="flex items-center space-x-2">
      <button
        className="flex flex-shrink-0 items-center space-x-2"
        onClick={() => {
          setFile(file);
        }}
      >
        <FileIcon className="h-4 w-4" />
        <span>{file.name}</span>
      </button>
    </div>
  );
}

interface TreeNode extends File {
  children: TreeNode[];
}

function TreeRenderer({ node }: { node: TreeNode }) {
  if (node.children.length === 0) {
    return <FileRow file={node} />;
  }

  return (
    <Accordion type="single" collapsible>
      <FileAccordionItem value={node.name}>
        <AccordionTrigger className="py-1">
          <div className="flex flex-shrink-0 items-center space-x-2">
            <FolderIcon className="h-4 w-4" />
            <span>{node.name}</span>
          </div>
        </AccordionTrigger>
        <FileAccordionContent>
          <div className="ml-3 space-y-2">
            {/* Recursively render child nodes */}
            {node.children.map((childNode, i) => (
              <TreeRenderer key={i} node={childNode} />
            ))}
          </div>
        </FileAccordionContent>
      </FileAccordionItem>
    </Accordion>
  );
}

export function RepoSidebar({ repo }: RepoSidebarProps) {
  const { data: files, isLoading } = api.repo.getFiles.useQuery({
    repoId: repo.id,
  });

  if (isLoading) return <>Loading...</>;

  function buildTree(files: File[]): TreeNode[] {
    const root: TreeNode[] = [];

    files.forEach((file) => {
      const filePath = file.relativePath;
      const pathParts = filePath.split("/");
      let currentNode = root;

      pathParts.forEach((part) => {
        const existingNode = currentNode.find((node) => node.name === part);

        if (existingNode) {
          currentNode = existingNode.children;
        } else {
          const newNode: TreeNode = {
            name: part,
            children: [],
            relativePath: filePath,
            url: file.url,
            id: file.id,
            repoId: file.repoId,
          };
          currentNode.push(newNode);
          currentNode = newNode.children;
        }
      });
    });

    return root;
  }

  const tree = buildTree(files ?? []);

  // start the tree after the repo name
  const root = tree[0]!.children[0]!.children;

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {root.map((node, i) => {
            return <TreeRenderer node={node} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}
