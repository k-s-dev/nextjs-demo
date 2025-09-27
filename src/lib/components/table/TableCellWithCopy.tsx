import { HtmlHTMLAttributes } from "react";
import CopyIcon from "../icons/CopyIcon";

export default function TableCellWithCopy({
  text,
  children,
  copyText,
  className = "table-cell",
  ...attrs
}: {
  text?: string;
  children?: React.ReactNode;
  copyText?: string;
  className?: string;
  attrs?: HtmlHTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className={className} {...attrs}>
      {text}
      {children}
      {text && copyText && <CopyIcon copyText={copyText} />}
      {text && !copyText && <CopyIcon copyText={text} />}
      {!text && copyText && <CopyIcon copyText={copyText} />}
    </div>
  );
}
