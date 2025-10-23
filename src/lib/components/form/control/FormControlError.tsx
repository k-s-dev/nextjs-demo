import FormError from "../FormError";
import styles from "./FormControlError.module.scss";

export default function FormControlError({
  errors,
  containerClass = styles.container,
  headerClass = styles.header,
  listClass = styles.container,
  itemClass = styles.item,
  appendContainerClass = true,
  appendHeaderClass = true,
  appendItemClass = true,
  appendListClass = true,
}: FormControlErrorProps) {
  return (
    <FormError
      errors={errors}
      title={null}
      containerClass={containerClass}
      headerClass={headerClass}
      listClass={listClass}
      itemClass={itemClass}
      appendContainerClass={appendContainerClass}
      appendHeaderClass={appendHeaderClass}
      appendListClass={appendListClass}
      appendItemClass={appendItemClass}
    />
  );
}

export interface FormControlErrorProps {
  errors?: string[];
  containerClass?: string;
  headerClass?: string;
  listClass?: string;
  itemClass?: string;
  appendContainerClass?: boolean;
  appendHeaderClass?: boolean;
  appendListClass?: boolean;
  appendItemClass?: boolean;
}
