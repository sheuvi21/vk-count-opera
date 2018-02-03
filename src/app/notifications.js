import strings from "./strings";
import storage from "../utils/storage";
import notifier from "../utils/notifier";

export default {
    show: function (messages, users, groups) {
        storage.getValues([storage.USE_WEB_API], (values) => {
            const useWebApi = values[storage.USE_WEB_API] === true;

            messages.forEach((message) => {
                let title, photo;

                if (message["user_id"] > 0) {
                    const user = users[message["user_id"]];
                    title = strings.FROM + user["first_name"] + " " + user["last_name"];
                    photo = user["photo_50"];
                }
                else {
                    const group = groups[Math.abs(message["user_id"])];
                    title = strings.FROM + group["name"];
                    photo = group["photo_50"];
                }

                notifier.notify(message["id"].toString(), title, message["body"], photo, useWebApi);
            });
        });
    }
};