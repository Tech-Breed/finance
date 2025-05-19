import { getAllTransactions } from "./storage.js";

const tableBody = document.getElementById("invoice-body");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportCSV");

let transactions = getAllTransactions();
let filteredTransactions = [...transactions]; // Cache filtered results

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((tx, index) => {
    const tr = document.createElement("tr");
    tr.classList.add("fade-in");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>₦${parseFloat(tx.amount).toLocaleString()}</td>
      <td>${tx.category}</td>
      <td>${new Date(tx.created).toLocaleDateString()}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function filterTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value.toLowerCase();

  filteredTransactions = transactions.filter(tx => {
    const categoryMatch = category === "all" || tx.category.toLowerCase() === category;
    const searchMatch = tx.category.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  renderTable(filteredTransactions);
}

// Initial render
renderTable(transactions);

// Event listeners
searchInput.addEventListener("input", filterTransactions);
categoryFilter.addEventListener("change", filterTransactions);

// Export filtered results to CSV
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    if (filteredTransactions.length === 0) {
      alert("No data to export.");
      return;
    }

    let csv = "No,Amount,Category,Date\n";
    filteredTransactions.forEach((tx, index) => {
      csv += `${index + 1},"₦${tx.amount}",${tx.category},${new Date(tx.created).toLocaleDateString()}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_transactions.csv";
    a.click();
  });
}


