import { Icon } from "@iconify/react";

export const TermurahMahalCard = () => {
  return (
    <div>
        <div className="flex justify-center items-center text-white gap-2 bg-linear-to-r from-brand-primary to-brand-secondary p-2 rounded-xl">
            <Icon icon="andrsrxn:trend-down" fontWeight={100} className="bg-white p-1 rounded-md text-brand-icon text-3xl "/>
        <div>
            <h3 className="text-xs">Harga Termurah</h3>
            <div>
                <span className="text-base">Rp32.500</span>
                <span className="text-tiny">/kg</span>
            </div>
        </div>
        </div>

    </div>
  )
}
