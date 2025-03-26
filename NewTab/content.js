// "the greatest extension not in the app store - wmed employee" - Richard Graziano
//TODO

/**
 * If the current URL includes "New&requestId=", it modifies the behavior of the save button and adds a "Save and Close" button.
 * The "Save and Close" button will close the window after a delay when clicked.
 */
const incident = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li:nth-child(2) > span"
);
const incidentNum = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li:nth-child(2) > sup"
);
if (incident) {
  setTimeout(() => {
    if (incidentNum && incidentNum.textContent != "0") {
      incident.click();
    }
  }, 1);
}
var darkReaderActive =
  document.documentElement.getAttribute("data-darkreader-scheme") === "dark";

const myTasks = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li.requesttypeheader.ml-0"
);
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
const subitem = document.querySelector("#submenu");
const navs = document.querySelectorAll("nav");
if (navs) {
  navs.forEach((nav) => {
    nav.style.zIndex = "1";
    subitem && (subitem.style.zIndex = "1");
  });
}
const footer = document.querySelector("body > div.toolbar_wrapper");
if (footer) {
  footer.style.zIndex = "1";
}
const requestButton = document.querySelector(
  "#zsd_navbar_menus > ul.navbar-nav.mr-auto > li:nth-child(2) > a"
);
if (requestButton) {
  requestButton.href = "/LiveTime/WebObjects/LiveTime";
}
async function updateTitle() {
  var requestTitle = "";
  var requestUser = "";
  try {
    const itemID = window.location.href.split("requestId=")[1];
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
    requestUser = document.querySelector("#customer-search-input").value;
    // Check if the response is OK (status code in range 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    requestTitle = data.subject;
  } catch (error) {
    requestTitle = "Error fetching title";
  }
  if (requestTitle) {
    if (requestTitle.length > 10 && requestTitle.length < 64) {
      document.title = requestTitle;
    } else if (requestTitle.length < 64) {
      document.title = requestTitle;
      try {
        document.title += " - " + requestUser;
      } catch (error) {
        updateTitle();
      }
    } else {
      document.title = requestTitle.substring(0, 61) + "...";
    }
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
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = chrome.runtime.getURL("./favicon.ico");
  document.head.appendChild(link);
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
if (
  KPIReport &&
  KPIReport.innerText.trim() == "KPI Reports" &&
  localStorage.getItem("reportDefaults") == "TRUE"
) {
  reporttech.click();
}
const reporttech_ATAG = document.querySelector(
  "#submenu > li:nth-child(5) > a"
);
const BottTR = document.querySelector(
  "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(5)"
);
if (BottTR) {
  leftTD = document.createElement("td");
  leftTD.align = "LEFT";
  const AutoCheck = document.createElement("input");
  AutoCheck.type = "checkbox";
  if (localStorage.getItem("reportDefaults") === "TRUE") {
    AutoCheck.checked = true;
  }
  AutoCheck.onchange = function () {
    if (localStorage.getItem("reportDefaults") === "TRUE") {
      localStorage.setItem("reportDefaults", "FALSE");
    } else {
      localStorage.setItem("reportDefaults", "TRUE");
    }
  };
  leftTD.append(AutoCheck);
  BottTR.append(leftTD);
}
if (
  reporttech_ATAG &&
  reporttech_ATAG.className == "active" &&
  localStorage.getItem("reportDefaults") === "TRUE"
) {
  const changeEvent = new Event("change");
  const technicianSelect = document.querySelector(
    "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(1) > td.fieldtext > select"
  );
  if (technicianSelect && technicianSelect.selectedIndex != 10) {
    technicianSelect.selectedIndex = 10;
    technicianSelect.dispatchEvent(changeEvent);
  }
  if (technicianSelect && technicianSelect.selectedIndex == 10) {
    const Monday = getMondayOfCurrentWeek();
    const formattedDate = Monday.toLocaleDateString("en-GB").replace(
      /(\d{2})\/(\d{2})\/(\d{4})/,
      "$2/$1/$3"
    );
    document.querySelector("#startDateUserTZ").value = formattedDate;
    const Friday = getFridayOfCurrentWeek();
    const formattedDate2 = Friday.toLocaleDateString("en-GB").replace(
      /(\d{2})\/(\d{2})\/(\d{4})/,
      "$2/$1/$3"
    );
    document.querySelector("#endDateUserTZ").value = formattedDate2;
    document.querySelector(
      "#technicianReportsForm > div > div.windowContent > div > table > tbody > tr:nth-child(4) > td.fieldtext > select"
    ).selectedIndex = 13;
  }
}

function getFridayOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  const distanceToFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 12 - dayOfWeek; // Calculate how many days to add to get to Friday

  today.setDate(today.getDate() + distanceToFriday);
  today.setHours(0, 0, 0, 0); // Set time to the start of the day
  return today;
}
function getMondayOfCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday (0), move back 6 days, otherwise move back `dayOfWeek - 1`

  today.setDate(today.getDate() - distanceToMonday);
  today.setHours(0, 0, 0, 0); // Set time to the start of the day
  return today;
}

if (window.location.href.includes("LookupRequest?")) {
  const favicon =
    document.querySelector("link[rel~='icon']") ||
    document.createElement("link");
  favicon.rel = "icon";
  favicon.href = chrome.runtime.getURL("./request.ico");
  if (!favicon.parentNode) {
    document.head.appendChild(favicon);
  }
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
              td.textContent.trim().includes("Open") ||
              td.textContent.trim().includes("In Progress") ||
              td.textContent.trim().includes("Waiting for customer") ||
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
      var openContainer = document.createElement("img");
      try {
        openContainer.src = chrome.runtime.getURL("./open.png");
        if (darkReaderActive) {
          openContainer.style.filter = "invert(1)";
        } else {
          openContainer.style.filter = "none";
        }
      } catch (error) {
        openContainer = document.createElement("p");
        openContainer.textContent = "↗";
        openContainer.style.color = darkReaderActive ? "white" : "black";
        openContainer.style.fontSize = "25px";
        openContainer.style.display = "inline-block";
        openContainer.style.textAlign = "center";
        openContainer.style.lineHeight = "20px";
        openContainer.style.border = "none";
        console.error("Error loading image");
      }
      openContainer.title = "Open Request Preview";
      openContainer.style.width = "20px";
      openContainer.style.height = "20px";
      openContainer.style.cursor = "pointer";
      openContainer.style.marginRight = "10px";
      openContainer.style.float = "right";

      pTag.textContent = link.textContent;
      pTag.style.color = "#07ada1";
      pTag.id = "requestId";

      pTag.style.margin = "0";
      pTag.style.padding = "0";
      pTag.style.boxSizing = "border-box";
      pTag.style.cursor = "pointer";
      pTag.style.textDecoration = "none";
      pTag.style.display = "inline";
      pTag.style.marginRight = "10px";
      pTag.style.backgroundColor = "rgba(255, 255, 255, 0)";
      pTag.style.borderRadius = "5px";
      pTag.style.transform = "scale(.85)";
      pTag.addEventListener("mouseover", () => {
        pTag.style.textDecoration = "underline";
        pTag.style.cursor = "pointer";
      });
      openContainer.addEventListener("click", () => {
        // Show description after 3 seconds
        const hoverTimeout = setTimeout(async () => {
          if (
            Array.from(document.querySelectorAll("#linkToRequest")).some(
              (div) => div.textContent.includes(pTag.textContent.trim())
            )
          ) {
            return;
          }

          const containerDiv = document.createElement("div");
          const descriptionDivHeader = document.createElement("div");
          const descriptionDiv = document.createElement("div");

          let isDragging = false;
          let offsetX, offsetY;

          // Set some basic styles for the containerDiv
          const removeAllContainers = () => {
            const openContainers = document.querySelectorAll(
              "div[style*='position: absolute']"
            );
            openContainers.forEach((container) => container.remove());
          };

          incident?.addEventListener("click", removeAllContainers);
          myTasks?.addEventListener("click", removeAllContainers);
          containerDiv.style.position = "absolute";
          const requestDetails = await getItemDetails(pTag.textContent.trim());
          // containerDiv.style.maxWidth = "80vw";
          // containerDiv.style.maxHeight = "80vh";
          containerDiv.style.border = "1px solid #ccc";
          containerDiv.style.borderRadius = "10px";
          containerDiv.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.41)";
          containerDiv.style.backgroundColor = "#ffff";
          containerDiv.style.pointerEvents = "all";
          containerDiv.style.resize = "both"; // Allow resizing both horizontally and vertically
          containerDiv.style.overflow = "auto"; // Ensure content is scrollable when resized
          containerDiv.style.outlineStyle = "solid";
          containerDiv.style.outlineWidth = ".25px";
          containerDiv.style.outlineColor = "#63fbf0";
          containerDiv.style.zIndex = "1";

          // Add event listener to bring the clicked container to the front
          containerDiv.addEventListener("click", () => {
            // Reset zIndex for all containers except the clicked one
            document
              .querySelectorAll("div[style*='position: absolute']")
              .forEach((div) => {
                if (div !== containerDiv) {
                  div.style.zIndex = "1";
                }
              });
            // Bring the clicked container to the front
            containerDiv.style.zIndex = "1000";
          });

          // Set some basic styles for the descriptionDivHeader
          descriptionDivHeader.id = "descriptionDivHeader";
          descriptionDivHeader.style.position = "sticky";
          descriptionDivHeader.style.top = "0";
          descriptionDivHeader.style.left = "0";
          descriptionDivHeader.style.right = "0";
          descriptionDivHeader.style.cursor = "default";
          descriptionDivHeader.style.height = "30px";
          descriptionDivHeader.style.backgroundColor = "gray";
          descriptionDivHeader.style.color = "white";
          descriptionDivHeader.style.display = "flex";
          descriptionDivHeader.style.alignItems = "center";
          descriptionDivHeader.style.padding = "0 10px";
          const subject = document.createElement("h8");
          subject.textContent = requestDetails.subject;
          subject.style.margin = "0 auto";
          subject.style.textAlign = "center";
          subject.style.flex = "1";
          subject.style.maxWidth = "calc(100% - 100px)"; // Adjust max width to leave space for other elements
          subject.style.color = "#63fbf0";
          subject.style.overflow = "hidden";
          subject.style.textOverflow = "ellipsis";
          subject.style.whiteSpace = "nowrap";
          const linkToRequest = document.createElement("a");
          linkToRequest.id = "linkToRequest";
          linkToRequest.href = `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`;
          linkToRequest.textContent = pTag.textContent.trim();
          linkToRequest.target = "_blank";
          descriptionDivHeader.appendChild(linkToRequest);
          descriptionDivHeader.appendChild(subject);
          let originalPosition = {
            top: containerDiv.style.top,
            left: containerDiv.style.left,
          };
          descriptionDivHeader.ondblclick = () => {
            if (containerDiv.style.position === "absolute") {
              originalPosition = {
                top: containerDiv.style.top,
                left: containerDiv.style.left,
              };
              containerDiv.style.position = "fixed";
              containerDiv.style.top = "0";
              containerDiv.style.left = "0";
              containerDiv.style.width = "100vw";
              containerDiv.style.height = "100vh";
              containerDiv.style.zIndex = "1000";
              containerDiv.style.resize = "none";
              containerDiv.style.overflow = "auto";
              containerDiv.style.borderRadius = "0";
              document.querySelector("html").style.overflow = "hidden";
            } else {
              containerDiv.style.position = "absolute";
              containerDiv.style.width = "35vw";
              containerDiv.style.height = "35vh";
              containerDiv.style.resize = "both";
              containerDiv.style.borderRadius = "10px";
              containerDiv.style.zIndex = "3";
            }
          };

          descriptionDivHeader.addEventListener("mousedown", (event) => {
            event.preventDefault();
            if (
              containerDiv.style.position === "fixed" &&
              event.target != exitButton &&
              event.target != linkToRequest
            ) {
              // Exit fullscreen mode when dragging starts
              containerDiv.style.position = "absolute";
              containerDiv.style.left = event.clientX - offsetX + "px";
              containerDiv.style.top = event.clientY - offsetY + "px";
              containerDiv.style.width = "35vw";
              containerDiv.style.height = "35vh";
              containerDiv.style.resize = "both";
              containerDiv.style.borderRadius = "10px";
              containerDiv.style.zIndex = "1";
              document.querySelector("html").style.overflow = "auto";
            }
            console.log("asd");

            isDragging = true;
            offsetX = event.clientX - containerDiv.offsetLeft;
            offsetY = event.clientY - containerDiv.offsetTop;
            containerDiv.style.zIndex = "1000"; // Bring the div to the front while dragging
          });

          document.addEventListener("mousemove", (event) => {
            if (isDragging) {
              let newLeft = event.clientX - offsetX;
              let newTop = event.clientY - offsetY;
              // Prevent dragging over the top of the screen
              switch (true) {
                case newTop < 0 && newLeft < 0:
                  newTop = 0;
                  newLeft = 0;
                  break;
                case newTop < 0 &&
                  newLeft >
                    document.documentElement.clientWidth -
                      containerDiv.offsetWidth:
                  newTop = 0;
                  newLeft =
                    document.documentElement.clientWidth -
                    containerDiv.offsetWidth;
                case newTop < 0:
                  newTop = 0;
                  break;
                case newLeft < 0:
                  newLeft = 0;
                  break;
                case newLeft >
                  document.documentElement.clientWidth -
                    containerDiv.offsetWidth:
                  newLeft =
                    document.documentElement.clientWidth -
                    containerDiv.offsetWidth;
                  break;
              }

              containerDiv.style.left = newLeft + "px";
              containerDiv.style.top = newTop + "px";
            }
          });

          document.addEventListener("mouseup", () => {
            isDragging = false;
            containerDiv.style.zIndex = "1"; // Reset z-index
          });
          // Set some basic styles for the descriptionDiv
          descriptionDiv.style.padding = "5px";
          descriptionDiv.style.overflow = "auto";
          descriptionDiv.style.whiteSpace = "pre-wrap";

          // Append the header and descriptionDiv to the containerDiv
          containerDiv.appendChild(descriptionDivHeader);
          containerDiv.appendChild(descriptionDiv);
          // Append the containerDiv to the body
          document.body.appendChild(containerDiv);
          containerDiv.style.width = "35vw";
          containerDiv.style.height = "35vh";

          // Add drag functionality to the header

          // Add content to the descriptionDiv
          descriptionDiv.appendChild(await getNotes(pTag.textContent.trim()));

          descriptionDiv.innerHTML += "<hr>" + requestDetails.description;

          // Add toggle functionality for notes
          const noteToggles = descriptionDiv.querySelectorAll("#noteToggle");
          noteToggles.forEach((toggle) => {
            toggle.onclick = function () {
              const noteDiv = toggle.parentElement.nextElementSibling;
              if (noteDiv.style.display === "none") {
                toggle.innerHTML =
                  '<span style="color: #63fbf0;">▲</span><span style="color: grey;">  |</span>';
                noteDiv.style.display = "block";
              } else {
                toggle.innerHTML =
                  '<span style="color: #63fbf0;">▼</span><span style="color: grey;">  |</span>';
                noteDiv.style.display = "none";
              }
            };
          });

          // Position the containerDiv near the pTag
          const rect = pTag.getBoundingClientRect();
          containerDiv.style.top = `${rect.bottom + window.scrollY}px`;
          containerDiv.style.left = `${rect.left + window.scrollX}px`;

          // Add a close button to the header
          const exitButton = document.createElement("p");
          exitButton.textContent = "❌";
          exitButton.title = "Close";
          exitButton.style.scale = "1.25";
          exitButton.style.color = "red";
          exitButton.style.position = "absolute";
          exitButton.style.top = "0px";
          exitButton.style.right = "15px";
          exitButton.style.backgroundColor = "transparent";
          exitButton.style.color = "white";
          exitButton.style.border = "none";
          exitButton.style.borderRadius = "50%";
          exitButton.style.width = "20px";
          exitButton.style.height = "20px";
          exitButton.style.cursor = "pointer";
          descriptionDivHeader.appendChild(exitButton);

          exitButton.onclick = function (event) {
            containerDiv.remove();
            document.querySelector("html").style.overflow = "auto";
          };
        }, 1);

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

      if (pTag.parentElement) {
        pTag.parentElement.appendChild(openContainer);
      }
      link.dataset.processed = "true";
    }
  });
}
async function getItemDetails(itemID) {
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
    return data;
  } catch (error) {
    location.reload();
  }
}

async function getNotes(requestID) {
  objectOfNotes = {};
  try {
    const response = await fetch(
      "https://support.wmed.edu/LiveTime/services/v1/user/requests/" +
        requestID +
        "/notes",
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
          requestID,
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
    objectOfNotes = data;
  } catch (error) {
    console.log(error);
  }
  NotesContainer = document.createElement("div");
  console.log(objectOfNotes);
  for (const [key, value] of Object.entries(objectOfNotes)) {
    if (value.notetext) {
      const noteCell = document.createElement("div");
      const noteToggle = document.createElement("p");
      noteToggle.innerHTML =
        '<span style="color: #63fbf0;">▼</span><span style="color: grey;">  |</span>';
      noteToggle.style.userSelect = "none";
      noteToggle.style.marginBottom = "12px";
      noteToggle.style.cursor = "pointer";
      noteToggle.style.borderRadius = "5px";
      noteToggle.style.marginTop = "10px";
      noteToggle.style.fontSize = "20px";
      noteToggle.style.padding = "0";
      noteToggle.style.width = "35px";
      noteToggle.style.height = "20px";
      noteToggle.style.display = "flex";
      noteToggle.style.alignItems = "center";
      noteToggle.style.justifyContent = "center";
      noteToggle.style.textAlign = "center";
      noteToggle.style.color = "#63fbf0";
      noteToggle.style.lineHeight = "20px"; // Ensures the text is vertically centered
      noteToggle.id = "noteToggle";
      const noteAuthor = document.createElement("p");
      noteAuthor.style.fontWeight = "bold";
      noteAuthor.textContent = value.noteClient.fullName;

      const timestamp = document.createElement("p");

      const formattedDate = new Date(value.noteDate);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      timestamp.textContent =
        "   -   " + formattedDate.toLocaleDateString("en-US", options);

      const noteDiv = document.createElement("div");
      noteDiv.className = "note";
      const noteHeader = document.createElement("div");
      noteHeader.style.display = "flex";
      noteToggle.style.marginRight = "5px";
      noteAuthor.style.margin = "0";
      noteAuthor.style.padding = "0";
      noteAuthor.style.color = "#333";
      noteAuthor.style.fontSize = "14px";
      noteAuthor.style.lineHeight = "20px";
      noteAuthor.style.display = "flex";
      noteAuthor.style.alignItems = "center";
      noteAuthor.style.justifyContent = "center";
      noteAuthor.style.textAlign = "center";

      timestamp.style.margin = "0";
      timestamp.style.padding = "0";
      timestamp.style.color = "#333";
      timestamp.style.fontSize = "14px";
      timestamp.style.lineHeight = "20px";
      timestamp.style.display = "flex";
      timestamp.style.alignItems = "center";
      timestamp.style.justifyContent = "center";
      timestamp.style.textAlign = "center";

      noteCell.appendChild(noteHeader);

      noteHeader.appendChild(noteToggle);
      noteHeader.appendChild(noteAuthor);
      if (value.isDraft == true) {
        const draftIndicator = document.createElement("p");
        draftIndicator.textContent = "DRAFT";
        draftIndicator.style.color = "red";
        draftIndicator.style.fontWeight = "bold";
        draftIndicator.style.margin = "0";
        draftIndicator.style.padding = "0";
        draftIndicator.style.fontSize = "14px";
        draftIndicator.style.lineHeight = "20px";
        draftIndicator.style.display = "flex";
        draftIndicator.style.alignItems = "center";
        draftIndicator.style.justifyContent = "center";
        draftIndicator.style.textAlign = "center";
        draftIndicator.style.marginLeft = "10px";
        draftIndicator.style.marginBottom = "-2px";
        noteAuthor.appendChild(draftIndicator);
      }
      noteHeader.appendChild(timestamp);
      noteCell.appendChild(noteDiv);
      noteDiv.innerHTML += value.notetext;
      noteDiv.style.display = "none";
      noteDiv.style.backgroundColor = "#f0f0f0";
      noteDiv.style.padding = "10px";
      noteDiv.style.borderRadius = "5px";
      noteDiv.style.marginTop = "5px";

      noteDiv.style.maxHeight = "250px";
      noteDiv.style.overflow = "auto";
      noteDiv.style.height = "auto";

      NotesContainer.appendChild(noteCell);
    }
  }
  return NotesContainer;
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
        console.log(requestIdSet);
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
}
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
