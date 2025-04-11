document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');

        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Закрываем все другие
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });

            // Переключаем текущее
            dropdown.classList.toggle('active');
        });
    });

    // Клик вне меню — закрытие всех
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Бургер-меню (если есть)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('open');
        });
    }
});
// Анимированное открытие/закрытие подменю
function toggleDropdown(dropdown, open) {
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!menu) return;

    if (open) {
        menu.style.display = 'block';
        menu.style.height = '0px';
        menu.style.opacity = '0';
        menu.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            menu.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            const fullHeight = menu.scrollHeight + 'px';
            menu.style.height = fullHeight;
            menu.style.opacity = '1';
        });
    } else {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;
        menu.style.transition = 'height 0.3s ease, opacity 0.3s ease';
        menu.style.height = '0px';
        menu.style.opacity = '0';

        setTimeout(() => {
            menu.style.display = 'none';
        }, 300);
    }
}