import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddRepoForm } from "./Form";
import React from "react";

export function AddRepoButton() {
  const [isOpen, onIsOpenChange] = React.useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={onIsOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Repo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Repository</DialogTitle>
          <DialogDescription>
            Copy and paste the repository URL to import.
          </DialogDescription>
        </DialogHeader>
        <AddRepoForm onIsOpenChange={onIsOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
