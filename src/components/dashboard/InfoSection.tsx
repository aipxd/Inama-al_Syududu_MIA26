import type { AppData } from "../../lib/data";
import { formatRupiah, MONTH_NAMES_ID } from "../../lib/data";
import { CardRata2Harga } from "../ui/CardRata2Harga";
import { InfoSumber } from "../ui/InfoSumber";
import { Loading } from "../ui/Loading";
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
  if (isLoading || !appData) {
    return <Loading />
  }

  // 1. Dapatkan ID Komoditas dari label terpilih
  let commodityId = "";
  if (Array.isArray(appData.meta.commodities)) {
    const found = appData.meta.commodities.find(
      (c: any) => c.label === selectedKomoditas || c.id === selectedKomoditas
    );
    if (found) commodityId = found.id;
  } else if (typeof appData.meta.commodities === "object") {
    commodityId =
      Object.keys(appData.meta.commodities).find((key) => {
        const item = appData.meta.commodities[key];
        const label = typeof item === "object" ? item.label : item;
        return label === selectedKomoditas || key === selectedKomoditas;
      }) || "";
  }

  if (!commodityId && appData.monthly) {
    commodityId = Object.keys(appData.monthly)[0] || "";
  }

  // 2. Ambil Array Harga Bulanan (Nasional vs Provinsi)
  const isNasional =
    !selectedWilayah ||
    selectedWilayah === "NASIONAL" ||
    selectedWilayah.includes("Nasional");

  const monthlyPrices: number[] = isNasional
    ? appData.national[commodityId] || []
    : appData.monthly[commodityId]?.[selectedWilayah] || [];

  // 3. Cari Indeks Bulan Terpilih & Bulan Sebelumnya (01-12)
  const selectedMonthIndex = MONTH_NAMES_ID.findIndex(
    (b) => b.toLowerCase() === selectedBulan.toLowerCase()
  );

  const targetMonthNum = (selectedMonthIndex >= 0 ? selectedMonthIndex + 1 : 1)
    .toString()
    .padStart(2, "0");

  const prevMonthIndex = selectedMonthIndex === 0 ? 11 : selectedMonthIndex - 1;
  const prevMonthNum = (prevMonthIndex + 1).toString().padStart(2, "0");

  // 4. Hitung Rata-Rata Harga Bulan Terpilih & Bulan Sebelumnya (2021-2025)
  const getAverageForMonth = (monthCode: string) => {
    if (!appData.meta.months || monthlyPrices.length === 0) return 0;

    const values: number[] = [];
    appData.meta.months.forEach((ymStr, idx) => {
      if (ymStr.endsWith(`-${monthCode}`) && monthlyPrices[idx] != null) {
        values.push(monthlyPrices[idx]);
      }
    });

    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / values.length);
  };

  const hargaRataRataBulanTerpilih = getAverageForMonth(targetMonthNum);
  const hargaRataRataBulanLalu = getAverageForMonth(prevMonthNum);

  // 5. Hitung Persentase Selisih (MoM) dan Status (Naik / Turun / Stabil)
  let persentaseSelisih = 0;
  if (hargaRataRataBulanLalu > 0 && hargaRataRataBulanTerpilih > 0) {
    persentaseSelisih =
      ((hargaRataRataBulanTerpilih - hargaRataRataBulanLalu) /
        hargaRataRataBulanLalu) *
      100;
  }

  let status: "Turun" | "Naik" | "Stabil" = "Stabil";
  if (persentaseSelisih > 0.1) status = "Naik";
  else if (persentaseSelisih < -0.1) status = "Turun";

  const displayPersentase = `${Math.abs(persentaseSelisih).toFixed(1)}%`;

  // 6. Penentuan Satuan Dinamis
  const isMinyak = selectedKomoditas.toLowerCase().includes("minyak");
  const satuan = isMinyak ? "liter" : "kg";

  // 7. Hitung Data Musiman (Seasonal) untuk RecommendCard (TENTUKAN DI SINI)
  const regionKey = isNasional ? "NASIONAL" : selectedWilayah;

  const seasonalArray: number[] =
    appData.seasonal[commodityId]?.[regionKey] || Array(12).fill(1);

  let minIdx = 0;
  let maxIdx = 0;

  seasonalArray.forEach((val, idx) => {
    if (val < seasonalArray[minIdx]) minIdx = idx;
    if (val > seasonalArray[maxIdx]) maxIdx = idx; // Koreksi nama variabel di sini
  });

  const bulanTermurah = MONTH_NAMES_ID[minIdx] || "Januari";
  const bulanTermahal = MONTH_NAMES_ID[maxIdx] || "Desember";

  const minVal = seasonalArray[minIdx] || 1;
  const maxVal = seasonalArray[maxIdx] || 1;
  const diffPercent = ((maxVal - minVal) / minVal) * 100;
  const displaySelisih = `${Math.round(diffPercent)}%`;

// Cari seluruh harga pada bulan terpilih khusus rentang tahun 2021-2025
  const pricesForSelectedMonth: number[] = [];
  if (appData.meta.months && monthlyPrices.length > 0) {
    appData.meta.months.forEach((ymStr, idx) => {
      const [year, mCode] = ymStr.split("-");
      const yearNum = parseInt(year, 10);
      if (mCode === targetMonthNum && yearNum >= 2021 && yearNum <= 2025) {
        const val = monthlyPrices[idx];
        if (val != null && val > 0) {
          pricesForSelectedMonth.push(val);
        }
      }
    });
  }

  const minHargaBulan =
    pricesForSelectedMonth.length > 0 ? Math.min(...pricesForSelectedMonth) : 0;
  const maxHargaBulan =
    pricesForSelectedMonth.length > 0 ? Math.max(...pricesForSelectedMonth) : 0;



  return (
    <div className="bg-brand-bg rounded-t-2xl p-4 min-h-screen flex flex-col justify-center items-center gap-5 pt-10 pb-25">
      {/* Kartu Rata-Rata Harga */}
      <CardRata2Harga
        bulan={selectedBulan}
        harga={formatRupiah(hargaRataRataBulanTerpilih)}
        satuan={satuan}
        persentase={displayPersentase}
        status={status}
      />

      {/* Kontainer Rekomendasi */}
      <div className="bg-white rounded-2xl shadow-lg w-full">
        <RecommendCard
          komoditas={selectedKomoditas}
          bulanTermurah={bulanTermurah}
          bulanTermahal={bulanTermahal}
          selisihPersen={displaySelisih}
        />
        <div className="flex flex-row justify-around items-center p-3 gap-4">
          <TermurahMahalCard 
          type="termurah"
          harga={formatRupiah(minHargaBulan)}
          satuan={satuan}
          />
          <TermurahMahalCard 
          type="termahal"
          harga={formatRupiah(maxHargaBulan)}
          satuan={satuan}
          />
        </div>
        <SaranPangi
          komoditas={selectedKomoditas}
          bulanTermurah={bulanTermurah}
          bulanTermahal={bulanTermahal}
          selectedBulan={selectedBulan}
          status={status}
        />
      </div>

      <PolaHargaChart />
      <InfoSumber />
    </div>
  );
};