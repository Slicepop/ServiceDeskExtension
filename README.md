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

### **Requests list i.e. Incident and My Tasks**

- Changes all request links to open in new tab
- Alternates background color of request list item for easier readability
- Automatically closes confirmation of ticket creation after a delay of 300 milliseconds

### **Request Page**

- New Save And Close button option that will save and close after a delay of 1 second
- Change title of tab to be the subject title
- Change Description box to be resizable
  <br>

**If you run into any issues please let me know!**

#### **Known Issues**

- Release of 1/2/25 12:33 PM - Issue of "Changes you made may not be saved." popup on close mitigated by changing when request list needs to be refreshed. Now happens when save modal pops up. Removing beforeunload event which triggered said popup

<br>
<br>
<br>

_"The greatest extension not in the app store - wmed employee" - Richard Graziano_
