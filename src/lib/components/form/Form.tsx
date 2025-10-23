import styles from "./Form.module.scss";

export default function Form({ children, ...formProps }: FormProps) {
  return (
    <form
      className={styles.form}
      {...formProps}
    >
      {children}
    </form>
  );
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}
