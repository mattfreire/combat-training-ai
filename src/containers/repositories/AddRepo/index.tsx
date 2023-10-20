import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "~/components/ui/use-toast";
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
import { type AddRepoFormValues, addRepoSchema } from "./schemas";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const defaultValues: Partial<AddRepoFormValues> = {
  path: "",
};

export function AddRepoForm() {
  const form = useForm<AddRepoFormValues>({
    resolver: zodResolver(addRepoSchema),
    defaultValues,
    mode: "onChange",
  });
  const createRepo = api.repo.create.useMutation();

  async function onSubmit(data: AddRepoFormValues) {
    await createRepo.mutateAsync(
      {
        repoUrl: data.path,
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
        onSettled: () => {
          form.reset(defaultValues);
        },
        onSuccess: () => {
          toast({
            title: "Repo Created",
            description: "Your repo has been added to Combat Training.",
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
