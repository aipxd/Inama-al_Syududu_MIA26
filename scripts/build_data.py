"""
build_data.py - ubah CSV Bapanas (data.go.id) menjadi 5 JSON kecil untuk website.
Pakai : python scripts/build_data.py data-raw/bapanas_harga_pangan.csv public/data
Butuh : pandas, numpy
Kolom CSV: Kode Provinsi, Nama Provinsi, Komoditas, Tahun, Bulan, Harga ("Rp12,072" atau "-")
"""
import json, sys
from pathlib import Path
import numpy as np
import pandas as pd

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "data-raw/bapanas_harga_pangan.csv")
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "public/data")
OUT.mkdir(parents=True, exist_ok=True)

# nama di CSV -> (id, label tampil, satuan). Satuan mengikuti standar Panel Harga Bapanas (tidak tercantum di CSV).
COMMODITIES = {
    "Beras Medium":           ("beras-medium", "Beras medium", "Rp/kg"),
    "Beras Premium":          ("beras-premium", "Beras premium", "Rp/kg"),
    "Cabai Merah Keriting":   ("cabai-merah-keriting", "Cabai merah keriting", "Rp/kg"),
    "Cabai Rawit Merah":      ("cabai-rawit-merah", "Cabai rawit merah", "Rp/kg"),
    "Bawang Merah":           ("bawang-merah", "Bawang merah", "Rp/kg"),
    "Bawang Putih (Bonggol)": ("bawang-putih", "Bawang putih", "Rp/kg"),
    "Telur Ayam Ras":         ("telur", "Telur ayam ras", "Rp/kg"),
    "Gula Pasir Lokal/Curah": ("gula", "Gula pasir", "Rp/kg"),
    "Minyak Goreng Kemasan":  ("minyak-goreng", "Minyak goreng kemasan", "Rp/liter"),
    "Daging Ayam Ras":        ("daging-ayam", "Daging ayam ras", "Rp/kg"),
    "Daging Sapi Murni":      ("daging-sapi", "Daging sapi", "Rp/kg"),
}
BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
         "September", "Oktober", "November", "Desember"]
YEARS = range(2021, 2026)          # hanya tahun lengkap untuk pola musiman
MIN_MONTHS, MIN_YR_NAT, MIN_YR_PROV = 10, 3, 2
LEGACY = " (SEBELUM 2024)"

# ---- 1. Baca dan bersihkan ----
df = pd.read_csv(SRC)
df["prov"] = df["Nama Provinsi"].str.strip().str.upper().replace({"D.I YOGYAKARTA": "DI YOGYAKARTA"})
df["m"] = df["Bulan"].str.strip().map({b: i + 1 for i, b in enumerate(BULAN)})
df["ym"] = df["Tahun"].astype(str) + "-" + df["m"].astype(int).astype(str).str.zfill(2)
df["h"] = pd.to_numeric(df["Harga"].str.replace("Rp", "", regex=False).str.replace(",", "", regex=False)
                        .replace("-", np.nan), errors="coerce")
df.loc[df.h <= 0, "h"] = np.nan
df = df[df.Komoditas.isin(COMMODITIES)].copy()
df["cid"] = df.Komoditas.map(lambda c: COMMODITIES[c][0])
# Papua dan Papua Barat sebelum 2024 = wilayah lama (sebelum pemekaran): tidak boleh disambung dengan sesudahnya.
old = (df.Tahun <= 2023) & df.prov.isin(["PAPUA", "PAPUA BARAT"])
df.loc[old, "prov"] = df.loc[old, "prov"] + LEGACY

# ---- 2. Buang nilai janggal (heuristik 0,2x-5x median komoditas-provinsi) ----
med = df.groupby(["cid", "prov"]).h.transform("median")
bad = df.h.notna() & ((df.h < 0.2 * med) | (df.h > 5 * med))
removed = int(bad.sum()); df.loc[bad, "h"] = np.nan

months = [str(p) for p in pd.period_range(df.ym.min(), df.ym.max(), freq="M")]
per = pd.PeriodIndex(months, freq="M")
isleg = lambda p: p.endswith(LEGACY)

def season_index(s, min_years):
    rows, used = [], []
    for y in YEARS:
        v = s[[p for p in s.index if p.year == y]].dropna()
        if len(v) >= MIN_MONTHS:
            mean = v.mean(); rows.append({p.month: x / mean for p, x in v.items()}); used.append(y)
    if len(rows) < min_years:
        return None, used
    t = pd.DataFrame(rows).mean()
    return [None if m not in t.index or pd.isna(t[m]) else round(float(t[m]), 3) for m in range(1, 13)], used

monthly, national, seasonal, latest, years_used = {}, {}, {}, {}, {}
for cid, sub in df.groupby("cid"):
    piv = sub.pivot(index="ym", columns="prov", values="h").reindex(months)
    shown = [p for p in piv.columns if not isleg(p)]
    monthly[cid] = {p: [None if pd.isna(v) else float(v) for v in piv[p]] for p in shown}
    cnt = piv.notna().sum(axis=1)
    nat = piv.median(axis=1).where(cnt >= 10)          # nasional = median antar provinsi (minimal 10 provinsi)
    national[cid] = [None if pd.isna(v) else float(v) for v in nat]
    seasonal[cid], years_used[cid] = {}, {}
    seasonal[cid]["NASIONAL"], years_used[cid]["NASIONAL"] = season_index(pd.Series(nat.values, index=per), MIN_YR_NAT)
    for p in shown:
        seasonal[cid][p], years_used[cid][p] = season_index(pd.Series(piv[p].values, index=per), MIN_YR_PROV)
    latest[cid] = {}
    for p in shown:
        s = piv[p]; last = s.iloc[-1]
        if pd.isna(last): continue
        prev, yago = s.iloc[-2], s.iloc[-13]
        latest[cid][p] = {"price": float(last),
                          "mom": None if pd.isna(prev) else round((last / prev - 1) * 100, 1),
                          "yoy": None if pd.isna(yago) else round((last / yago - 1) * 100, 1)}

first = df[df.cid == "beras-medium"].dropna(subset=["h"]).groupby("prov").ym.min()
limited = sorted(p for p in first.index if not isleg(p) and first[p] > months[0])
meta = {
    "source": "Badan Pangan Nasional (Bapanas) melalui data.go.id (Satu Data Indonesia)",
    "dataset": "Rata-rata Harga Pangan Bulanan Tingkat Konsumen Provinsi (Angka Januari 2026)",
    "license": "Belum diverifikasi: cek ketentuan pemakaian di data.go.id",
    "unit": "Rupiah per kg (minyak goreng: per liter)",
    "months": months,
    "provinces": sorted(p for p in df.prov.unique() if not isleg(p)),
    "commodities": [{"id": v[0], "label": v[1], "unit": v[2], "csvName": k} for k, v in COMMODITIES.items()],
    "latestMonth": months[-1],
    "seasonalYears": years_used,
    "limitedProvinces": limited,
    "notes": [
        "Rata-rata harga bulanan tingkat konsumen per provinsi. Bukan harga real-time.",
        "Rata-rata nasional dihitung sendiri (median antar provinsi, minimal 10 provinsi), bukan angka resmi.",
        "Satuan mengikuti standar Panel Harga Bapanas; tidak tercantum di berkas data.",
        "Indeks musiman memakai tahun lengkap 2021-2025 (tahun dengan minimal 10 bulan terisi).",
        "Provinsi hasil pemekaran Papua baru punya data sejak 2024; Papua dan Papua Barat sebelum 2024 tidak disambung.",
        "Nilai janggal dibuang dengan aturan 0,2 sampai 5 kali median (heuristik): %d nilai." % removed,
    ],
}
for name, obj in [("meta", meta), ("monthly", monthly), ("national", national), ("seasonal", seasonal), ("latest", latest)]:
    (OUT / f"{name}.json").write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(name, (OUT / f"{name}.json").stat().st_size // 1024, "KB")
print("bulan:", months[0], "-", months[-1], "| provinsi:", len(meta["provinces"]), "| nilai janggal dibuang:", removed)
