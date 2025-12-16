"use client";

import React, { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Save } from "lucide-react";

// Placeholder komponen untuk Form Input dan Preview PDF
const InvoiceForm = () => (
    <div className="p-4 space-y-4">
        <div className="p-4 border border-dashed rounded-lg border-slate-300 bg-slate-50 text-slate-500 text-center">
            Area Form Input
        </div>
    </div>
);

const InvoicePreview = () => (
    <div className="flex items-center justify-center h-full bg-slate-100 border rounded-lg">
        <div className="text-slate-400 text-center">
            <p>Preview PDF</p>
            <p className="text-sm">Menunggu Data...</p>
        </div>
    </div>
);

export default function Home() {
    // Hydration fix untuk Zustand persist (mencegah error hydration mismatch)
    const [isHydrated, setIsHydrated] = useState(false);
    const { data, resetForm } = useInvoiceStore();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header / Navbar Sederhana */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                        M
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 leading-tight">
                            Invoice Generator
                        </h1>
                        <p className="text-xs text-slate-500">
                            Minilemon Technology • Project ID:{" "}
                            {data.invoiceNumber}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    "Apakah Anda yakin ingin mereset formulir? Data akan hilang."
                                )
                            ) {
                                resetForm();
                            }
                        }}
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan PDF
                    </Button>
                </div>
            </header>

            {/* Main Content: Split Screen */}
            <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:flex gap-6 overflow-hidden">
                {/* KIRI: Form Input (Scrollable) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto h-full pr-1">
                    <Card className="border-slate-200 shadow-sm">
                        <div className="p-4 border-b bg-slate-50/50">
                            <h2 className="font-semibold text-slate-700">
                                Detail Transaksi
                            </h2>
                        </div>
                        <InvoiceForm />
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <div className="p-4 border-b bg-slate-50/50">
                            <h2 className="font-semibold text-slate-700">
                                Item & Produk
                            </h2>
                        </div>
                        <div className="p-4">
                            {/* Placeholder Item List */}
                            <div className="p-8 border border-dashed rounded border-slate-200 text-center text-slate-400">
                                List Item akan muncul di sini
                            </div>
                        </div>
                    </Card>
                </div>

                {/* KANAN: PDF Preview (Sticky/Fixed di Desktop) */}
                <div className="hidden lg:block w-full lg:w-1/2 h-[calc(100vh-140px)] sticky top-24">
                    <Card className="h-full border-slate-200 shadow-md bg-slate-500/5 flex flex-col overflow-hidden">
                        <div className="p-3 border-b bg-white flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">
                                Live Preview (A4)
                            </span>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 bg-slate-100 rounded text-slate-500">
                                    100%
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-hidden bg-slate-300/50 flex items-center justify-center">
                            {/* Area Preview Dokumen */}
                            <div className="bg-white shadow-xl w-[400px] h-[565px] flex items-center justify-center">
                                <InvoicePreview />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
