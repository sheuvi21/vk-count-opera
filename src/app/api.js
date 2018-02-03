import urls from "./urls";
import requests from "../utils/requests";

export default class {
    constructor(token = null) {
        this.token = token;
    }

    authorize(token) {
        this.token = token;
    }

    deAuthorize() {
        this.token = null;
    }

    isAuthorized() {
        return this.token !== null;
    }

    getDialogs(onSuccess, onFailure) {
        this._get(urls.GET_DIALOGS_URL + this.token, onSuccess, onFailure);
    }

    getUsers(userIds, callback) {
        if (userIds.length > 0) {
            this._getItems(urls.GET_USERS_URL + this.token +
                "&user_ids=" + userIds.join() +
                "&name_case=gen" + // имя в родительном падеже
                "&fields=first_name,last_name,photo_50", callback);
        }
        else {
            callback();
        }
    }

    getGroups(groupIds, callback) {
        if (groupIds.length > 0) {
            this._getItems(urls.GET_GROUPS_URL + this.token +
                "&group_ids=" + groupIds.join() +
                "&fields=name,photo_50", callback);
        }
        else {
            callback();
        }
    }

    _getItems(url, callback) {
        const obj = {};

        this._get(url, (items) => {
            items.forEach((item) => {
                obj[item["id"]] = item;
            });

            callback(obj);
        });
    }

    _get(url, onSuccess, onFailure) {
        requests.getJson(url, (response) => {
            if (response["error"] !== undefined) {
                if (onFailure !== undefined) {
                    onFailure(response["error"]);
                }
                return;
            }

            if (onSuccess !== undefined) {
                onSuccess(response["response"]);
            }
        });
    }
};