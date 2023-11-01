import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useCreateRepo } from "./form";
import { type UseCreateRepoFormProps } from "./types";
import { DialogClose, DialogFooter } from "~/components/ui/dialog";

export function AddRepoForm({ onIsOpenChange }: UseCreateRepoFormProps) {
  const { form, onSubmit, isSubmitting } = useCreateRepo({ onIsOpenChange });

  return (
    <DialogFooter className="w-full sm:justify-start">
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>
                  This is your public repository URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </DialogFooter>
  );
}
