var app = {

	data: {
		storageField: 'vk_access_token',
		interval: 5000,
		timerId: false,
		token: false,
		authUrl: 'https://oauth.vk.com/authorize?'+
			'client_id=5801053&'+
			'display=page&'+
			'redirect_uri=https://oauth.vk.com/blank.html&'+
			'scope=messages,offline&'+
			'response_type=token&'+
			'v=5.60',
		methodUrl: 'https://api.vk.com/method/messages.getDialogs?'+
		'v=5.60&'+
		'unread=1&'+
		'access_token=',
		dialogsUrl: 'https://vk.com/im',
		inactiveColor: '#A6A6A6',
		activeColor: '#F7421E',
	},

	actions: {
		init: function() {
			chrome.browserAction.setBadgeBackgroundColor({ 'color': app.data.inactiveColor });
			chrome.browserAction.setBadgeText({ 'text': '?' });
			chrome.storage.local.get([app.data.storageField], function(items) {
				if (items[app.data.storageField] !== undefined) {
					app.data.token = items[app.data.storageField];
					if (app.data.timerId !== false) {
						clearInterval(app.data.timerId);
					}
					app.data.timerId = setInterval(app.actions.sync, app.data.interval);
				}
			});
		},
		sync: function() {
			app.helpers.sendRequest(app.data.methodUrl + app.data.token, function(responseText) {
				var response = JSON.parse(responseText);
				var count = response['response']['count'];
				if (count > 0) {
					chrome.browserAction.setBadgeBackgroundColor({ 'color': app.data.activeColor });
				}
				else {
					chrome.browserAction.setBadgeBackgroundColor({ 'color': app.data.inactiveColor });
				}
				chrome.browserAction.setBadgeText({ 'text': count.toString() });
			});
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
								if (app.data.timerId !== false) {
									clearInterval(app.data.timerId);
								}
								app.data.timerId = setInterval(app.actions.sync, app.data.interval);
								chrome.tabs.remove(tabId);
								var values = {};
								values[app.data.storageField] = app.data.token;
								chrome.storage.local.set(values);
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
					callback(this.responseText);
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