const { exec, spawn } = require('child_process');
const path = require('path');
const os = require('os');
const open = require('open');
const http = require('http');

// Определяем текущую директорию (где находится start.js)
const projectRoot = __dirname;
const serverDir = path.join(projectRoot, 'server');
const clientDir = path.join(projectRoot, 'client');

// Функция для выполнения команд в терминале
function runCommand(command, cwd, name) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, { cwd, shell: true, stdio: 'inherit' });
    proc.on('error', (err) => {
      console.error(`Ошибка в ${name}:`, err);
      reject(err);
    });
    proc.on('exit', (code) => {
      if (code !== 0) {
        console.error(`${name} завершился с кодом ${code}`);
        reject(new Error(`${name} failed`));
      } else {
        resolve();
      }
    });
  });
}

// Функция для ожидания запуска сервера
function waitForServer(port, retries = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    function tryConnect() {
      attempt++;
      const req = http.request({ hostname: 'localhost', port, method: 'HEAD', timeout: 500 }, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          if (attempt >= retries) {
            reject(new Error(`Сервер не отвечает на порту ${port} после ${retries} попыток`));
          } else {
            setTimeout(tryConnect, delay);
          }
        }
      });
      req.on('error', () => {
        if (attempt >= retries) {
          reject(new Error(`Сервер не отвечает на порту ${port} после ${retries} попыток`));
        } else {
          setTimeout(tryConnect, delay);
        }
      });
      req.end();
    }

    tryConnect();
  });
}

// Основная функция запуска
async function startApp() {
  console.log('Запуск проекта travel-app...');
  console.log('Рабочая директория:', projectRoot);

  try {
    // Установка зависимостей для сервера
    console.log('Установка зависимостей сервера...');
    await runCommand('npm install', serverDir, 'установка сервера');

    // Установка зависимостей для клиента
    console.log('Установка зависимостей клиента...');
    await runCommand('npm install', clientDir, 'установка клиента');

    // Запуск сервера в фоновом режиме
    console.log('Запуск сервера...');
    const serverProcess = spawn('node', ['server.js'], {
      cwd: serverDir,
      stdio: 'inherit',
      shell: true,
    });

    serverProcess.on('error', (err) => {
      console.error('Ошибка сервера:', err);
    });

    // Ожидание запуска сервера
    await waitForServer(5000);

    // Запуск клиента
    console.log('Запуск клиента...');
    const clientProcess = spawn('npm', ['start'], {
      cwd: clientDir,
      stdio: 'inherit',
      shell: true,
    });

    clientProcess.on('error', (err) => {
      console.error('Ошибка клиента:', err);
    });

    // Ожидание запуска клиента
    await waitForServer(3000);

    // Открытие браузера
    console.log('Открытие сайта в браузере...');
    await open('http://localhost:3000');

    console.log('Сайт запущен! Сервер на http://localhost:5000, клиент на http://localhost:3000');
    console.log('Для остановки нажмите Ctrl+C в терминале.');

  } catch (err) {
    console.error('Ошибка при запуске:', err);
    process.exit(1);
  }
}

// Запуск
startApp();