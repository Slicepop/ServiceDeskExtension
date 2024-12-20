function replaceLinks() {
  const links = document.querySelectorAll('a[id^="requestId"]');

  links.forEach((link) => {
    const pTag = document.createElement("p");
    pTag.textContent = link.textContent;
    pTag.style.color = "#06deb7";
    pTag.addEventListener("mouseover", () => {
      // Code to execute when the mouse enters the element
      pTag.style.textDecoration = "underline";
    });
    pTag.addEventListener("mouseout", () => {
      pTag.style.textDecoration = "none";
    });

    pTag.onclick = function () {
      window.open(
        "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=" +
          link.textContent.trim(),
        "_blank"
      );
      setTimeout(() => {
        window.focus();
      }, 1000);
    };

    link.parentNode.replaceChild(pTag, link);
  });
}

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" || mutation.type === "subtree") {
      replaceLinks();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
