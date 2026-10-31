import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("NTT (Nusa Tenggara Timur)");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    "Jawa Timur",
    "Jawa Barat",
    "Jawa Tengah",
    "NTB (Nusa Tenggara Barat)",
    "NTT (Nusa Tenggara Timur)",
  ];

  // Otomatis menutup dropdown jika pengguna mengeklik di luar area komponen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div className="relative rounded-xl mb-2 min-w-0" ref={dropdownRef}>
      {/* Label Atas */}
      <div className="flex items-center gap-2 mb-1.5 font-semibold">
        <Icon icon="akar-icons:location" className="text-lg text-brand-icon shrink-0" />
        <h3 className="text-xs text-brand-gray truncate">PILIH WILAYAH</h3>
      </div>

      {/* 1. TOMBOL UTAMA (TRIGGER) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-5 py-3 rounded-xl border flex justify-between items-center w-full cursor-pointer bg-white transition-all duration-300 ease-in-out select-none ${
          isOpen
            ? "border-brand-yellow ring-1 ring-brand-yellow/10 shadow-md -translate-y-0.5"
            : "border-black/20 hover:border-brand-yellow/50 hover:shadow-sm text-black/70"
        }`}
      >
        <p className="font-medium truncate min-w-0 text-left text-slate-800">{selected}</p>

        {/* Animasi Panah Berputar & Membesar Halus */}
        <Icon
          icon="basil:caret-down-outline"
          className={`text-2xl shrink-0 transition-all duration-300 ease-out ${
            isOpen ? "rotate-180 text-brand-yellow scale-110" : "text-slate-400"
          }`}
        />
      </button>

      {/* 2. MENU DROPDOWN DENGAN ANIMASI FADE + SLIDE + SCALE */}
      <div
        className={`absolute left-0 right-0 mt-1 z-50 bg-white border border-slate-200/80 rounded-2xl shadow-xl max-h-56 overflow-y-auto p-1.5 transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {options.map((option, index) => {
          const isSelected = selected === option;
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer select-none ${
                isSelected
                  ? "bg-brand-yellow text-white font-bold translate-x-1"
                  : "text-slate-700 hover:bg-brand-yellow/10 hover:text-brand-yellow hover:translate-x-1"
              }`}
            >
              <span>{option}</span>
              {isSelected && (
                <Icon icon="akar-icons:check" className="text-base shrink-0 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};