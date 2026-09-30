const menuButtons = document.querySelectorAll(".menu-btn");
const pages = document.querySelectorAll(".page");

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    menuButtons.forEach(btn => btn.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.page).classList.add("active");
  });
});

const displayValue = document.getElementById("displayValue");
const historyLine = document.getElementById("historyLine");
const basicButtons = document.querySelectorAll("#basicPage .btn");
const scienceButtons = document.querySelectorAll(".science");
const scienceDisplay = document.getElementById("scienceDisplay");
const scienceHistory = document.getElementById("scienceHistory");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let expression = "";
let scienceExpression = "";
let calculationHistory = [];

function updateDisplay() {
  displayValue.textContent = expression || "0";
}

function updateScienceDisplay() {
  scienceDisplay.textContent = scienceExpression || "0";
}

function addValue(value) {
  const lastChar = expression.slice(-1);
  const operators = ["+", "-", "*", "/", "%"];

  if (value === "." && getCurrentNumber(expression).includes(".")) return;

  if (operators.includes(value) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  updateDisplay();
}

function addScienceValue(value) {
  scienceExpression += value;
  updateScienceDisplay();
}

function getCurrentNumber(value) {
  return value.split(/[+\-*/%()]/).pop();
}

function clearCalculator() {
  expression = "";
  historyLine.textContent = "";
  updateDisplay();
}

function clearScience() {
  scienceExpression = "";
  scienceHistory.textContent = "";
  updateScienceDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function deleteScienceLast() {
  scienceExpression = scienceExpression.slice(0, -1);
  updateScienceDisplay();
}

function toggleSign() {
  if (!expression) return;

  const match = expression.match(/(-?\d+\.?\d*)$/);
  if (!match) return;

  const number = match[0];
  const startIndex = expression.length - number.length;

  if (number.startsWith("-")) {
    expression = expression.slice(0, startIndex) + number.slice(1);
  } else {
    expression = expression.slice(0, startIndex) + "-" + number;
  }

  updateDisplay();
}

function calculateBasic() {
  if (!expression) return;

  try {
    const cleanExpression = expression.replace(/%/g, "/100");
    const answer = Function(`"use strict"; return (${cleanExpression})`)();

    if (!Number.isFinite(answer)) throw new Error();

    const result = String(Number(answer.toFixed(10)));
    const formatted = formatExpression(expression);

    historyLine.textContent = `${formatted} =`;
    expression = result;
    updateDisplay();
    saveHistory(`${formatted} = ${result}`);
  } catch {
    displayValue.textContent = "Error";
    expression = "";
  }
}

function calculateScience() {
  if (!scienceExpression) return;

  try {
    const cleanExpression = scienceExpression
      .replace(/π/g, "Math.PI")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(");

    const answer = Function(`"use strict"; return (${cleanExpression})`)();

    if (!Number.isFinite(answer)) throw new Error();

    const result = String(Number(answer.toFixed(10)));
    const formatted = formatExpression(scienceExpression);

    scienceHistory.textContent = `${formatted} =`;
    scienceExpression = result;
    updateScienceDisplay();
    saveHistory(`${formatted} = ${result}`);
  } catch {
    scienceDisplay.textContent = "Error";
    scienceExpression = "";
  }
}

function formatExpression(value) {
  return value
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−")
    .replace(/sqrt/g, "√");
}

function saveHistory(item) {
  calculationHistory.unshift(item);
  calculationHistory = calculationHistory.slice(0, 12);
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (calculationHistory.length === 0) {
    historyList.innerHTML = "<li>No calculations yet</li>";
    return;
  }

  calculationHistory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

clearHistoryBtn.addEventListener("click", () => {
  calculationHistory = [];
  renderHistory();
});

basicButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) addValue(value);
    if (action === "clear") clearCalculator();
    if (action === "delete") deleteLast();
    if (action === "toggle-sign") toggleSign();
    if (action === "calculate") calculateBasic();
  });
});

scienceButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.science;

    if (value === "clear") clearScience();
    else if (value === "delete") deleteScienceLast();
    else if (value === "calculate") calculateScience();
    else if (value === "sqrt") addScienceValue("sqrt(");
    else if (value === "sin") addScienceValue("sin(");
    else if (value === "cos") addScienceValue("cos(");
    else if (value === "tan") addScienceValue("tan(");
    else if (value === "log") addScienceValue("log(");
    else if (value === "ln") addScienceValue("ln(");
    else if (value === "square") addScienceValue("**2");
    else addScienceValue(value);
  });
});

const convertType = document.getElementById("convertType");
const convertValue = document.getElementById("convertValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const convertBtn = document.getElementById("convertBtn");
const convertResult = document.getElementById("convertResult");

const units = {
  currency: ["USD", "NGN", "EUR", "GBP", "CAD"],
  length: ["Meters", "Kilometers", "Centimeters", "Miles"],
  weight: ["Grams", "Kilograms", "Pounds", "Ounces"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"]
};

const currencyRates = {
  USD: 1,
  NGN: 1500,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36
};

function loadUnits() {
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  units[convertType.value].forEach(unit => {
    fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
  });

  toUnit.selectedIndex = 1;
  convertResult.textContent = "0";
}

function convert() {
  const value = Number(convertValue.value);
  if (Number.isNaN(value) || convertValue.value === "") return;

  let result = value;

  if (convertType.value === "currency") {
    const valueInUsd = value / currencyRates[fromUnit.value];
    result = valueInUsd * currencyRates[toUnit.value];
  }

  if (convertType.value === "length") {
    const toMeters = {
      Meters: 1,
      Kilometers: 1000,
      Centimeters: 0.01,
      Miles: 1609.34
    };

    result = value * toMeters[fromUnit.value] / toMeters[toUnit.value];
  }

  if (convertType.value === "weight") {
    const toGrams = {
      Grams: 1,
      Kilograms: 1000,
      Pounds: 453.592,
      Ounces: 28.3495
    };

    result = value * toGrams[fromUnit.value] / toGrams[toUnit.value];
  }

  if (convertType.value === "temperature") {
    let celsius = value;

    if (fromUnit.value === "Fahrenheit") celsius = (value - 32) * 5 / 9;
    if (fromUnit.value === "Kelvin") celsius = value - 273.15;

    result = celsius;

    if (toUnit.value === "Fahrenheit") result = celsius * 9 / 5 + 32;
    if (toUnit.value === "Kelvin") result = celsius + 273.15;
  }

  convertResult.textContent = Number(result.toFixed(6));
}

convertType.addEventListener("change", loadUnits);
convertBtn.addEventListener("click", convert);
loadUnits();

const mathNotes = document.getElementById("mathNotes");
const saveNotes = document.getElementById("saveNotes");
const noteStatus = document.getElementById("noteStatus");

mathNotes.value = localStorage.getItem("calculatorNotes") || "";

saveNotes.addEventListener("click", () => {
  localStorage.setItem("calculatorNotes", mathNotes.value);
  noteStatus.textContent = "Saved";
});

document.addEventListener("keydown", event => {
  if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") return;

  const activePage = document.querySelector(".page.active").id;
  const key = event.key;

  if (activePage === "basicPage") {
    if (!Number.isNaN(Number(key)) || ["+", "-", "*", "/", ".", "%"].includes(key)) {
      addValue(key);
    }

    if (key === "Enter") {
      event.preventDefault();
      calculateBasic();
    }

    if (key === "Backspace") deleteLast();
    if (key === "Escape") clearCalculator();
  }
});