import { useForm } from "react-hook-form";
import { addRepoSchema } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";
import {
  type UseCreateRepoFormProps,
  type CreateRepoFormInputs,
} from "./types";

export const useCreateRepo = ({ onIsOpenChange }: UseCreateRepoFormProps) => {
  const defaultValues: Partial<CreateRepoFormInputs> = {
    path: "",
  };

  const form = useForm<CreateRepoFormInputs>({
    resolver: zodResolver(addRepoSchema),
    defaultValues,
    mode: "onChange",
  });

  const createRepo = api.repo.create.useMutation();
  const utils = api.useContext();

  async function onSubmit(data: CreateRepoFormInputs) {
    console.log("submitting");
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

    await utils.repo.getAll.invalidate();
    onIsOpenChange(false);
  }

  const isSubmitting = form.formState.isSubmitting;
  const disabled = !form.formState.isValid || isSubmitting;
  const dirty = form.formState.isDirty;

  return {
    form,
    onSubmit,
    disabled,
    dirty,
    isSubmitting,
  };
};
