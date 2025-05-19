const STORAGE_KEY = "acctedge_transactions";

// ✅ Exported: Save transaction to localStorage
export function saveTransaction(transaction) {
  const existing = getAllTransactions();
  existing.push(transaction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// ✅ Exported: Retrieve all transactions
export function getAllTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// ✅ Exported: Optional reset function
export function clearAllTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}

// INVOICE
const INVOICE_KEY = "acctedge_invoices";

export function saveInvoice(invoice) {
  const existing = getAllInvoices();
  existing.push(invoice);
  localStorage.setItem(INVOICE_KEY, JSON.stringify(existing));
}

export function getAllInvoices() {
  const data = localStorage.getItem(INVOICE_KEY);
  return data ? JSON.parse(data) : [];
}
