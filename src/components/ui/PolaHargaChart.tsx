import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis } from 'recharts';

const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 7200 },
  { month: 'Apr', revenue: 6100 },
  { month: 'Mei', revenue: 8900 },
  { month: 'Jun', revenue: 7400 },
  { month: 'Jul', revenue: 7400 },
  { month: 'Agu', revenue: 7400 },
  { month: 'Sep', revenue: 7400 },
  { month: 'Okt', revenue: 7400 },
  { month: 'Nov', revenue: 7400 },
  { month: 'Des', revenue: 7400 },
];

// 1. Cari nilai tertinggi dan terendah secara otomatis
const revenues = data.map((d) => d.revenue);
const maxVal = Math.max(...revenues);
const minVal = Math.min(...revenues);

// Dapatkan nama bulan termahal & termurah untuk tampilan legenda
const maxMonth = data.find((d) => d.revenue === maxVal)?.month;
const minMonth = data.find((d) => d.revenue === minVal)?.month;

export default function PolaHargaChart() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-black/15">
      {/* Header Judul */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-2 bg-[#41B573] rounded-xl"></div>
        <h3 className="font-semibold text-sm text-slate-800">
          Pola Harga 12 Bulan (Rata-Rata 5 Tahun)
        </h3>
      </div>

      {/* 2. Legenda Warna */}
      <div className="flex items-center gap-4 text-xs mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#41B573]"></span>
          <span className="text-slate-600 font-medium">Termurah ({minMonth})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
          <span className="text-slate-600 font-medium">Termahal ({maxMonth})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200"></span>
          <span className="text-slate-500">Bulan lainnya</span>
        </div>
      </div>

      {/* 3. Area Chart */}
      <div className="w-full">
        <BarChart
          style={{ width: '100%', maxWidth: 600, maxHeight: '70vh', aspectRatio: 1.7 }}
          responsive
          data={data}
          margin={{ top: 25, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#64748b" 
            fontSize={11}
            interval={0}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: any) => [`Rp ${value}`, 'Harga']}
            cursor={{ fill: '#63636320' }}
          />
          
          <Bar dataKey="revenue" barSize={26} radius={[4, 4, 0, 0]}>
            {/* 4. Pemetaan 3 warna dinamis pada tiap batang */}
            {data.map((entry, index) => {
              let color = '#E2E8F0'; // Default: Abu-abu (Bulan lainnya)
              if (entry.revenue === maxVal) color = '#EF4444'; // Merah (Termahal)
              if (entry.revenue === minVal) color = '#41B573'; // Hijau (Termurah)

              return <Cell key={`cell-${index}`} fill={color} />;
            })}

            <LabelList 
              dataKey="revenue" 
              position="top" 
              fontSize={10} 
              fontWeight="bold"
              fill="#475569"
              formatter={(val: any) => (val ? `${(Number(val) / 1000).toFixed(1)}k` : '')}
            />
          </Bar>
        </BarChart>
      </div>

      {/* Footer Keterangan */}
      <span className="text-xs text-brand-gray mt-2 block italic text-center">
        *Harga rata-rata per kg/liter dalam ribuan rupiah (k)
      </span>
    </div>
  );
}