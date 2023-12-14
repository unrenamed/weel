import { ReactNode, useState } from "react";
import { DropdownMenu } from "./";
import { ChevronDown } from "lucide-react";
import { classNames } from "../utils";

type Props = {
  content: ReactNode | string;
  icon: ReactNode;
  text: string;
};

export default function ButtonDropdown({ content, icon, text }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu content={content} onOpenChange={setOpen}>
      <button className="flex items-center justify-between space-x-2 rounded-md shadow transition-all active:scale-95 px-3 py-2.5 bg-white hover:shadow-md w-full xs:w-48">
        <div className="flex items-center space-x-2">
          {icon}
          <p className="text-sm">{text}</p>
        </div>
        <ChevronDown
          className={classNames(
            "h-4 w-4 text-gray-500 transition duration-75",
            open ? "rotate-180 transform" : ""
          )}
        />
      </button>
    </DropdownMenu>
  );
}
