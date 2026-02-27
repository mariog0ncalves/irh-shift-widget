(function() {
    const listagemPicagens = document.getElementById('listagem-picagens');
    if (!listagemPicagens) {
        console.error('Elemento com ID "listagem-picagens" não encontrado.');
        return;
    }

    /* Remove existing panel if re-run */
    const existing = document.getElementById('shift-timer-panel');
    if (existing) existing.remove();

    const rows = Array.from(listagemPicagens.querySelectorAll('tbody tr')).reverse();
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
                if (prevType === 'Entrada') {
                    type = 'Saída';
                    break;
                } else if (prevType === 'Saída') {
                    type = 'Entrada';
                    break;
                }
            }
            if (type === '-') {
                type = 'Entrada';
            }
        }

        interpretedTypes.push(type);

        if (type === 'Entrada') {
            entradaSeconds = currentSeconds;
        } else if (type === 'Saída') {
            if (entradaSeconds > 0) {
                totalSeconds += currentSeconds - entradaSeconds;
                entradaSeconds = 0;
            }
        }
    });

    if (entradaSeconds > 0) {
        const now = new Date();
        totalSeconds += (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) - entradaSeconds;
    }

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

    const totalExpectedSeconds = 7 * 3600 + 40 * 60;
    const remainingSeconds = totalExpectedSeconds - totalSeconds;
    const now = new Date();
    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const totalTimeString = formatTime(totalSeconds);
    let statusHTML = '';
    let accentColor = '#4caf50';

    if (remainingSeconds > 0) {
        const timeLeft = formatTime(remainingSeconds);
        const estimatedExitTimeInSeconds = currentTimeInSeconds + remainingSeconds;
        const estimatedExitTimeString = formatTime(estimatedExitTimeInSeconds % 86400);
        accentColor = '#ff9800';
        statusHTML =
            '<div style="margin-bottom:8px;color:#ccc;font-size:12px;">Tempo restante</div>' +
            '<div style="font-size:22px;font-weight:bold;color:' + accentColor + ';">' + timeLeft + '</div>' +
            '<div style="margin-top:10px;color:#ccc;font-size:12px;">Horário estimado saída</div>' +
            '<div style="font-size:18px;font-weight:bold;color:#fff;">' + estimatedExitTimeString + '</div>';
    } else {
        const extraTime = formatTime(Math.abs(remainingSeconds));
        accentColor = '#4caf50';
        statusHTML =
            '<div style="margin-bottom:8px;color:#ccc;font-size:12px;">Tempo excedido</div>' +
            '<div style="font-size:22px;font-weight:bold;color:' + accentColor + ';">+' + extraTime + '</div>';
    }

    /* Build the panel */
    const panel = document.createElement('div');
    panel.id = 'shift-timer-panel';
    panel.innerHTML =
        '<div id="stp-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<span style="font-size:13px;font-weight:bold;color:#fff;letter-spacing:0.5px;">⏱ Turno</span>' +
            '<span id="stp-close" style="cursor:pointer;color:#888;font-size:18px;line-height:1;" title="Fechar">✕</span>' +
        '</div>' +
        '<div style="margin-bottom:12px;">' +
            '<div style="color:#ccc;font-size:12px;margin-bottom:4px;">Horas cumpridas</div>' +
            '<div style="font-size:26px;font-weight:bold;color:#fff;">' + totalTimeString + '</div>' +
            '<div style="margin-top:4px;height:4px;border-radius:2px;background:#333;overflow:hidden;">' +
                '<div style="height:100%;width:' + Math.min(100, Math.round(totalSeconds / totalExpectedSeconds * 100)) + '%;background:' + accentColor + ';border-radius:2px;"></div>' +
            '</div>' +
        '</div>' +
        '<hr style="border:none;border-top:1px solid #333;margin:10px 0;">' +
        statusHTML;

    panel.style.cssText =
        'position:fixed;bottom:16px;right:16px;z-index:2147483647;' +
        'width:240px;padding:16px;border-radius:12px;' +
        'background:rgba(30,30,30,0.95);backdrop-filter:blur(8px);' +
        'box-shadow:0 8px 32px rgba(0,0,0,0.45);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'color:#fff;line-height:1.4;';

    document.body.appendChild(panel);

    /* Close button */
    document.getElementById('stp-close').addEventListener('click', function() {
        panel.remove();
    });

    /* Auto-refresh every 30 seconds by re-running the bookmarklet logic */
    panel._refreshTimer = setInterval(function() {
        if (!document.getElementById('shift-timer-panel')) {
            clearInterval(panel._refreshTimer);
            return;
        }
        /* Re-calculate */
        let ts = 0, es = 0;
        const it2 = [];
        rows.forEach((row) => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 4) return;
            const timeStr = tds[2].textContent.trim();
            let tp = tds[3].textContent.trim();
            if (!timeStr) return;
            const [h, m, s] = timeStr.split(':').map(Number);
            const cs = h * 3600 + m * 60 + s;
            if (tp === '-') {
                for (let i = it2.length - 1; i >= 0; i--) {
                    if (it2[i] === 'Entrada') { tp = 'Saída'; break; }
                    else if (it2[i] === 'Saída') { tp = 'Entrada'; break; }
                }
                if (tp === '-') tp = 'Entrada';
            }
            it2.push(tp);
            if (tp === 'Entrada') es = cs;
            else if (tp === 'Saída' && es > 0) { ts += cs - es; es = 0; }
        });
        if (es > 0) {
            const n2 = new Date();
            ts += (n2.getHours() * 3600 + n2.getMinutes() * 60 + n2.getSeconds()) - es;
        }
        const rem = totalExpectedSeconds - ts;
        const n2 = new Date();
        const ct2 = n2.getHours() * 3600 + n2.getMinutes() * 60 + n2.getSeconds();
        const tts = formatTime(ts);
        let sHTML = '';
        let ac = '#4caf50';
        if (rem > 0) {
            ac = '#ff9800';
            sHTML =
                '<div style="margin-bottom:8px;color:#ccc;font-size:12px;">Tempo restante</div>' +
                '<div style="font-size:22px;font-weight:bold;color:' + ac + ';">' + formatTime(rem) + '</div>' +
                '<div style="margin-top:10px;color:#ccc;font-size:12px;">Horário estimado saída</div>' +
                '<div style="font-size:18px;font-weight:bold;color:#fff;">' + formatTime((ct2 + rem) % 86400) + '</div>';
        } else {
            sHTML =
                '<div style="margin-bottom:8px;color:#ccc;font-size:12px;">Tempo excedido</div>' +
                '<div style="font-size:22px;font-weight:bold;color:' + ac + ';">+' + formatTime(Math.abs(rem)) + '</div>';
        }
        const p = document.getElementById('shift-timer-panel');
        if (p) {
            p.innerHTML =
                '<div id="stp-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                    '<span style="font-size:13px;font-weight:bold;color:#fff;letter-spacing:0.5px;">⏱ Turno</span>' +
                    '<span id="stp-close" style="cursor:pointer;color:#888;font-size:18px;line-height:1;" title="Fechar">✕</span>' +
                '</div>' +
                '<div style="margin-bottom:12px;">' +
                    '<div style="color:#ccc;font-size:12px;margin-bottom:4px;">Horas cumpridas</div>' +
                    '<div style="font-size:26px;font-weight:bold;color:#fff;">' + tts + '</div>' +
                    '<div style="margin-top:4px;height:4px;border-radius:2px;background:#333;overflow:hidden;">' +
                        '<div style="height:100%;width:' + Math.min(100, Math.round(ts / totalExpectedSeconds * 100)) + '%;background:' + ac + ';border-radius:2px;"></div>' +
                    '</div>' +
                '</div>' +
                '<hr style="border:none;border-top:1px solid #333;margin:10px 0;">' +
                sHTML;
            document.getElementById('stp-close').addEventListener('click', function() {
                clearInterval(panel._refreshTimer);
                p.remove();
            });
        }
    }, 1000);
})();
