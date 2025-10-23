import styles from "./FormControl.module.scss";
import FormMessage, { FormMessageProps } from "../FormMessage";
import FormControlError, { FormControlErrorProps } from "./FormControlError";

export default function FormControl({
  children,
  errorsProps,
  messagesProps,
}: {
  children?: React.ReactNode;
  errorsProps?: FormControlErrorProps;
  messagesProps?: FormMessageProps;
}) {
  return (
    <section className={styles.container}>
      {children}
      <FormControlError {...errorsProps} />
      <FormMessage {...messagesProps} />
    </section>
  );
}
