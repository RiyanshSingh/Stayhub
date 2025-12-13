import { format } from "date-fns";

export const downloadInvoice = async (booking: any) => {
    try {
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text("StayHub Inc.", 105, 30, { align: "center" });

        // Status Stamp
        if (booking.status === 'cancelled') {
            doc.setTextColor(200, 0, 0);
            doc.text("CANCELLED", 160, 20);
            doc.setTextColor(0, 0, 0);
        } else if (booking.status === 'confirmed' || booking.status === 'completed') {
            doc.setTextColor(0, 150, 0);
            doc.text("PAID", 160, 20);
            doc.setTextColor(0, 0, 0);
        }

        // Booking Info
        doc.setFontSize(10);
        doc.text(`Invoice Date: ${format(new Date(), "MMM dd, yyyy")}`, 14, 40);
        doc.text(`Booking ID: #${booking.id}`, 14, 45);
        doc.text(`Transaction ID: ${booking.transaction_id || "N/A"}`, 14, 50);

        // Property Info
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(booking.property_name || "Property Name", 14, 65);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        // Handle potentially missing property object if listing-only view
        if (booking.property) {
            doc.text(`${booking.property.location || ''}`, 14, 70);
            doc.text(`${booking.property.city || ''}, ${booking.property.country || ''}`, 14, 75);
        } else {
            doc.text("Location details available in booking", 14, 70);
        }

        // Guest Info
        doc.text(`Guest: ${booking.guests} Guests`, 120, 65);
        doc.text(`Check-in: ${format(new Date(booking.check_in), "MMM dd, yyyy")}`, 120, 70);
        doc.text(`Check-out: ${format(new Date(booking.check_out), "MMM dd, yyyy")}`, 120, 75);

        // Table
        autoTable(doc, {
            startY: 85,
            head: [['Description', 'Quantity', 'Price']],
            body: [
                [`Accommodation (${booking.nights} nights)`, '1', `$${booking.total_price}`],
                ['Taxes & Fees', '1', '$0.00'],
            ],
            foot: [['Total', '', `$${booking.total_price}`]],
            theme: 'striped',
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.text("Thank you for choosing StayHub!", 105, finalY, { align: "center" });

        doc.save(`invoice_booking_${booking.id}.pdf`);
    } catch (error) {
        console.error("Error generating invoice:", error);
        alert("Could not generate invoice. Please try again.");
    }
};
