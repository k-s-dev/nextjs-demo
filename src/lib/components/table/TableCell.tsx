import { HtmlHTMLAttributes } from "react";

export default function TableCell({
  children,
  className = "table-cell",
  ...attrs
}: {
  children: React.ReactNode;
  className?: string;
  attrs?: HtmlHTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className={className} {...attrs}>
      {children}
    </div>
  );
}
