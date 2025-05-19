import { saveTransaction, getAllTransactions } from "./storage.js";

const amountEl = document.getElementById("expenseAmount");
const categoryEl = document.getElementById("expenseCategory");
const addBtn = document.getElementById("addExpenseBtn");
const chartCanvas = document.getElementById("expensePieChart");

let currentChart = null;

addBtn.addEventListener("click", () => {
  const amount = parseFloat(amountEl.value);
  const category = categoryEl.value;

  if (!amount || amount <= 0 || !category) {
    alert("Please enter a valid amount and category.");
    return;
  }

  const tx = {
    id: Date.now(),
    amount: amount,
    category: category,
    created: new Date().toISOString(),
  };

  saveTransaction(tx);
  amountEl.value = "";
  drawChart();
});

function drawChart() {
  const all = getAllTransactions();
  const expenses = all.filter(tx => !tx.category.toLowerCase().includes("income"));

  const dataMap = {};
  expenses.forEach(tx => {
    const cat = tx.category;
    if (!dataMap[cat]) {
      dataMap[cat] = 0;
    }
    dataMap[cat] += parseFloat(tx.amount);
  });

  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  // Remove previous chart instance if exists
  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Expense Breakdown",
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD"],
        borderWidth: 1
      }]
    },
    options: {
      animation: {
        duration: 1200,
        easing: "easeOutBounce"
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
            font: {
              size: 14,
              weight: "bold"
            }
          }
        }
      }
    }
  });
}

// Initial chart draw on load
drawChart();
