// chrome.runtime.sendMessage({ action: "requestToken" }, (response) => {
//   if (response && response.token) {
//     console.log("Token received from background script:", response.token);
//     localStorage.setItem("authToken", response.token);
//   } else {
//     console.error("Failed to receive token from background script");
//   }
// });

var subject = "";
var clientId = 0;
const subjectline = document.querySelector("#subjectLine");
subjectline.addEventListener("input", function (event) {
  subject = event.target.value;
});
const searchItem = document.querySelector("#search");
async function searchUser(loginOBJ, event) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginOBJ.token}`,
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
      clientId;
      createPhoneQuickCall(loginOBJ, subject);
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

async function login() {
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

    const button2 = document.querySelector("#myButton2");

    searchItem.addEventListener("input", async function (event) {
      searchUser(loginOBJ, event);
    });
    button2.onclick = function () {
      createPhoneQuickCall(loginOBJ, subject);
    };
  } catch (error) {
    console.error("Error:", error);
  }
}
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
async function createPhoneQuickCall(loginOBJ, subject) {
  const raw = JSON.stringify({
    requestProcessIndex: "INCIDENT",
    clientId: clientId, // Dynamically use the clientId from loginOBJ
    subject: subject,
    itemId: 277657,
    classfication: 54,
    source: "USER_PORTAL",
  });

  const requestOptions = {
    method: "POST", // Use POST to send a body
    headers: {
      Authorization: `Bearer ${loginOBJ.token}`,
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
