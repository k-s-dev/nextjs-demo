export interface ServerActionProps<TFormState> {
  prevState: TFormState;
  formData: FormData;
}

export type TServerAction<TFormState> = (
  prevState: TFormState | null,
  formData: FormData,
) => Promise<TFormState>;

export type TDataRequestMode = "server" | "client";

export type TServerResponseStatus = "error" | "success" | "pending";

export type TServerResponse<GData = undefined> = {
  status: TServerResponseStatus;
  data?: GData;
  errors?: string[];
  log?: unknown;
};

export type TServerResponsePromise<GData = undefined> = Promise<
  TServerResponse<GData>
>;
