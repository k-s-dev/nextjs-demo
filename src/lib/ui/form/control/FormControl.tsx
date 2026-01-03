import styles from "./FormControl.module.scss";
import FormMessages, { FormMessagesProps } from "../FormMessages";

export default function FormControl({
  children,
  errorsProps,
  messagesProps,
}: {
  children?: React.ReactNode;
  errorsProps?: FormMessagesProps;
  messagesProps?: FormMessagesProps;
}) {
  return (
    <section className={styles.container}>
      {children}
      <FormMessages error {...errorsProps} />
      <FormMessages {...messagesProps} />
    </section>
  );
}
