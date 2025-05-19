import { saveTransaction } from "./storage.js";

const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal");
const saveBtn = document.querySelector(".submit");

const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

if (addBtn && modal && saveBtn) {
  addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("active");
    }
  });

  saveBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (!amount || amount <= 0 || !category) {
      alert("Please enter a valid amount and select a category.");
      return;
    }

    const transaction = {
      id: Date.now(),
      amount,
      category,
      created: new Date().toISOString()
    };

    saveTransaction(transaction);
    alert("Transaction saved!");

    amountInput.value = "";
    modal.classList.add("hidden");
    modal.classList.remove("active");

    location.reload();
  });
}
