import FormMessage from "../FormMessage";
import FormControlError from "./FormControlError";

export default function FormControl({
  children,
  errors,
  messages,
  errorRootClass = "form-control-error",
  errorItemClass = "form-control-error-item",
}: {
  children?: React.ReactNode;
  errors: string[] | undefined;
  messages?: string[] | undefined;
  errorRootClass?: string;
  errorItemClass?: string;
}) {
  return (
    <section className="form-control">
      {children}
      <FormControlError
        errors={errors}
        rootClass={errorRootClass}
        itemClass={errorItemClass}
      />
      <FormMessage messages={messages} />
    </section>
  );
}
