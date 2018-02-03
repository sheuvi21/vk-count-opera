const VK_API_VERSION = "5.60";

export default {
    AUTH_URL: "https://oauth.vk.com/authorize?" +
    "client_id=5801053&" +
    "display=page&" +
    "redirect_uri=https://oauth.vk.com/blank.html&" +
    "scope=messages,offline&" +
    "response_type=token&" +
    "v=" + VK_API_VERSION,
    GET_DIALOGS_URL: "https://api.vk.com/method/messages.getDialogs?" +
    "v=" + VK_API_VERSION + "&" +
    "unread=1&" +
    "access_token=",
    GET_USERS_URL: "https://api.vk.com/method/users.get?" +
    "v=" + VK_API_VERSION + "&" +
    "access_token=",
    GET_GROUPS_URL: "https://api.vk.com/method/groups.getById?" +
    "v=" + VK_API_VERSION + "&" +
    "access_token=",
    DIALOGS_URL: "https://vk.com/im",
};