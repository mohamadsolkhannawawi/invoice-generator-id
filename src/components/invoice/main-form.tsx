import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceSchema, InvoiceType } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { ItemList } from "./item-list";

export const MainForm = () => {
    const {
        data,
        setInvoiceInfo,
        setSenderDetails,
        setClientDetails,
        setTaxRate,
        setDiscount,
        addItem,
    } = useInvoiceStore();

    // Inisialisasi Form dengan data dari Zustand (Global State)
    const methods = useForm<InvoiceType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            ...data,
            // Pastikan date dikonversi ke object Date jika string
            date:
                typeof data.date === "string" ? new Date(data.date) : data.date,
            dueDate:
                typeof data.dueDate === "string"
                    ? new Date(data.dueDate)
                    : data.dueDate,
        },
        mode: "onChange", // Validasi real-time
    });

    const { register, watch, control } = methods;

    // --- LOGIKA SINKRONISASI REAL-TIME ---
    // Pantau perubahan form, lalu update Zustand agar Preview PDF berubah
    useEffect(() => {
        const subscription = watch((value) => {
            // Update Store saat user mengetik
            // Note: Kita gunakan casting 'as any' sementara untuk mempercepat dev karena partial update
            if (value.senderDetails)
                setSenderDetails(value.senderDetails as any);
            if (value.clientDetails)
                setClientDetails(value.clientDetails as any);
            if (value.invoiceNumber)
                setInvoiceInfo({ invoiceNumber: value.invoiceNumber });

            // Khusus item list, dibiarkan logic ItemList yang menangani via internal form state
            // Namun untuk Tax & Discount perlu update manual ke store jika berubah
            if (value.taxRate !== undefined) setTaxRate(Number(value.taxRate));
            if (value.discount !== undefined)
                setDiscount(Number(value.discount));

            // Update items array ke store (PENTING untuk PDF)
            if (value.items) {
                useInvoiceStore.setState((state) => ({
                    data: { ...state.data, items: value.items as any },
                }));
            }
        });
        return () => subscription.unsubscribe();
    }, [
        watch,
        setSenderDetails,
        setClientDetails,
        setInvoiceInfo,
        setTaxRate,
        setDiscount,
    ]);

    return (
        <FormProvider {...methods}>
            <form className="space-y-6">
                {/* Bagian 1: Informasi Dasar & Pengirim */}
                <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="font-semibold text-slate-800">
                            Informasi Dasar
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">
                                Nomor Invoice
                            </Label>
                            <Input
                                {...register("invoiceNumber")}
                                placeholder="INV-001"
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">
                                Tanggal Invoice
                            </Label>
                            <Input
                                type="date"
                                {...register("date", { valueAsDate: true })}
                                className="block"
                            />
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-3">
                        <Label className="font-medium text-slate-700">
                            Dari (Pengirim)
                        </Label>
                        <Input
                            {...register("senderDetails.name")}
                            placeholder="Nama Perusahaan / Freelancer"
                        />
                        <Textarea
                            {...register("senderDetails.address")}
                            placeholder="Alamat lengkap..."
                            rows={2}
                            className="resize-none"
                        />
                    </div>
                </Card>

                {/* Bagian 2: Informasi Klien */}
                <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h2 className="font-semibold text-slate-800">
                            Kepada (Klien)
                        </h2>
                    </div>
                    <div className="space-y-3">
                        <Input
                            {...register("clientDetails.name")}
                            placeholder="Nama Klien / Perusahaan Tujuan"
                        />
                        <Input
                            {...register("clientDetails.email")}
                            placeholder="Email Klien (Opsional)"
                        />
                        <Textarea
                            {...register("clientDetails.address")}
                            placeholder="Alamat Klien..."
                            rows={2}
                            className="resize-none"
                        />
                    </div>
                </Card>

                {/* Bagian 3: Items & Kalkulasi */}
                <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-6">
                    <ItemList />

                    <Separator />

                    {/* Kalkulasi Pajak & Diskon */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Pajak / PPN (%)</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    {...register("taxRate", {
                                        valueAsNumber: true,
                                    })}
                                    className="pr-8 text-right"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    %
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Diskon (Rp)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                                    Rp
                                </span>
                                <Input
                                    type="number"
                                    {...register("discount", {
                                        valueAsNumber: true,
                                    })}
                                    className="pl-8 text-right"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </form>
        </FormProvider>
    );
};
