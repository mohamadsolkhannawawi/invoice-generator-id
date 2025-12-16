import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";
import { InvoiceType } from "@/lib/schemas";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Mendaftarkan font (Opsional, kita pakai Helvetica bawaan dulu agar cepat)
// Font.register({ family: 'Open Sans', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#333",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 20,
    },
    logoSection: {
        flexDirection: "column",
    },
    titleSection: {
        textAlign: "right",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#2563eb", // Blue-600
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: "#666",
    },
    // Info Grid
    infoGrid: {
        flexDirection: "row",
        marginBottom: 30,
    },
    colLeft: {
        width: "55%",
        paddingRight: 10,
    },
    colRight: {
        width: "45%",
    },
    label: {
        fontSize: 8,
        color: "#888",
        marginBottom: 2,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 10,
        marginBottom: 10,
        lineHeight: 1.4,
    },
    // Table
    table: {
        width: "100%",
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    colDesc: { flex: 3 },
    colQty: { flex: 1, textAlign: "center" },
    colPrice: { flex: 1.5, textAlign: "right" },
    colTotal: { flex: 1.5, textAlign: "right" },

    // Footer Totals
    totalsSection: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "40%",
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 10,
        color: "#666",
    },
    totalValue: {
        fontSize: 10,
        fontWeight: "bold",
    },
    grandTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "40%",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: "#2563eb",
    },
    grandTotalLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#2563eb",
    },
    grandTotalValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#2563eb",
    },
});

// Helper Rupiah untuk PDF (karena Intl browser kadang beda di render PDF)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const SimpleTemplate = ({ data }: { data: InvoiceType }) => {
    // Hitung Totals
    const subtotal = data.items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
    );
    const taxAmount = (subtotal * data.taxRate) / 100;
    const grandTotal = subtotal + taxAmount - data.discount;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {/* Logo jika ada */}
                        {data.senderDetails.logo ? (
                            <Image
                                src={data.senderDetails.logo}
                                style={{
                                    width: 64,
                                    height: 64,
                                    marginBottom: 8,
                                    borderRadius: 8,
                                }}
                            />
                        ) : null}
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                            {data.senderDetails.name || "Nama Perusahaan"}
                        </Text>
                        <Text style={[styles.value, { color: "#666" }]}>
                            {data.senderDetails.address}
                        </Text>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>
                            {data.status === "PAID" ? "RECEIPT" : "INVOICE"}
                        </Text>
                        <Text style={styles.subtitle}>
                            #{data.invoiceNumber}
                        </Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.colLeft}>
                        <Text style={styles.label}>Kepada:</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {data.clientDetails.name || "Nama Klien"}
                        </Text>
                        <Text style={styles.value}>
                            {data.clientDetails.address}
                        </Text>
                        <Text style={styles.value}>
                            {data.clientDetails.email}
                        </Text>
                    </View>
                    <View style={styles.colRight}>
                        <Text style={styles.label}>Tanggal:</Text>
                        <Text style={styles.value}>
                            {data.date
                                ? format(new Date(data.date), "dd MMMM yyyy", {
                                      locale: id,
                                  })
                                : "-"}
                        </Text>

                        <Text style={styles.label}>Jatuh Tempo:</Text>
                        <Text style={styles.value}>
                            {data.dueDate
                                ? format(
                                      new Date(data.dueDate),
                                      "dd MMMM yyyy",
                                      { locale: id }
                                  )
                                : "-"}
                        </Text>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.label, styles.colDesc]}>
                        Deskripsi Produk
                    </Text>
                    <Text style={[styles.label, styles.colQty]}>Qty</Text>
                    <Text style={[styles.label, styles.colPrice]}>
                        Harga Satuan
                    </Text>
                    <Text style={[styles.label, styles.colTotal]}>Jumlah</Text>
                </View>

                {/* Table Rows */}
                {data.items.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.value, styles.colDesc]}>
                            {item.description}
                        </Text>
                        <Text style={[styles.value, styles.colQty]}>
                            {item.quantity}
                        </Text>
                        <Text style={[styles.value, styles.colPrice]}>
                            {formatCurrency(item.unitPrice)}
                        </Text>
                        <Text style={[styles.value, styles.colTotal]}>
                            {formatCurrency(item.quantity * item.unitPrice)}
                        </Text>
                    </View>
                ))}

                {/* Footer Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(subtotal)}
                        </Text>
                    </View>

                    {data.taxRate > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                Pajak ({data.taxRate}%)
                            </Text>
                            <Text style={styles.totalValue}>
                                {formatCurrency(taxAmount)}
                            </Text>
                        </View>
                    )}

                    {data.discount > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Diskon</Text>
                            <Text style={[styles.totalValue, { color: "red" }]}>
                                - {formatCurrency(data.discount)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.grandTotal}>
                        <Text style={styles.grandTotalLabel}>TOTAL</Text>
                        <Text style={styles.grandTotalValue}>
                            {formatCurrency(grandTotal)}
                        </Text>
                    </View>
                </View>

                {/* Payment Status Badge (Text only) */}
                {data.status === "PAID" && (
                    <View
                        style={{
                            position: "absolute",
                            bottom: 100,
                            left: 40,
                            border: "2px solid green",
                            padding: 10,
                            transform: "rotate(-15deg)",
                        }}
                    >
                        <Text
                            style={{
                                color: "green",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            LUNAS
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};
