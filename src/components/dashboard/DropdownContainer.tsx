// DropdownContainer.tsx
import { Dropdown } from "../ui/Dropdown";
import { PrimaryButton } from "../ui/PrimaryButton";

interface DropdownContainerProps {
  wilayah: string;
  setWilayah: (val: string) => void;
  komoditas: string;
  setKomoditas: (val: string) => void;
  bulan: string;
  setBulan: (val: string) => void;
  onCekHarga: () => void;
  wilayahOptions: string[];
  komoditasOptions: string[];
}

export const DropdownContainer = ({
  wilayah, setWilayah,
  komoditas, setKomoditas,
  bulan, setBulan,
  onCekHarga,
  wilayahOptions,
  komoditasOptions
}: DropdownContainerProps) => {
  return (
    <div className="bg-brand-bg mx-4 p-5 rounded-xl shadow-lg">
      <Dropdown 
        label="PILIH WILAYAH" 
        icon="akar-icons:location" 
        // Tambahkan opsi "Nasional" jika belum ada
        options={["NASIONAL", ...wilayahOptions]} 
        value={wilayah} 
        onChange={setWilayah} 
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Dropdown 
          label="PILIH KOMODITAS" 
          icon="akar-icons:basket" 
          options={komoditasOptions} 
          value={komoditas} 
          onChange={setKomoditas} 
        />
        <Dropdown 
          label="PILIH BULAN" 
          icon="akar-icons:calendar" 
          options={["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]} 
          value={bulan} 
          onChange={setBulan} 
        />
      </div>
      <PrimaryButton onClick={onCekHarga} />
    </div>
  );
};