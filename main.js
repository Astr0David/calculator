const keys = document.querySelectorAll(".key");
const input = document.querySelector(".calculator_screen .input");
const output = document.querySelector(".calculator_screen .output");

let user_input = "";

for (let key of keys) {
  key.addEventListener("mousedown", () => {
    key.style.transform = "scale(0.95)";
  });

  key.addEventListener("mouseup", () => {
    key.style.transform = "scale(1.05)";
  });
  const value = key.getAttribute("data-key");
  console.log(value);
  key.addEventListener("click", () => {
    if (value == "clear") {
      user_input = "";
      input.innerHTML = "";
      output.innerHTML = "";
    } else if (value == "delete") {
      user_input = user_input.slice(0, -1);
      input.innerHTML = isClean(user_input);
    } else if (value == "brackets") {
      if (
        user_input.indexOf("(") == -1 ||
        (user_input.indexOf("(") != -1 &&
          user_input.indexOf(")") != -1 &&
          user_input.lastIndexOf("(") < user_input.lastIndexOf(")"))
      ) {
        if (isValid("(")) {
          user_input += "(";
        }
      } else if (
        (user_input.indexOf("(") != -1 && user_input.indexOf(")") == -1) ||
        (user_input.indexOf("(") != -1 &&
          user_input.indexOf(")") != -1 &&
          user_input.lastIndexOf("(") > user_input.lastIndexOf(")"))
      ) {
        if (isValid(")")) {
          user_input += ")";
        }
      }
      input.innerHTML = isClean(user_input);
    } else if (value == "=") {
      input.innerHTML = isClean(user_input);
      output.innerHTML = eval(user_input);
    } else {
      if (isValid(value)) {
        user_input += value;
        input.innerHTML = isClean(user_input);
      }
    }
  });
}

const isValid = function (char) {
  const operators = ["+", "-", "/", "%", "*"];
  if (operators.includes(char)) {
    if (user_input == "") {
      if (char == "*" || char == "/" || char == "%") {
        return false;
      }
    } else if (
      operators.includes(user_input[user_input.length - 1]) ||
      user_input[user_input.length - 1] == "(" ||
      user_input[user_input.length - 1] == "."
    ) {
      return false;
    }
  } else if (char == ".") {
    if (
      user_input[user_input.length - 1] == "." ||
      operators.includes(user_input[user_input.length - 1]) ||
      user_input[user_input.length - 1] == "(" ||
      user_input[user_input.length - 1] == ")"
    ) {
      return false;
    }
  } else if (char == "(") {
    if (operators.includes(user_input[user_input.length - 1])) {
      return true;
    } else if (user_input == "") {
      return true;
    } else {
      return false;
    }
  } else if (char == ")") {
    if (operators.includes(user_input[user_input.length - 1])) {
      return false;
    } else if (user_input[user_input.length - 1] == "(") {
      return false;
    }
  } else if (user_input[user_input.length - 1] == ")") {
    if (operators.includes(char)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

function isClean(user_input) {
  let input_array = user_input.split("");
  let input_array_length = input_array.length;

  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] == "*") {
      input_array[i] = ` <span class="operator">x</span> `;
    } else if (input_array[i] == "/") {
      input_array[i] = ` <span class="operator">÷</span> `;
    } else if (input_array[i] == "+") {
      input_array[i] = ` <span class="operator">+</span> `;
    } else if (input_array[i] == "-") {
      input_array[i] = ` <span class="operator">-</span> `;
    } else if (input_array[i] == "(") {
      input_array[i] = `<span class="brackets">(</span>`;
    } else if (input_array[i] == ")") {
      input_array[i] = `<span class="brackets">)</span>`;
    } else if (input_array[i] == "%") {
      input_array[i] = `<span class="operator">%</span>`;
    }
  }

  return input_array.join("");
}
