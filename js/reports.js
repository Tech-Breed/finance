
import { getAllTransactions } from "./storage.js";

let filteredData = getAllTransactions();

// 🚀 RENDER CHARTS
function renderCharts(data) {
  const lineCtx = document.getElementById("lineChart");
  const barCtx = document.getElementById("barChart");

  const byDate = {};
  const byCategory = {};

  data.forEach(tx => {
    const date = new Date(tx.created).toLocaleDateString();
    const category = tx.category.toLowerCase();
    const amount = parseFloat(tx.amount);

    if (!byDate[date]) byDate[date] = { income: 0, expense: 0 };

    if (["income", "sales", "deposit"].some(k => category.includes(k))) {
      byDate[date].income += amount;
    } else {
      byDate[date].expense += amount;
      byCategory[category] = (byCategory[category] || 0) + amount;
    }
  });

  const dates = Object.keys(byDate);
  const incomeData = dates.map(d => byDate[d].income);
  const expenseData = dates.map(d => byDate[d].expense);

  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Income", data: incomeData, borderColor: "#2ecc71", fill: false },
        { label: "Expenses", data: expenseData, borderColor: "#e74c3c", fill: false }
      ]
    }
  });

  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: Object.keys(byCategory),
      datasets: [{
        label: "Expenses by Category",
        data: Object.values(byCategory),
        backgroundColor: "#3498db"
      }]
    }
  });
}

// 📊 PROFIT & LOSS
function renderPLReport(data) {
  const tableBody = document.getElementById("plTableBody");
  let income = 0, expense = 0;
  const incomeMap = {};
  const expenseMap = {};

  data.forEach(tx => {
    const category = tx.category.toLowerCase();
    const amount = parseFloat(tx.amount);

    if (["income", "sales", "deposit"].some(k => category.includes(k))) {
      income += amount;
      incomeMap[category] = (incomeMap[category] || 0) + amount;
    } else {
      expense += amount;
      expenseMap[category] = (expenseMap[category] || 0) + amount;
    }
  });

  // Render table
  tableBody.innerHTML = "";
  Object.entries(incomeMap).forEach(([cat, amt]) => {
    tableBody.innerHTML += `<tr><td>Income</td><td>${cat}</td><td>₦${amt.toLocaleString()}</td></tr>`;
  });
  Object.entries(expenseMap).forEach(([cat, amt]) => {
    tableBody.innerHTML += `<tr><td>Expense</td><td>${cat}</td><td>₦${amt.toLocaleString()}</td></tr>`;
  });

  document.getElementById("plIncome").textContent = `₦${income.toLocaleString()}`;
  document.getElementById("plExpense").textContent = `₦${expense.toLocaleString()}`;
  document.getElementById("plNet").textContent = `₦${(income - expense).toLocaleString()}`;

  // P&L line chart
  const plCtx = document.getElementById("plChart");
  const dates = [...new Set(data.map(tx => new Date(tx.created).toLocaleDateString()))];

  const byDate = {};
  data.forEach(tx => {
    const date = new Date(tx.created).toLocaleDateString();
    const category = tx.category.toLowerCase();
    const amount = parseFloat(tx.amount);
    if (!byDate[date]) byDate[date] = { income: 0, expense: 0 };
    if (["income", "sales", "deposit"].some(k => category.includes(k))) {
      byDate[date].income += amount;
    } else {
      byDate[date].expense += amount;
    }
  });

  const incomeSeries = dates.map(d => byDate[d]?.income || 0);
  const expenseSeries = dates.map(d => byDate[d]?.expense || 0);

  new Chart(plCtx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Income", data: incomeSeries, borderColor: "#27ae60", fill: false },
        { label: "Expenses", data: expenseSeries, borderColor: "#c0392b", fill: false }
      ]
    }
  });
}

// 📉 CASH FLOW STATEMENT
function renderCashFlow(data) {
  const inflowList = document.getElementById("cashInList");
  const outflowList = document.getElementById("cashOutList");

  let inflow = 0, outflow = 0;
  const inflows = {};
  const outflows = {};

  data.forEach(tx => {
    const category = tx.category.toLowerCase();
    const amount = parseFloat(tx.amount);

    if (["income", "sales", "deposit"].some(k => category.includes(k))) {
      inflow += amount;
      inflows[category] = (inflows[category] || 0) + amount;
    } else {
      outflow += amount;
      outflows[category] = (outflows[category] || 0) + amount;
    }
  });

  inflowList.innerHTML = Object.entries(inflows).map(([cat, amt]) =>
    `<li>${cat}: ₦${amt.toLocaleString()}</li>`).join("");

  outflowList.innerHTML = Object.entries(outflows).map(([cat, amt]) =>
    `<li>${cat}: ₦${amt.toLocaleString()}</li>`).join("");

  document.getElementById("cashInTotal").textContent = `₦${inflow.toLocaleString()}`;
  document.getElementById("cashOutTotal").textContent = `₦${outflow.toLocaleString()}`;
  document.getElementById("netCashFlow").textContent = `₦${(inflow - outflow).toLocaleString()}`;
}

// 🧾 BALANCE SHEET
function renderBalanceSheet(data) {
  const assets = {};
  const liabilities = {};

  data.forEach(tx => {
    const category = tx.category.toLowerCase();
    const amount = parseFloat(tx.amount);

    if (["cash", "inventory", "equipment", "bank"].some(k => category.includes(k))) {
      assets[category] = (assets[category] || 0) + amount;
    }

    if (["loan", "debt", "payable"].some(k => category.includes(k))) {
      liabilities[category] = (liabilities[category] || 0) + amount;
    }
  });

  const assetList = document.getElementById("assetsList");
  const liabilityList = document.getElementById("liabilitiesList");

  assetList.innerHTML = Object.entries(assets).map(([cat, amt]) =>
    `<li>${cat}: ₦${amt.toLocaleString()}</li>`).join("");

  liabilityList.innerHTML = Object.entries(liabilities).map(([cat, amt]) =>
    `<li>${cat}: ₦${amt.toLocaleString()}</li>`).join("");

  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
  const equity = totalAssets - totalLiabilities;

  document.getElementById("totalAssets").textContent = `₦${totalAssets.toLocaleString()}`;
  document.getElementById("totalLiabilities").textContent = `₦${totalLiabilities.toLocaleString()}`;
  document.getElementById("equityValue").textContent = `₦${equity.toLocaleString()}`;
}

// 🎯 INITIAL RENDER
renderCharts(filteredData);
renderPLReport(filteredData);
renderBalanceSheet(filteredData);
renderCashFlow(filteredData);


document.getElementById("exportBalance").addEventListener("click", () => {
  const node = document.querySelector(".balance-grid");

  if (!node) {
    alert("Balance grid not found.");
    return;
  }

  html2canvas(node).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Balance_Sheet.png";
    link.click();
  }).catch(err => {
    console.error("Export failed:", err);
    alert("Something went wrong while exporting.");
  });
});

document.getElementById("exportBalance").addEventListener("click", () => {
  const target = document.getElementById("balanceSheetSection");

  if (!target) {
    alert("Balance sheet section not found!");
    return;
  }

  html2canvas(target).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Balance_Sheet.png";
    link.click();
  }).catch(err => {
    console.error("Download failed:", err);
    alert("Could not export Balance Sheet.");
  });
});
