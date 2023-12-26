import { Search } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";
import { TextInput } from ".";
import { cn } from "../utils";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  function SearchInput({ className, placeholder, ...props }: InputProps, ref) {
    return (
      <div className="w-full">
        <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-secondary/80" />
        </div>
        <TextInput
          ref={ref}
          placeholder={placeholder ?? "Search..."}
          className={cn("pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);

export default SearchInput;
