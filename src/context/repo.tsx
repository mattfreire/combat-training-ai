import React, { type ReactNode } from "react";
import { type Repository } from "@prisma/client";
import { AddRepoDialog } from "~/containers/repositories/AddRepo";

interface RepoContextProps {
  repo: Repository | null;
  setRepo: React.Dispatch<React.SetStateAction<Repository | null>>;
  openAddRepoDialog: () => void;
}

export const RepoContext = React.createContext<RepoContextProps>({
  repo: null,
  setRepo: () => null,
  openAddRepoDialog: () => null,
});

export const RepoProvider = ({ children }: { children: ReactNode }) => {
  const [repo, setRepo] = React.useState<Repository | null>(null);
  const [isOpen, onIsOpenChange] = React.useState(false);

  return (
    <RepoContext.Provider
      value={{ repo, setRepo, openAddRepoDialog: () => onIsOpenChange(true) }}
    >
      <AddRepoDialog isOpen={isOpen} onIsOpenChange={onIsOpenChange} />
      {children}
    </RepoContext.Provider>
  );
};

const useRepoContext = () => React.useContext(RepoContext);

export const useRepo = () => {
  const context = useRepoContext();

  // add a keyboard shortcut listener to open the add repo dialog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "n" && event.metaKey) {
        event.preventDefault();
        context.openAddRepoDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [context]);

  return { ...context };
};
