export interface ServerActionProps<TFormState> {
  prevState: TFormState;
  formData: FormData;
}

export type TServerAction<TFormState> = (
  prevState: TFormState | null,
  formData: FormData,
) => Promise<TFormState>;

export type TDataRequestMode = "server" | "client";
