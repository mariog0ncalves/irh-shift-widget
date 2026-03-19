/* Shared utilities for iRH Shift Widget panels */
(function() {
    var isDarkMode = localStorage.getItem('stp-dark-mode') !== null
        ? localStorage.getItem('stp-dark-mode') === 'true'
        : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var autoRefreshEnabled = localStorage.getItem('stp-auto-refresh') === 'true';
    var autoRefreshTimer = null;

    function getTheme() {
        return isDarkMode ? {
            panelBg: 'rgba(30,30,30,0.95)',
            text: '#fff',
            label: '#ccc',
            track: '#333',
            border: '#333',
            closeBtnColor: '#888',
            shadow: '0 8px 32px rgba(0,0,0,0.45)',
            toggleIcon: '🌙',
            themeName: 'Escuro',
            menuBg: 'rgba(40,40,40,0.98)',
            menuHover: 'rgba(255,255,255,0.08)'
        } : {
            panelBg: 'rgba(255,255,255,0.95)',
            text: '#222',
            label: '#555',
            track: '#ddd',
            border: '#ddd',
            closeBtnColor: '#999',
            shadow: '0 8px 32px rgba(0,0,0,0.15)',
            toggleIcon: '☀️',
            themeName: 'Claro',
            menuBg: 'rgba(255,255,255,0.98)',
            menuHover: 'rgba(0,0,0,0.05)'
        };
    }

    function formatTime(seconds) {
        var sign = seconds < 0 ? '-' : '';
        var abs = Math.abs(Math.floor(seconds));
        var h = Math.floor(abs / 3600);
        var m = Math.floor((abs % 3600) / 60);
        var s = abs % 60;
        return sign +
            h.toString().padStart(2, '0') + ':' +
            m.toString().padStart(2, '0') + ':' +
            s.toString().padStart(2, '0');
    }

    function showSnackbar(message) {
        var t = getTheme();
        var snackbar = document.createElement('div');
        snackbar.id = 'stp-snackbar';
        snackbar.textContent = message;
        snackbar.style.cssText =
            'position:fixed;bottom:16px;right:272px;z-index:2147483647;' +
            'padding:10px 16px;border-radius:8px;' +
            'background:' + t.panelBg + ';color:' + t.text + ';' +
            'box-shadow:' + t.shadow + ';' +
            'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
            'font-size:13px;font-weight:500;' +
            'backdrop-filter:blur(8px);' +
            'opacity:0;transition:opacity 0.3s ease;';
        document.body.appendChild(snackbar);
        requestAnimationFrame(function() { snackbar.style.opacity = '1'; });
        setTimeout(function() {
            snackbar.style.opacity = '0';
            setTimeout(function() { snackbar.remove(); }, 300);
        }, 3000);
    }

    function startAutoRefresh() {
        if (autoRefreshTimer) clearInterval(autoRefreshTimer);
        autoRefreshTimer = setInterval(function() {
            showSnackbar('A atualizar sessão em 5 segundos...');
            setTimeout(function() { location.reload(); }, 5000);
        }, 3600000);
    }

    function toggleAutoRefresh(renderCallback) {
        autoRefreshEnabled = !autoRefreshEnabled;
        localStorage.setItem('stp-auto-refresh', autoRefreshEnabled);
        if (autoRefreshEnabled) {
            startAutoRefresh();
        } else {
            if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
        }
        if (renderCallback) renderCallback();
    }

    if (autoRefreshEnabled) startAutoRefresh();

    /**
     * Build a menu HTML string.
     * @param {string} prefix - ID prefix for element IDs (e.g. 'stp' or 'ass')
     */
    function buildMenuHTML(prefix) {
        var t = getTheme();
        var autoRefreshToggleBg = autoRefreshEnabled ? '#4caf50' : t.track;
        var autoRefreshTogglePos = autoRefreshEnabled ? '14px' : '2px';

        return '<div id="' + prefix + '-menu" style="position:absolute;top:100%;right:0;margin-top:4px;background:' + t.menuBg + ';border-radius:8px;box-shadow:' + t.shadow + ';padding:4px 0;min-width:200px;z-index:10;border:1px solid ' + t.border + ';color:' + t.text + ';font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
            '<div id="' + prefix + '-menu-theme" style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:13px;color:' + t.text + ';">' +
                '<span>' + t.toggleIcon + ' Tema: ' + t.themeName + '</span>' +
            '</div>' +
            '<div style="border-top:1px solid ' + t.border + ';margin:2px 0;"></div>' +
            '<div id="' + prefix + '-menu-autorefresh" style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:13px;color:' + t.text + ';">' +
                '<span>🔄 Refrescar sessão</span>' +
                '<div style="display:flex;align-items:center;gap:6px;">' +
                    '<div style="width:28px;height:16px;border-radius:8px;background:' + autoRefreshToggleBg + ';position:relative;transition:background 0.2s;">' +
                        '<div style="width:12px;height:12px;border-radius:50%;background:#fff;position:absolute;top:2px;left:' + autoRefreshTogglePos + ';transition:left 0.2s;"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    /**
     * Build the header HTML with menu button, close button, and optional dropdown.
     * @param {string} prefix - ID prefix
     * @param {string} icon - Header icon emoji
     * @param {string} title - Header title text
     * @param {boolean} menuOpen - Whether the menu is currently open
     */
    function buildHeaderHTML(prefix, icon, title, menuOpen) {
        var menuHTML = menuOpen ? buildMenuHTML(prefix) : '';
        return '<div id="' + prefix + '-header" style="background:#009b85;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;margin:-16px -16px 12px -16px;border-radius:12px 12px 0 0;position:relative;">' +
            '<span style="font-size:13px;font-weight:bold;color:#fff;letter-spacing:0.5px;">' + icon + ' ' + title + '</span>' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
                '<span id="' + prefix + '-menu-btn" style="cursor:pointer;font-size:14px;line-height:1;padding:4px;" title="Definições">⚙️</span>' +
                '<span id="' + prefix + '-close" style="cursor:pointer;font-size:14px;line-height:1;" title="Fechar">❌</span>' +
            '</div>' +
            menuHTML +
        '</div>';
    }

    /**
     * Wire up the menu button, close button, theme toggle, and auto-refresh toggle.
     * @param {HTMLElement} panel - The panel element
     * @param {string} prefix - ID prefix
     * @param {object} state - Mutable state object with `menuOpen` property
     * @param {function} renderFn - Function to call to re-render: renderFn(panel)
     */
    function wireMenuEvents(panel, prefix, state, renderFn) {
        document.getElementById(prefix + '-close').addEventListener('click', function() {
            clearInterval(panel._refreshTimer);
            if (autoRefreshTimer) clearInterval(autoRefreshTimer);
            panel.remove();
        });

        document.getElementById(prefix + '-menu-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            state.menuOpen = !state.menuOpen;
            renderFn(panel);
        });

        if (state.menuOpen) {
            var menuThemeEl = document.getElementById(prefix + '-menu-theme');
            var menuAutoRefreshEl = document.getElementById(prefix + '-menu-autorefresh');

            if (menuThemeEl) {
                menuThemeEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    isDarkMode = !isDarkMode;
                    localStorage.setItem('stp-dark-mode', isDarkMode);
                    renderFn(panel);
                });
            }
            if (menuAutoRefreshEl) {
                menuAutoRefreshEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleAutoRefresh(function() { renderFn(panel); });
                });
            }

            document.addEventListener('click', function closeMenu() {
                state.menuOpen = false;
                renderFn(panel);
                document.removeEventListener('click', closeMenu);
            });
        }
    }

    /**
     * Create a floating panel element and append it to the body.
     * @param {string} id - The panel element ID
     * @returns {HTMLElement}
     */
    function createPanel(id) {
        var existing = document.getElementById(id);
        if (existing) existing.remove();

        var panel = document.createElement('div');
        panel.id = id;
        panel.style.cssText =
            'position:fixed;bottom:16px;right:16px;z-index:2147483647;' +
            'width:240px;padding:16px;border-radius:12px;' +
            'backdrop-filter:blur(8px);' +
            'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
            'line-height:1.4;';
        document.body.appendChild(panel);
        return panel;
    }

    /**
     * Apply theme colors to a panel element.
     * @param {HTMLElement} panel
     */
    function applyTheme(panel) {
        var t = getTheme();
        panel.style.background = t.panelBg;
        panel.style.boxShadow = t.shadow;
        panel.style.color = t.text;
    }

    window.STPUtils = {
        getTheme: getTheme,
        formatTime: formatTime,
        showSnackbar: showSnackbar,
        buildHeaderHTML: buildHeaderHTML,
        wireMenuEvents: wireMenuEvents,
        createPanel: createPanel,
        applyTheme: applyTheme
    };
})();
