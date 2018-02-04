# VK Count (Счётчик ВКонтакте)

Расширение для браузеров Opera и Google Chrome, отображающее количество непрочитанных сообщений ВКонтакте.

## Возможности

* Отображает количество непрочитанных сообщений.

* Уведомляет о новых сообщениях с помощью всплывающих уведомлений.

## Установка

Запакованное расширение можно скачать по ссылке https://github.com/sheuvi21/vk-count-opera/releases (файлы .nex и .crx). Откройте скачанный файл с помощью соответствующего браузера, .nex — с помощью Opera, а .crx — с помощью Google Chrome.

После установки кликните по иконке расширения, чтобы пройти авторизацию.

## Сборка

Для сборки используется Webpack, а также плагины к нему: babel-loader и uglifyjs-webpack-plugin.

1. Установите Node.js и NPM.

2. Установите необходимые библиотеки:

   `npm install --save-dev webpack babel-core babel-loader uglifyjs-webpack-plugin`

3. Запустите сборку:

   `npx webpack`

## Дополнительно

Почитать про разработку расширений для браузеров Opera и Google Chrome вы можете по ссылкам https://dev.opera.com/extensions/ и https://developer.chrome.com/extensions.
