import { getAllInvoices } from "./storage.js";

// DOM elements
const tableBody = document.getElementById("invoiceTableBody");
const statusFilter = document.getElementById("statusFilter");

const statusModal = document.getElementById("statusModal");
const modalSelect = document.getElementById("modalStatus");
const saveStatusBtn = document.getElementById("saveStatus");

let activeInvoiceId = null;

// Format currency
function formatCurrency(amount) {
  return `₦${amount.toLocaleString()}`;
}

// Calculate dynamic status
function getStatus(invoice) {
  const today = new Date();
  const due = new Date(invoice.due);
  if (invoice.status === "paid") return "Paid";
  if (due < today) return "Overdue";
  return "Sent";
}

// Render invoice rows
function renderInvoices(invoices) {
  tableBody.innerHTML = "";

  invoices.forEach((inv, index) => {
    const status = getStatus(inv);

    const row = document.createElement("tr");
    row.classList.add("fade-in");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${inv.client}</td>
      <td>${formatCurrency(inv.amount)}</td>
      <td>
        <span 
          class="status ${status.toLowerCase()}" 
          data-id="${inv.id}" 
          data-status="${status.toLowerCase()}">
          ${status}
        </span>
      </td>
      <td>${new Date(inv.due).toLocaleDateString()}</td>
      <td>
        <button class="export-btn" data-id="${inv.id}">PDF</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Add PDF download handlers
  document.querySelectorAll(".export-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const inv = invoices.find(i => i.id === id);
      generatePDF(inv);
    });
  });

  // Handle click on status span to open modal
  document.querySelectorAll(".status").forEach(span => {
    span.addEventListener("click", () => {
      const currentStatus = span.dataset.status;
      activeInvoiceId = parseInt(span.dataset.id);
      modalSelect.value = currentStatus;
      statusModal.classList.remove("hidden");
      statusModal.classList.add("active");
    });
  });
}

// Save new status from modal
saveStatusBtn.addEventListener("click", () => {
  const newStatus = modalSelect.value;
  const invoices = getAllInvoices();
  const index = invoices.findIndex(inv => inv.id === activeInvoiceId);

  if (index !== -1) {
    invoices[index].status = newStatus;
    localStorage.setItem("acctedge_invoices", JSON.stringify(invoices));
    statusModal.classList.add("hidden");
    statusModal.classList.remove("active");
    filterInvoices();
  }
});

// Close modal on outside click
statusModal.addEventListener("click", (e) => {
  if (e.target === statusModal) {
    statusModal.classList.add("hidden");
    statusModal.classList.remove("active");
  }
});

// Filter invoices by dropdown
function filterInvoices() {
  const selected = statusFilter.value;
  const all = getAllInvoices();

  const filtered = all.filter(inv => {
    const status = getStatus(inv).toLowerCase();
    return selected === "all" || selected === status;
  });

  renderInvoices(filtered);
}

// Generate PDF
function generatePDF(inv) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const total = (inv.amount + (inv.tax || 0)) - (inv.discount || 0);

  doc.text("INVOICE", 10, 10);
  doc.text(`Client: ${inv.client}`, 10, 20);
  doc.text(`Email: ${inv.email}`, 10, 30);
  doc.text(`Service: ${inv.service}`, 10, 40);
  doc.text(`Amount: ₦${inv.amount.toLocaleString()}`, 10, 50);
  doc.text(`Tax: ₦${(inv.tax || 0).toLocaleString()}`, 10, 60);
  doc.text(`Discount: ₦${(inv.discount || 0).toLocaleString()}`, 10, 70);
  doc.text(`Total: ₦${total.toLocaleString()}`, 10, 80);
  doc.text(`Due: ${new Date(inv.due).toLocaleDateString()}`, 10, 90);
  doc.text(`Notes: ${inv.notes || "N/A"}`, 10, 100);

  doc.save(`Invoice_${inv.client}_${inv.id}.pdf`);
}

// Init
statusFilter.addEventListener("change", filterInvoices);
filterInvoices();
