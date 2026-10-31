import { Dropdown } from "../ui/Dropdown";
import { PrimaryButton } from "../ui/PrimaryButton";

interface DropdownProps {
  label: string;
  value: string;
}

export const DropdownContainer = ({label, value}: DropdownProps) => {
  return (
    <div className="bg-brand-bg mx-4 p-5 rounded-xl flex-row justify-center items-center shadow-lg">
      <Dropdown />
      <div className="grid grid-cols-2 gap-3 mt-4 ">
        <Dropdown />
        <Dropdown />
      </div>
      <PrimaryButton />
      
    </div>
  )
}

