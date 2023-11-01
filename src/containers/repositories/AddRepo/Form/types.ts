import { type z } from "zod";
import { type addRepoSchema } from "./schemas";

export type CreateRepoFormInputs = z.infer<typeof addRepoSchema>

export type UseCreateRepoFormProps = {
  onIsOpenChange: (isOpen: boolean) => void;
}