"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { type PopoverProps } from "@radix-ui/react-popover";
import { type Repository } from "@prisma/client";

import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { useDojo } from "~/context/repo";

interface RepoSelectorProps extends PopoverProps {
  repos: Repository[];
}

export function RepoSelector({ repos, ...props }: RepoSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const {
    repo: selectedRepo,
    setRepo: setSelectedRepo,
    openAddRepoDialog,
  } = useDojo();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a repo..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedRepo ? selectedRepo.name : "Load a repo..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search repos..." />
          <CommandEmpty>No repos found.</CommandEmpty>
          <CommandGroup heading="Examples">
            {repos.map((repo) => (
              <CommandItem
                key={repo.id}
                onSelect={() => {
                  setSelectedRepo(repo);
                  setOpen(false);
                }}
              >
                {repo.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedRepo?.id === repo.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup className="pt-0">
            <CommandItem
              onSelect={() => {
                openAddRepoDialog();
              }}
            >
              Add a repo
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
