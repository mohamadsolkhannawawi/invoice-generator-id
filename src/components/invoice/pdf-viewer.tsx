"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { SimpleTemplate } from "@/components/pdf-templates/simple-template";
import { Loader2 } from "lucide-react";

// Import PDFViewer secara dynamic agar tidak error "window not defined" (SSR issue)
const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Memuat PDF Engine...</p>
            </div>
        ),
    }
);

export const InvoicePDFViewer = () => {
    const { data } = useInvoiceStore();

    return (
        <div className="w-full h-full bg-slate-100 border rounded-lg overflow-hidden shadow-inner">
            <PDFViewer
                width="100%"
                height="100%"
                className="border-none"
                showToolbar={false}
            >
                <SimpleTemplate data={data} />
            </PDFViewer>
        </div>
    );
};
