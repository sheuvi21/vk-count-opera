export default {
    openTab: function (url, callback = undefined) {
        chrome.tabs.create({ "url": url }, callback);
    },

    closeTab: function (tabId) {
        chrome.tabs.remove(tabId);
    },

    setOnUpdatedListener: function (handler) {
        chrome.tabs.onUpdated.addListener(handler);
    }
};