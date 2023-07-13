const keys = document.querySelectorAll(".key");
const input = document.querySelector(".calculator_screen .input");
const output = document.querySelector(".calculator_screen .output");

let user_input = "";

for (let key of keys) {
  const value = key.getAttribute("data-key");
    console.log(value)
  key.addEventListener("click", () => {
    if (value == "clear") {
      user_input = "";
      input.innerHTML = "";
      output.innerHTML = "";
    } else if (value == "delete") {
      user_input = user_input.slice(0, -1);
      input.innerHTML = user_input;
    } else if (value == "brackets") {
      if (
        user_input.indexOf("(") == -1 ||
        (user_input.indexOf("(") != -1 &&
          user_input.indexOf(")") != -1 &&
          user_input.lastIndexOf("(") < user_input.lastIndexOf(")"))
      ) {
        user_input += "(";
      } else if (
        (user_input.indexOf("(") != -1 && user_input.indexOf(")") == -1) ||
        (user_input.indexOf("(") != -1 &&
          user_input.indexOf(")") != -1 &&
          user_input.lastIndexOf("(") > user_input.lastIndexOf(")"))
      ) {
        user_input += ")";
      }
      input.innerHTML = user_input;
    } else if (value == "=") {
      input.innerHTML = user_input;
      output.innerHTML = eval(user_input);
    } else {
        if (isValid(value)) {
            user_input += value;
            input.innerHTML = user_input;
        }
    }
  });
}

const isValid = function(char) {
    const operators = ["+","-","/","%","*"]
    if (operators.includes(char)) {
        if (operators.includes(user_input[user_input.length - 1]) ) {
            return false
        }
    } else if (char == ".") {
        if (user_input[user_input.length - 1] == ".") {
            return false
        }
    } else {
        return true
    }
    return true
}