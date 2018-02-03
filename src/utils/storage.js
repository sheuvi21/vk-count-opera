export default {
    getValues: function (keys, callback) {
        chrome.storage.local.get(keys, callback);
    },

    setValue: function (key, value) {
        chrome.storage.local.set({ [key]: value });
    },

    removeValue: function (key) {
        chrome.storage.local.remove(key);
    },

    TOKEN: "vk_access_token",
    NOTIFY: "notify",
    LAST_MESSAGE_ID: "last_message_id",
    USE_WEB_API: "use_web_api"
};