import { Icon } from "@iconify/react";

interface CardRata2Props {
    bulan: string,
    harga: string;
    satuan: string,
    persentase: string,
    status: "Turun" | "Naik" | "Stabil",
}

export const CardRata2Harga = ({ bulan, harga, satuan, persentase, status }: CardRata2Props) => {
    const isTurun = status === "Turun";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-black/15">
        <div className="text-sm flex justify-between items-center">
            <h3 className="font-medium text-brand-gray">Harga rata-rata {bulan}</h3>
            
            {/* Nanti ganti */}
            <div className=" text-brand-icon text-xs bg-brand-icon/15 border border-brand-icon/40 p-2 rounded-full min-w-35 flex justify-center items-center gap-2">
                <Icon icon={isTurun ? "akar-icons:triangle-down-fill" : "akar-icons:triangle-up-fill"} className="text-xl"/>
                <p>{status} {persentase} dari bulan sebelumnya</p>
            </div>
        </div>

        {/* Nanti ganti */}
        <div className="flex items-center justify-start gap-2 my-3">
            <p className="font-semibold text-3xl">{harga}</p> 
            <p className="text-brand-gray">{satuan}</p>
        </div>

        {/* Nanti ganti */}
        <div className="flex gap-1 text-xs justify-center items-center text-brand-gray">
            <Icon icon="ant-design:info-circle-outlined" fontSize={35} />
            <p className="">
                Data Januari 2021-2026. Data ini bersumber dari Badan Pangan Nasional yang telah diolah oleh internal kami.
            </p>
        </div>
    </div>
  )
}