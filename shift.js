(function() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    var U = window.STPUtils;
    var state = { menuOpen: false };
    var notificationSent = false;

    var listagemPicagens = document.getElementById('listagem-picagens');
    if (!listagemPicagens) {
        console.error('Elemento com ID "listagem-picagens" não encontrado.');
        return;
    }

    var totalExpectedSeconds = 7 * 3600 + 40 * 60;

    function calculateWorkedSeconds() {
        var rows = Array.from(listagemPicagens.querySelectorAll('tbody tr')).reverse();
        var totalSeconds = 0;
        var entradaSeconds = 0;
        var interpretedTypes = [];

        rows.forEach(function(row) {
            var tds = row.querySelectorAll('td');
            if (tds.length < 4) return;

            var timeString = tds[2].textContent.trim();
            var type = tds[3].textContent.trim();
            if (!timeString) return;

            var parts = timeString.split(':').map(Number);
            var currentSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

            if (type === '-') {
                for (var i = interpretedTypes.length - 1; i >= 0; i--) {
                    var prevType = interpretedTypes[i];
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
            var now = new Date();
            totalSeconds += (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) - entradaSeconds;
        }

        return totalSeconds;
    }

    function buildStatusHTML(remainingSeconds) {
        var now = new Date();
        var currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        var t = U.getTheme();

        if (remainingSeconds > 0) {
            var estimatedExitTimeString = U.formatTime((currentTimeInSeconds + remainingSeconds) % 86400);
            return {
                accentColor: '#ff9800',
                html:
                    '<div style="margin-bottom:8px;color:' + t.label + ';font-size:12px;">Tempo restante</div>' +
                    '<div style="font-size:22px;font-weight:bold;color:#ff9800;">' + U.formatTime(remainingSeconds) + '</div>' +
                    '<div style="margin-top:10px;color:' + t.label + ';font-size:12px;">Horário estimado saída</div>' +
                    '<div style="font-size:18px;font-weight:bold;color:' + t.text + ';">' + estimatedExitTimeString + '</div>'
            };
        }

        if (!notificationSent && "Notification" in window && Notification.permission === "granted") {
            var n = new Notification("Turno completo", {
                body: "Já completaste as 7h40 de trabalho.",
                icon: "https://irh.pt/media/favicon.png"
            });
            n.onclick = function() { window.focus(); };
        }
        notificationSent = true;

        return {
            accentColor: '#4caf50',
            html:
                '<div style="margin-bottom:8px;color:' + t.label + ';font-size:12px;">Tempo excedido</div>' +
                '<div style="font-size:22px;font-weight:bold;color:#4caf50;">+' + U.formatTime(Math.abs(remainingSeconds)) + '</div>'
        };
    }

    function renderPanel(panel) {
        var totalSeconds = calculateWorkedSeconds();
        var remainingSeconds = totalExpectedSeconds - totalSeconds;
        var status = buildStatusHTML(remainingSeconds);
        var progressPercent = Math.min(100, Math.round(totalSeconds / totalExpectedSeconds * 100));
        var t = U.getTheme();

        U.applyTheme(panel);

        panel.innerHTML =
            U.buildHeaderHTML('stp', '🕐', 'Turno', state.menuOpen) +
            '<div style="margin-bottom:12px;">' +
                '<div style="color:' + t.label + ';font-size:12px;margin-bottom:4px;">Horas cumpridas</div>' +
                '<div style="font-size:26px;font-weight:bold;color:' + t.text + ';">' + U.formatTime(totalSeconds) + '</div>' +
                '<div style="margin-top:4px;height:4px;border-radius:2px;background:' + t.track + ';overflow:hidden;">' +
                    '<div style="height:100%;width:' + progressPercent + '%;background:' + status.accentColor + ';border-radius:2px;"></div>' +
                '</div>' +
            '</div>' +
            '<hr style="border:none;border-top:1px solid ' + t.border + ';margin:10px 0;">' +
            status.html;

        U.wireMenuEvents(panel, 'stp', state, renderPanel);
    }

    var panel = U.createPanel('shift-timer-panel');
    renderPanel(panel);

    panel._refreshTimer = setInterval(function() {
        if (!document.getElementById('shift-timer-panel')) {
            clearInterval(panel._refreshTimer);
            return;
        }
        renderPanel(panel);
    }, 1000);
})();
