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
  if (incident) {
    if (incident.className == "selectedtab") {
      incident.click();
    } else {
      if (myTasks) {
        myTasks.click();
      }
    }
  }
};

if (window.location.href.includes("New&requestId=")) {
  const requestTitle = document.querySelector("#request-subject-text");
  if (requestTitle) {
    if (requestTitle.textContent.length < 64) {
      document.title = requestTitle.textContent;
    } else {
      document.title = requestTitle.textContent.substring(0, 61) + "...";
    }
  } else {
    document.title = "ERROR loading title, refresh";
  }
  const descriptionArea = document.querySelector(
    "#description-tab > div.ml-2.description-box"
  );
  const readMore = document.querySelector("#more_less_link");
  if (readMore) {
    readMore.click();
  }
  if (descriptionArea) {
    descriptionArea.style.resize = "vertical"; // Enable resizing both directions
    descriptionArea.style.overflow = "auto"; // Ensure scrolling works
    descriptionArea.style.maxHeight = "1000px";
    descriptionArea.style.height = "300px";
  }
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
                var mainPageStatus = document.querySelector(
                  "#request-general-detail > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(13) > div > select"
                );
                selectStatus.selectedIndex = mainPageStatus.selectedIndex;
                originalButton.click();
                mainPageStatus.selectedIndex = tempStatus;
                const saveButton = document.querySelector(
                  "#request_general_container > div > div.card-header.general-card-header > button"
                );
                setTimeout(() => {
                  saveButton.click();
                }, 500);
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
