import storage from "./utils/storage";

document.addEventListener("DOMContentLoaded", function () {
    const notifyCheckbox = document.getElementById("notify");
    const webApiCheckbox = document.getElementById("use_web_api");

    storage.getValues([storage.NOTIFY, storage.USE_WEB_API], function (values) {
        notifyCheckbox.checked = values[storage.NOTIFY];
        webApiCheckbox.checked = values[storage.USE_WEB_API];
    });

    notifyCheckbox.addEventListener("change", function () {
        storage.setValue(storage.NOTIFY, notifyCheckbox.checked);
    });

    webApiCheckbox.addEventListener("change", function () {
        storage.setValue(storage.USE_WEB_API, webApiCheckbox.checked);
    });

    if (Notification === undefined) {
        webApiCheckbox.disabled = true;
    }
});