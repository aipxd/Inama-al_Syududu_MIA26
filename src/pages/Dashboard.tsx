import { useState, useEffect } from "react";
import { DropdownContainer } from "../components/dashboard/DropdownContainer";
import Header from "../components/dashboard/Header";
import { InfoSection } from "../components/dashboard/InfoSection";
import { fetchCekPanganData, type AppData, formatRupiah } from "../lib/data"

export const Dashboard = () => {
  const [appData, setAppData] = useState<AppData | null>(null)
  
  const [wilayah, setWilayah] = useState("Seluruh Indonesia / Nasional (38 Provinsi)");
  const [komoditas, setKomoditas] = useState("Bawang Putih");
  const [bulan, setBulan] = useState("Januari");
  
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCekPanganData();
        setAppData(data);

        if (data.meta.latestMonth) {
          setBulan(data.meta.latestMonth);
        }
        setShowData(true);
      } catch (error) {
        console.log("Gagal memuat data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCekHarga = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  return (
    <section>
      <Header />
      
      <div className="py-4 pb-8">
        <DropdownContainer 
          wilayah={wilayah}
          setWilayah={setWilayah}
          komoditas={komoditas} 
          setKomoditas={setKomoditas}
          bulan={bulan} 
          setBulan={setBulan}
          onCekHarga={handleCekHarga}
        />
      </div>

      <div>
        {showData && (
          <InfoSection 
            isLoading={isLoading}
            appData={appData}
            selectedWilayah={wilayah}
            selectedKomoditas={komoditas}
            selectedBulan={bulan} 
          />
        )}
      </div>
    </section>
  );
};