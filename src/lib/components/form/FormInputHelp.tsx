import { Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import { FaCircleInfo } from "react-icons/fa6";

export default function FormInputHelp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTarget>
        <FaCircleInfo />
      </PopoverTarget>
      <PopoverDropdown>{children}</PopoverDropdown>
    </Popover>
  );
}
