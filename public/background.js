/* eslint-disable no-undef */

// check if the chrome tab has been updated (changed)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // checking the status of the tab and the url
    if(changeInfo.status === "complete" && /^http/.test(tab.url)){
        // inject script --- using the scripting API added to the permissions in the manifest.json file
        chrome.scripting.executeScript({
            target: { tabId },
            files: [ "./contentScript.js" ]
        }).then(()=> {
            console.log("Successfully injected the content script");
        }).catch(err => console.log(err, "Error in background script line 12"))
    }
});