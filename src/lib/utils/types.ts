export interface ServerActionProps<TFormState> {
  prevState: TFormState;
  formData: FormData;
}

export type TServerAction<TFormState> = (
  prevState: TFormState | null,
  formData: FormData,
) => Promise<TFormState>;

export type TDataRequestMode = "server" | "client";

export type TServerResponse<GData = undefined> = {
  status: "error" | "success" | "pending";
  data?: GData | undefined;
  errors?: string[];
  log?: unknown;
};

export type TServerResponsePromise<GData = undefined> = Promise<
  TServerResponse<GData>
>;
