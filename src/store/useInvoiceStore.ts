import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { InvoiceType, ItemType } from "@/lib/schemas";

// Data awal (Default Value) agar form tidak kosong melompong saat pertama dibuka
const initialInvoice: InvoiceType = {
    invoiceNumber: "INV-001",
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default jatuh tempo 7 hari
    senderDetails: {
        name: "Minilemon Media",
        address: "Jl. Veteran No. 1, Semarang, Jawa Tengah",
        logo: "",
    },
    clientDetails: {
        name: "",
        address: "",
        email: "",
    },
    items: [
        {
            id: "item-1",
            description: "Jasa Pembuatan Website",
            quantity: 1,
            unitPrice: 1500000,
        },
    ],
    taxRate: 0,
    discount: 0,
    status: "UNPAID",
    currency: "IDR",
};

interface InvoiceState {
    data: InvoiceType;

    // Actions (Fungsi untuk mengubah data)
    setSenderDetails: (details: Partial<InvoiceType["senderDetails"]>) => void;
    setClientDetails: (details: Partial<InvoiceType["clientDetails"]>) => void;
    setInvoiceInfo: (
        info: Partial<
            Pick<InvoiceType, "invoiceNumber" | "date" | "dueDate" | "status">
        >
    ) => void;

    // Item Actions
    addItem: () => void;
    removeItem: (index: number) => void;
    updateItem: (index: number, item: Partial<ItemType>) => void;

    // Financial Actions
    setTaxRate: (rate: number) => void;
    setDiscount: (amount: number) => void;

    // Reset
    resetForm: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
    persist(
        (set) => ({
            data: initialInvoice,

            setSenderDetails: (details) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        senderDetails: {
                            ...state.data.senderDetails,
                            ...details,
                        },
                    },
                })),

            setClientDetails: (details) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        clientDetails: {
                            ...state.data.clientDetails,
                            ...details,
                        },
                    },
                })),

            setInvoiceInfo: (info) =>
                set((state) => ({
                    data: { ...state.data, ...info },
                })),

            addItem: () =>
                set((state) => ({
                    data: {
                        ...state.data,
                        items: [
                            ...state.data.items,
                            {
                                id: crypto.randomUUID(),
                                description: "",
                                quantity: 1,
                                unitPrice: 0,
                            },
                        ],
                    },
                })),

            removeItem: (index) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        items: state.data.items.filter((_, i) => i !== index),
                    },
                })),

            updateItem: (index, item) =>
                set((state) => {
                    const newItems = [...state.data.items];
                    newItems[index] = { ...newItems[index], ...item };
                    return { data: { ...state.data, items: newItems } };
                }),

            setTaxRate: (rate) =>
                set((state) => ({
                    data: { ...state.data, taxRate: rate },
                })),

            setDiscount: (amount) =>
                set((state) => ({
                    data: { ...state.data, discount: amount },
                })),

            resetForm: () => set({ data: initialInvoice }),
        }),
        {
            name: "invoice-storage", // Nama key di LocalStorage browser
            storage: createJSONStorage(() => localStorage),
            // Kita perlu custom storage handler untuk Date object karena JSON tidak support Date
            partialize: (state) => ({
                ...state,
                data: {
                    ...state.data,
                    // Convert Date to string saat save
                    date: state.data.date.toISOString(),
                    dueDate: state.data.dueDate.toISOString(),
                },
            }),
            onRehydrateStorage: () => (state) => {
                // Convert String back to Date saat load (hydrate)
                if (state) {
                    state.data.date = new Date(state.data.date);
                    state.data.dueDate = new Date(state.data.dueDate);
                }
            },
        }
    )
);
