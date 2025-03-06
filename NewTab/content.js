// "the greatest extension not in the app store - wmed employee" - Richard Graziano
//TODO

/**
 * If the current URL includes "New&requestId=", it modifies the behavior of the save button and adds a "Save and Close" button.
 * The "Save and Close" button will close the window after a delay when clicked.
 */

var darkReaderActive =
  document.documentElement.getAttribute("data-darkreader-scheme") === "dark";

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
const requestButton = document.querySelector(
  "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(2) > a"
);
if (requestButton) {
  requestButton.href = "/LiveTime/WebObjects/LiveTime";
}
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
        location.reload();
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
    privNote.style.backgroundColor = "rgba(255, 255, 255, 0)";

    if (darkReaderActive) {
      privNote.style.color = "#63fbf0";
    } else {
      privNote.style.color = "#3a948d";
      privNote.style.placeholderColor = "#423f3f";
    }
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
if (window.location.href.includes("/reports")) {
  document
    .querySelector(
      "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(7) > a > span"
    )
    .click();
}
const KPIReport = document.querySelector(
  "#kpiReportsForm > div > div.windowTitleBar > div"
);
const reporttech = document.querySelector(
  "#submenu > li:nth-child(5) > a > span"
);
if (KPIReport && KPIReport.innerText.trim() == "KPI Reports") {
  reporttech.click();
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
  const darkreaderEl =
    document.documentElement.getAttribute("data-darkreader-scheme") === "dark";

  if (darkreaderEl) {
    darkReaderActive = true;
  } else {
    darkReaderActive = false;
  }

  const requestFilterCard = document.querySelector("#requestfiltercard");
  if (requestFilterCard) {
    const selects = requestFilterCard.querySelectorAll("select");
    selects.forEach((select) => {
      select.style.resize = "vertical";
      select.style.maxHeight = "none";
    });
  }
  if (window.location.href.includes("LookupRequest?")) {
    const informationTag = document.querySelector(
      "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(1) > em"
    );
    const newElement = document.createElement("i");
    if (informationTag) {
      newElement.className = informationTag.className;
      newElement.style.cssText = informationTag.style.cssText;
      newElement.style.cursor = "pointer";
      newElement.style.pointerEvents = "all";
      newElement.style.marginTop = "40px";
      newElement.style.marginLeft = "10px";
      informationTag.parentNode.replaceChild(newElement, informationTag);
    }
    const informationInfo = document.querySelector("#tooltip_info");
    if (informationInfo) {
      const labels = document.querySelectorAll(
        'span[_ngcontent-ng-c548543592=""] > label[_ngcontent-ng-c548543592=""]'
      );
      labels.forEach((label) => {
        label.style.cursor = "text";
      });
      newElement.onclick = function () {
        if (informationInfo.style.display != "block") {
          informationInfo.style.display = "block";
          document.addEventListener("click", function handler(event) {
            if (
              !newElement.contains(event.target) &&
              !informationInfo.contains(event.target)
            ) {
              informationInfo.style.display = "none";
              document.removeEventListener("click", handler);
            }
          });
        } else {
          informationInfo.style.display = "none";
        }
      };
    }
    const ExpandedNoteReply = document.querySelector("#expandnotenoneditable");
    if (ExpandedNoteReply) {
      ExpandedNoteReply.style.resize = "vertical";
      ExpandedNoteReply.style.maxHeight = "none";
    }
    // const addNote = document.querySelector(
    //   "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12"
    // );
    // if (addNote) {
    //   const originalButton = document.querySelector("#createquickrequest");

    //   if (originalButton && !document.querySelector(".overlay-button")) {
    //     // Create the overlay button
    //     const overlayButton = document.createElement("button");
    //     overlayButton.classList.add("overlay-button");
    //     overlayButton.style.opacity = "0";

    //     // Append the overlay button to the same parent
    //     const parent = originalButton.parentNode;
    //     parent.style.position = "relative"; // Ensure the parent container is positioned
    //     parent.appendChild(overlayButton);

    //     // Match the position and size of the original button
    //     const rect = originalButton.getBoundingClientRect();
    //     overlayButton.style.position = "absolute";
    //     overlayButton.style.top = `${originalButton.offsetTop - 10}px`;
    //     overlayButton.style.left = `${originalButton.offsetLeft - 18}px`;
    //     overlayButton.style.width = `${rect.width + 20}px`;
    //     overlayButton.style.height = `${rect.height + 20}px`;

    //     const changeStatus = document.querySelector(
    //       "#changeRequestStatusCheckBox"
    //     );
    //     if (changeStatus) {
    //       overlayButton.onclick = function () {
    //         if (changeStatus.checked) {
    //           const selectStatus = document.querySelector(
    //             "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12 > div.container-fluid.pl-0.pr-0 > div:nth-child(3) > div > div.col-xl-4.col-lg-4.col-md-12.col-sm-12.col-12.group-options-wrapper > div.change-status-wrapper > select"
    //           );
    //           if (
    //             selectStatus &&
    //             (selectStatus.selectedIndex == 0 ||
    //               selectStatus.selectedIndex == 4 ||
    //               selectStatus.selectedIndex == 5 ||
    //               selectStatus.selectedIndex == 6 ||
    //               selectStatus.selectedIndex == 7)
    //           ) {
    //             var tempStatus = selectStatus.selectedIndex;
    //             var mainPageStatus = document.querySelector(
    //               "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(13) > div > select"
    //             );
    //             selectStatus.selectedIndex = mainPageStatus.selectedIndex;
    //             setTimeout(() => {
    //               originalButton.click();
    //             }, 4000);
    //             mainPageStatus.selectedIndex = tempStatus;
    //             const saveButton = document.querySelector(
    //               "#request_general_container > div > div.card-header.general-card-header > button"
    //             );
    //             setTimeout(() => {
    //               // saveButton.click();

    //               console.log("ASDssss");
    //             }, 3500);
    //           }
    //         } else {
    //           originalButton.click();
    //         }
    //       };
    //     }
    //   }
    //   //   const editor = tinymce.get(
    //   //     document.querySelector(
    //   //       "#addnoteModal > div > div:nth-child(1) > div.modal-body.col-lg-12.col-xl-12.col-md-12.col-sm-12.col-12 > div.container-fluid.pl-0.pr-0 > div.form-group.col-xl-12.col-lg-12.col-md-12.col-xl-12.col-sm-12.col-12.mb-1.pl-0.pr-0 > zsd-tinymce > div > editor textarea"
    //   //     ).id
    //   //   );
    //   //   if (editor) {
    //   //     console.log("ASDSASD" + editor.getContent("ASDASDASDASD"));
    //   //   } else {
    //   //     console.log(editor);
    //   //   }
    // }

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
        if (darkReaderActive) {
          saveClose.style.background = "rgba(0, 0, 0, 0)";
        } else {
          saveClose.style.background = "#0069d9";
        }
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
              td.textContent.trim().includes("On Hold")
            ) {
              if (!tbodyElement.querySelector("textarea")) {
                const textTD = document.createElement("td");
                textTD.style.height = "20px";
                textTD.style.padding = "0px";
                textTD.colSpan = "10";
                const privateNote = document.createElement("textarea");
                textTD.setAttribute("_ngcontent-ng-c4256737322", "");
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
                privateNote.style.backgroundColor = "rgba(230, 230, 230, 0)";
                privateNote.style.outlineColor = "#63fbf0";
                if (darkReaderActive) {
                  privateNote.style.color = "#63fbf0";
                } else {
                  privateNote.style.color = "#3a948d";
                  privateNote.style.placeholderColor = "#423f3f";
                }
                privateNote.style.borderRadius = "5px";
                privateNote.style.marginTop = "-15px";
                privateNote.style.marginLeft = "5px";
                privateNote.style.resize = "both";
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
                  emptyTD.style.height = "10px";
                  trEl.append(emptyTD);
                }
                trEl.append(textTD);

                privateNote.style.width = noteObjecta.Width || "auto";
                privateNote.style.height = noteObjecta.Height || "30px";

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
            }

            // Add import/export buttons
            const importButton = document.createElement("button");
            importButton.textContent = "Import Notes";
            importButton.style.marginRight = "10px";
            importButton.onclick = () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".json";
              input.onchange = (event) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                  const notes = JSON.parse(e.target.result);
                  for (const [key, value] of Object.entries(notes)) {
                    localStorage.setItem(key, JSON.stringify(value));
                  }
                  alert("Notes imported successfully!");
                  location.reload();
                };
                reader.readAsText(file);
              };
              input.click();
            };

            const exportButton = document.createElement("button");
            exportButton.textContent = "Export Notes";
            exportButton.id = "export";
            importButton.style.backgroundColor = "#333";
            importButton.style.color = "#fff";
            importButton.style.border = "1px solid #555";
            importButton.style.borderRadius = "5px";
            importButton.style.padding = "5px 10px";

            exportButton.style.backgroundColor = "#333";
            exportButton.style.color = "#fff";
            exportButton.style.border = "1px solid #555";
            exportButton.style.borderRadius = "5px";
            exportButton.style.padding = "5px 10px";
            exportButton.onclick = () => {
              const notes = {};
              for (const key of Object.keys(localStorage)) {
                const value = localStorage.getItem(key);
                if (value && value.startsWith('{"note')) {
                  notes[key] = JSON.parse(value);
                }
              }
              const blob = new Blob([JSON.stringify(notes, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "notes.json";
              a.click();
              URL.revokeObjectURL(url);
            };

            const container = document.querySelector(
              "body > div.toolbar_wrapper > ul"
            ); // Replace with actual container element
            if (container && !document.querySelector("#export")) {
              container.appendChild(importButton);
              container.appendChild(exportButton);

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

        // Show description after 3 seconds
        const hoverTimeout = setTimeout(async () => {
          const descriptionDiv = document.createElement("div");
          descriptionDiv.style.position = "absolute";
          descriptionDiv.style.maxWidth = "56vw";
          descriptionDiv.style.overflow = "auto";
          descriptionDiv.style.padding = "5px";
          descriptionDiv.style.borderRadius = "10px";
          descriptionDiv.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.41)";
          descriptionDiv.style.outline = "1px solid #ccc";
          descriptionDiv.style.maxHeight = "40vh";
          descriptionDiv.style.whiteSpace = "pre-wrap";
          descriptionDiv.style.backgroundColor = "#ffff";
          descriptionDiv.style.border = "1px solid #ccc";
          descriptionDiv.style.pointerEvents = "all";
          descriptionDiv.style.zIndex = "1000";
          descriptionDiv.innerHTML = await getItemDescription(
            pTag.textContent.trim()
          );

          document.body.appendChild(descriptionDiv);
          console.log("appended");
          const rect = pTag.getBoundingClientRect();
          descriptionDiv.style.top = `${rect.bottom + window.scrollY}px`;
          descriptionDiv.style.left = `${rect.left + window.scrollX}px`;

          pTag.addEventListener("mouseout", () => {
            if (!descriptionDiv.matches(":hover")) {
              descriptionDiv.remove();
            }
          });

          descriptionDiv.addEventListener("mouseout", (event) => {
            if (!descriptionDiv.contains(event.relatedTarget)) {
              descriptionDiv.remove();
            }
          });
        }, 400);

        pTag.addEventListener("mouseout", () => {
          clearTimeout(hoverTimeout);
        });
      });
      pTag.addEventListener("mouseout", () => {
        pTag.style.textDecoration = "none";
        pTag.style.cursor = "default";
      });
      pTag.onauxclick = function (event) {
        if (event.button === 1) {
          // Check if the middle mouse button was clicked
          window.open(
            "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=" +
              link.textContent.trim(),
            "_blank"
          );
        }
      };
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
async function getItemDescription(itemID) {
  let description = "";

  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/requests/" +
        itemID +
        "/basic",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.5",
          "sec-ch-ua":
            '"Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "zsd-source": "LT",
        },
        referrer:
          "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=" +
          itemID,
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );

    // Check if the response is OK (status code in range 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    description = data.description || "No description available";
    return description;
  } catch (error) {
    console.error("Error fetching description:", error);
    description = "Error fetching description";
    return description;
  }
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
function getLocalStorageToken() {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token found:", token);
    return token;
  } else {
    console.error("Token not found in localStorage");
    return null;
  }
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "requestToken") {
//     const token = getLocalStorageToken();
//     console.log("ASD");
//     sendResponse({ token });
//   }
// });
