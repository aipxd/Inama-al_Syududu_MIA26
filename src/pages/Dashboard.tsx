import { useState, useEffect } from "react";
import { DropdownContainer } from "../components/dashboard/DropdownContainer";
import Header from "../components/dashboard/Header";
import { InfoSection } from "../components/dashboard/InfoSection";
import { fetchCekPanganData, MONTH_NAMES_ID, type AppData } from "../lib/data"

export const Dashboard = () => {
  const [appData, setAppData] = useState<AppData | null>(null)
  
  const [wilayah, setWilayah] = useState("");
  const [komoditas, setKomoditas] = useState("");
  const [bulan, setBulan] = useState("");
  
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCekPanganData();
        setAppData(data);

        const daftarProvinsi = data.meta.provinces || [];
        const daftarKomoditas = data.meta.commodities
          ? Object.values(data.meta.commodities).map((item: any) =>
              typeof item === "object" ? item.label : item
            )
          : [];

        if (daftarProvinsi.length > 0) {
          setWilayah("NASIONAL");
        }
        if (daftarKomoditas.length > 0) {
          setKomoditas(daftarKomoditas[0]);
        }
        if (data.meta.latestMonth && data.meta.latestMonth.includes("-")) {
          const monthIndex = parseInt(data.meta.latestMonth.split("-")[1], 10) -1;
          if (MONTH_NAMES_ID[monthIndex]) {
            setBulan(MONTH_NAMES_ID[monthIndex])
          }
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
          wilayahOptions={appData? ["NASIONAL", ...appData.meta.provinces] : []}
          komoditasOptions={appData? Object.values(appData.meta.commodities).map((item: any) => 
            typeof item === "object" ? item.label : item
          ) : []
          }
        
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