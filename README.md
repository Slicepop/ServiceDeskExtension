# ServiceDeskExtension

### **Installation Instructions**

1. Clone the repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch in the top right corner.
4. Click the "Load unpacked" button and select the NewTab folder inside of the cloned repository folder.
5. Once loaded, you will need to refresh the service page.
6. The extension should now be loaded and ready to use.
   ![alt text](https://developer.chrome.com/static/docs/extensions/get-started/tutorial/hello-world/image/extensions-page-e0d64d89a6acf_856.png)

# **What does this Do?**

### **Extension Pop-Up**

If you click on the extension icon a new menu wil show allowing you to quickly create quickcall tickets ie) Phone Call, Walk up, and Teams Message.

![alt text](./Popup.png)

_Extension Pop-Up in Dark Mode, click moon/sun to switch_

1. Simply search in the top text box for the user and select in the result box that shows when searching
2. Create a general description (this is what you enter after "Phone Call - " in the subject line)
3. Click on which quickcall you would like this ticket to be created as
4. Once successfully created a confirmation message will appear that links to the newly created ticket, window will close after 3 seconds

### **Requests list i.e. Incident and My Tasks**

- Changes all request links to open in new tab
- Alternates background color of request list item for easier readability
- Automatically closes confirmation of ticket creation after a delay of 300 milliseconds
- Add in "Personal Note" to each ticket assigned to you. This is a temporary note that will get removed once the ticket is not assigned to yourself

### **Request Page**

- New Save And Close button option that will save and close after a delay of 1 second
- Change title of tab to be the subject title
- Change Description box to be resizable
- "Personal Note" added into additional details section
  <br>

**If you run into any issues please let me know!**

#### **Known Issues**

- Release of 1/2/25 12:33 PM - Issue of "Changes you made may not be saved." popup on close mitigated by changing when request list needs to be refreshed. Now happens when save modal pops up. Removing beforeunload event which triggered said popup
- Release of 1/21/25 10:00 AM - Issue of logging out when refreshing should be solved, service desk adds /LiveTime/WebObjects/LiveTime/wo/xx.xx.xxx when clicking requests which caused logging out. Changed link to be /LiveTime/WebObjects/LiveTime
  <br>
  <br>
  <br>

_"The greatest extension not in the app store - wmed employee" - Richard Graziano_
