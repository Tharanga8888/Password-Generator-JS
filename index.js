function generatePassword(pwLength, lowercase, uppercase, numbers, symbols) {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbersChars = "0123456789";
    const symbolsChars = "!@#$%^&*()_-+=";

    let allowedChars = "";
    let genPassword = "";

    if (lowercase) allowedChars += lowercaseChars;
    if (uppercase) allowedChars += uppercaseChars;
    if (numbers) allowedChars += numbersChars;
    if (symbols) allowedChars += symbolsChars;

    if (pwLength <= 0) {
        return "(Password length must be at least 1)";
    }

    if (allowedChars.length === 0) {
        return "(Select at least one character type)";
    }

    for (let i = 0; i < pwLength; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        genPassword += allowedChars[randomIndex];
    }

    return genPassword;
}

function getStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return score;
}

function updateStrengthBar(password) {
    const strengthBar = document.getElementById("strength-bar");
    const strengthText = document.getElementById("strength-text");
    let checkPassword = "";

    !password.startsWith("(") ? checkPassword = password : checkPassword = "";
    const score = getStrength(checkPassword);

    const colors = ["#ddd", "red", "orange", "yellow", "#4caf50", "blue"];
    const labels = ["", "Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

    strengthBar.style.width = (score / 5) * 100 + "%";
    strengthBar.style.background = colors[score];
    strengthText.textContent = labels[score];
}

// DOM Elements
const lengthInput = document.getElementById("length");
const lowercaseInput = document.getElementById("lowercase");
const uppercaseInput = document.getElementById("uppercase");
const numbersInput = document.getElementById("numbers");
const symbolsInput = document.getElementById("symbols");
const generateBtn = document.getElementById("generate-btn");
const passwordOutput = document.getElementById("password-output");
const copyBtn = document.getElementById("copy-btn");
const message = document.getElementById("message");
const historyList = document.getElementById("history-list");


let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
renderHistory();

function renderHistory() {
    historyList.innerHTML = "";
    history.slice(-5).reverse().forEach(pw => {
        const li = document.createElement("li");
        li.textContent = pw;
        const copySmall = document.createElement("button");
        copySmall.textContent = "📋";
        copySmall.style.border = "none";
        copySmall.style.background = "transparent";
        copySmall.style.cursor = "pointer";
        copySmall.onclick = () => {
            navigator.clipboard.writeText(pw);
            message.textContent = "Password copied!";
            message.style.color = "blue";
        };
        li.appendChild(copySmall);
        historyList.appendChild(li);
    });
}


generateBtn.addEventListener("click", () => {
    const length = Number(lengthInput.value);
    const lowercase = lowercaseInput.checked;
    const uppercase = uppercaseInput.checked;
    const numbers = numbersInput.checked;
    const symbols = symbolsInput.checked;

    const password = generatePassword(length, lowercase, uppercase, numbers, symbols);
    passwordOutput.value = password;
    updateStrengthBar(password);

    if (!password.startsWith("(")) {
        history.push(password);
        localStorage.setItem("passwordHistory", JSON.stringify(history));
        renderHistory();
        message.textContent = "Password generated!";
        message.style.color = "green";
    } else {
        message.textContent = password;
        message.style.color = "red";
    }
});


copyBtn.addEventListener("click", () => {
    if (passwordOutput.value.trim() !== "") {
        navigator.clipboard.writeText(passwordOutput.value)
            .then(() => {
                message.textContent = "Password copied to clipboard!";
                message.style.color = "blue";
            });
    }
});
