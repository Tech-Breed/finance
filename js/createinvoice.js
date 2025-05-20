import { saveInvoice } from "./storage.js";

const btn = document.getElementById("generateInvoice");

btn.addEventListener("click", async () => {
  const client = document.getElementById("clientName").value;
  const email = document.getElementById("clientEmail").value;
  const service = document.getElementById("service").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const due = document.getElementById("dueDate").value;
  const notes = document.getElementById("notes").value;

  if (!client || !email || !service || !amount || !due) {
    alert("Fill all fields!");
    return;
  }

  const invoice = {
    id: Date.now(),
    client,
    email,
    service,
    amount,
    due,
    notes,
    status: "sent",
    created: new Date().toISOString()
  };

  saveInvoice(invoice);
  alert("Invoice saved and sent!");

  // Generate PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("INVOICE", 10, 10);
  doc.text(`To: ${client}`, 10, 20);
  doc.text(`Email: ${email}`, 10, 30);
  doc.text(`Service: ${service}`, 10, 40);
  doc.text(`Amount: ₦${amount.toLocaleString()}`, 10, 50);
  doc.text(`Due: ${due}`, 10, 60);
  doc.text(`Notes: ${notes}`, 10, 70);
  doc.save(`Invoice_${client}_${Date.now()}.pdf`);
});

const { jsPDF } = window.jspdf;
const doc = new jsPDF();
