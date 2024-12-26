// import { power } from "./page.js";

function fixCSS() {
  const lists = document.querySelectorAll(".accordion-toggle");
  lists.forEach((list) => {
    list.addEventListener("mouseover", () => {
      list.style.cursor = "default";
    });
  });
  if (window.location.href.includes("New&requestId=")) {
    const saveButton = document.querySelector(
      "#request_general_container > div > div.card-header.general-card-header > button"
    );
    saveButton.onclick = function () {
      setTimeout(() => {
        fixCSS();
      }, 500);
    };
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
    }
  }
}
function replaceLinks() {
  const links = document.querySelectorAll('a[id^="requestId"]');
  links.forEach((link) => {
    if (!link.dataset.processed) {
      const listItems = document.querySelectorAll(".accordion-toggle");
      listItems.forEach((item, index) => {
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

let debounceTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    replaceLinks();
    fixCSS();
  }, 100);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
