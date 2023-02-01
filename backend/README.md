[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

Дополнительно в проект добавлены миддлвэры:
- Helmet - защита от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP 
- Express-rare-limit - ограничение числа запросов для защиты от DoS атак

[Ссылка на репозиторий сервера](https://github.com/Artem-Mit/express-mesto-gha)
