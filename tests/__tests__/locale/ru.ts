export const ui = {
  form: {
    urlLabel: 'Ссылка RSS'
  },
  buttons: {
    add: 'Добавить',
    preview: 'Просмотр',
    close: 'Закрыть',
    readFull: 'Читать полностью'
  },
  feedback: {
    success: 'RSS успешно загружен',
    exists: 'RSS уже существует',
    invalidUrl: 'Ссылка должна быть валидным URL',
    noRss: 'Ресурс не содержит валидный RSS',
    network: 'Ошибка сети'
  },
  sections: {
    feeds: 'Фиды',
    posts: 'Посты'
  },
  feed: {
    title: 'Новые уроки на Хекслете',
    description: 'Практические уроки по программированию'
  },
  posts: {
    aggregation: 'Агрегация / Python: Деревья',
    traversal: 'Traversal / Python: Деревья',
    modalDescription: 'Цель: Научиться извлекать из дерева необходимые данные'
  }
} as const;
