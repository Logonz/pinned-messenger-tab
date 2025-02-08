let currentTab;
let messengerTabId;
let previousTab;

function createPinnedTab() {
  browser.tabs.create({
    url: "https://www.messenger.com",
    pinned: true,
    active: true,
  });
}

function handleSearch(messengerTabs) {
  console.log("currentTab: " + currentTab);
  console.log("previousTab: " + previousTab);
  console.log("messengerTabs: " + messengerTabs);
  if (messengerTabs.length > 0) {
    messengerTabId = messengerTabs[0].id;
    windowId = messengerTabs[0].windowId;
    if (messengerTabId === currentTab.id) {
      // console.log("Messenger tab is the current tab");
      browser.tabs.update(previousTab.id, { active: true });
      browser.windows.update(previousTab.windowId, { focused: true });
    } else {
      //console.log("Messenger tab is not the current tab");
      previousTab = currentTab;
      browser.tabs.update(messengerTabId, { active: true });
      browser.windows.update(windowId, { focused: true });
    }
  } else {
    //console.log("No Messenger tab found, creating a new one");
    previousTab = currentTab;
    createPinnedTab();
  }
}

function onError(e) {
  console.log("***Error: " + e);
}

function onOpened() {
  console.log("Options page opened");
}

function handleClick(tab) {
  //console.log("Ext clicked");
  currentTab = tab;
  var querying = browser.tabs.query({ url: "*://www.messenger.com/*" });
  querying.then(handleSearch, onError);
}

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
}

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);
