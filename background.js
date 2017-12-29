const API_VERSION = '5.60';
const TOKEN_STORAGE = 'vk_access_token';
const NOTIFY_STORAGE = 'notify';
const LAST_MESSAGE_ID_STORAGE = 'last_message_id';
const USE_WEB_API_STORAGE = 'use_web_api';

var app = {

	data: {
		interval: 5000,
		timerId: false,
		token: false,
		authUrl: 'https://oauth.vk.com/authorize?' +
			'client_id=5801053&' +
			'display=page&' +
			'redirect_uri=https://oauth.vk.com/blank.html&' +
			'scope=messages,offline&' +
			'response_type=token&' +
			'v=' + API_VERSION,
		getDialogsUrl: 'https://api.vk.com/method/messages.getDialogs?' +
		'v=' + API_VERSION + '&' +
		'unread=1&' +
		'access_token=',
		getUsersUrl: 'https://api.vk.com/method/users.get?' +
		'v=' + API_VERSION + '&' +
		'access_token=',
		dialogsUrl: 'https://vk.com/im',
		inactiveColor: '#A6A6A6',
		activeColor: '#F7421E',
	},

	actions: {
		init: function() {
			chrome.browserAction.setBadgeBackgroundColor({ 'color': app.data.inactiveColor });
			chrome.browserAction.setBadgeText({ 'text': '?' });
			chrome.storage.local.get([TOKEN_STORAGE, NOTIFY_STORAGE, LAST_MESSAGE_ID_STORAGE], function(storage) {
				if (storage[TOKEN_STORAGE] !== undefined) {
					app.data.token = storage[TOKEN_STORAGE];
					app.actions.initTimer();
				}
				if (storage[NOTIFY_STORAGE] === undefined) {
					app.actions.setStorageValue(NOTIFY_STORAGE, true);
				}
				if (storage[LAST_MESSAGE_ID_STORAGE] === undefined) {
					app.actions.setStorageValue(LAST_MESSAGE_ID_STORAGE, 0);
				}
			});
		},
		sync: function() {
			app.helpers.sendRequest(app.data.getDialogsUrl + app.data.token, function(response) {
				var count = response['response']['count'];
				if (count > 0) {
					chrome.browserAction.setBadgeBackgroundColor({ 'color': app.data.activeColor });
					chrome.browserAction.setBadgeText({ 'text': count.toString() });
					var items = response['response']['items'];
					var messages = [];
					chrome.storage.local.get([LAST_MESSAGE_ID_STORAGE], function(storage) {
						var lastMessageId = storage[LAST_MESSAGE_ID_STORAGE];
						items.forEach(function(item) {
							var message = item['message'];
							if (message['id'] > lastMessageId) {
								messages.push(message);
							}
						});
						if (messages.length > 0) {
							chrome.storage.local.get([NOTIFY_STORAGE], function(storage) {
								var notify = storage[NOTIFY_STORAGE];
								if (notify) {
									messages.sort(function(a, b) {
										return a['id'] - b['id'];
									});
									app.actions.showNotifications(messages);
									var lastMessage = messages[messages.length - 1];
									app.actions.setStorageValue(LAST_MESSAGE_ID_STORAGE, lastMessage['id']);
								}
							});
						}
					});
				}
				else {
					chrome.browserAction.setBadgeText({ 'text': '' });
				}
			});
		},
		setStorageValue: function(name, value) {
			var values = {};
			values[name] = value;
			chrome.storage.local.set(values);
		},
		showNotifications: function(messages) {
			var userIds = [];
			messages.forEach(function(message) {
				userIds.push(message['user_id']);
			});
			app.helpers.sendRequest(app.data.getUsersUrl + app.data.token +
				'&user_ids=' + userIds.join() +
				'&name_case=gen' + // имя в родительном падеже
				'&fields=first_name,last_name,photo_50', function(response) {
				var items = response['response'];
				var users = {};
				items.forEach(function(item) {
					users[item['id']] = item;
				});
				chrome.storage.local.get([USE_WEB_API_STORAGE], function(storage) {
					var useWebApi = storage[USE_WEB_API_STORAGE] === true;
					messages.forEach(function(message) {
						var user = users[message['user_id']];
						app.actions.notify(message['id'], 'Сообщение от ' + user['first_name'] + ' ' + user['last_name'],
							message['body'], user['photo_50'], useWebApi);
					});
				});
			});
		},
		notify: function(id, title, body, icon, useWebApi) {
			if (useWebApi && 'Notification' in window) {
				Notification.requestPermission()
					.then(function(permission) {
						if (permission === 'granted') {
							new Notification(title, {
								body: body,
								icon: icon
							});
						} else {
							// Разрешение не получено
						}
					});
			} else {
				chrome.notifications.create(id.toString(), {
					type: 'basic',
					title: title,
					message: body,
					iconUrl: icon
				});
			}
		},
		initTimer: function() {
			if (app.data.timerId !== false) {
				clearInterval(app.data.timerId);
			}
			app.data.timerId = setInterval(app.actions.sync, app.data.interval);
			chrome.browserAction.setTitle({ 'title': 'Перейти к диалогам' });
		}
	},

	watchers: {
		icon: function() {
			chrome.browserAction.onClicked.addListener(function() {
				if (app.data.token) {
					chrome.tabs.create({ 'url': app.data.dialogsUrl });
				}
				else {
					chrome.tabs.create({ 'url': app.data.authUrl }, function(tab) {
						var authTabId = tab.id;
						chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
							if (tabId === authTabId && changeInfo.url !== undefined && changeInfo.url.indexOf('access_token') !== -1) {
								app.data.token = changeInfo.url.split('#')[1].split('&')[0].split('=')[1];
								app.actions.initTimer();
								chrome.tabs.remove(tabId);
								app.actions.setStorageValue(TOKEN_STORAGE, app.data.token);
							}
						});
					});
				}
			});
		}
	},

	helpers: {
		sendRequest: function(url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.send();
			xhr.onreadystatechange = function() {
				if (this.readyState != 4) { // запрос еще не завершен
					return;
				}
				if (this.status == 200) {
					callback(JSON.parse(this.responseText));
				}
			}
		}
	},

	init: function() {
		app.actions.init();
		app.watchers.icon();
	}

};

app.init();