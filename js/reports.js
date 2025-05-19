import { getAllTransactions } from "./storage.js";

const lineCtx = document.getElementById("lineChart");
const barCtx = document.getElementById("barChart");

const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const applyBtn = document.getElementById("applyFilter");

const downloadLine = document.getElementById("downloadLine");
const downloadBar = document.getElementById("downloadBar");

let lineChartInstance = null;
let barChartInstance = null;

function drawReports(filtered = null) {
  const all = filtered || getAllTransactions();

  const byDate = {};
  const byCategory = {};

  all.forEach(tx => {
    const txDate = new Date(tx.created);
    const date = txDate.toLocaleDateString();
    const category = tx.category;
    const amount = parseFloat(tx.amount);

    // Group by date
    if (!byDate[date]) byDate[date] = { income: 0, expense: 0 };
    if (category.toLowerCase().includes("income")) {
      byDate[date].income += amount;
    } else {
      byDate[date].expense += amount;

      // Group by category
      if (!byCategory[category]) byCategory[category] = 0;
      byCategory[category] += amount;
    }
  });

  const dates = Object.keys(byDate);
  const incomeData = dates.map(d => byDate[d].income);
  const expenseData = dates.map(d => byDate[d].expense);

  const categoryLabels = Object.keys(byCategory);
  const categoryValues = Object.values(byCategory);
  const totalExpense = categoryValues.reduce((a, b) => a + b, 0);

  // Destroy previous charts
  if (lineChartInstance) lineChartInstance.destroy();
  if (barChartInstance) barChartInstance.destroy();

  // Line Chart
  lineChartInstance = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.2)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231, 76, 60, 0.2)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutQuart" },
      plugins: {
        title: {
          display: true,
          text: "Income vs Expenses Over Time",
          font: { size: 16 }
        },
        legend: {
          labels: {
            color: "#333",
            font: { size: 14, weight: "bold" }
          }
        }
      }
    }
  });

  // Bar Chart
  barChartInstance = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: categoryLabels,
      datasets: [{
        label: "Expenses by Category",
        data: categoryValues,
        backgroundColor: [
          "#3498db", "#9b59b6", "#f39c12", "#1abc9c", "#e74c3c", "#2ecc71"
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1200, easing: "easeOutBounce" },
      plugins: {
        title: {
          display: true,
          text: "Top Expense Categories",
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const percent = ((val / totalExpense) * 100).toFixed(1);
              return `${context.label}: ₦${val.toLocaleString()} (${percent}%)`;
            }
          }
        },
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Event: Apply Date Filter
applyBtn.addEventListener("click", () => {
  const startDate = new Date(startDateEl.value);
  const endDate = new Date(endDateEl.value);

  if (isNaN(startDate) || isNaN(endDate)) {
    alert("Please select both a start and end date.");
    return;
  }

  const all = getAllTransactions();
  const filtered = all.filter(tx => {
    const txDate = new Date(tx.created);
    return txDate >= startDate && txDate <= endDate;
  });

  drawReports(filtered);
});

// Event: Download Charts
downloadLine.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "income-vs-expenses.png";
  link.href = lineChartInstance.toBase64Image();
  link.click();
});

downloadBar.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "expense-categories.png";
  link.href = barChartInstance.toBase64Image();
  link.click();
});

// Initial Load
drawReports();
