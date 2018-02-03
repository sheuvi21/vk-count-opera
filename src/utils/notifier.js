export default {
    notify: function (id, title, body, icon, useWebApi = false) {
        if (useWebApi && Notification !== undefined) {
            Notification.requestPermission()
                .then(function (permission) {
                    if (permission === "granted") {
                        const notification = new Notification(title, {
                            body: body,
                            icon: icon
                        });
                        notification.onerror = function (error) {
                            console.log(error);
                        };
                    }
                });
        } else {
            chrome.notifications.create(id, {
                type: "basic",
                title: title,
                message: body,
                iconUrl: icon
            });
        }
    }
};