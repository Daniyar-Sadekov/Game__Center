// Класс для контроля производительности сайта
class DetailManager {
    constructor() {
        this.isLowDetail = false;
        this.detailToggle = document.getElementById('detail-toggle');

        // Проверяем сохраненные настройки
        const savedDetailMode = localStorage.getItem('lowDetailMode');
        if (savedDetailMode === 'true') {
            this.enableLowDetailMode();
        }

        this.initEvents();
        this.monitorPerformance();
        this.renderModeOnBtn();
    }

    initEvents() {
        this.detailToggle.addEventListener('click', () => {
            this.toggleDetailMode();
        });

        // Автоматическое включение на слабых устройствах
        this.autoDetectPerformance();
    }

    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();

        const checkPerformance = (currentTime) => {
            frameCount++;

            // Проверяем FPS каждую секунду
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

                // Если FPS ниже порога, включаем режим низкой детализации
                if (fps < 10 && !this.isLowDetail) {
                    this.enableLowDetailMode();
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(checkPerformance);
        };

        requestAnimationFrame(checkPerformance);
    }

    toggleDetailMode() {
        if (this.isLowDetail) {
            this.disableLowDetailMode();
        } else {
            this.enableLowDetailMode();
        }
    }

    enableLowDetailMode() {
        document.documentElement.classList.add('low-detail-mode');
        this.isLowDetail = true;
        this.detailToggle.classList.add('active');
        this.detailToggle.title = 'Switch to Full Detail Mode';
        this.detailToggle.textContent = 'FDM'
        this.detailToggle.setAttribute('aria-label', 'Режим полной детализации');

        // Останавливаем сложные анимации
        this.stopIntensiveAnimations();

        // Сохраняем настройку
        localStorage.setItem('lowDetailMode', 'true');

        console.log('Режим низкой детализации активирован');
    }

    disableLowDetailMode() {
        document.documentElement.classList.remove('low-detail-mode');
        this.isLowDetail = false;
        this.detailToggle.classList.remove('active');
        this.detailToggle.title = 'Switch to Low Detail Mode';
        this.detailToggle.textContent = 'LDM'
        this.detailToggle.setAttribute('aria-label', 'Режим низкой детализации');

        // Восстанавливаем анимации
        this.restoreAnimations();

        // Сохраняем настройку
        localStorage.setItem('lowDetailMode', 'false');

        console.log('Режим полной детализации активирован');
    }

    stopIntensiveAnimations() {
        // Уменьшаем количество звезд
        const stars = document.querySelectorAll('.star');
        for (let i = 100; i < stars.length; i++) {
            stars[i].style.display = 'none';
        }

        // Останавливаем генерацию новых анимаций
        if (window.starGenerationInterval) {
            clearInterval(window.starGenerationInterval);
        }
    }

    restoreAnimations() {
        // Восстанавливаем отображение звезд
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.display = 'block';
        });
    }

    autoDetectPerformance() {
        // Проверяем производительность устройства
        if (this.isLowPerformanceDevice()) {
            this.enableLowDetailMode();
        }
    }

    isLowPerformanceDevice() {
        // Простые проверки на слабые устройства
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSlowConnection = navigator.connection && (
            navigator.connection.saveData ||
            navigator.connection.effectiveType.includes('2g') ||
            navigator.connection.effectiveType.includes('3g')
        );

        return isMobile || isSlowConnection;
    }


    // Изначальный вид кнопки при загрузке страницы
    renderModeOnBtn() {
        if (this.detailToggle.textContent == 'FDM') {
            this.detailToggle.title = 'Switch to Full Detail Mode'
        } else if (this.detailToggle.textContent == 'LDM') {
            this.detailToggle.title = 'Switch to Low Detail Mode'
        } else {
            this.disableLowDetailMode()
        }
    }
}

// Основной класс для управления игровым центром
class GameCenter {
    constructor() {
        this.screens = document.querySelectorAll('.screen');
        this.currentScreen = 'main-menu';
        this.isFullscreen = false;
        this.isMusicPlaying = false;

        // Измененный порядок
        this.detailManager = new DetailManager();
        this.initMusic();
        this.initMusicSettings();
        this.initBackground();
        this.initEvents();
        this.initModals();
        this.initCursor();
        this.animateCards();
    }

    initBackground() {
        // Создаем звезды для фона
        for (let i = 0; i < 300; i++) {
            this.createStar();
        }

        // Создаем туманности
        for (let i = 0; i < 8; i++) {
            this.createNebula();
        }

        // Создаем галактики
        for (let i = 0; i < 3; i++) {
            this.createGalaxy();
        }

        // Создаем пульсары
        for (let i = 0; i < 5; i++) {
            this.createPulsar();
        }

        // Создаем космическую пыль
        for (let i = 0; i < 10; i++) {
            this.createCosmicDust();
        }

        // Создаем падающие звезды и кометы
        setInterval(() => {
            if (Math.random() > 0.3) this.createShootingStar();
            if (Math.random() > 0.5) this.createComet();
        }, 2000);
    }

    clearAllSessions() {
        this.showConfirmationModal(
            "Вы уверены, что хотите удалить всю историю сессий?",
            () => {
                localStorage.setItem('gameSessions', JSON.stringify([]));
                this.loadStats();

                // Показываем уведомление об успешном удалении
                this.showNotification('История сессий очищена', 'success');
            }
        );
    }

    deleteSession(index) {
        this.showConfirmationModal(
            "Вы уверены, что хотите удалить эту сессию?",
            () => {
                const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
                if (index >= 0 && index < sessions.length) {
                    sessions.splice(index, 1);
                    localStorage.setItem('gameSessions', JSON.stringify(sessions));
                    this.loadStats();
                    this.showNotification('Сессия удалена', 'success');
                }
            }
        );
    }


    showConfirmModal(message, callback) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
        <div class="modal-content">
            <h3>Подтверждение</h3>
            <p>${message}</p>
            <div class="confirm-buttons">
                <button class="btn btn-warning" id="confirm-yes">Да</button>
                <button class="btn" id="confirm-no">Отмена</button>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        modal.querySelector('#confirm-yes').addEventListener('click', () => {
            callback(true);
            modal.remove();
        });

        modal.querySelector('#confirm-no').addEventListener('click', () => {
            callback(false);
            modal.remove();
        });

        // Закрытие по клику вне окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                callback(false);
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Стили для уведомления
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';

        if (type === 'success') {
            notification.style.background = 'rgba(86, 171, 47, 0.9)';
        } else {
            notification.style.background = 'rgba(79, 160, 255, 0.9)';
        }

        document.body.appendChild(notification);

        // Анимация появления
        gsap.fromTo(notification,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }
        );

        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            gsap.to(notification, {
                y: 100,
                opacity: 0,
                duration: 0.5,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }

    // Метод для обработки перехода между экранами
    switchScreen(newScreenId, fromBackButton = false) {
        // Сохраняем предыдущий экран
        const previousScreen = this.currentScreen;

        // Скрываем текущий экран
        const currentScreenElement = document.getElementById(this.currentScreen);
        if (currentScreenElement) {
            currentScreenElement.classList.remove('active');
            currentScreenElement.classList.add('hidden');
        }

        // Обрабатываем особые случаи
        if (fromBackButton) {
            this.handleBackButton(previousScreen);
        }

        // Показываем новый экран
        const newScreenElement = document.getElementById(newScreenId);
        if (newScreenElement) {
            newScreenElement.classList.remove('hidden');
            setTimeout(() => {
                newScreenElement.classList.add('active');
                this.currentScreen = newScreenId;

                // Действия после перехода на новый экран
                if (newScreenId === 'stats-screen') {
                    this.loadStats();
                }

                if (newScreenId === 'breathing-game') {
                    breathingGame.reset();
                }
            }, 50);
        }
    }

    // Обработчик кнопки "Назад"
    handleBackButton(previousScreen) {
        // Останавливаем игры в зависимости от предыдущего экрана
        if (previousScreen === 'space-game' && spaceGame.active) {
            spaceGame.stop(false);
        }

        if (previousScreen === 'breathing-game' && breathingGame.active) {
            breathingGame.pause();
            breathingGame.reset();
        }

        // Скрываем все модальные окна
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (!modal.id || modal.id !== 'music-modal') {
                modal.classList.add('hidden');
            }
        });

        // Скрываем контейнер рефлексии
        document.getElementById('reflection-container').classList.add('hidden');

        // Восстанавливаем курсор
        document.body.classList.remove('hide-cursor');
        this.ensureCursorVisible();
    }

    animateCards() {
        // Анимация появления карточек в главном меню
        const cards = document.querySelectorAll('.game-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, 500 + index * 300);
        });
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';

        const size = 1 + Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = 0.3 + Math.random() * 0.7;
        star.style.animationDelay = `${Math.random() * 5}s`;

        document.getElementById('stars-container').appendChild(star);
    }

    createNebula() {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';

        const size = 150 + Math.random() * 200;
        nebula.style.width = `${size}px`;
        nebula.style.height = `${size}px`;
        nebula.style.left = `${Math.random() * 100}%`;
        nebula.style.top = `${Math.random() * 100}%`;
        nebula.style.backgroundColor = ['#4fa0ff', '#ff4b2b', '#a8e063', '#9d4edd', '#f72585'][Math.floor(Math.random() * 5)];
        nebula.style.animationDelay = `${Math.random() * 10}s`;

        document.getElementById('stars-container').appendChild(nebula);
    }

    createGalaxy() {
        const galaxy = document.createElement('div');
        galaxy.className = 'galaxy';

        const size = 300 + Math.random() * 400;
        galaxy.style.width = `${size}px`;
        galaxy.style.height = `${size}px`;
        galaxy.style.left = `${Math.random() * 100}%`;
        galaxy.style.top = `${Math.random() * 100}%`;
        galaxy.style.background = `radial-gradient(circle, ${['#4fa0ff40', '#ff4b2b40', '#a8e06340'][Math.floor(Math.random() * 3)]}, transparent 70%)`;
        galaxy.style.animationDuration = `${60 + Math.random() * 120}s`;

        document.getElementById('stars-container').appendChild(galaxy);
    }

    createPulsar() {
        const pulsar = document.createElement('div');
        pulsar.className = 'pulsar';

        pulsar.style.left = `${Math.random() * 100}%`;
        pulsar.style.top = `${Math.random() * 100}%`;
        pulsar.style.animationDelay = `${Math.random() * 3}s`;

        document.getElementById('stars-container').appendChild(pulsar);
    }

    createCosmicDust() {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust';

        const size = 20 + Math.random() * 80;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.top = `${Math.random() * 100}%`;
        dust.style.animationDelay = `${Math.random() * 40}s`;
        dust.style.animationDuration = `${30 + Math.random() * 20}s`;

        document.getElementById('stars-container').appendChild(dust);
    }

    createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';

        const length = 30 + Math.random() * 70;
        const angle = Math.random() * Math.PI / 4;

        shootingStar.style.width = `${length}px`;
        shootingStar.style.height = '1px';
        shootingStar.style.transform = `rotate(${angle}rad)`;
        shootingStar.style.left = `${Math.random() * window.innerWidth}px`;
        shootingStar.style.top = '-50px';

        document.getElementById('stars-container').appendChild(shootingStar);

        // Анимация падающей звезды
        gsap.to(shootingStar, {
            y: window.innerHeight + 100,
            x: `+=${Math.tan(angle) * window.innerHeight + 100}`,
            duration: 1 + Math.random() * 2,
            opacity: 0,
            ease: "none",
            onComplete: () => shootingStar.remove()
        });
    }

    createComet() {
        const comet = document.createElement('div');
        comet.className = 'comet';

        const length = 80 + Math.random() * 120;
        const angle = Math.random() * Math.PI / 4;

        comet.style.width = `${length}px`;
        comet.style.height = '2px';
        comet.style.transform = `rotate(${angle}rad)`;
        comet.style.left = `${Math.random() * window.innerWidth}px`;
        comet.style.top = '-50px';

        // Случайный цвет кометы
        const colors = ['#4fa0ff', '#ff4b2b', '#a8e063', '#9d4edd'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        comet.style.background = `linear-gradient(to right, 
                    rgba(255, 255, 255, 0) 0%, 
                    ${color} 30%, 
                    rgba(255, 255, 255, 0) 100%)`;

        // Добавляем хвост кометы
        const tail = document.createElement('div');
        tail.style.position = 'absolute';
        tail.style.right = '0';
        tail.style.top = '0';
        tail.style.width = '20px';
        tail.style.height = '100%';
        tail.style.background = `linear-gradient(to right, 
                    ${color} 0%, 
                    rgba(255, 255, 255, 0) 100%)`;
        tail.style.filter = 'blur(2px)';
        comet.appendChild(tail);

        document.getElementById('stars-container').appendChild(comet);

        // Анимация кометы
        gsap.to(comet, {
            y: window.innerHeight + 100,
            x: `+=${Math.tan(angle) * window.innerHeight + 100}`,
            duration: 2 + Math.random() * 2,
            opacity: 0,
            ease: "power1.out",
            onComplete: () => comet.remove()
        });
    }

    initCursor() {
        const cursor = document.getElementById('custom-cursor');
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let lastTime = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Плавное движение курсора с улучшенной производительностью
        const updateCursor = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            // Используем более быстрое следование за курсором
            cursorX += (mouseX - cursorX - 10) * 0.4;
            cursorY += (mouseY - cursorY - 10) * 0.4;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(updateCursor);
        };

        requestAnimationFrame(updateCursor);

        // Добавляем эффект при наведении на интерактивные элементы
        const interactiveElements = document.querySelectorAll('button, .game-card, .back-btn, .modal-close');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    initEvents() {

        // Обработка ESC для всех модальных окон
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('confirmation-modal');
                if (modal && !modal.classList.contains('hidden')) {
                    e.preventDefault();
                    this.hideConfirmationModal();

                    // Вызываем cancel callback если он есть
                    const cancelBtn = document.getElementById('modal-cancel');
                    if (cancelBtn && cancelBtn.onclick) {
                        cancelBtn.onclick();
                    }
                }

                // Также закрываем другие модальные окна
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    if (!modal.classList.contains('hidden') && (!modal.id || modal.id !== 'music-modal')) {
                        modal.classList.add('hidden');
                    }
                });
            }
        });

        // Обработчики для кнопок назад
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchScreen(btn.dataset.target, true);
            });
        });

        // Обработчики для других кнопок навигации
        document.querySelectorAll('[data-target]:not(.back-btn)').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchScreen(btn.dataset.target, false);
            });
        });

        // Кнопка очистки истории сессий
        document.getElementById('clear-sessions').addEventListener('click', () => {
            this.clearAllSessions();
        });

        // Закрытие музыкального модального окна
        document.querySelector('#music-modal .modal-close').addEventListener('click', () => {
            this.hideMusicModal();
        });

        document.getElementById('music-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideMusicModal();
            }
        })
        // Обработчики для карточек игр
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('card-play-btn') ||
                    e.target.classList.contains('card-details-btn')) return;

                const game = card.dataset.game;
                this.showScreen(game);

                if (game === 'space-game') spaceGame.start();
                else if (game === 'breathing-game') breathingGame.reset();
            });
        });

        // Обработчики для кнопок "Играть"
        document.querySelectorAll('.card-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const game = btn.closest('.game-card').dataset.game;
                if (btn.dataset.target) {
                    this.showScreen(btn.dataset.target);
                } else {
                    this.showScreen(game);
                    if (game === 'space-game') spaceGame.start();
                    else if (game === 'breathing-game') breathingGame.reset();
                }
            });
        });

        // Обработчики для кнопок "Подробнее"
        document.querySelectorAll('.card-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modalId = btn.dataset.modal;
                this.showModal(modalId);
            });
        });

        // Обработчики для кнопок назад
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen(btn.dataset.target);
            });
        });

        // Обработчики для других кнопок
        document.querySelectorAll('[data-target]').forEach(btn => {
            if (!btn.classList.contains('back-btn') && !btn.classList.contains('card-play-btn')) {
                btn.addEventListener('click', () => {
                    this.showScreen(btn.dataset.target);
                });
            }
        });

        // Инициализация игр
        document.getElementById('restart-space-game').addEventListener('click', () => {
            spaceGame.start();
        });

        document.getElementById('start-breathing').addEventListener('click', () => {
            breathingGame.start();
        });

        document.getElementById('pause-breathing').addEventListener('click', () => {
            breathingGame.togglePause();
        });

        document.getElementById('reset-breathing').addEventListener('click', () => {
            breathingGame.reset();
        });

        // Кнопка полноэкранного режима
        document.getElementById('fullscreen-toggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Кнопка управления музыкой
        document.getElementById('music-toggle').addEventListener('click', () => {
            this.toggleMusic();
        });

        // Кнопка экспорта данных
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        // Кнопка загрузки музыки
        document.getElementById('music-upload').addEventListener('click', () => {
            this.showMusicModal();
        });

        // Переключение между стандартной и пользовательской музыкой
        document.querySelectorAll('input[name="music"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('custom-music-upload').style.display =
                    e.target.value === 'custom' ? 'block' : 'none';
            });
        });

        // Сохранение настроек музыки
        document.getElementById('save-music').addEventListener('click', () => {
            this.saveMusicSettings();
        });

        // Контроль громкости
        document.getElementById('volume-control').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audio.volume = volume;
            document.getElementById('volume-value').textContent = `${e.target.value}%`;

            // Сохраняем настройки громкости
            localStorage.setItem('musicVolume', volume);
        });
    }

    initMusicSettings() {
        if (!this.audio) {
            console.error("Аудио элемент не инициализирован");
            return;
        }
        // Загрузка сохраненных настроек музыки
        const musicType = localStorage.getItem('musicType') || 'default';
        const musicVolume = localStorage.getItem('musicVolume') || 0.3;
        const customMusicData = localStorage.getItem('customMusic');

        // Установка громкости
        this.audio.volume = musicVolume;
        document.getElementById('volume-control').value = musicVolume * 100;
        document.getElementById('volume-value').textContent = `${musicVolume * 100}%`;

        // Установка типа музыки
        document.getElementById(`${musicType}-music`).checked = true;

        if (musicType === 'custom' && customMusicData) {
            try {
                // Восстанавливаем пользовательскую музыку из localStorage
                const musicData = JSON.parse(customMusicData);
                this.audio.src = musicData.url;
                document.getElementById('custom-music-upload').style.display = 'block';
            } catch (e) {
                console.error("Ошибка загрузки пользовательской музыки:", e);
            }
        }
    }

    showConfirmationModal(message, confirmCallback, cancelCallback = null) {
        const modal = document.getElementById('confirmation-modal');
        const messageElement = document.getElementById('dialog-message');
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');

        // Устанавливаем сообщение
        messageElement.textContent = message;

        // Удаляем предыдущие обработчики
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));

        // Получаем новые reference после клонирования
        const newConfirmBtn = document.getElementById('modal-confirm');
        const newCancelBtn = document.getElementById('modal-cancel');

        // Добавляем новые обработчики
        newConfirmBtn.addEventListener('click', () => {
            confirmCallback();
            this.hideConfirmationModal();
        });

        newCancelBtn.addEventListener('click', () => {
            if (cancelCallback) cancelCallback();
            this.hideConfirmationModal();
        });

        // Закрытие при клике на оверлей
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (cancelCallback) cancelCallback();
                this.hideConfirmationModal();
            }
        });

        // Показываем модальное окно
        modal.classList.remove('hidden');

        // Убедимся, что кастомный курсор виден
        this.ensureCursorVisible();
    }

    hideConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        modal.classList.add('hidden');
    }

    ensureCursorVisible() {
        const customCursor = document.getElementById('custom-cursor');
        if (customCursor) {
            customCursor.style.display = 'block';
            customCursor.style.opacity = '1';
            customCursor.style.zIndex = '10001';
        }
    }

    showMusicModal() {
        const musicModal = document.getElementById('music-modal');
        musicModal.classList.remove('hidden');

        // Анимация появления
        gsap.fromTo(musicModal,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );

        gsap.fromTo(musicModal.querySelector('.modal-content'),
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }

    saveMusicSettings() {
        const selectedMusic = document.querySelector('input[name="music"]:checked').value;

        if (selectedMusic === 'custom') {
            const fileInput = document.getElementById('music-file');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    // Сохраняем музыку в localStorage
                    const musicData = {
                        name: file.name,
                        type: file.type,
                        url: e.target.result
                    };

                    localStorage.setItem('customMusic', JSON.stringify(musicData));
                    localStorage.setItem('musicType', 'custom');

                    // Устанавливаем новую музыку
                    this.audio.src = musicData.url;

                    if (this.isMusicPlaying) {
                        this.audio.play().catch(e => console.log("Не удалось воспроизвести музыку"));
                    }

                    this.hideMusicModal();
                };

                reader.readAsDataURL(file);
            } else {
                alert("Пожалуйста, выберите аудиофайл");
            }
        } else {
            // Используем стандартную музыку
            localStorage.setItem('musicType', 'default');
            this.audio.src = document.querySelector('audio source').src;

            if (this.isMusicPlaying) {
                this.audio.play().catch(e => console.log("Не удалось воспроизвести музыку"));
            }

            this.hideMusicModal();
        }
    }

    hideMusicModal() {
        const musicModal = document.getElementById('music-modal');

        gsap.to(musicModal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                musicModal.classList.add('hidden');
            }
        });
    }

    initModals() {
        // Содержимое модальных окон
        this.modals = {
            'space-game-info': `
                        <div class="modal-info">
                            <h3>Космический отражатель мыслей</h3>
                            <p>В этой игре вы управляете космическим кораблем, который должен перехватывать негативные мысли и пропускать позитивные.</p>
                            <p><strong>Как играть:</strong></p>
                            <ul>
                                <li>Управляйте кораблем с помощью мыши</li>
                                <li>Перехватывайте красные негативные мысли</li>
                                <li>Пропускайте зеленые позитивные мысли</li>
                                <li>Набирайте очки, правильно сортируя мысли</li>
                            </ul>
                            <p>Игра длится 60 секунд. По окончании вы увидите статистику и рекомендации.</p>
                        </div>
                    `,
            'breathing-game-info': `
                        <div class="modal-info">
                            <h3>Дыхательное упражнение</h3>
                            <p>Эта техника дыхания 4-7-8 помогает снизить стресс и тревожность, способствует расслаблению.</p>
                            <p><strong>Как выполнять:</strong></p>
                            <ul>
                                <li>Сядьте в удобной позе</li>
                                <li>Вдыхайте через нос 4 секунды</li>
                                <li>Задержите дыхание на 7 секунд</li>
                                <li>Медленно выдыхайте через рот 8 секунд</li>
                            </ul>
                            <p>Повторите цикл 3-5 раз для достижения наилучшего эффекта расслабления.</p>
                        </div>
                    `
        };

        // Закрытие модального окна
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });
    }

    initMusic() {
        this.audio = document.getElementById('background-music');
        this.audio.volume = 0.3;

        // Попытка воспроизвести музыку при взаимодействии с пользователем
        document.addEventListener('click', () => {
            if (this.isMusicPlaying && this.audio.paused) {
                this.audio.play().catch(e => console.log("Автовоспроизведение заблокировано"));
            }
        }, { once: true });
    }

    showModal(modalId) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = this.modals[modalId];
        modalOverlay.classList.remove('hidden');

        // Анимация появления
        gsap.fromTo(modalOverlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );

        gsap.fromTo(modalOverlay.querySelector('.modal-content'),
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }

    hideModal() {
        const modalOverlay = document.getElementById('modal-overlay');

        gsap.to(modalOverlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modalOverlay.classList.add('hidden');
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Ошибка при включении полноэкранного режима: ${err.message}`);
            });
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                this.isFullscreen = false;
            }
        }
    }

    toggleMusic() {
        const musicBtn = document.getElementById('music-toggle');

        if (this.isMusicPlaying) {
            this.audio.pause();
            musicBtn.textContent = '♪';
            musicBtn.style.opacity = '0.7';
        } else {
            this.audio.play().catch(e => console.log("Не удалось воспроизвести музыку"));
            musicBtn.textContent = '♫';
            musicBtn.style.opacity = '1';
        }

        this.isMusicPlaying = !this.isMusicPlaying;
    }

    showScreen(screenId) {
        const results = document.getElementById('game-results');
        // Скрыть текущий экран
        document.getElementById(this.currentScreen).classList.remove('active');
        document.getElementById(this.currentScreen).classList.add('hidden');

        // Показать выбранный экран
        document.getElementById(screenId).classList.remove('hidden');
        setTimeout(() => {
            document.getElementById(screenId).classList.add('active');
        }, 50);

        this.currentScreen = screenId;

        // Останавливаем игры при переходе в главное меню
        if (screenId === 'main-menu') {
            if (spaceGame.active) spaceGame.stop(false);
            if (breathingGame.active) breathingGame.pause();

            // Восстанавливаем курсор
            document.body.classList.remove('hide-cursor');
        }

        // Сброс дыхательной игры при переходе на ее экран
        if (screenId === 'breathing-game') {
            breathingGame.reset();
        }

        // Загрузка статистики при переходе на экран статистики
        if (screenId === 'stats-screen') {
            this.loadStats();
        }
        // Показываем рекомендацию только если игра завершена естественно
        if (this.isGameCompleted && this.missedNegative >= 3) {
            document.getElementById('breathing-recommendation').classList.remove('hidden');
        } else {
            document.getElementById('breathing-recommendation').classList.add('hidden');
        }

        results.classList.remove('hidden');

        // Анимация появления результатов
        gsap.fromTo('.result-section',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }
        );
    }

    loadStats() {
        const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');

        // Общая статистика
        document.getElementById('total-sessions').textContent = sessions.length;

        const totalPositive = sessions.reduce((sum, session) => sum + (session.positiveThoughts || 0), 0);
        const totalNegative = sessions.reduce((sum, session) => sum + (session.negativeThoughts || 0), 0);
        const totalMissed = sessions.reduce((sum, session) => sum + (session.missedNegative || 0), 0);

        document.getElementById('total-positive').textContent = totalPositive;
        document.getElementById('total-negative').textContent = totalNegative;
        document.getElementById('total-missed').textContent = totalMissed;

        // Эффективность
        const totalThoughts = totalPositive + totalNegative + totalMissed;
        const efficiency = totalThoughts > 0 ? Math.round((totalPositive + totalNegative) / totalThoughts * 100) : 0;
        document.getElementById('efficiency-bar').style.width = `${efficiency}%`;

        // Настроение
        const avgMoodBefore = sessions.length > 0 ?
            sessions.reduce((sum, session) => sum + (session.initialMood || 2), 0) / sessions.length : 2;
        const avgMoodAfter = sessions.length > 0 ?
            sessions.reduce((sum, session) => sum + (session.finalMood || 2), 0) / sessions.length : 2;

        document.getElementById('mood-before-bar').style.width = `${(avgMoodBefore / 3 * 100)}%`;
        document.getElementById('mood-after-bar').style.width = `${(avgMoodAfter / 3 * 100)}%`;

        // Список сессий
        const sessionsContainer = document.getElementById('sessions-container');
        sessionsContainer.innerHTML = '';

        if (sessions.length === 0) {
            sessionsContainer.innerHTML = '<p class="empty-message">У вас пока нет завершенных сессий.</p>';
        } else {
            sessions.slice().reverse().forEach((session, index) => {
                const sessionEl = document.createElement('div');
                sessionEl.className = 'session-item';
                sessionEl.innerHTML = `
                <button class="delete-session btn btn-warning" data-index="${sessions.length - 1 - index}">×</button>
                <p><strong>${new Date(session.date).toLocaleString()}</strong></p>
                <p>Длительность: ${session.duration} сек</p>
                <p>Настроение: ${session.initialMood} → ${session.finalMood}</p>
                <p>Мысли: +${session.positiveThoughts} / -${session.negativeThoughts}</p>
                ${session.nextAction ? `<p>Следующее действие: ${session.nextAction}</p>` : ''}
            `;
                sessionsContainer.appendChild(sessionEl);
            });

            // Добавляем обработчики для кнопок удаления
            sessionsContainer.querySelectorAll('.delete-session').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sessionIndex = parseInt(btn.dataset.index);
                    this.deleteSession(sessionIndex);
                });
            });
        }
    }

    exportData() {
        const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        const csvContent = this.convertToCSV(sessions);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'mindspace_sessions.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(objArray) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = 'Дата,Длительность,Начальное настроение,Конечное настроение,Позитивные мысли,Негативные мысли,Пропущенные негативные,Следующее действие\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            line += `"${array[i].date}",`;
            line += `"${array[i].duration}",`;
            line += `"${array[i].initialMood}",`;
            line += `"${array[i].finalMood}",`;
            line += `"${array[i].positiveThoughts || 0}",`;
            line += `"${array[i].negativeThoughts || 0}",`;
            line += `"${array[i].missedNegative || 0}",`;
            line += `"${array[i].nextAction || ''}"\r\n`;

            str += line;
        }

        return str;
    }
}

// Класс для космической игры
class SpaceGame {
    constructor() {
        this.container = document.getElementById('space-game');
        this.active = false;
        this.thoughts = [];
        this.parallaxLayers = [];

        this.negativeThoughts = 0;
        this.positiveThoughts = 0;
        this.missedNegative = 0;
        this.missedPositive = 0;
        this.timeLeft = 60;

        this.missedNegativeThoughts = [];
        this.caughtPositiveThoughts = [];

        this.sessionStartTime = null;
        this.initialMood = null;
        this.finalMood = null;

        this.isGameCompleted = false;

        this.negativeThoughtsList = [
            "У меня не получится", "Я неудачник", "Это слишком сложно",
            "Я устал", "Это бессмысленно", "Я не справлюсь",
            "Всё плохо", "Нет времени", "Я не достаточно хорош", "Это не для меня"
        ];

        this.positiveThoughtsList = [
            "Я могу это сделать", "У меня получится", "Я справлюсь",
            "Всё будет хорошо", "Я сделаю перерыв", "Я научусь",
            "Я становлюсь лучше", "Я доволен прогрессом", "Я сосредоточен", "Я благодарен"
        ];

        this.init();
    }

    init() {
        // Создаем игрока
        this.player = document.createElement('div');
        this.player.className = 'player';
        this.player.style.display = 'none';
        this.container.appendChild(this.player);

        // Создаем космический фон с параллакс-эффектом
        this.createParallaxBackground();

        // Обработчик движения мыши
        this.container.addEventListener('mousemove', (e) => {
            if (!this.active) return;

            this.player.style.left = `${e.clientX}px`;
            this.player.style.top = `${e.clientY}px`;

            // Эффект наклона корабля
            const tilt = (e.clientX / window.innerWidth - 0.5) * 20;
            this.player.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;

            // Параллакс-эффект для фона
            this.moveParallaxLayers(e);
        });
    }


    createParallaxBackground() {
        const background = document.getElementById('space-background');
        // Уменьшаем количество элементов в режиме низкой детализации
        const layerCount = gameCenter.detailManager.isLowDetail ? 1 : 2;
        const starCount = gameCenter.detailManager.isLowDetail ? 25 : 50;

        // Создаем слои параллакса
        const layers = [
            { depth: 0.05, starCount: 50, starSize: 1 },
            { depth: 0.1, starCount: 100, starSize: 1.5 }
        ];

        layers.forEach(layerInfo => {
            const layer = document.createElement('div');
            layer.className = 'parallax-layer';
            layer.dataset.depth = layerInfo.depth;

            // Добавляем звезды в слой
            for (let i = 0; i < layerInfo.starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = `${layerInfo.starSize + Math.random() * 2}px`;
                star.style.height = star.style.width;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.opacity = 0.5 + Math.random() * 0.5;
                star.style.animationDelay = `${Math.random() * 5}s`;

                // Добавляем цветные звезды
                if (Math.random() > 0.7) {
                    const colors = ['#4fa0ff', '#ff4b2b', '#a8e063'];
                    star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    star.style.boxShadow = `0 0 ${2 + Math.random() * 4}px ${star.style.backgroundColor}`;
                }

                layer.appendChild(star);
            }

            background.appendChild(layer);
            this.parallaxLayers.push(layer);
        });

        // Создаем планеты
        for (let i = 0; i < 2; i++) {
            const planet = document.createElement('div');
            planet.className = 'planet';

            const size = 50 + Math.random() * 80;
            planet.style.width = `${size}px`;
            planet.style.height = `${size}px`;
            planet.style.left = `${10 + Math.random() * 80}%`;
            planet.style.top = `${10 + Math.random() * 80}%`;
            planet.style.background = [
                'linear-gradient(135deg, #8a2387, #e94057, #f27121)',
                'linear-gradient(135deg, #0072ff, #00c6ff)'
            ][i % 2];
            planet.style.animationDelay = `${Math.random() * 10}s`;

            background.appendChild(planet);
            this.parallaxLayers.push(planet);
        }
    }

    moveParallaxLayers(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        this.parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth || 0.1);
            let moveX = x * depth * 30;
            let moveY = y * depth * 30;

            // Инверсивное движение для планет
            if (layer.classList.contains('planet')) {
                moveX = -moveX * 1.5;
                moveY = -moveY * 1.5;
            }

            gsap.to(layer, {
                x: moveX,
                y: moveY,
                duration: 1.5
            });
        });
    }

    start() {
        if (this.active) return;

        // Сбрасываем состояние игры
        this.isGameCompleted = false;
        document.getElementById('game-results').classList.add('hidden');

        // Показываем вопросы рефлексии перед началом
        this.showReflectionQuestions();
    }

    startGameplay() {
        this.active = true;
        this.negativeThoughts = 0;
        this.positiveThoughts = 0;
        this.missedNegative = 0;
        this.missedPositive = 0;
        this.timeLeft = 60;
        this.missedNegativeThoughts = [];
        this.caughtPositiveThoughts = [];

        // Прячем курсор
        document.body.classList.add('hide-cursor');

        // Сбрасываем UI
        document.getElementById('game-results').classList.add('hidden');
        document.getElementById('timer').textContent = '01:00';
        document.getElementById('score').textContent = 'Негативные: 0 | Позитивные: 0';

        // Скрываем сообщения о пустых списках
        document.querySelectorAll('.empty-message').forEach(msg => {
            msg.style.display = 'none';
        });

        // Очищаем мысли
        this.thoughts.forEach(thought => {
            if (thought.element && thought.element.parentNode) {
                thought.element.parentNode.removeChild(thought.element);
            }
        });
        this.thoughts = [];

        // Показываем игрока
        this.player.style.display = 'block';
        this.player.style.left = '50%';
        this.player.style.top = '80%';

        // Запускаем таймер
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                this.stop(true); // true означает естественное завершение
            }
        }, 1000);

        // Запускаем генерацию мыслей
        this.thoughtInterval = setInterval(() => this.generateThought(), 1200);

        // Запускаем игровой цикл
        this.gameLoop();
    }


    stop(isNaturalEnd = false) {
        if (!this.active) return;

        this.active = false;
        this.isGameCompleted = isNaturalEnd; // Устанавливаем флаг завершения

        clearInterval(this.timerInterval);
        clearInterval(this.thoughtInterval);
        cancelAnimationFrame(this.animationFrame);

        // Восстанавливаем курсор
        document.body.classList.remove('hide-cursor');

        // Останавливаем все мысли
        this.thoughts.forEach(thought => {
            if (thought.element && thought.element.parentNode) {
                thought.element.parentNode.removeChild(thought.element);
            }
        });
        this.thoughts = [];

        // Прячем игрока
        this.player.style.display = 'none';

        // Показываем рефлексию только если игра завершена естественным образом
        if (isNaturalEnd) {
            this.showPostGameReflection();
        } else {
            // Если игра прервана, сразу показываем результаты
            this.showResults();
        }
    }

    gameLoop() {
        if (!this.active) return;

        this.updateThoughts();
        this.checkCollisions();

        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }

    generateThought() {
        if (!this.active) return;
        // Увеличиваем интервал в режиме низкой детализации
        const interval = gameCenter.detailManager.isLowDetail ? 2000 : 1200;
        const isNegative = Math.random() > 0.5;
        const thoughts = isNegative ? this.negativeThoughtsList : this.positiveThoughtsList;
        const text = thoughts[Math.floor(Math.random() * thoughts.length)];

        const thought = document.createElement('div');
        thought.className = 'thought';
        thought.textContent = text;
        thought.style.left = `${Math.random() * (window.innerWidth - 120)}px`;
        thought.style.top = '-50px';

        this.container.appendChild(thought);

        // Сохраняем данные мысли
        this.thoughts.push({
            element: thought,
            text: text,
            isNegative: isNegative,
            x: parseFloat(thought.style.left),
            y: -50,
            speed: 1 + Math.random() * 2,
            caught: false,
            colorIntensity: 0
        });
    }

    updateThoughts() {
        for (let i = this.thoughts.length - 1; i >= 0; i--) {
            const thought = this.thoughts[i];

            if (thought.caught) {
                thought.y -= 5;
            } else {
                thought.y += thought.speed;

                // Изменяем цвет по мере приближения к низу
                thought.colorIntensity = Math.min(1, thought.y / window.innerHeight);

                if (thought.colorIntensity > 0.7) {
                    if (thought.isNegative) {
                        thought.element.classList.add('negative');
                    } else {
                        thought.element.classList.add('positive');
                    }
                }
            }

            thought.element.style.top = `${thought.y}px`;

            // Проверяем выход за границы
            if (thought.y > window.innerHeight || thought.y < -100) {
                if (!thought.caught) {
                    if (thought.isNegative) {
                        this.missedNegative++;
                        this.missedNegativeThoughts.push(thought.text);
                    } else {
                        this.missedPositive++;
                    }

                    this.updateScore();
                }

                if (thought.element.parentNode) {
                    thought.element.parentNode.removeChild(thought.element);
                }
                this.thoughts.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        const playerRect = this.player.getBoundingClientRect();

        this.thoughts.forEach(thought => {
            if (thought.caught) return;

            const thoughtRect = thought.element.getBoundingClientRect();

            if (playerRect.left < thoughtRect.right &&
                playerRect.right > thoughtRect.left &&
                playerRect.top < thoughtRect.bottom &&
                playerRect.bottom > thoughtRect.top) {

                thought.caught = true;

                // Добавляем класс в зависимости от типа мысли
                if (thought.isNegative) {
                    thought.element.classList.add('negative');
                    this.negativeThoughts++;

                    // Анимация счетчика
                    this.animateScore('negative');
                } else {
                    thought.element.classList.add('positive');
                    this.positiveThoughts++;
                    this.caughtPositiveThoughts.push(thought.text);

                    // Анимация счетчика
                    this.animateScore('positive');
                }

                // Анимация захвата
                gsap.to(thought.element, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                    onComplete: () => {
                        gsap.to(thought.element, {
                            y: -100,
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                if (thought.element.parentNode) {
                                    thought.element.parentNode.removeChild(thought.element);
                                }
                            }
                        });
                    }
                });

                this.updateScore();
            }
        });
    }

    animateScore(type) {
        const scoreElement = document.getElementById('score');
        scoreElement.classList.add('score-bounce');

        // Изменяем цвет в зависимости от типа
        if (type === 'negative') {
            scoreElement.style.color = '#ff4b2b';
        } else {
            scoreElement.style.color = '#a8e063';
        }

        setTimeout(() => {
            scoreElement.classList.remove('score-bounce');
            scoreElement.style.color = 'white';
        }, 500);
    }

    updateScore() {
        document.getElementById('score').textContent =
            `Негативные: ${this.negativeThoughts} | Позитивные: ${this.positiveThoughts}`;
    }

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Меняем цвет таймера ближе к концу
        if (this.timeLeft < 10) {
            document.getElementById('timer').style.color = '#ff4b2b';
            gsap.to('#timer', {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        } else {
            document.getElementById('timer').style.color = 'white';
            gsap.to('#timer', {
                scale: 1,
                duration: 0.3
            });
        }
    }

    showReflectionQuestions() {
        const reflectionHTML = `
                    <div class="reflection-section">
                        <h3>Перед началом игры</h3>
                        <p>Как вы себя чувствуете?</p>
                        <div class="reflection-options">
                            <button class="reflection-btn" data-value="1">😔 Напряжен</button>
                            <button class="reflection-btn" data-value="2">😐 Нейтрально</button>
                            <button class="reflection-btn" data-value="3">😊 Спокоен</button>
                        </div>
                    </div>
                `;

        const container = document.getElementById('reflection-container');
        container.innerHTML = reflectionHTML;
        container.classList.remove('hidden');

        this.sessionStartTime = Date.now();
        this.initialMood = null;

        document.querySelectorAll('.reflection-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.initialMood = parseInt(e.target.dataset.value);
                container.classList.add('hidden');
                this.startGameplay();
            });
        });
    }

    showPostGameReflection() {
        const reflectionHTML = `
                <div class="reflection-section">
                    <h3>После игры</h3>
                    <p>Как вы себя чувствуете теперь?</p>
                    <div class="reflection-options">
                        <button class="reflection-btn" data-value="1">😔 Напряжен</button>
                        <button class="reflection-btn" data-value="2">😐 Нейтрально</button>
                        <button class="reflection-btn" data-value="3">😊 Спокоен</button>
                    </div>
                    <p>Что будете делать дальше?</p>
                    <input type="text" id="next-action-input" placeholder="Мой следующий шаг...">
                    <button id="save-reflection" class="btn">Сохранить и продолжить</button>
                </div>
            `;

        const container = document.getElementById('reflection-container');
        container.innerHTML = reflectionHTML;
        container.classList.remove('hidden');

        document.getElementById('save-reflection').addEventListener('click', () => {
            const selectedMood = document.querySelector('.reflection-btn.active');
            this.finalMood = selectedMood ? parseInt(selectedMood.dataset.value) : 2;
            this.saveSessionData();
            container.classList.add('hidden');
            this.showResults();
        });

        // Добавляем обработчики для кнопок настроения
        document.querySelectorAll('.reflection-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.reflection-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    saveSessionData() {
        const sessionData = {
            date: new Date().toISOString(),
            duration: Math.round((Date.now() - this.sessionStartTime) / 1000),
            initialMood: this.initialMood,
            finalMood: this.finalMood,
            negativeThoughts: this.negativeThoughts,
            positiveThoughts: this.positiveThoughts,
            missedNegative: this.missedNegative,
            nextAction: document.getElementById('next-action-input').value
        };

        // Сохраняем в localStorage
        const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('gameSessions', JSON.stringify(sessions));
    }

    showResults() {
        const results = document.getElementById('game-results');

        document.getElementById('total-score').textContent = this.negativeThoughts + this.positiveThoughts;

        // Показываем пропущенные негативные мысли
        const missedList = document.getElementById('missed-negative-list');
        missedList.innerHTML = '';

        if (this.missedNegativeThoughts.length === 0) {
            missedList.innerHTML = '<p class="empty-message">Вы не пропустили ни одной негативной мысли! Отличный результат!</p>';
        } else {
            this.missedNegativeThoughts.forEach(thought => {
                const thoughtItem = document.createElement('div');
                thoughtItem.className = 'thought-item negative';
                thoughtItem.textContent = thought;
                missedList.appendChild(thoughtItem);
            });
        }

        // Показываем перехваченные позитивные мысли с улучшенной визуализацией
        const caughtList = document.getElementById('caught-positive-list');
        caughtList.innerHTML = '';

        if (this.caughtPositiveThoughts.length === 0) {
            caughtList.innerHTML = '<p class="empty-message">Вы не перехватили ни одной позитивной мысли.</p>';
        } else {
            const positiveTitle = document.createElement('h3');
            positiveTitle.textContent = `Только поглядите! Вы перехватили ${this.caughtPositiveThoughts.length} позитивных мыслей!`;
            positiveTitle.style.color = '#a8e063';
            positiveTitle.style.marginBottom = '20px';
            caughtList.appendChild(positiveTitle);

            this.caughtPositiveThoughts.forEach(thought => {
                const thoughtItem = document.createElement('div');
                thoughtItem.className = 'thought-item positive';
                thoughtItem.innerHTML = `
                            <div class="thought-bubble">
                                <span class="thought-icon">💭</span>
                                <p>${thought}</p>
                            </div>
                        `;
                caughtList.appendChild(thoughtItem);
            });
        }

        // Показываем рекомендацию, если пропущено много негативных мыслей
        if (this.missedNegative >= 3) {
            document.getElementById('breathing-recommendation').classList.remove('hidden');
        } else {
            document.getElementById('breathing-recommendation').classList.add('hidden');
        }

        results.classList.remove('hidden');

        // Анимация появления результатов
        gsap.fromTo('.result-section',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }
        );
    }
}

// Класс для дыхательного упражнения
class BreathingGame {
    constructor() {
        this.active = false;
        this.paused = false;
        this.phase = null;
        this.cycleCount = 0;
        this.timeouts = [];
        this.startTime = 0;
        this.phaseTime = 0;
        this.animationFrame = null;

        this.phases = {
            inhale: { duration: 4000, text: "Вдыхайте 4 секунды", indicator: "4" },
            hold: { duration: 7000, text: "Задержите дыхание на 7 секунд", indicator: "7" },
            exhale: { duration: 8000, text: "Выдыхайте 8 секунд", indicator: "8" }
        };

        this.init();
    }

    init() {
        // Создаем космический фон
        this.createBreathingBackground();

        // Добавляем элемент для свечения
        const glow = document.createElement('div');
        glow.className = 'breath-glow';
        document.getElementById('breath-circle').appendChild(glow);
    }

    createBreathingBackground() {
        if (gameCenter.detailManager.isLowDetail) {
            return; // Не создаем фон в режиме низкой детализации
        }
        const background = document.getElementById('breathing-background');

        // Создаем звезды для фона дыхательного упражнения
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const size = 1 + Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = 0.5 + Math.random() * 0.5;
            star.style.animationDelay = `${Math.random() * 5}s`;

            background.appendChild(star);
        }
    }

    start() {
        if (this.active && !this.paused) return;

        if (this.paused) {
            // Продолжаем с текущей фазы
            this.paused = false;
            document.getElementById('pause-breathing').textContent = 'Пауза';
            this.nextPhase(this.phase);
            return;
        }

        this.active = true;
        this.paused = false;
        this.cycleCount = 0;
        this.startTime = Date.now();

        document.getElementById('breath-circle').classList.add('breathing');
        document.getElementById('start-breathing').style.display = 'none';
        document.getElementById('pause-breathing').style.display = 'inline-block';
        document.getElementById('pause-breathing').textContent = 'Пауза';

        this.nextPhase('inhale');
    }

    togglePause() {
        if (!this.active) return;

        if (this.paused) {
            // Продолжаем
            this.paused = false;
            document.getElementById('pause-breathing').textContent = 'Пауза';
            this.nextPhase(this.phase);
        } else {
            // Ставим на паузу
            this.paused = true;
            document.getElementById('pause-breathing').textContent = 'Продолжить';
            this.pause();
        }
    }

    pause() {
        cancelAnimationFrame(this.animationFrame);

        // Очищаем все таймеры
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];

        document.getElementById('breath-circle').classList.remove('breathing');
        document.getElementById('breath-text').textContent = 'Упражнение на паузе';
    }

    reset() {
        this.pause();
        this.active = false;
        this.paused = false;

        document.getElementById('breath-circle').style.transform = 'scale(1)';
        document.getElementById('breath-circle').style.backgroundColor = '#1a1a2e';
        document.getElementById('breath-indicator').textContent = '4';
        document.getElementById('breath-text').textContent = 'Нажмите "Начать" для начала упражнения';
        document.getElementById('start-breathing').style.display = 'inline-block';
        document.getElementById('pause-breathing').style.display = 'none';
    }

    nextPhase(phase) {
        if (!this.active || this.paused) return;

        this.phase = phase;
        this.phaseTime = Date.now();
        const phaseInfo = this.phases[phase];

        document.getElementById('breath-indicator').textContent = phaseInfo.indicator;
        document.getElementById('breath-text').textContent = phaseInfo.text;
        document.getElementById('breath-text').classList.add('breath-text-animate');

        setTimeout(() => {
            document.getElementById('breath-text').classList.remove('breath-text-animate');
        }, 1000);

        // Анимация круга
        switch (phase) {
            case 'inhale':
                gsap.to('#breath-circle', {
                    scale: 1.3,
                    backgroundColor: '#4fa0ff',
                    duration: phaseInfo.duration / 1000,
                    ease: "power1.inOut"
                });
                break;

            case 'exhale':
                gsap.to('#breath-circle', {
                    scale: 1,
                    backgroundColor: '#1a1a2e',
                    duration: phaseInfo.duration / 1000,
                    ease: "power1.inOut"
                });
                break;
        }

        // Запускаем анимацию фазы
        this.animationFrame = requestAnimationFrame(() => this.animatePhase());

        // Устанавливаем таймер для перехода к следующей фазе
        this.timeouts.push(setTimeout(() => {
            if (!this.active || this.paused) return;

            if (phase === 'exhale') {
                this.cycleCount++;

                if (this.cycleCount < 4) {
                    this.nextPhase('inhale');
                } else {
                    this.active = false;
                    document.getElementById('breath-text').textContent = 'Упражнение завершено!';
                    document.getElementById('breath-circle').classList.remove('breathing');
                    document.getElementById('start-breathing').style.display = 'inline-block';
                    document.getElementById('pause-breathing').style.display = 'none';
                }
            } else {
                const nextPhase = phase === 'inhale' ? 'hold' : 'exhale';
                this.nextPhase(nextPhase);
            }
        }, phaseInfo.duration));
    }

    animatePhase() {
        if (!this.active || this.paused) return;

        const phaseInfo = this.phases[this.phase];
        const elapsed = Date.now() - this.phaseTime;
        const progress = Math.min(elapsed / phaseInfo.duration, 1);

        // Обновляем индикатор для фаз с задержкой дыхания
        if (this.phase === 'hold') {
            const remaining = Math.ceil((phaseInfo.duration - elapsed) / 1000);
            if (remaining >= 0) {
                document.getElementById('breath-indicator').textContent = remaining;
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.animatePhase());
    }
}

// Инициализация при загрузке страницы
let gameCenter, spaceGame, breathingGame;

document.addEventListener('DOMContentLoaded', () => {
    gameCenter = new GameCenter();
    spaceGame = new SpaceGame();
    breathingGame = new BreathingGame();
    // Обработка ESC для всех модальных окон
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dialog = document.getElementById('confirmation-dialog');
            if (dialog && dialog.open) {
                e.preventDefault();
                dialog.close();

                // Вызываем cancel callback если он есть
                const cancelBtn = document.getElementById('dialog-cancel');
                if (cancelBtn && cancelBtn.onclick) {
                    cancelBtn.onclick();
                }
            }
        }
    });
});

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    // Предотвращаем появление горизонтального скролла
    document.body.style.overflowX = 'hidden';
});

// Обработчик полноэкранного режима
document.addEventListener('fullscreenchange', () => {
    gameCenter.isFullscreen = !!document.fullscreenElement;
});