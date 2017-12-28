const NOTIFY_STORAGE = 'notify';

var notifyCheckbox = document.getElementById('notify');

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get([NOTIFY_STORAGE], function(storage) {
		notifyCheckbox.checked = storage[NOTIFY_STORAGE];
	});
});

notifyCheckbox.addEventListener('change', function() {
	var values = {};
	values[NOTIFY_STORAGE] = notifyCheckbox.checked;
	chrome.storage.local.set(values);
});