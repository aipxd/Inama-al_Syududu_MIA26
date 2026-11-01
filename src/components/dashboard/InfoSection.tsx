import { CardRata2Harga } from "../ui/CardRata2Harga";
import { InfoSumber } from "../ui/InfoSumber";
import PolaHargaChart from "../ui/PolaHargaChart";
import { RecommendCard } from "../ui/RecommendCard";
import { SaranPangi } from "../ui/SaranPangi";
import { TermurahMahalCard } from "../ui/TermurahMahalCard";

interface InfoSectionProps {
  isLoading: boolean;
}

export const InfoSection = ({ isLoading }: InfoSectionProps) => {
  if (isLoading) {
    return (
      <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col items-center gap-5 pt-10 pb-25 w-full">
        {/* Skeleton Card Rata-rata */}
        <div className="bg-slate-200 animate-pulse w-full h-32 rounded-2xl"></div>
        {/* Skeleton Rekomendasi Area */}
        <div className="bg-slate-200 animate-pulse w-full h-48 rounded-2xl"></div>
        {/* Skeleton Chart */}
        <div className="bg-slate-200 animate-pulse w-full h-64 rounded-2xl"></div>
      </div>
    )
  }
  return (
    <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col justify-center items-center gap-5 pt-10 pb-25">
        <CardRata2Harga 
          bulan="Januari 2025"
          harga="Rp 35.000"
          satuan="/kg"
          persentase="1.8%"
          status="Turun"
        />
        <div className="bg-white rounded-2xl shadow-lg">
          <RecommendCard />
          <div className="flex flex-row justify-around items-center p-3 gap-4 ">
            <TermurahMahalCard />
            <TermurahMahalCard />
          </div>
          <SaranPangi />
        </div>
        <PolaHargaChart />
        <InfoSumber />
    </div>
  )
}
