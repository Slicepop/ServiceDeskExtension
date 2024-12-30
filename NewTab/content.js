//TODO
/**
 * Phone-call, Walk-up, Teams Message Macro
 *    Figure out why I cannot make the incident list to trigger on incidentFelid.value updated
 *
 * */

/**
 * If the current URL includes "New&requestId=", it modifies the behavior of the save button and adds a "Save and Close" button.
 * The "Save and Close" button will close the window after a delay when clicked.
 */
function fixCSS() {
  if (window.location.href.includes("New&requestId=")) {
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
const createRequest = document.querySelector("#createRequestButton");
const formBody = document.querySelector(
  "#quickRequestModalBody > form > div.form-group.col-xl-6.col-lg-6.col-md-6.col-sm-12.col-12.mt-3.mb-3.add-customer"
);
const phoneMacro = document.createElement("img");
phoneMacro.style.width = "30px";
phoneMacro.style.height = "30px";
phoneMacro.style.background = "#393d3e";
phoneMacro.id = "phoneMacro";
formBody.append(phoneMacro);
phoneMacro.onclick = function () {
  const inputEvent = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
    composed: true,
    inputType: "insertText",
    data: "p", // Match the inserted value
  });
  // const parentElement = document.querySelector("#quickCallItemSearch");
  const itemField = document.querySelector("#item-field");
  // document.getElementById("exampleRadios2").click();
  const thirdTable = document.querySelector(
    "#quickcallselection > zsd-quickcall > section > div.col-lg-12.col-md-12.col-xl-12.col-sm-12.col-12.mb-4.quickcalltable > div > table > tbody"
  );
  if (thirdTable) {
    const thirdTableRow = thirdTable.querySelectorAll("tr")[4];
    if (thirdTableRow) {
      thirdTableRow.click();
    }
    itemField.addEventListener("keydown", (event) => {
      console.log("Keydown event fired:", event.key);
    });
    itemField.addEventListener("input", (event) => {
      console.log("Input event fired:", event);
    });
  }
  console.log(itemField.tagName); // Should be INPUT or TEXTAREA

  itemField.focus();
  // itemField.value = "phone";
  itemField.dispatchEvent(inputEvent);
};
function macros() {}

macros();

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
