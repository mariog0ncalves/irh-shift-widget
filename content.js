(function() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    let notificationSent = false;
    let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function getTheme() {
        return isDarkMode ? {
            panelBg: 'rgba(30,30,30,0.95)',
            text: '#fff',
            label: '#ccc',
            track: '#333',
            border: '#333',
            closeBtnColor: '#888',
            shadow: '0 8px 32px rgba(0,0,0,0.45)',
            toggleIcon: '☀️'
        } : {
            panelBg: 'rgba(255,255,255,0.95)',
            text: '#222',
            label: '#555',
            track: '#ddd',
            border: '#ddd',
            closeBtnColor: '#999',
            shadow: '0 8px 32px rgba(0,0,0,0.15)',
            toggleIcon: '🌙'
        };
    }

    const listagemPicagens = document.getElementById('listagem-picagens');
    if (!listagemPicagens) {
        console.error('Elemento com ID "listagem-picagens" não encontrado.');
        return;
    }

    /* Remove existing panel if re-run */
    const existing = document.getElementById('shift-timer-panel');
    if (existing) existing.remove();

    const rows = Array.from(listagemPicagens.querySelectorAll('tbody tr')).reverse();
    const totalExpectedSeconds = 7 * 3600 + 40 * 60;

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [
            h.toString().padStart(2, '0'),
            m.toString().padStart(2, '0'),
            s.toString().padStart(2, '0')
        ].join(':');
    };

    function calculateWorkedSeconds() {
        let totalSeconds = 0;
        let entradaSeconds = 0;
        const interpretedTypes = [];

        rows.forEach((row) => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 4) return;

            const timeString = tds[2].textContent.trim();
            let type = tds[3].textContent.trim();
            if (!timeString) return;

            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const currentSeconds = hours * 3600 + minutes * 60 + seconds;

            if (type === '-') {
                for (let i = interpretedTypes.length - 1; i >= 0; i--) {
                    const prevType = interpretedTypes[i];
                    if (prevType === 'Entrada') { type = 'Saída'; break; }
                    else if (prevType === 'Saída') { type = 'Entrada'; break; }
                }
                if (type === '-') type = 'Entrada';
            }

            interpretedTypes.push(type);

            if (type === 'Entrada') {
                entradaSeconds = currentSeconds;
            } else if (type === 'Saída' && entradaSeconds > 0) {
                totalSeconds += currentSeconds - entradaSeconds;
                entradaSeconds = 0;
            }
        });

        if (entradaSeconds > 0) {
            const now = new Date();
            totalSeconds += (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) - entradaSeconds;
        }

        return totalSeconds;
    }

    function buildStatusHTML(remainingSeconds) {
        const now = new Date();
        const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const t = getTheme();

        if (remainingSeconds > 0) {
            const estimatedExitTimeString = formatTime((currentTimeInSeconds + remainingSeconds) % 86400);
            return {
                accentColor: '#ff9800',
                html:
                    '<div style="margin-bottom:8px;color:' + t.label + ';font-size:12px;">Tempo restante</div>' +
                    '<div style="font-size:22px;font-weight:bold;color:#ff9800;">' + formatTime(remainingSeconds) + '</div>' +
                    '<div style="margin-top:10px;color:' + t.label + ';font-size:12px;">Horário estimado saída</div>' +
                    '<div style="font-size:18px;font-weight:bold;color:' + t.text + ';">' + estimatedExitTimeString + '</div>'
            };
        }

        if (!notificationSent && "Notification" in window && Notification.permission === "granted") {
            const n = new Notification("Turno completo", {
                body: "Já completaste as 7h40 de trabalho.",
                icon: "https://irh.pt/media/favicon.png"
            });
            n.onclick = () => window.focus();
        }
        notificationSent = true;

        return {
            accentColor: '#4caf50',
            html:
                '<div style="margin-bottom:8px;color:' + t.label + ';font-size:12px;">Tempo excedido</div>' +
                '<div style="font-size:22px;font-weight:bold;color:#4caf50;">+' + formatTime(Math.abs(remainingSeconds)) + '</div>'
        };
    }

    function renderPanel(panel) {
        const totalSeconds = calculateWorkedSeconds();
        const remainingSeconds = totalExpectedSeconds - totalSeconds;
        const { accentColor, html: statusHTML } = buildStatusHTML(remainingSeconds);
        const progressPercent = Math.min(100, Math.round(totalSeconds / totalExpectedSeconds * 100));
        const t = getTheme();

        panel.style.background = t.panelBg;
        panel.style.boxShadow = t.shadow;
        panel.style.color = t.text;

        panel.innerHTML =
            '<div id="stp-header" style="background:#009b85;padding:8px 10px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin:-16px -16px 12px -16px;border-radius:12px 12px 0 0;">' +
                '<span style="font-size:13px;font-weight:bold;color:#fff;letter-spacing:0.5px;">🕐 Turno</span>' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<span id="stp-toggle-theme" style="cursor:pointer;font-size:14px;line-height:1;" title="Alternar tema">' + t.toggleIcon + '</span>' +
                    '<span id="stp-close" style="cursor:pointer;font-size:14px;line-height:1;" title="Fechar">❌</span>' +
                '</div>' +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
                '<div style="color:' + t.label + ';font-size:12px;margin-bottom:4px;">Horas cumpridas</div>' +
                '<div style="font-size:26px;font-weight:bold;color:' + t.text + ';">' + formatTime(totalSeconds) + '</div>' +
                '<div style="margin-top:4px;height:4px;border-radius:2px;background:' + t.track + ';overflow:hidden;">' +
                    '<div style="height:100%;width:' + progressPercent + '%;background:' + accentColor + ';border-radius:2px;"></div>' +
                '</div>' +
            '</div>' +
            '<hr style="border:none;border-top:1px solid ' + t.border + ';margin:10px 0;">' +
            statusHTML;

        document.getElementById('stp-close').addEventListener('click', function() {
            clearInterval(panel._refreshTimer);
            panel.remove();
        });

        document.getElementById('stp-toggle-theme').addEventListener('click', function() {
            isDarkMode = !isDarkMode;
            renderPanel(panel);
        });
    }

    /* Build the panel */
    const panel = document.createElement('div');
    panel.id = 'shift-timer-panel';
    panel.style.cssText =
        'position:fixed;bottom:16px;right:16px;z-index:2147483647;' +
        'width:240px;padding:16px;border-radius:12px;' +
        'backdrop-filter:blur(8px);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'line-height:1.4;';

    document.body.appendChild(panel);
    renderPanel(panel);

    /* Auto-refresh every second */
    panel._refreshTimer = setInterval(function() {
        if (!document.getElementById('shift-timer-panel')) {
            clearInterval(panel._refreshTimer);
            return;
        }
        renderPanel(panel);
    }, 1000);
})();
