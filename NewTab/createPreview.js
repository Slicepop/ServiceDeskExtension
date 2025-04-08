export function handlePreview(pTag, color) {
  let technicians = "";
  // Show description after 3 seconds
  const hoverTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://support.wmed.edu/LiveTime/services/v1/user/requests/${pTag.textContent.trim()}/layerTechnicians`,
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
            "content-type": "application/json",
          },
          referrer: `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`,
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      technicians = data;
    } catch (error) {
      console.error("Error fetching layer technicians:", error);
    }
    let availableStatuses = null;
    try {
      const response = await fetch(
        `https://support.wmed.edu/LiveTime/services/v1/user/requests/${pTag.textContent.trim()}/statuses`,
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
            "content-type": "application/json",
          },
          referrer: `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`,
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      availableStatuses = data;
      console.log(availableStatuses);
    } catch (error) {
      console.error("Error fetching available statuses:", error);
    }

    if (
      Array.from(document.querySelectorAll("#linkToRequest")).some((div) =>
        div.textContent.includes(pTag.textContent.trim())
      )
    ) {
      return;
    }

    const containerDiv = document.createElement("div");
    containerDiv.id = "containerDiv";
    const headerContainer = document.createElement("div");
    const contentContainer = document.createElement("div");

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
    // Set styles for the main container
    containerDiv.style.position = "absolute";
    containerDiv.style.border = "1px solid #ccc";
    containerDiv.style.borderRadius = "10px";
    containerDiv.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.41)";
    containerDiv.style.backgroundColor = "#ffff";
    containerDiv.style.pointerEvents = "all";
    containerDiv.style.resize = "both";
    containerDiv.style.overflow = "hidden"; // Ensure content doesn't overflow
    containerDiv.style.outlineStyle = "solid";
    containerDiv.style.outlineWidth = ".25px";
    containerDiv.style.outlineColor = color;
    containerDiv.style.zIndex = "1";

    // Add event listener to bring the clicked container to the front
    containerDiv.addEventListener("click", () => {
      document
        .querySelectorAll("div[style*='position: absolute']")
        .forEach((div) => {
          if (div !== containerDiv) {
            div.style.zIndex = "1";
          }
        });
      containerDiv.style.zIndex = "1000";
    });

    // Set styles for the header container
    headerContainer.style.position = "sticky";
    headerContainer.style.top = "0";
    headerContainer.style.left = "0";
    headerContainer.style.right = "0";
    headerContainer.style.cursor = "default";
    headerContainer.style.height = "30px";
    headerContainer.style.backgroundColor = "gray";
    headerContainer.style.color = "white";
    headerContainer.style.display = "flex";
    headerContainer.style.alignItems = "center";
    headerContainer.style.padding = "0 10px";
    headerContainer.style.zIndex = "2";

    const requestDetails = await getItemDetails(pTag.textContent.trim());
    const subject = document.createElement("h8");
    subject.textContent = requestDetails.subject;
    subject.style.flex = "1";
    subject.style.maxWidth = "calc(100% - 100px)";
    subject.style.color = color;
    subject.style.overflow = "hidden";
    subject.style.textOverflow = "ellipsis";
    subject.style.whiteSpace = "nowrap";
    subject.style.textAlign = "center";
    subject.style.display = "flex";
    subject.style.alignItems = "center";
    subject.style.justifyContent = "center";

    const linkToRequest = document.createElement("a");
    linkToRequest.id = "linkToRequest";
    linkToRequest.href = `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`;
    linkToRequest.textContent = pTag.textContent.trim();
    linkToRequest.target = "_blank";
    linkToRequest.style.color = color;
    headerContainer.appendChild(linkToRequest);
    headerContainer.appendChild(subject);

    let originalPosition = {
      top: containerDiv.style.top,
      left: containerDiv.style.left,
    };

    headerContainer.ondblclick = () => {
      if (event.target.tagName.toLowerCase() === "p") {
        return;
      }
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

    headerContainer.addEventListener("mousedown", (event) => {
      if (event.target.tagName.toLowerCase() === "p") {
        return;
      }
      event.preventDefault();
      if (
        containerDiv.style.position === "fixed" &&
        event.target != exitButton &&
        event.target != linkToRequest
      ) {
        containerDiv.style.position = "absolute";
        containerDiv.style.left = event.clientX - offsetX + "px";
        containerDiv.style.top = event.clientY - offsetY + "px";
        containerDiv.style.width = "35vw";
        containerDiv.style.height = "35vh";
        containerDiv.style.resize = "both";
        containerDiv.style.borderRadius = "10px";
        document.querySelector("html").style.overflow = "auto";
      }

      isDragging = true;
      offsetX = event.clientX - containerDiv.offsetLeft;
      offsetY = event.clientY - containerDiv.offsetTop;
      containerDiv.style.zIndex = "1000";
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        switch (true) {
          case newTop < 0 && newLeft < 0:
            newTop = 0;
            newLeft = 0;
            break;
          case newTop < 0 &&
            newLeft >
              document.documentElement.clientWidth - containerDiv.offsetWidth:
            newTop = 0;
            newLeft =
              document.documentElement.clientWidth - containerDiv.offsetWidth;
          case newTop < 0:
            newTop = 0;
            break;
          case newLeft < 0:
            newLeft = 0;
            break;
          case newLeft >
            document.documentElement.clientWidth - containerDiv.offsetWidth:
            newLeft =
              document.documentElement.clientWidth - containerDiv.offsetWidth;
            break;
        }
        containerDiv.style.zIndex = "1000";

        containerDiv.style.left = newLeft + "px";
        containerDiv.style.top = newTop + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      containerDiv.style.zIndex = "1";
    });

    // Set styles for the content container
    contentContainer.style.padding = "5px";
    contentContainer.style.overflow = "auto";
    contentContainer.style.whiteSpace = "pre-wrap";
    contentContainer.style.height = "calc(100% - 30px)"; // Adjust height to exclude header height
    containerDiv.style.minWidth = "50px";
    containerDiv.style.minHeight = "50px";
    // Append the header and content containers to the main container
    containerDiv.appendChild(headerContainer);
    containerDiv.appendChild(contentContainer);

    // Append the main container to the body

    document.body.appendChild(containerDiv);

    containerDiv.style.width = "35vw";
    containerDiv.style.height = "35vh";

    // Add content to the content container
    contentContainer.appendChild(await getNotes(pTag.textContent.trim()));
    contentContainer.innerHTML += "<hr>" + requestDetails.description;

    // Add toggle functionality for notes
    const noteToggles = contentContainer.querySelectorAll("#noteToggle");
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
    const menuBtn = document.createElement("p");
    menuBtn.textContent = "☰";
    menuBtn.style.float = "right";
    menuBtn.style.scale = "1.25";
    menuBtn.style.marginRight = "40px";
    menuBtn.style.marginTop = "10px";
    menuBtn.style.cursor = "pointer";
    menuBtn.style.userSelect = "none";
    menuBtn.addEventListener("click", createMenu);

    headerContainer.appendChild(menuBtn);

    // Add a close button to the header
    const exitButton = document.createElement("p");
    exitButton.textContent = "❌";
    exitButton.title = "Close";
    exitButton.style.scale = "1.25";
    exitButton.style.position = "absolute";
    exitButton.style.top = "0px";
    exitButton.style.right = "15px";
    exitButton.style.backgroundColor = "transparent";
    exitButton.style.width = "20px";
    exitButton.style.height = "20px";
    exitButton.style.cursor = "pointer";
    exitButton.style.userSelect = "none";
    headerContainer.appendChild(exitButton);

    exitButton.onclick = function (event) {
      pTag.style.color = "#63fbf0";
      containerDiv.remove();
      document.querySelector("html").style.overflow = "auto";
    };
    const assign = document.createElement("button");
    assign.textContent = "Assign";
    assign.style.cursor = "pointer";
    assign.style.marginTop = "10px";
    assign.style.padding = "5px 10px";
    assign.style.border = "1px solid #ccc";
    assign.style.borderRadius = "5px";
    assign.style.backgroundColor = "#007bff";
    assign.style.color = "white";
    assign.style.fontSize = "14px";
    assign.style.marginLeft = "10px";
    const testSelect = document.createElement("select");
    testSelect.style.marginTop = "10px";
    testSelect.style.padding = "5px";
    testSelect.style.border = "1px solid #ccc";
    testSelect.style.borderRadius = "5px";
    testSelect.style.backgroundColor = "#f8f9fa";
    testSelect.style.color = "#333";
    testSelect.style.fontSize = "14px";
    testSelect.style.width = "205px";

    technicians.forEach((tech) => {
      const option = document.createElement("option");
      option.value = tech.clientId;
      option.textContent = tech.fullName;
      testSelect.appendChild(option);
    });
    let techID = "";
    testSelect.addEventListener("change", (e) => {
      techID = testSelect.value;
    });
    assign.onclick = async function () {
      try {
        const response = await fetch(
          `https://support.wmed.edu/LiveTime/services/v1/user/requests/${pTag.textContent.trim()}/update`,
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
              "content-type": "application/json", // Add content-type header
            },
            referrer: `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "PUT",
            mode: "cors",
            credentials: "include",
            body: JSON.stringify({
              // Add the body here
              escalation: {
                isIncidentEscalationActive: 1,
                technicianId: parseInt(techID, 10),
              },
            }),
          }
        );

        // Check if the response is OK (status code in range 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.warn("Response body is not valid JSON:", jsonError);
          data = null;
        }
        alert("Request successfully assigned!");
        containerDiv.remove();

        return data;
      } catch (error) {
        console.error(error);
        alert("Failed to assign the request.");
      }
    };
    const updateStatus = document.createElement("button");
    updateStatus.textContent = "Update Status";
    updateStatus.style.cursor = "pointer";
    updateStatus.style.marginTop = "10px";
    updateStatus.style.padding = "5px 10px";
    updateStatus.style.border = "1px solid #ccc";
    updateStatus.style.borderRadius = "5px";
    updateStatus.style.backgroundColor = "#007bff";
    updateStatus.style.color = "white";
    updateStatus.style.fontSize = "14px";
    updateStatus.style.marginLeft = "10px";

    const statusSelect = document.createElement("select");
    statusSelect.style.marginTop = "10px";
    statusSelect.style.padding = "5px";
    statusSelect.style.border = "1px solid #ccc";
    statusSelect.style.borderRadius = "5px";
    statusSelect.style.backgroundColor = "#f8f9fa";
    statusSelect.style.color = "#333";
    statusSelect.style.fontSize = "14px";
    statusSelect.style.width = "205px";
    availableStatuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status.statusId;
      option.textContent = status.statusName;
      statusSelect.appendChild(option);
    });
    updateStatus.onclick = async function () {
      try {
        const response = await fetch(
          `https://support.wmed.edu/LiveTime/services/v1/user/requests/${pTag.textContent.trim()}/itemstatus`,
          {
            method: "PUT",
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
              "content-type": "application/json",
            },
            body: JSON.stringify({
              requestId: pTag.textContent.trim(),
              itemStatusId: parseInt(statusSelect.value, 10),
            }),
            referrer: `https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=${pTag.textContent.trim()}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include",
          }
        );

        // Check if the response is OK (status code in range 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.warn("Response body is not valid JSON:", jsonError);
          data = null;
        }
        alert("Request successfully assigned!");
        containerDiv.remove();

        return data;
      } catch (error) {
        console.error(error);
        alert("Failed to assign the request.");
      }
    };

    // statusID = null;
    // statusSelect.addEventListener("change", (e) => {
    //   statusID = statusSelect.value;
    // });

    contentContainer.appendChild(document.createElement("br"));

    function createMenu() {
      if (!contentContainer.querySelector("#menu")) {
        const menu = document.createElement("div");
        menu.id = "menu";
        menu.style.position = "absolute";
        menu.style.gridTemplateColumns = "1fr 1fr"; // Allow 2 items per row
        menu.style.gap = "10px"; // Add spacing between items
        menu.style.top = "15px"; // Set flex direction to column for different lines
        menu.style.top = "15px";
        menu.style.borderRadius = "5px";
        menu.style.right = "-5px";
        menu.style.padding = "10px";
        menu.style.backgroundColor = "#ffff";
        menu.style.outlineStyle = "solid";
        menu.style.outlineColor = "grey";
        menu.style.overflow = "none";
        menu.style.outlineWidth = ".25px";
        menu.appendChild(testSelect);
        menu.appendChild(assign);
        menu.appendChild(document.createElement("br"));

        menu.appendChild(statusSelect);
        menu.appendChild(updateStatus);
        contentContainer.appendChild(menu);
      } else {
        contentContainer.querySelector("#menu").remove();
      }
    }
  }, 1);

  pTag.addEventListener("mouseout", () => {
    clearTimeout(hoverTimeout);
  });
}
