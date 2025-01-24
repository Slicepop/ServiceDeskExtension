// https://support.wmed.edu/servicedesk-apidocs/

checkAuth();
async function refreshToken() {
  try {
    const respond = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/auth/tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      }
    );
    if (respond.ok) {
      const data = await respond.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    }
  } catch (error) {
    createLoginPage();
  }
  createLoginPage();
  return false;
}
async function checkAuth() {
  //This function runs a search to see if the current authentication token is valid, if not, login page is shown
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/client/findusers?internalOnly=true&clientTypes=8&searchTerm=Soffset=0&limit=10&locale=en-US",
      requestOptions
    );
    if (response.ok) {
      return true;
    } else {
      refreshToken();
    }
  } catch (error) {
    createLoginPage();
    return false;
  }
}
// if (authorized == false) {
//   console.log("FALSEEEE");
//   setTimeout(() => {
// fetch("https://support.wmed.edu/LiveTime/services/v1/auth/tokens", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: localStorage.getItem("refreshToken"),
//   },
// })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.token) {
//           localStorage.setItem("authToken", data.token);
//           localStorage.setItem("refreshToken", data.refreshToken);
//           console.log("New token received and stored:", data.token);
//         } else {
//           createLoginPage();
//         }
//       })
//       .catch((error) => {
//         createLoginPage();
//       });
//   }, 2000);
// }

function createLoginPage() {
  const loginOverlay = document.createElement("div");

  loginOverlay.id = "loginOverlay";
  loginOverlay.style.position = "fixed";
  loginOverlay.style.top = "0";
  loginOverlay.style.left = "0";
  loginOverlay.style.width = "100%";
  loginOverlay.style.height = "100%";
  loginOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  loginOverlay.style.display = "flex";
  loginOverlay.style.justifyContent = "center";
  loginOverlay.style.alignItems = "center";
  loginOverlay.style.zIndex = "1000";

  const loginForm = document.createElement("div");
  if (localStorage.getItem("isDarkMode") === "true") {
    loginForm.style.backgroundColor = "#363232";
  } else {
    loginForm.style.backgroundColor = "white";
  }
  loginForm.style.padding = "20px";
  loginForm.style.borderRadius = "5px";
  loginForm.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username:";
  usernameLabel.style.display = "block";
  usernameLabel.style.marginBottom = "5px";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.style.width = "100%";
  usernameInput.style.marginBottom = "10px";

  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password:";
  passwordLabel.style.display = "block";
  passwordLabel.style.marginBottom = "5px";

  const passwordInput = document.createElement("input");
  passwordInput.id = "pwordField";
  passwordInput.type = "password";
  passwordInput.style.width = "100%";
  passwordInput.style.marginBottom = "10px";

  const loginButton = document.createElement("button");
  loginButton.textContent = "Login";
  loginButton.style.width = "100%";
  loginButton.style.padding = "10px";
  loginButton.style.backgroundColor = "#4CAF50";
  loginButton.style.color = "white";
  loginButton.style.border = "none";
  loginButton.style.borderRadius = "5px";
  loginButton.style.cursor = "pointer";

  function handleLogin() {
    username = usernameInput.value;
    password = passwordInput.value;
    login();
  }

  loginButton.addEventListener("click", handleLogin);

  passwordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  });

  loginForm.appendChild(usernameLabel);
  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(passwordInput);
  loginForm.appendChild(loginButton);
  loginOverlay.appendChild(loginForm);
  document.querySelector("#buttons").appendChild(loginOverlay);
}

function hidePage() {
  document.querySelector("#loginOverlay").style.display = "none";
}

async function login() {
  const storedToken = localStorage.getItem("refreshToken");

  const jsonData = {
    username: username,
    password: password,
    ldapSourceId: 1,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/auth/login",
      requestOptions
    );
    if (!response.ok) {
      const errorMSG = document.createElement("P");
      errorMSG.id = "err";
      errorMSG.textContent =
        "Incorrect Username or Password. Please try again.";

      if (document.querySelector("#err")) {
        document.querySelector("#err").remove();
        setTimeout(() => {
          document.querySelector("#loginOverlay > div").append(errorMSG);
        }, 200);
      } else {
        document.querySelector("#loginOverlay > div").append(errorMSG);
      }
    } else {
      document.querySelector("#loginOverlay").remove();
    }
    const result = await response.text();
    const loginOBJ = JSON.parse(result);
    console.log(loginOBJ);
    localStorage.setItem("refreshToken", loginOBJ.refreshToken);
    localStorage.setItem("authToken", loginOBJ.token);
  } catch (error) {
    console.log(error);
  }
}

const subjectline = document.querySelector("#subjectLine");
const savedSubject = localStorage.getItem("subject");
if (savedSubject) {
  subjectline.value = savedSubject;
  subject = savedSubject;
}
subjectline.addEventListener("input", function (event) {
  localStorage.setItem("subject", event.target.value);
  subject = event.target.value;
});
const searchItem = document.querySelector("#search");
const lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
  searchItem.value = lastSearch;
  const inputEvent = new Event("input");
  searchItem.dispatchEvent(inputEvent);
}
let debounceTimeout;
searchItem.addEventListener("input", function (event) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async function () {
    localStorage.setItem("lastSearch", event.target.value);
    searchUser(event);
  }, 500);
});
async function searchUser(event) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/client/findusers?internalOnly=true&clientTypes=8&searchTerm=" +
        event.target.value +
        "&offset=0&limit=10&locale=en-US",
      requestOptions
    );
    if (!response.ok) {
      refreshToken();
      searchUser(event);
      return;
    }
    const JSONresponse = await response.json();
    results = JSONresponse.results;
    const resultConatiner = document.querySelector("#resultBox");
    resultConatiner.innerHTML = "";

    results.forEach((result) => {
      const resultItem = document.createElement("p");
      resultItem.className = "result";
      resultItem.innerHTML = result.fullName;
      resultItem.style.cursor = "pointer";
      resultItem.onclick = function () {
        console.log(result.fullName);
        searchItem.value = result.fullName;
        localStorage.setItem("clientId", result.clientId);
        const inputEvent = new Event("input");
        searchItem.dispatchEvent(inputEvent);
      };
      resultConatiner.appendChild(resultItem);
    });
    console.log(results[0].clientId + "ASD237");
  } catch (error) {
    // if (!response.ok) {
    //   console.log(error);
    //   // Optionally, you can trigger a re-login or show a login prompt here
    //   createLoginPage();
    // }
    const resultConatiner = document.querySelector("#resultBox");
    resultConatiner.innerHTML = "<p>No results found</p>";

    console.log("Input event detected:", event.target.value);
  }
}
const button2 = document.querySelectorAll("#myButton2");
button2.forEach((button) => {
  button.onclick = function () {
    var clientId = localStorage.getItem("clientId");
    var subject = localStorage.getItem("subject");

    localStorage.removeItem("subject");
    localStorage.removeItem("lastSearch");
    localStorage.removeItem("clientId");

    switch (button.textContent) {
      case "Phone Call":
        if (clientId && subject) {
          createQuickCall(subject, clientId, 277657);
        }
        break;
      case "Walk-Up":
        if (clientId && subject) {
          createQuickCall(subject, clientId, 277658);
        }
        break;
      case "Teams Message":
        if (clientId && subject) {
          createQuickCall(subject, clientId, 277661);
        }
        break;
      default:
        console.error("Something went wrong");
        break;
    }
  };
});

// Removed unused function logisn and variable authToken

// async funct
// }ion createRequest(loginOBJ, subject, requestDescription) {
//   const raw = JSON.stringify({
//     subject: subject,
//     requestProcessIndex: "INCIDENT",
//     requestDescription: "<p>" + requestDescription + "</p><div></div>",
//     clientId: loginOBJ.clientId, // Use the clientId from loginOBJ
//     classification: 54,
//     itemId: 277657,
//     source: "USER_PORTAL",
//   });

//   const requestOptions2 = {
//     method: "POST",
//     headers: {
//       // Authorization: `Bearer ${authToken}`,
//       "Content-Type": "application/json",
//       Connection: "keep-alive",
//     },
//     body: raw,
//     redirect: "follow",
//   };

//   try {
//     const response = await fetch(
//       "https://support.wmed.edu/LiveTime/services/v1/customer/requests",
//       requestOptions2
//     );
//     if (!response.ok) {
//       throw new Error(`Request failed: ${response.statusText}`);
//     }
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.debug("Error:", error);
//   }
async function createQuickCall(subject, clientId, itemId) {
  switch (itemId) {
    case 277657:
      subject = "Phone Call - " + subject;
      index = 10;
      break;
    case 277658:
      subject = "Walk Up - " + subject;
      index = 11;
      break;
    case 277661:
      subject = "Teams - " + subject;
      index = 12;
      break;
    default:
      console.error("Invalid itemId");
      return;
  }
  const raw = JSON.stringify({
    requestProcessIndex: "INCIDENT",
    clientId: clientId,
    subject: subject,
    itemId: itemId,
    classfication: 54,
    source: "USER_PORTAL",
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    body: raw,
    referrer: "https://support.wmed.edu/LiveTime/WebObjects/LiveTime",
    referrerPolicy: "strict-origin-when-cross-origin",

    mode: "cors",
  };

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/quickcall/request/quickCall/" +
        index +
        "?locale=en-US",
      requestOptions
    );
    if (!response.ok) {
      refreshToken();
      createQuickCall(subject, clientId, itemId);
      return;
    }
    const result = await response.json();
    console.log(result);

    const requestIdDiv = document.createElement("div");
    requestIdDiv.innerHTML = `<p style="display: inline;">Incident Created ID: </p><a href="https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${result.requestId}" target="_blank">${result.requestId}</a>`;
    document.body.appendChild(requestIdDiv);
    setTimeout(() => {
      window.close();
    }, 3000);
  } catch (error) {
    if (error.message.includes("401")) {
      refreshToken();
      createQuickCall(subject, clientId, itemId);
    } else {
      console.error("Error:", error.message);
    }
  }
}
const toggleDark = document.querySelector("#theme-toggle");
var flip = localStorage.getItem("isDarkMode");
toggleDark.addEventListener("click", function () {
  console.log(flip);
  if (localStorage.getItem("isDarkMode") === "true") {
    toggleDark.src = chrome.runtime.getURL("./sun-solid.svg");
  } else {
    toggleDark.src = chrome.runtime.getURL("./moon-solid.svg");
  }
  document.body.classList.toggle("dark-mode");
  quickCallButtons.forEach((button) => {
    button.classList.toggle("dark-mode");
  });
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("isDarkMode", isDarkMode);
});
const quickCallButtons = document.querySelectorAll("#myButton2");
// On page load, check the saved preference and apply dark mode if needed
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("isDarkMode");
  if (savedTheme === "true") {
    toggleDark.src = chrome.runtime.getURL("./moon-solid.svg");
    document.body.classList.add("dark-mode");
    quickCallButtons.forEach((button) => {
      button.classList.add("dark-mode");
    });
  } else {
    toggleDark.src = chrome.runtime.getURL("./sun-solid.svg");
  }
});
