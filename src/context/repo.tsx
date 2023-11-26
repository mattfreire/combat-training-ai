import React, { type ReactNode } from "react";
import { type File, type Repository } from "@prisma/client";
import { AddRepoDialog } from "~/containers/repositories/AddRepo";

interface DojoContextProps {
  repo: Repository | null;
  file: File | null;
  setRepo: React.Dispatch<React.SetStateAction<Repository | null>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  openAddRepoDialog: () => void;
}

export const DojoContext = React.createContext<DojoContextProps>({
  repo: null,
  file: null,
  setRepo: () => null,
  setFile: () => null,
  openAddRepoDialog: () => null,
});

export const DojoProvider = ({ children }: { children: ReactNode }) => {
  const [repo, setRepo] = React.useState<Repository | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [isOpen, onIsOpenChange] = React.useState(false);

  return (
    <DojoContext.Provider
      value={{
        repo,
        setRepo,
        openAddRepoDialog: () => onIsOpenChange(true),
        file,
        setFile,
      }}
    >
      <AddRepoDialog isOpen={isOpen} onIsOpenChange={onIsOpenChange} />
      {children}
    </DojoContext.Provider>
  );
};

const useDojoContext = () => React.useContext(DojoContext);

export const useDojo = () => {
  const context = useDojoContext();

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
