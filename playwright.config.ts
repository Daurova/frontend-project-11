import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/__tests__',   // путь к папке с тестами
  use: {
    baseURL: 'http://localhost:5173', // если нужен сервер разработки
  },
});