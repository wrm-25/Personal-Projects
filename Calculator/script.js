const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = current;
}

function inputNumber(num) {
  if (shouldReset) {
    current = num === "." ? "0." : num;
    shouldReset = false;
    updateDisplay();
    return;
  }

  if (num === "." && current.includes(".")) return;

  current = current === "0" && num !== "." ? num : current + num;
  updateDisplay();
}

function chooseOperator(nextOp) {
  if (operator && !shouldReset) {
    compute();
  }
  previous = current;
  operator = nextOp;
  shouldReset = true;
}

function compute() {
  if (previous === null || operator === null) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = b === 0 ? "Error" : a / b;
      break;
    case "%":
      result = a % b;
      break;
    default:
      return;
  }

  current = String(result);
  operator = null;
  previous = null;
  shouldReset = true;
  updateDisplay();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  shouldReset = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldReset) return;
  current = current.length <= 1 ? "0" : current.slice(0, -1);
  updateDisplay();
}

keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.classList.contains("number")) {
    inputNumber(btn.textContent);
    return;
  }

  if (btn.dataset.operator) {
    chooseOperator(btn.dataset.operator);
    return;
  }

  if (btn.dataset.action === "equals") compute();
  if (btn.dataset.action === "clear") clearAll();
  if (btn.dataset.action === "delete") deleteLast();
});

document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    inputNumber(e.key);
  } else if (["+", "-", "*", "/", "%"].includes(e.key)) {
    chooseOperator(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    compute();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Escape") {
    clearAll();
  }
});
