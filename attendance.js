(function() {
    var U = window.STPUtils;
    var state = { menuOpen: false };

    var listagemAssiduidade = document.getElementById('listagem-assiduidade');
    if (!listagemAssiduidade) {
        console.error('Elemento com ID "listagem-assiduidade" não encontrado.');
        return;
    }

    var tempoMinimoTrabalho = 7 * 3600 + 40 * 60;

    function horaParaSegundos(hora) {
        var parts = hora.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
    }

    function calculateData() {
        var rows = Array.from(listagemAssiduidade.querySelectorAll('tbody tr'));
        var horasExtraSeconds = 0;
        var nIncompleto = 0;

        for (var i = rows.length - 1; i >= 0; i--) {
            var row = rows[i];
            var tipo = (row.cells[8] && row.cells[8].textContent.trim()) || '';
            var horaCumprida = (row.cells[6] && row.cells[6].textContent.trim()) || '';
            if (!horaCumprida) continue;
            if (tipo === 'Incompleto') nIncompleto++;
            if (tipo !== 'Horas Extra') continue;
            horasExtraSeconds += horaParaSegundos(horaCumprida) - tempoMinimoTrabalho;
        }

        return { horasExtraSeconds: horasExtraSeconds, nIncompleto: nIncompleto };
    }

    function renderPanel(panel) {
        var data = calculateData();
        var t = U.getTheme();

        U.applyTheme(panel);

        var accentColor = data.horasExtraSeconds >= 0 ? '#4caf50' : '#ff9800';
        var incompletoColor = data.nIncompleto > 0 ? '#ff5722' : '#4caf50';
        var incompletoEmoji = data.nIncompleto > 0 ? '🤬' : '😇';

        panel.innerHTML =
            U.buildHeaderHTML('ass', '📊', 'Assiduidade', state.menuOpen) +
            '<div style="margin-bottom:12px;">' +
                '<div style="color:' + t.label + ';font-size:12px;margin-bottom:4px;">🏖️ Horas extra acumuladas</div>' +
                '<div style="font-size:26px;font-weight:bold;color:' + accentColor + ';">' + U.formatTime(data.horasExtraSeconds) + '</div>' +
            '</div>' +
            '<hr style="border:none;border-top:1px solid ' + t.border + ';margin:10px 0;">' +
            '<div>' +
                '<div style="color:' + t.label + ';font-size:12px;margin-bottom:4px;">'+incompletoEmoji+' Dias por justificar</div>' +
                '<div style="font-size:22px;font-weight:bold;color:' + incompletoColor + ';">' + data.nIncompleto + '</div>' +
            '</div>';

        U.wireMenuEvents(panel, 'ass', state, renderPanel);
    }

    var panel = U.createPanel('assiduidade-panel');
    renderPanel(panel);

    /* Re-render when search results change */
    var observer = new MutationObserver(function() {
        renderPanel(panel);
    });
    observer.observe(listagemAssiduidade, { childList: true, subtree: true });

    /* Fallback: re-render on search button click */
    var searchBtn = document.getElementById('pesquisa-assiduidade');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            setTimeout(function() { renderPanel(panel); }, 1500);
        });
    }
})();
