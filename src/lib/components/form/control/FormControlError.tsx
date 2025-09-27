import FormError from "../FormError";

export default function FormControlError({
  errors,
  rootClass = "form-control-error",
  itemClass = "form-control-error-item",
}: {
  errors?: string[];
  rootClass?: string;
  itemClass?: string;
}) {
  return (
    <FormError
      errors={errors}
      title={null}
      rootClass={rootClass}
      itemClass={itemClass}
    />
  );
}
