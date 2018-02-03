import storage from "../utils/storage";
import Timer from "../utils/timer";
import options from "./options";
import icon from "../utils/icon";
import tabs from "../utils/tabs";
import urls from "./urls";
import strings from "./strings";
import VkApi from "./api";
import notifications from "./notifications";

export default class {
    constructor() {
        this.vkApi = new VkApi();
        this.timer = new Timer(this.update.bind(this), options.updateInterval);
    }

    init() {
        icon.setColor(options.inactiveColor);
        icon.setText("?");
        icon.setTitle(strings.AUTH);

        storage.getValues([storage.TOKEN, storage.LAST_MESSAGE_ID, storage.NOTIFY], (values) => {
            if (values[storage.TOKEN] !== undefined) {
                const token = values[storage.TOKEN];
                this.vkApi.authorize(token);
                this.timer.startTimer();

                icon.setTitle(strings.DIALOGS);
            }

            if (values[storage.NOTIFY] === undefined) {
                storage.setValue(storage.NOTIFY, true);
            }

            if (values[storage.LAST_MESSAGE_ID] === undefined) {
                storage.setValue(storage.LAST_MESSAGE_ID, 0);
            }
        });

        icon.setOnClickListener(() => {
            if (this.vkApi.isAuthorized()) {
                tabs.openTab(urls.DIALOGS_URL);
            }
            else {
                tabs.openTab(urls.AUTH_URL, (tab) => {
                    const authTabId = tab.id;

                    tabs.setOnUpdatedListener((tabId, changeInfo) => {
                        if (tabId === authTabId &&
                            changeInfo.url !== undefined &&
                            changeInfo.url.indexOf("access_token") !== -1) {
                            tabs.closeTab(tabId);

                            const token = changeInfo.url.split("#")[1].split("&")[0].split("=")[1];
                            this.vkApi.authorize(token);
                            this.timer.startTimer();

                            storage.setValue(storage.TOKEN, token);
                            icon.setTitle(strings.DIALOGS);
                        }
                    });
                });
            }
        });
    }

    update() {
        this.vkApi.getDialogs((response) => {
            const count = response["count"];

            if (count > 0) {
                icon.setColor(options.activeColor);
                icon.setText(count.toString());

                const items = response["items"];
                const messages = [];
                storage.getValues([storage.LAST_MESSAGE_ID, storage.NOTIFY], (values) => {
                    const lastMessageId = values[storage.LAST_MESSAGE_ID];
                    items.forEach((item) => {
                        if (item["message"]["id"] > lastMessageId) {
                            messages.push(item["message"]);
                        }
                    });

                    if (messages.length > 0) {
                        messages.sort((a, b) => {
                            return a["id"] - b["id"];
                        });

                        const notify = values[storage.NOTIFY];
                        if (notify) {
                            const userIds = [], groupIds = [];

                            messages.forEach((message) => {
                                if (message["user_id"] > 0) {
                                    userIds.push(message["user_id"]);
                                }
                                else {
                                    groupIds.push(Math.abs(message["user_id"]));
                                }
                            });

                            this.vkApi.getUsers(userIds, (users = {}) => {
                                this.vkApi.getGroups(groupIds, (groups = {}) => {
                                    notifications.show(messages, users, groups);
                                });
                            });
                        }

                        const lastMessage = messages[messages.length - 1];
                        storage.setValue(storage.LAST_MESSAGE_ID, lastMessage["id"]);
                    }
                });
            }
            else {
                icon.setText("");
            }
        }, (error) => {
            if (error["error_code"] === 5) { // Авторизация пользователя не удалась
                icon.setColor(options.inactiveColor);
                icon.setText("?");
                icon.setTitle(strings.AUTH);

                this.vkApi.deAuthorize();
                this.timer.stopTimer();
                storage.removeValue(storage.TOKEN);
            }
        });
    }
};