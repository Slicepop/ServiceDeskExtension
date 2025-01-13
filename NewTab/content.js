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
        document.title = "ERROR fetching title, Refresh";
      }
    } else {
      document.title = requestTitle.textContent.substring(0, 61) + "...";
    }
  } else {
    document.title = "ERROR fetching title, Refresh";
  }
}
const requestStatus = document.querySelector(
  "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(13) > div > select"
);
const saveButton = document.querySelector(
  "#request_general_container > div > div.card-header.general-card-header > button"
);
function addPrivate() {
  const requestIdElement = document.querySelector(
    "#editRequest > div.card.request-subject.common-subject-description-card.ml-0 > div > div.priority_requestnumber > p.request-number"
  );
  if (!requestIdElement) {
    console.error("Request ID element not found");
    return;
  }
  const requestId = requestIdElement.textContent;

  const storedKeys = Object.keys(localStorage);
  if (storedKeys.includes(requestId)) {
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
    const privNote = document.createElement("textarea");
    privNote.style.marginRight = "10px";
    privNote.style.width = "100%";

    privNote.style.resize = "vertical";
    privNote.style.margin = "0";
    privNote.style.padding = "0";
    privNote.style.boxSizing = "border-box";
    privNote.style.float = "left";
    privNote.placeholder = "Personal Note";
    privNote.style.outlineStyle = "solid";
    privNote.style.outlineWidth = ".25px";
    privNote.style.outlineColor = "#63fbf0";
    privNote.style.color = "#63fbf0";
    privNote.style.backgroundColor = "rgba(32, 32, 32, 0.8)";
    privNote.style.borderRadius = "5px";
    privNote.style.transform = "scale(.85)";
    const noteObject = JSON.parse(localStorage.getItem(requestId) || "{}");
    privNote.value = noteObject.note || "";
    privNote.addEventListener("input", () => {
      if (privNote.value === "") {
        localStorage.removeItem(requestId);
      } else {
        localStorage.setItem(
          requestId,
          JSON.stringify({ note: privNote.value })
        );
      }
    });
    privNote.style.height = privNote.style.scrollHeight;
    const PrivNoteLabel = document.createElement("h6");
    PrivNoteLabel.id = "privnotelabel";
    PrivNoteLabel.style.color = "rgb(161, 153, 140)";
    PrivNoteLabel.textContent = "PERSONAL NOTE";
    const addDTL = document.querySelector(
      "#request-general-detail > div > div:nth-child(2) > div:nth-child(2) > div > div"
    );
    if (addDTL) {
      addDTL.append(PrivNoteLabel);
      addDTL.append(privNote);
    }
  }
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
function changeMainpagestatus(tempStatus) {
  var mainPageStatus = document.querySelectorAll(".commonsectiondata")[12];
  const event2 = new Event("change", { bubbles: true });

  mainPageStatus.selectedIndex = tempStatus;
  console.log(mainPageStatus.selectedIndex);
  mainPageStatus.dispatchEvent(event2);
}
function changeMainpagestatusUntilSuccess(
  tempStatus,
  maxRetries = 15,
  delay = 300
) {
  let attempts = 0;
  console.log(attempts);
  function attemptChange() {
    try {
      changeMainpagestatus(tempStatus);

      // Check if the operation succeeded
      const mainPageStatus =
        document.querySelectorAll(".commonsectiondata")[12];
      if (
        document.querySelector(".col-12.alert.alert-info.alert-dismissible") &&
        document.querySelector(".col-12.alert.alert-info.alert-dismissible")
          .innerHTML ==
          " Save your changes before updating the following sections. " &&
        !document.querySelector("#addnoteModal")
      ) {
        console.log("Status successfully changed!");
        const saveButton = document.querySelector(
          "#request_general_container > div > div.card-header.general-card-header > button"
        );
        saveButton.type = "submit";

        try {
          setTimeout(() => {
            saveButton.dispatchEvent(new Event("click"));
            saveButton.click();
          }, 1000);
          console.log("save click");
        } catch (error) {
          console.log("Error clicking save button:", error);
          setTimeout(attemptChange, delay);
        }
        return; // Exit if successful
      }

      // If not successful and we have retries left, retry after a delay
      if (attempts < maxRetries) {
        attempts++;
        console.log(`Retrying... Attempt ${attempts}`);
        setTimeout(attemptChange, delay);
      } else {
        console.error("Failed to change status after maximum retries.");
      }
    } catch (error) {
      console.log("Error during status change:", error);

      // Retry on error if within max retries
      if (attempts < maxRetries) {
        attempts++;
        setTimeout(attemptChange, delay);
      } else {
        console.log("Exceeded maximum retries due to errors.");
      }
    }
  }

  attemptChange(); // Start the first attempt
}
function fixCSS() {
  if (window.location.href.includes("New&requestId=")) {
    const addNote = document.querySelector(
      "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12"
    );
    if (addNote) {
      const originalButton = document.querySelector("#createquickrequest");

      if (originalButton && !document.querySelector(".overlay-button")) {
        // Create the overlay button
        const overlayButton = document.createElement("button");
        overlayButton.classList.add("overlay-button");
        overlayButton.style.opacity = "0";

        // Append the overlay button to the same parent
        const parent = originalButton.parentNode;
        parent.style.position = "relative"; // Ensure the parent container is positioned
        parent.appendChild(overlayButton);

        // Match the position and size of the original button
        const rect = originalButton.getBoundingClientRect();
        overlayButton.style.position = "absolute";
        overlayButton.style.top = `${originalButton.offsetTop - 10}px`;
        overlayButton.style.left = `${originalButton.offsetLeft - 18}px`;
        overlayButton.style.width = `${rect.width + 20}px`;
        overlayButton.style.height = `${rect.height + 20}px`;

        const changeStatus = document.querySelector(
          "#changeRequestStatusCheckBox"
        );
        if (changeStatus) {
          overlayButton.onclick = function () {
            if (changeStatus.checked) {
              const selectStatus = document.querySelector(
                "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12 > div.container-fluid.pl-0.pr-0 > div:nth-child(3) > div > div.col-xl-4.col-lg-4.col-md-12.col-sm-12.col-12.group-options-wrapper > div.change-status-wrapper > select"
              );
              if (
                selectStatus &&
                (selectStatus.selectedIndex == 0 ||
                  selectStatus.selectedIndex == 4 ||
                  selectStatus.selectedIndex == 5 ||
                  selectStatus.selectedIndex == 6 ||
                  selectStatus.selectedIndex == 7)
              ) {
                var tempStatus = selectStatus.selectedIndex;
                var mainPageStatus =
                  document.querySelectorAll(".commonsectiondata")[12];
                selectStatus.selectedIndex = mainPageStatus.selectedIndex;
                const event = new Event("change", { bubbles: true });
                selectStatus.dispatchEvent(event);
                setTimeout(() => {
                  originalButton.click();
                }, 200);
                setTimeout(() => {
                  changeMainpagestatusUntilSuccess(tempStatus);
                }, 300);
              }
            } else {
              originalButton.click();
            }
          };
        }
      }
      //   const editor = tinymce.get(
      //     document.querySelector(
      //       "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12 > div.container-fluid.pl-0.pr-0 > div.form-group.col-xl-12.col-lg-12.col-md-12.col-xl-12.col-sm-12.col-12.mb-1.pl-0.pr-0 > zsd-tinymce > div > editor textarea"
      //     ).id
      //   );
      //   if (editor) {
      //     console.log("ASDSASD" + editor.getContent("ASDASDASDASD"));
      //   } else {
      //     console.log(editor);
      //   }
    }

    // if (addNote) {
    //   const bodyElement = document.querySelector('body[id="tinymce"]');

    //   if (bodyElement) {
    //     // Update the content programmatically
    //     bodyElement.innerHTML =
    //       "This is new content<br>With line breaks<br>And more text.";
    //     console.log("Editable content updated.");
    //   } else {
    //     console.error("Editable <body> element not found.");
    //   }
    // }
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
requestIdArray = [];
const search = document.querySelector("#searchText");
foo = true;
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
            const requestId = trElement
              .querySelector("#requestId")
              .textContent.trim();
            if (!requestIdArray.includes(requestId)) {
              requestIdArray.push(requestId);
            }
            if (
              td.textContent.trim() == "Open" ||
              td.textContent.trim() == "In Progress" ||
              td.textContent.trim() == "Waiting for customer" ||
              td.textContent.trim() == "On Hold"
            ) {
              if (!tbodyElement.querySelector("textarea")) {
                const textTD = document.createElement("td");
                textTD.style.height = "20px";
                textTD.style.padding = "0px";
                textTD.colSpan = "10";
                const privateNote = document.createElement("textarea");
                textTD.setAttribute("_ngcontent-ng-c4256737322", "");
                // privateNote.style.height = "30px";
                const replyMSG_EL =
                  tbodyElement.querySelector("tr:nth-child(2)");
                if (replyMSG_EL) {
                  const replyMSG = replyMSG_EL.querySelector("td.notetext");
                  replyMSG.style.float = "right";
                  replyMSG.style.marginRight = "6vw";
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
                const noteObjecta = JSON.parse(
                  localStorage.getItem(requestId) || "{}"
                );
                privateNote.value = noteObjecta.note || "";

                privateNote.id = "private";
                privateNote.placeholder = "Personal Note";
                privateNote.marginLeft = "10px";
                privateNote.style.float = "left";
                privateNote.style.outlineStyle = "solid";
                privateNote.style.minWidth = "50px";
                privateNote.style.outlineWidth = ".25px";

                privateNote.style.maxWidth = "32vw";
                privateNote.style.outlineColor = "#63fbf0";
                privateNote.style.color = "#63fbf0";
                privateNote.style.backgroundColor = "rgba(32, 32, 32, 0.8)";
                privateNote.style.borderRadius = "5px";
                privateNote.style.marginTop = "-15px";
                privateNote.style.marginLeft = "5px";
                privateNote.style.resize = "both";
                // privateNote.style.transform = "scale(0.8)";
                const trEl = document.createElement("tr");
                trEl.setAttribute("_ngcontent-ng-c4256737322", "");
                trEl.style.boxSizing = "border-box";
                privateNote.style.minHeight = "25px";
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

                // if (privateNote.value === "") {
                //   privateNote.style.width = "80px";
                // } else {
                //   privateNote.style.width = noteObjecta.Width || "auto";

                //   privateNote.style.width = privateNote.scrollWidth + 5 + "px";
                // }
                privateNote.style.width = noteObjecta.Width || "auto";
                privateNote.style.height = noteObjecta.Height || "30px";
                // privateNote.style.height = `${privateNote.scrollHeight + 5}px`;

                const resizeObserver = new ResizeObserver(() => {
                  if (privateNote.value != "") {
                    localStorage.setItem(
                      requestId,
                      JSON.stringify({
                        note: privateNote.value,
                        Height: privateNote.style.height,
                        Width: privateNote.style.width,
                      })
                    );
                  }
                });

                resizeObserver.observe(privateNote);
                privateNote.addEventListener("input", () => {
                  removeUnusedKeys();
                  // if (privateNote.value === "") {
                  //   privateNote.style.height = "30px";
                  // } else {
                  //   privateNote.style.height = "auto";
                  //   privateNote.style.height = `${
                  //     privateNote.scrollHeight + 5
                  //   }px`;
                  // }
                  // console.log(privateNote.style.maxHeight);
                  // console.log(privateNote.scrollHeight);
                  // if (
                  //   privateNote.style.maxHeight >=
                  //   privateNote.scrollHeight + 5
                  // ) {
                  //   privateNote.style.maxHeight = `${
                  //     privateNote.scrollHeight + 5
                  //   }px`;
                  // }
                  if (privateNote.value === "") {
                    localStorage.removeItem(requestId);
                  } else {
                    localStorage.setItem(
                      requestId,
                      JSON.stringify({
                        note: privateNote.value,
                        Height: privateNote.style.height,
                        Width: privateNote.style.width,
                      })
                    );
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
const test = document.querySelector(
  "#accordion0 > tr:nth-child(1) > td:nth-child(1) > input[type=checkbox]"
);
function removeUnusedKeys() {
  const search = document.querySelector("#searchText");
  const incident = document.querySelector(
    "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li:nth-child(2) > span"
  );
  if (incident) {
    if (incident.className != "selectedtab") {
      if (search && search.value == "") {
        const storedKeys = Object.keys(localStorage); // Get all keys from localStorage
        const requestIdSet = new Set(requestIdArray.map(String)); // Convert requestIdArray to Set of strings

        // First log all the stored keys and compare with the requestIdSet
        storedKeys.forEach((key) => {
          const value = localStorage.getItem(key);
          if (!requestIdSet.has(key) && value.startsWith('{"note')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  }

  //   if (incident.className != "selectedtab") {
  //     if (search) {
  //       if (search.value == "") {
  //         const storedKeys = Object.keys(localStorage);
  //         storedKeys.forEach((key) => {
  //           safe = false;
  //           const value = localStorage.getItem(key);
  //           if (value && value.startsWith('{"note')) {
  //             requestIdArray.forEach((request) => {
  //               if (key != request) {
  //                 safe = true;
  //               }
  //             });
  //           }
  //           if (safe == false) {
  //             console.log(key);
  //           }
  //         });
  //       }
  //     }
  //   }
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
