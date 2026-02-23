document.querySelectorAll('.mask').forEach(element => {
    element.addEventListener('click', (e) => {
        e.target.classList.toggle('visible');
    });
});

function inferCodeLanguage(title, codeText) {
    const normalizedTitle = (title ?? '').toLowerCase();
    const trimmed = (codeText ?? '').trim();
    const upper = trimmed.toUpperCase();

    if (normalizedTitle.includes('.ts') || normalizedTitle.includes('typescript')) {
        return 'typescript';
    }

    if (normalizedTitle.includes('sql') || normalizedTitle.includes('実行計画')) {
        return 'sql';
    }

    if (
        normalizedTitle.includes('実行') ||
        normalizedTitle.includes('コマンド') ||
        normalizedTitle.includes('インストール') ||
        normalizedTitle.includes('マイグレーション')
    ) {
        return 'bash';
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return 'json';
    }

    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|EXPLAIN|TRUNCATE)\b/.test(upper)) {
        return 'sql';
    }

    if (/^(npm|npx|pnpm|yarn|docker)\b/i.test(trimmed)) {
        return 'bash';
    }

    if (/(^|\n)\s*(import|export|async\s+function|const|let|await)\b/.test(trimmed)) {
        return 'typescript';
    }

    return 'plaintext';
}

function applySyntaxHighlight() {
    if (!window.hljs) return;

    document.querySelectorAll('.code-card').forEach(card => {
        const titleElement = card.querySelector('.code-title');
        const codeElement = card.querySelector('.code-block');
        if (!codeElement) return;

        const language = inferCodeLanguage(titleElement?.textContent ?? '', codeElement.textContent ?? '');
        codeElement.classList.add(`language-${language}`);
        window.hljs.highlightElement(codeElement);
    });
}

applySyntaxHighlight();

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