package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Recharge;
import com.example.demo.repository.RechargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class TransactionService {

    private final RechargeRepository rechargeRepository;

    @Autowired
    public TransactionService(RechargeRepository rechargeRepository) {
        this.rechargeRepository = rechargeRepository;
    }

    public List<Recharge> getTransactions(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required!");
        }
        List<Recharge> transactions = rechargeRepository.findByMobileNumber(mobileNumber);
        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No transactions found for mobile number: " + mobileNumber);
        }
        return transactions;
    }

    public ResponseEntity<byte[]> generateReceipt(Long id) {
        Recharge recharge = rechargeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Font headingFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

            Paragraph heading = new Paragraph("MobiComm Prepaid Recharge", headingFont);
            heading.setAlignment(Element.ALIGN_CENTER);
            document.add(heading);

            document.add(new Paragraph("\n")); // Adding space
            document.add(new Paragraph("Recharge Receipt", titleFont));
            document.add(new Paragraph("------------------------------------------------------"));
            document.add(new Paragraph("Mobile Number: " + recharge.getMobileNumber(), boldFont));
            document.add(new Paragraph("Email: " + (recharge.getEmail() != null ? recharge.getEmail() : "N/A"), normalFont));
            document.add(new Paragraph("Amount: ₹" + recharge.getAmount(), normalFont));
            document.add(new Paragraph("Plan Details: " + recharge.getPlanDetails(), normalFont));
            document.add(new Paragraph("Payment ID: " + recharge.getPaymentId(), normalFont));
            document.add(new Paragraph("Payment Method: " + recharge.getPaymentMethod(), normalFont));
            document.add(new Paragraph("Payment Status: " + recharge.getPaymentStatus(), normalFont));
            document.add(new Paragraph("Date: " + recharge.getTransactionDate(), normalFont));
            document.add(new Paragraph("------------------------------------------------------"));

            document.close();


            byte[] pdfBytes = outputStream.toByteArray();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (DocumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(("Error generating PDF: " + e.getMessage()).getBytes());
        }
    }
}