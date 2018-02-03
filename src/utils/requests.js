export default {
    getJson: function (url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) { // запрос еще не завершен
                return;
            }
            if (xhr.status === 200) {
                const responseJson = JSON.parse(xhr.responseText);
                callback(responseJson);
            }
        };
    }
};