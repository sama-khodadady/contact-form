const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const messageBox = document.getElementById("message");
const queryDiv = document.getElementById("query");
const checkBox = document.getElementById("checkbox");
const checkBoxDiv = document.getElementById("checkbox-div");
const radioInputs = document.getElementsByName("query-type");
const inputs = document.querySelectorAll("input");
const button = document.querySelector("button");
const modal = document.querySelector(".modal");
const form = document.querySelector("form");

let isValid = true;
const values = [];

//show alert
const showAlert = (element, message, type) => {
  if (
    element.type === "text" ||
    element.type === "textarea" ||
    element.type === "email"
  ) {
    element.style.borderColor = "#d73c3c";
  }
  const divEl = element.parentElement.lastElementChild;
  divEl.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add(`alert-${type}`);
  divEl.append(alert);
};

//remove alert
const removeAlert = (element) => {
  if (
    element.type === "text" ||
    element.type === "textarea" ||
    element.type === "email"
  ) {
    element.style.borderColor = "#87a3a6";
  }
  const divEl = element.parentElement.lastElementChild;
  divEl.innerHTML = "";
};

//validate firstname,lastname and messageBox
const validatetextInputs = () => {
  const fNameValue = firstNameInput.value.toLowerCase().trim();
  const lNameValue = lastNameInput.value.toLowerCase().trim();
  const messageValue = messageBox.value.toLowerCase().trim();
  const textRegex = /^[a-zA-Z ]+$/;

  isValid = !fNameValue
    ? (showAlert(firstNameInput, "This field is required", "error"), false)
    : !fNameValue.match(textRegex)
    ? (showAlert(firstNameInput, "Name should contain letters only!", "error"),
      false)
    : ((values[0] = fNameValue), isValid);

  isValid = !lNameValue
    ? (showAlert(lastNameInput, "This field is required", "error"), false)
    : !lNameValue.match(textRegex)
    ? (showAlert(
        lastNameInput,
        "Last name should contain letters only!",
        "error"
      ),
      false)
    : ((values[1] = lNameValue), isValid);

  isValid = !messageValue
    ? (showAlert(messageBox, "This field is required", "error"), false)
    : ((values[4] = messageValue), isValid);

  return isValid;
};

//validate email
const validateEmailInput = () => {
  const emailValue = emailInput.value.toLowerCase().trim();
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  isValid = !emailValue
    ? (showAlert(emailInput, "This field is required", "error"), false)
    : !emailValue.match(emailRegex)
    ? (showAlert(emailInput, "Please enter a valid email address", "error"),
      false)
    : ((values[2] = emailValue), isValid);

  return isValid;
};

//validate radio buttons and checkBox
const validateCheckInputs = () => {
  const options = [...inputs].filter((input) => input.type === "radio");

  isValid =
    !options[0].checked && !options[1].checked
      ? (showAlert(queryDiv, "Please Select a Query Type!", "error"), false)
      : isValid;

  isValid = !checkBox.checked
    ? (showAlert(
        checkBoxDiv,
        "To submit this form, please consent to being contacted fild is required",
        "error"
      ),
      false)
    : ((values[5] = "true"), isValid);

  return isValid;
};

//change style of query types
const changeClass = (id) => {
  radioInputs.forEach((input) => {
    input.id === id
      ? input.parentElement.classList.add("radio-selected")
      : input.parentElement.classList.remove("radio-selected");
  });
};

const radioInputHandler = (event) => {
  const queryValue = event.target.nextElementSibling.innerText;
  const id = event.target.id;
  changeClass(id);
  values[3] = queryValue;
};

//save user form data to localStorage
const saveToLocalStorage = (values) => {
  const [firstName, lastName, email, queryType, message, consent] = values;

  const userInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    queryType: queryType,
    message: message,
    consent: consent,
  };

  let storedData = JSON.parse(localStorage.getItem("values")) || [];

  storedData.push(userInfo);

  localStorage.setItem("values", JSON.stringify(storedData));
};

//show modal form submitted succesfully
const displayModal = (alert, message, type) => {
  modal.classList.remove("hidden");
  modal.firstElementChild.lastElementChild.innerText = alert;
  modal.lastElementChild.innerText = message;
  if (type === "success") {
    modal.firstElementChild.firstElementChild.src =
      "../assets/images/icon-success-check.svg";
    modal.firstElementChild.firstElementChild.alt = "succesfull-check";
  }

  setTimeout(() => {
    modal.classList.add("hidden");
  }, 1000);
};

//handle the button
const buttonHandler = (event) => {
  event.preventDefault();

  isValid = true;

  validatetextInputs();
  validateEmailInput();
  validateCheckInputs();

  if (isValid) {
    saveToLocalStorage(values);
    displayModal(
      "Message Sent!",
      "Thanks for completing the form. We'll be in touch soon!",
      "success"
    );

    setTimeout(() => {
      form.submit();
      form.reset();
      values.length = 0;
      isValid = true;
    }, 2000);
  } else {
    firstNameInput.addEventListener("focus", () => removeAlert(firstNameInput));
    lastNameInput.addEventListener("focus", () => removeAlert(lastNameInput));
    emailInput.addEventListener("focus", () => removeAlert(emailInput));
    radioInputs.forEach((query) => {
      query.addEventListener("change", () => removeAlert(queryDiv));
    });
    messageBox.addEventListener("focus", () => removeAlert(messageBox));
    checkBox.addEventListener("change", () => removeAlert(checkBoxDiv));
  }
};

//prevent copy,paste
[firstNameInput, lastNameInput, emailInput, messageBox].forEach((input) => {
  input.addEventListener("paste", (e) => e.preventDefault());
  input.addEventListener("drop", (e) => e.preventDefault());
  input.addEventListener("dragover", (e) => e.preventDefault());
});

radioInputs.forEach((query) => {
  query.addEventListener("click", radioInputHandler);
});
button.addEventListener("click", buttonHandler);
