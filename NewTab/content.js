// "the greatest extension not in the app store - wmed employee" - Richard Graziano
//TODO

/**
 * If the current URL includes "New&requestId=", it modifies the behavior of the save button and adds a "Save and Close" button.
 * The "Save and Close" button will close the window after a delay when clicked.
 */
const myTasks = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li.requesttypeheader.ml-0"
);
const incident = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li:nth-child(2) > span"
);
if (incident) {
  incident.click();
}
window.onfocus = function () {
  if (localStorage.getItem("refresh") == "true") {
    localStorage.setItem("refresh", "false");
    if (incident) {
      if (incident.className == "selectedtab") {
        incident.click();
      } else {
        if (myTasks) {
          myTasks.click();
        }
      }
    }
  }
};

const requestTitle = document.querySelector("#request-subject-text");
const requestUser = document.querySelector("#customer-search-input");
function updateTitle() {
  if (requestTitle) {
    if (
      requestTitle.textContent.length > 10 &&
      requestTitle.textContent.length < 64
    ) {
      document.title = requestTitle.textContent;
    } else if (requestTitle.textContent.length < 64) {
      document.title = requestTitle.textContent;
      try {
        document.title += " - " + requestUser.value;
      } catch (error) {
        console.error("Error updating title with user value:", error);
      }
    } else {
      document.title = requestTitle.textContent.substring(0, 61) + "...";
    }
  } else {
    document.title = "ERROR loading title, refresh";
  }
}
const requestStatus = document.querySelector(
  "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(13) > div > select"
);
const saveButton = document.querySelector(
  "#request_general_container > div > div.card-header.general-card-header > button"
);
function addPrivate() {
  if (saveButton) {
    saveButton.onclick = function () {
      if (
        requestStatus.value == "Resolved" ||
        requestStatus.value == "Autoclosed"
      ) {
        localStorage.removeItem(requestId);
      }
    };
  }
  const requestId = document.querySelector(
    "#editRequest > div.card.request-subject.common-subject-description-card.ml-0 > div > div.priority_requestnumber > p.request-number"
  ).textContent;
  const privNote = document.createElement("Input");
  privNote.style.marginRight = "10px";
  privNote.placeholder = "Private Note";
  privNote.style.outlineStyle = "solid";
  privNote.style.outlineWidth = ".25px";
  privNote.style.outlineColor = "#63fbf0";
  privNote.style.color = "#63fbf0";
  privNote.style.backgroundColor = "rgba(32, 32, 32, 0.8)";
  privNote.style.borderRadius = "5px";
  privNote.style.transform = "scale(.85)";
  privNote.value = localStorage.getItem(requestId) || "";

  privNote.addEventListener("input", () => {
    if (privNote.value === "") {
      localStorage.removeItem(requestId);
    } else {
      localStorage.setItem(requestId, privNote.value);
    }
  });
  document
    .querySelector(
      "#editRequest > div.card.request-subject.common-subject-description-card.ml-0 > div > div.request_subject"
    )
    .prepend(privNote);
}
if (window.location.href.includes("New&requestId=")) {
  addPrivate();
  updateTitle();
  const descriptionArea = document.querySelector(
    "#description-tab > div.ml-2.description-box"
  );
  const readMore = document.querySelector("#more_less_link");
  if (readMore) {
    readMore.click();
  }
  if (descriptionArea) {
    document.querySelector("#request-description-text").style.overflow = "auto";
    descriptionArea.style.resize = "vertical";
    descriptionArea.style.minHeight = "80px";
    descriptionArea.style.maxHeight = descriptionArea.scrollHeight + 20 + "px";
    descriptionArea.style.height = "300px";
  }
}

function fixCSS() {
  if (window.location.href.includes("New&requestId=")) {
    if (document.title != requestTitle.textContent) {
      updateTitle();
    }
    const SaveLoad = document.querySelector("#toast-container > div");
    if (SaveLoad) {
      localStorage.setItem("refresh", "true");
    }
    const saveButton = document.querySelector(
      "#request_general_container > div > div.card-header.general-card-header > button"
    );

    saveButton.onclick = function () {
      setTimeout(() => {
        fixCSS();
      }, 200);
    };

    const addNoteButton = document.querySelector(
      "button.btn.btn-primary.footer-button"
    );
    if (addNoteButton) {
      addNoteButton.onclick = function () {
        setTimeout(() => {
          fixCSS();
        }, 200);
      };
    }

    if (!document.querySelector('img[alt="Save and Close"]')) {
      const saveClose = document.createElement("img");
      if (saveClose) {
        saveClose.src = chrome.runtime.getURL("./saveClose.png");
        saveClose.className = "text-right";
        saveClose.style.marginLeft = "30px";
        saveClose.alt = "Save and Close";
        saveClose.style.width = "35px";
        saveClose.style.height = "20px";
        saveClose.style.transform = "scale(1.5)";
        saveClose.style.outlineStyle = "solid";
        saveClose.style.outlineWidth = ".15px";
        saveClose.style.borderRadius = "2.5px";
        saveClose.style.background = "#393d3e";
        saveClose.style.padding = "2px";
        const container = document.querySelector(
          "#request_general_container > div > div.card-header.general-card-header > button"
        );
        if (container) {
          container.append(saveClose);
        }
        saveClose.onclick = function () {
          setTimeout(() => {
            window.close();
          }, 1000);
        };
      }
      const container = document.querySelector(
        "#request_general_container > div > div.card-header.general-card-header > button"
      );
      if (container) {
        if (saveClose) {
          container.append(saveClose);
        }
      }
      saveClose.onclick = function () {
        setTimeout(() => {
          window.close();
        }, 800);
      };
    }
  }
  if (window.history.pushState) {
    window.history.pushState(null, "", window.location.href);
  }
}
if (!localStorage.getItem("refresh")) {
  localStorage.setItem("refresh", "false");
}

/**
 * Replaces all anchor elements with IDs starting with "requestId" with styled paragraph elements.
 * The new paragraph elements retain the original text content and have specific styles and event listeners.
 *
 * - Alternates the background color of elements with the class "accordion-toggle" which is the list item in the ticket list.
 * - Sets the cursor to default when hovering over anything but the requestID.
 * - Creates a new paragraph element with the same text content as the original link this is so the underlying code that opens the ticket breaks.
 * - Styles the paragraph element and adds mouseover and mouseout event listeners for text decoration and cursor changes.
 * - Adds an onclick event listener to open a new tab with the New&requestId= url.
 * - Marks the original link as processed to avoid duplicate processing.
 */
function replaceLinks() {
  const links = document.querySelectorAll('a[id^="requestId"]');
  links.forEach((link) => {
    if (!link.dataset.processed) {
      const listItems = document.querySelectorAll(".accordion-toggle");
      listItems.forEach((item, index) => {
        if (incident.className != "selectedtab") {
          const trElement = item.querySelector("tr");
          const tbodyElement = trElement.closest("tbody");

          const tdElements = trElement.querySelectorAll("td");
          tdElements.forEach((td) => {
            if (
              td.textContent.trim() == "Open" ||
              td.textContent.trim() == "In Progress" ||
              td.textContent.trim() == "Waiting for customer" ||
              td.textContent.trim() == "On Hold"
            ) {
              const requestId = trElement
                .querySelector("#requestId")
                .textContent.trim();
              if (!tbodyElement.querySelector("textarea")) {
                const textTD = document.createElement("td");
                textTD.style.height = "20px";
                textTD.style.padding = "0px";
                textTD.colSpan = "10";
                const privateNote = document.createElement("textarea");
                privateNote.style.height = `${privateNote.scrollHeight + 5}px`;
                textTD.setAttribute("_ngcontent-ng-c4256737322", "");
                // privateNote.style.height = "30px";
                const replyMSG_EL =
                  tbodyElement.querySelector("tr:nth-child(2)");
                if (replyMSG_EL) {
                  const replyMSG = replyMSG_EL.querySelector("td.notetext");
                  replyMSG.style.float = "right";
                  replyMSG.style.marginRight = "85px";
                  replyMSG.style.outlineStyle = "solid";
                  replyMSG.style.outlineWidth = ".25px";
                  replyMSG.style.outlineColor = "#63fbf0";
                  replyMSG.style.borderRadius = "5px";
                  replyMSG.style.marginTop = "-15px";
                  replyMSG.style.marginBottom = "-15px";

                  tbodyElement.querySelector("tr:nth-child(2)").remove();
                  textTD.append(privateNote);
                  textTD.append(replyMSG);
                } else {
                  textTD.append(privateNote);
                }
                privateNote.value = localStorage.getItem(requestId) || "";

                privateNote.id = "private";
                privateNote.placeholder = "Private Note";
                privateNote.marginLeft = "10px";
                privateNote.style.float = "left";
                privateNote.style.outlineStyle = "solid";
                privateNote.style.minWidth = "50px";
                privateNote.style.outlineWidth = ".25px";
                privateNote.style.maxWidth = "817px";
                privateNote.style.outlineColor = "#63fbf0";
                privateNote.style.color = "#63fbf0";
                privateNote.style.backgroundColor = "rgba(32, 32, 32, 0.8)";
                privateNote.style.borderRadius = "5px";
                privateNote.style.marginTop = "-15px";
                privateNote.style.marginLeft = "5px";
                privateNote.style.resize = "horizontal";
                // privateNote.style.transform = "scale(0.8)";
                const trEl = document.createElement("tr");
                trEl.setAttribute("_ngcontent-ng-c4256737322", "");
                trEl.style.boxSizing = "border-box";
                // privateNote.style.minHeight = "20px";
                trEl.style.padding = ".25rem";
                trEl.style.border = "0px";
                tbodyElement.append(trEl);
                for (let i = 0; i < 5; i++) {
                  const emptyTD = document.createElement("td");
                  emptyTD.textContent = "";
                  emptyTD.style.padding = "0px";
                  emptyTD.setAttribute("_ngcontent-ng-c4256737322", "");
                  // emptyTD.style.transform = "scale(0.8)";
                  emptyTD.style.height = "10px";
                  trEl.append(emptyTD);
                }
                trEl.append(textTD);

                if (privateNote.value === "") {
                  privateNote.style.width = "80px";
                } else {
                  privateNote.style.width = "auto";

                  privateNote.style.width = privateNote.scrollWidth + 5 + "px";
                }
                privateNote.style.height = "auto";
                privateNote.style.height = `${privateNote.scrollHeight + 5}px`;
                privateNote.addEventListener("input", () => {
                  privateNote.style.height = "auto";
                  privateNote.style.height = `${
                    privateNote.scrollHeight + 5
                  }px`;
                  if (privateNote.value === "") {
                    localStorage.removeItem(requestId);
                  } else {
                    localStorage.setItem(requestId, privateNote.value);
                  }
                });
              }
              // Remove tickets from local storage that are not in the list
              const storedKeys = Object.keys(localStorage);
              // storedKeys.forEach((key) => {
              //   if (
              //     key.startsWith(requestId) &&
              //     !document.querySelector(`#requestId:contains(${key})`)
              //   ) {
              //     localStorage.removeItem(key);
              //   }
              // });
            }
          });
        }

        item.addEventListener("mouseover", () => {
          item.style.cursor = "default";
        });
        if (index % 2 === 0) {
          item.style.backgroundColor = "#ffffff";
        } else {
          item.style.backgroundColor = "#f0f0f0";
        }
      });
      const pTag = document.createElement("p");
      pTag.textContent = link.textContent;
      pTag.style.color = "#07ada1";
      pTag.id = "requestId";
      pTag.addEventListener("mouseover", () => {
        pTag.style.textDecoration = "underline";
        pTag.style.cursor = "pointer";
      });
      pTag.addEventListener("mouseout", () => {
        pTag.style.textDecoration = "none";
        pTag.style.cursor = "default";
      });

      pTag.onclick = function () {
        window.open(
          "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=" +
            link.textContent.trim(),
          "_blank"
        );
      };

      link.parentNode.replaceChild(pTag, link);
      link.dataset.processed = "true";
    }
  });
}
/**
 * Removes the confirmation message by clicking the dismiss button on a modal.
 * If the success message is currently displayed, it waits for 300 milliseconds
 * before triggering the click event on the modal's dismiss button.
 */
const successMSG = document.querySelector("#request_success_msg");
function removeConfirmation() {
  if (successMSG.style.display == "block") {
    setTimeout(() => {
      document.querySelector('em[data-dismiss="modal"]').click();
    }, 300);
  }
}
// Observes changes and runs on each change, if ran in the last 300 milliseconds it doesn't run to avoid loading hang
let debounceTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (successMSG) {
      removeConfirmation();
    }
    replaceLinks();
    fixCSS();
  }, 200);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
