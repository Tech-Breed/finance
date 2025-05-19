import { getAllTransactions } from "./storage.js";

const incomeEl = document.getElementById("totalIncome");
const expenseEl = document.getElementById("totalExpenses");
const pendingEl = document.getElementById("pendingInvoices");

function calculateTotals() {
  const transactions = getAllTransactions();
  let income = 0;
  let expenses = 0;

  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount);
    if (tx.category.toLowerCase().includes("income")) {
      income += amount;
    } else {
      expenses += amount;
    }
  });

  incomeEl.textContent = `₦${income.toLocaleString()}`;
  expenseEl.textContent = `₦${expenses.toLocaleString()}`;
  pendingEl.textContent = `₦${(income - expenses).toLocaleString()}`;
}

calculateTotals();

