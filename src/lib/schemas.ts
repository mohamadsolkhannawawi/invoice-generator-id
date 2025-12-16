import { z } from "zod";

// Schema untuk satu baris item produk/jasa
export const ItemSchema = z.object({
    id: z.string(), // ID unik untuk key React
    description: z.string().min(1, "Deskripsi produk harus diisi"),
    quantity: z.number().min(1, "Jumlah minimal 1"),
    unitPrice: z.number().min(0, "Harga satuan tidak boleh negatif"),
});

// Schema Utama Invoice
export const InvoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Nomor Invoice wajib diisi"),
    date: z.date({ required_error: "Tanggal wajib dipilih" }),
    dueDate: z.date({ required_error: "Jatuh tempo wajib dipilih" }),

    // Data Pengirim (User)
    senderDetails: z.object({
        name: z.string().min(1, "Nama usaha/pengirim wajib diisi"),
        address: z.string().optional(),
        logo: z.string().optional(), // Akan menyimpan string Base64 gambar
    }),

    // Data Penerima (Klien)
    clientDetails: z.object({
        name: z.string().min(1, "Nama klien wajib diisi"),
        address: z.string().optional(),
        email: z
            .string()
            .email("Format email tidak valid")
            .optional()
            .or(z.literal("")),
    }),

    // Daftar Item
    items: z.array(ItemSchema).min(1, "Minimal harus ada 1 item transaksi"),

    // Keuangan
    taxRate: z.number().min(0).max(100).default(0), // Dalam Persen (%)
    discount: z.number().min(0).default(0), // Dalam Rupiah (Nominal) agar mudah

    // Metadata
    status: z.enum(["UNPAID", "PAID"]).default("UNPAID"),
    currency: z.string().default("IDR"),
});

// Export tipe data TypeScript (diambil otomatis dari Schema di atas)
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type ItemType = z.infer<typeof ItemSchema>;
