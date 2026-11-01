import { CardRata2Harga } from "../ui/CardRata2Harga";
import PolaHargaChart from "../ui/PolaHargaChart";
import { RecommendCard } from "../ui/RecommendCard";
import { SaranPangi } from "../ui/SaranPangi";
import { TermurahMahalCard } from "../ui/TermurahMahalCard";

export const InfoSection = () => {
  return (
    <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col gap-5 pt-10">
        <CardRata2Harga />
        <div className="bg-white rounded-2xl shadow-lg">
          <RecommendCard />
          <div className="flex flex-row justify-center items-center p-3 gap-4">
            <TermurahMahalCard />
            <TermurahMahalCard />
          </div>
          <SaranPangi />
        </div>
        <PolaHargaChart />
    </div>
  )
}
