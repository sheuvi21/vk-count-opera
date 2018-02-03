export default {
    setColor: function (color) {
        chrome.browserAction.setBadgeBackgroundColor({ "color": color });
    },

    setText: function (text) {
        chrome.browserAction.setBadgeText({ "text": text });
    },

    setTitle: function (title) {
        chrome.browserAction.setTitle({ "title": title });
    },

    setOnClickListener: function (handler) {
        chrome.browserAction.onClicked.addListener(handler);
    }
};