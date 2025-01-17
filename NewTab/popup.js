// chrome.runtime.sendMessage({ action: "requestToken" }, (response) => {
//   if (response && response.token) {
//     console.log("Token received from background script:", response.token);
//     localStorage.setItem("authToken", response.token);
//   } else {
//     console.error("Failed to receive token from background script");
//   }
// });

document.body.style.width = "200px";
document.body.style.height = "200px";
const refreshToken = localStorage.getItem("refreshToken");
if (refreshToken) {
  fetch("https://support.wmed.edu/LiveTime/services/v1/auth/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("New token received and stored:", data.token);
      } else {
        console.error("Failed to refresh token");
      }
    })
    .catch((error) => {
      console.error("Error refreshing token:", error);
    });
} else {
  newLogin();
}

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
  loginForm.style.backgroundColor = "white";
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

  loginButton.addEventListener("click", function () {
    username = usernameInput.value;
    password = passwordInput.value;
    loginOverlay.remove();
    login();
  });

  loginForm.appendChild(usernameLabel);
  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(passwordInput);
  loginForm.appendChild(loginButton);
  loginOverlay.appendChild(loginForm);
  document.body.appendChild(loginOverlay);
}
function newLogin() {
  createLoginPage();
}

function hidePage() {
  document.querySelector("#loginOverlay").style.display = "none";
}

async function login() {
  const storedToken = localStorage.getItem("refreshToken");
  if (storedToken) {
    hidePage();
    return;
  }
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
      throw new Error(`Login failed: ${response.statusText}`);
    }
    const result = await response.text();
    const loginOBJ = JSON.parse(result);
    console.log(loginOBJ);
    const authToken = loginOBJ.token;
    localStorage.setItem("authToken", authToken);

    const refreshToken = loginOBJ.refreshToken;
    localStorage.setItem("refreshToken", refreshToken);
    hidePage();
  } catch (error) {
    console.error("Error:", error);
  }
}

var subject = "";
var clientId = 0;
const subjectline = document.querySelector("#subjectLine");
subjectline.addEventListener("input", function (event) {
  subject = event.target.value;
});
const searchItem = document.querySelector("#search");
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

    const JSONresponse = await response.json();
    results = JSONresponse.results;
    const resultConatiner = document.querySelector("#resultBox");
    resultConatiner.innerHTML = ""; // Clear previous results

    results.forEach((result) => {
      const resultItem = document.createElement("p");
      resultItem.innerHTML = result.fullName;
      resultItem.style.cursor = "pointer";
      resultItem.onclick = function () {
        console.log(result.fullName);
        searchItem.value = result.clientId;
        clientId = result.clientId;
        const inputEvent = new Event("input");
        searchItem.dispatchEvent(inputEvent);
      };
      resultConatiner.appendChild(resultItem);
    });
    console.log(results[0].clientId);

    const button2 = document.querySelector("#myButton2");

    button2.onclick = function () {
      createPhoneQuickCall(subject, clientId);
    };
  } catch (error) {
    const resultConatiner = document.querySelector("#resultBox");
    resultConatiner.innerHTML = "<p>No results found</p>";
  }

  console.log("Input event detected:", event.target.value);
}
const buton = document.querySelector("#myButton");
if (buton) {
  buton.onclick = async function () {
    buton.remove();
    login();
  };
} else {
  console.error("Element with id 'myButton' not found");
}

async function logisn() {
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
  }
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
      throw new Error(`Login failed: ${response.statusText}`);
    }
    const result = await response.text();
    const loginOBJ = JSON.parse(result);
    console.log(loginOBJ);
    const authToken = loginOBJ.token;
  } catch (error) {
    console.error("Error:", error);
  }
}
searchItem.addEventListener("input", async function (event) {
  searchUser(event);
});
async function createRequest(loginOBJ, subject, requestDescription) {
  const raw = JSON.stringify({
    subject: subject,
    requestProcessIndex: "INCIDENT",
    requestDescription: "<p>" + requestDescription + "</p><div></div>",
    clientId: loginOBJ.clientId, // Use the clientId from loginOBJ
    classification: 54,
    itemId: 277657,
    source: "USER_PORTAL",
  });

  const requestOptions2 = {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/customer/requests",
      requestOptions2
    );
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.debug("Error:", error);
  }
}
async function createPhoneQuickCall(subject, clientId) {
  const raw = JSON.stringify({
    requestProcessIndex: "INCIDENT",
    clientId: clientId, // Dynamically use the clientId from loginOBJ
    subject: subject,
    itemId: 277657,
    classfication: 54,
    source: "USER_PORTAL",
  });

  const requestOptions = {
    // Use POST to send a body
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    body: raw,
    referrer: "https://support.wmed.edu/LiveTime/WebObjects/LiveTime",
    referrerPolicy: "strict-origin-when-cross-origin",

    mode: "cors",
    // quickCallId: 10,
  };

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/quickcall/request/quickCall/10?locale=en-US",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    const result = await response.json(); // Parse response as JSON
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message); // Improved error logging
  }
}
document
  .getElementById("settingsButton")
  .addEventListener("click", function () {
    var panel = document.getElementById("settingsPanel");
    if (panel.style.display === "none") {
      panel.style.display = "block";
    } else {
      panel.style.display = "none";
    }
  });

settings = document.querySelector("#settingsPanel");
settings.style.backgroundColor = "rgba(32, 32, 32, 0.22)";
settings.style.borderRadius = "5px";
settings.style.marginTop = "2px";
settings.style.marginBottom = "2px";
settings.style.padding = "5px";
let username = "";
const usernameInput = document.querySelector("#username");
usernameInput.addEventListener("input", function (event) {
  username = event.target.value;
});

let password = "";
const passwordInput = document.querySelector("#password");
passwordInput.addEventListener("input", function (event) {
  password = event.target.value;
});
