import React, { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { InvoiceType } from "@/lib/schemas";

export const ItemList = () => {
    const { register, control, setValue } = useFormContext<InvoiceType>();

    // Mengelola array dinamis (tambah/hapus baris)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    // Memantau perubahan nilai items untuk hitung subtotal
    const items = useWatch({
        control,
        name: "items",
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">
                    Daftar Produk / Jasa
                </h3>
            </div>

            <div className="space-y-3">
                {fields.map((field, index) => {
                    // Hitung subtotal per baris untuk display user
                    const qty = items?.[index]?.quantity || 0;
                    const price = items?.[index]?.unitPrice || 0;
                    const subtotal = qty * price;

                    return (
                        <div
                            key={field.id}
                            className="group relative grid grid-cols-12 gap-2 items-start p-3 bg-white border rounded-lg hover:shadow-sm transition-all"
                        >
                            {/* Deskripsi */}
                            <div className="col-span-12 md:col-span-5 space-y-1">
                                <label className="text-xs text-slate-500 md:hidden">
                                    Deskripsi
                                </label>
                                <Input
                                    {...register(`items.${index}.description`)}
                                    placeholder="Contoh: Jasa Desain UI"
                                    className="border-slate-200 focus:border-blue-500"
                                />
                            </div>

                            {/* Qty */}
                            <div className="col-span-3 md:col-span-2 space-y-1">
                                <label className="text-xs text-slate-500 md:hidden">
                                    Qty
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    {...register(`items.${index}.quantity`, {
                                        valueAsNumber: true,
                                    })}
                                    className="text-center border-slate-200"
                                    placeholder="1"
                                />
                            </div>

                            {/* Harga Satuan */}
                            <div className="col-span-5 md:col-span-3 space-y-1">
                                <label className="text-xs text-slate-500 md:hidden">
                                    Harga
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                                        Rp
                                    </span>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...register(
                                            `items.${index}.unitPrice`,
                                            { valueAsNumber: true }
                                        )}
                                        className="pl-8 text-right border-slate-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Subtotal & Hapus (Desktop) */}
                            <div className="col-span-4 md:col-span-2 flex items-center justify-between gap-2 pt-2 md:pt-0">
                                <span className="text-xs font-medium text-slate-600 truncate block md:hidden">
                                    Total:
                                </span>
                                <div className="text-sm font-semibold text-slate-700 w-full text-right">
                                    {formatRupiah(subtotal)}
                                </div>

                                {/* Tombol Hapus (Hanya muncul jika item > 1) */}
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 md:static"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                    append({
                        id: crypto.randomUUID(),
                        description: "",
                        quantity: 1,
                        unitPrice: 0,
                    })
                }
                className="w-full border-dashed border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50"
            >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Baris Item
            </Button>
        </div>
    );
};
