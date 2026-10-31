import { Icon } from "@iconify/react";

export const PrimaryButton = () => {
  return (
    <div>
        <button className="bg-brand-yellow w-full mt-5 p-3 rounded-xl font-semibold flex justify-center items-center gap-2 shadow-sm cursor-pointer hover:bg-yellow-400 transition-all duration-200 ease-out hover:scale-101">
            <Icon icon="akar-icons:search" fontSize={20}/>
            <label>Cek Harga</label>
        </button>
    </div>
  )
}
