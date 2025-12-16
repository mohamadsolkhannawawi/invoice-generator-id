import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { InvoiceType } from "@/lib/schemas";

export const LogoUpload = () => {
  const { setValue, watch } = useFormContext<InvoiceType>();
  const logo = watch("senderDetails.logo");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Batas 2MB agar LocalStorage tidak penuh
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan string base64 ke form state
        setValue("senderDetails.logo", reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setValue("senderDetails.logo", "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />
      
      {logo ? (
        <div className="relative group w-32 h-32 border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={logo} 
            alt="Logo Perusahaan" 
            className="w-full h-full object-contain p-2" 
          />
          <button
            type="button"
            onClick={removeLogo}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            title="Hapus Logo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group bg-slate-50"
        >
          <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <ImagePlus className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
          </div>
          <span className="text-[10px] font-medium text-slate-500 text-center px-2">
            Upload Logo
            <span className="block text-[9px] text-slate-400 font-normal mt-0.5">(Max 2MB)</span>
          </span>
        </div>
      )}
    </div>
  );
};