import { ReactNode, useState } from "react";
import { DropdownMenu } from "./";
import { ChevronDown } from "lucide-react";
import { classNames } from "../utils";

type Props = {
  icon: ReactNode;
  text: string;
  items: { value: string; display: string }[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function ButtonDropdown({
  icon,
  text,
  items,
  selected,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu
      open={open}
      setOpen={setOpen}
      items={items}
      selected={selected}
      onSelect={(value) => {
        setOpen(false);
        onSelect(value);
      }}
    >
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
