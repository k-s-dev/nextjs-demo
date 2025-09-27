"use client";

import "./Form.scss";

export function FormSubmitButton({
  formId,
  isPending,
  buttonText = "Submit",
  children,
  className,
  ...props
}: IPropsFormButtonSubmit) {
  return (
    <button
      form={formId}
      disabled={isPending}
      className={!!className ? className : "form-btn-submit"}
      {...props}
    >
      {buttonText}
      {children}
    </button>
  );
}

export interface IPropsFormBtn {
  formId: string;
  isPending: boolean;
}

export interface IPropsFormButtonSubmit
  extends IPropsFormBtn,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string;
  children?: React.ReactNode;
  className?: string;
}
