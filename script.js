document.querySelectorAll('.mask').forEach(element => {
    element.addEventListener('click', (e) => {
        e.target.classList.toggle('visible');
    });
});

document.querySelectorAll('.copy-btn').forEach(element => {
    element.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        if (button.disabled) return;

        const card = button.closest('.code-card');
        const code = card?.querySelector('.code-block')?.textContent ?? '';
        await navigator.clipboard.writeText(code);

        if (!button.dataset.originalLabel) {
            button.dataset.originalLabel = button.textContent;
        }

        button.disabled = true;
        button.textContent = 'コピーしました';
        button.classList.add('copied');

        clearTimeout(button._copyTimeout);
        button._copyTimeout = setTimeout(() => {
            button.textContent = button.dataset.originalLabel;
            button.disabled = false;
            button.classList.remove('copied');
        }, 1500);
    });
});