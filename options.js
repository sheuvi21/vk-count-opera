const NOTIFY_STORAGE = 'notify';
const USE_WEB_API_STORAGE = 'use_web_api';

function setStorageValue(name, value) {
	var values = {};
	values[name] = value;
	chrome.storage.local.set(values);
}

document.addEventListener('DOMContentLoaded', function() {
	var notifyCheckbox = document.getElementById('notify');
	var webApiCheckbox = document.getElementById('use_web_api');

	chrome.storage.local.get([NOTIFY_STORAGE, USE_WEB_API_STORAGE], function(storage) {
		notifyCheckbox.checked = storage[NOTIFY_STORAGE];
		webApiCheckbox.checked = storage[USE_WEB_API_STORAGE];
	});

	notifyCheckbox.addEventListener('change', function() {
		setStorageValue(NOTIFY_STORAGE, notifyCheckbox.checked);
	});

	webApiCheckbox.addEventListener('change', function () {
		setStorageValue(USE_WEB_API_STORAGE, webApiCheckbox.checked);
	});

	if (!('Notification' in window)) {
		webApiCheckbox.disabled = true;
	}
});