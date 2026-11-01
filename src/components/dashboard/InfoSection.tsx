import type { AppData } from "../../lib/data";
import { formatRupiah } from "../../lib/data";
import { CardRata2Harga } from "../ui/CardRata2Harga";
import { InfoSumber } from "../ui/InfoSumber";
import PolaHargaChart from "../ui/PolaHargaChart";
import { RecommendCard } from "../ui/RecommendCard";
import { SaranPangi } from "../ui/SaranPangi";
import { TermurahMahalCard } from "../ui/TermurahMahalCard";

interface InfoSectionProps {
  isLoading: boolean;
  appData: AppData | null;
  selectedWilayah: string;
  selectedKomoditas: string;
  selectedBulan: string;
}

export const InfoSection = ({
  isLoading,
  appData,
  selectedWilayah,
  selectedKomoditas,
  selectedBulan,
}: InfoSectionProps) => {
  // 1. Tampilan Skeleton Loading
  if (isLoading || !appData) {
    return (
      <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col items-center gap-5 pt-10 pb-25 w-full">
        <div className="bg-slate-200 animate-pulse w-full h-36 rounded-2xl"></div>
        <div className="bg-slate-200 animate-pulse w-full h-48 rounded-2xl"></div>
        <div className="bg-slate-200 animate-pulse w-full h-64 rounded-2xl"></div>
      </div>
    );
  }

  const commodityId =
    Object.keys(appData.meta.commodities).find(
      (key) => appData.meta.commodities[key] === selectedKomoditas
    ) || "";

  const isMinyak = selectedKomoditas.toLowerCase().includes("minyak");
  const satuan = isMinyak ? "liter" : "kg";

  let hargaTerbaru = 0;
  let persentaseMoM = 0;
  
  if (commodityId && appData.latest[commodityId]) {
    const targetRegionKey =
    selectedWilayah === "NASIONAL" ||
    selectedWilayah === "Seluruh Indonesia / Nasional (38 Provinsi)"
    ? "NASIONAL"
    : selectedWilayah;
    
    const dataHargaRegional = appData.latest[commodityId][targetRegionKey];
    
    if (dataHargaRegional) {
      hargaTerbaru = dataHargaRegional.price;
      persentaseMoM = dataHargaRegional.mom;
    }
  }

  let status: "Turun" | "Naik" | "Stabil" = "Stabil";
  if (persentaseMoM > 0) status = "Naik";
  else if (persentaseMoM < 0) status = "Turun";

  const displayPersentase = `${Math.abs(persentaseMoM).toFixed(1)}%`;

  return (
    <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col justify-center items-center gap-5 pt-10 pb-25">
      <CardRata2Harga
        bulan={selectedBulan.toUpperCase()}
        harga={formatRupiah(hargaTerbaru)}
        satuan={satuan}
        persentase={displayPersentase}
        status={status}
      />

      <div className="bg-white rounded-2xl shadow-lg w-full">
        <RecommendCard />
        <div className="flex flex-row justify-around items-center p-3 gap-4">
          <TermurahMahalCard />
          <TermurahMahalCard />
        </div>
          <SaranPangi />
      </div>

      <PolaHargaChart />
      <InfoSumber />
    </div>
  );
};