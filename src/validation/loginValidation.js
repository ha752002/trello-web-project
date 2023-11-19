import { object, string } from "yup";

export const signUpFormSchema = object({
    email: string().email().required(),
});