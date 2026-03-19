<p align="center">
    <img src="icons/ico.png">
</p>

# ⏱ iRH+ Widget — Your Work Companion!

**Never lose track of your work hours again!** iRH+ Widget is a sleek browser extension for the [iRH](https://irh.pt) platform that gives you real-time dashboards for your **shift timer** and **attendance overview** — right on the page!

---

## 🚀 Features

### 🕐 Shift Panel (`/picagens/picagens_c`)

- **Live Shift Timer** — Instantly see how many hours you've clocked today, updated every second.
- **Time Remaining** — Know exactly how much time is left before your 7h40m shift is complete.
- **Estimated Exit Time** — Get a real-time estimate of when you can head home. 🎉
- **Overtime Tracking** — Already past your shift? The counter flips to show how much extra time you've put in.
- **Progress Bar** — A visual indicator of your shift completion at a glance.
- **Smart Type Detection** — Automatically interprets ambiguous clock entries (Entrada/Saída) so you don't have to.
- **Desktop Notifications** — Get notified when your shift is complete.
- **Live DOM Updates** — The panel detects new clock entries ("Registar picagem") instantly, no page refresh needed.

### 📊 Attendance Panel (`/assiduidade/assiduidade_c`)

- **Extra Hours Tracker** — Sums all overtime hours across search results.
- **Incomplete Days Counter** — Shows how many days are marked "Incompleto" and need justification.
- **Auto-updates on Search** — Panel refreshes automatically when the attendance table updates via AJAX.

### ⚙️ Shared Settings (both panels)

- **Dark / Light Theme** — Toggle via the ⚙️ settings menu; persisted in localStorage.
- **Auto Refresh Session** — Optional 1-hour auto-reload with a snackbar notification before refreshing.
- **Gorgeous Floating Panel** — A minimal, themed overlay that stays out of your way but keeps you informed.
- **Cross-Browser Support** — Works on both **Chrome** (Manifest V3) and **Firefox** (Manifest V2).

---

## 📸 How It Works

Once installed, navigate to either supported page:

| Page | Panel | What it shows |
|------|-------|---------------|
| `/picagens/picagens_c` | 🕐 Turno | Hours worked, time remaining, estimated exit, overtime |
| `/assiduidade/assiduidade_c` | 📊 Assiduidade | Extra hours accumulated, days pending justification |

A floating panel appears in the bottom-right corner. Click **⚙️** to access the settings menu.

---

## 🛠 Installation

### Firefox (Developer Edition Only)
1. Download the latest `irh-counter.xpi` from this repo latest [release](https://github.com/mariog0ncalves/irh-shift-widget/releases/latest).
2. Open Firefox and go to `about:config`.
3. Swap flag `xpinstall.signatures.required` to `false`.
2. Open Firefox and go to `about:addons`.
3. Click the gear icon → **Install Add-on From File…**
4. Select the `.xpi` file — done!

### Chrome
1. Clone or download this repo latest [release](https://github.com/mariog0ncalves/irh-shift-widget/releases/latest).
2. Run `npm run build:chrome` to generate the manifest.
3. Open Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked** and select the project folder.

---

## 📦 Build from Scratch Scripts

```bash
# Prepare manifest for Chrome
npm run build:chrome

# Prepare manifest + package .xpi for Firefox
npm run build:firefox
```

---

## 🧑‍💻 Author

Made with ❤️ by **drajacinta@imed.pt**

---

## 📄 License

ISC
