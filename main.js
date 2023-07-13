const keys = document.querySelectorAll(".key");
const input = document.querySelector(".calculator_screen .input");
const output = document.querySelector(".calculator_screen .output");

let user_input = "";
const operators = ["+", "-", "/", "%", "*"];

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
      if (user_input.includes("/0")) {
        alert("You cannot divide by 0.");
      } else {
        input.innerHTML = isClean(user_input);
        output.innerHTML = addComma(evaluateExpression(user_input));
      }
    } else if (value == ".") {
      if (user_input.indexOf(".") !== -1) {
        for (let each in operators) {
          if (user_input.lastIndexOf(each) > user_input.lastIndexOf(".")) {
            if (isValid(".")) {
              user_input += ".";
              input.innerHTML = isClean(user_input);
            }
          }
        }
      } else {
        if (isValid(".")) {
          user_input += ".";
          input.innerHTML = isClean(user_input);
        }
      }
    } else {
      if (isValid(value)) {
        user_input += value;
        input.innerHTML = isClean(user_input);
      }
    }
  });
}

const isValid = function (char) {
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
    if (user_input.endsWith(".") || user_input.endsWith("(")) {
      return false;
    }
    const lastOperatorIndex = user_input.lastIndexOf(
      operators.find((operator) => user_input.includes(operator))
    );
    const lastDecimalIndex = user_input.lastIndexOf(".");
    if (lastDecimalIndex > lastOperatorIndex) {
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

  for (let i = 0; i < input_array.length; i++) {
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

function addComma(output) {
  output = Math.round((output + Number.EPSILON) * 100000) / 100000;
  let output_string = output.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];

  let output_array = output_string.split("");

  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0; i -= 3) {
      output_array.splice(i, 0, ",");
    }
  }

  if (decimal) {
    output_array.push(".");
    output_array.push(decimal);
  }

  return output_array.join("");
}

function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  const postfix = convertToPostfix(tokens);
  const result = evaluatePostfix(postfix);
  return result;
}

function tokenizeExpression(expression) {
  const regex = /(\d+(\.\d+)?|\+|\-|\*|\/|%|\(|\))/g;
  const tokens = expression.match(regex);

  return tokens;
}

function isOperator(token) {
  return ["+", "-", "*", "/", "%"].includes(token);
}

function getPrecedence(operator) {
  if (operator === "+" || operator === "-") {
    return 1;
  } else if (operator === "*" || operator === "/" || operator === "%") {
    return 2;
  }
  return 0;
}

function convertToPostfix(tokens) {
  const postfix = [];
  const stack = [];

  for (let token of tokens) {
    if (!isOperator(token) && token !== "(" && token !== ")") {
      postfix.push(parseFloat(token));
    } else if (isOperator(token)) {
      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== "(" &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        postfix.push(stack.pop());
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        postfix.push(stack.pop());
      }
      stack.pop();
    }
  }

  while (stack.length > 0) {
    postfix.push(stack.pop());
  }

  return postfix;
}

function evaluatePostfix(postfix) {
  const stack = [];

  for (let token of postfix) {
    if (!isOperator(token)) {
      stack.push(parseFloat(token));
    } else {
      if (token === "-") {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        let result;

        if (isNaN(operand1)) {
          result = -operand2;
        } else {
          result = operand1 - operand2;
        }

        stack.push(result);
      } else if (token === "+") {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        let result;

        if (isNaN(operand1)) {
          result = operand2;
        } else {
          result = operand1 + operand2;
        }

        stack.push(result);
      } else {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        let result;

        switch (token) {
          case "+":
            result = operand1 + operand2;
            break;
          case "*":
            result = operand1 * operand2;
            break;
          case "/":
            result = operand1 / operand2;
            break;
          case "%":
            result = operand1 % operand2;
            break;
        }

        stack.push(result);
      }
    }
  }

  return stack.pop();
}

const keyMap = {
  Digit0: "0",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Period: ".",
  Slash: "/",
  KeyX: "*",
  Minus: "-",
  Equal: "+",
  Enter: "=",
  Backspace: "delete",
};

document.addEventListener("keydown", (event) => {
  const key = event.code;
  const value = keyMap[key];

  if (key === "Digit5") {
    if (event.shiftKey) {
      const percentButton = document.querySelector('[data-key="%"]');
      percentButton.click();
    } else {
      const numberfive = document.querySelector('[data-key="5"]');
      numberfive.click();
    }
  } else if (value) {
    const button = document.querySelector(`[data-key="${value}"]`);
    button.click();
  }
});
