<p align="center">
    <img src="icons/ico.png">
</p>

# ⏱ iRH Shift Widget — Your Shift Time Companion!

**Never lose track of your work hours again!** iRH Shift Widget is a sleek browser extension that automatically calculates how long you've been working and tells you exactly when your shift ends. Built for the [iRH](https://irh.pt) clocking system, it turns raw punch-in/punch-out data into a beautiful, real-time dashboard — right on the page!

---

## 🚀 Features

- **Live Shift Timer** — Instantly see how many hours you've clocked today, updated every 30 seconds.
- **Time Remaining** — Know exactly how much time is left before your 7h40m shift is complete.
- **Estimated Exit Time** — Get a real-time estimate of when you can head home. 🎉
- **Overtime Tracking** — Already past your shift? The counter flips to show how much extra time you've put in.
- **Gorgeous Floating Panel** — A minimal, dark-themed overlay that stays out of your way but keeps you informed.
- **Progress Bar** — A visual indicator of your shift completion at a glance.
- **Smart Type Detection** — Automatically interprets ambiguous clock entries (Entrada/Saída) so you don't have to.
- **Cross-Browser Support** — Works on both **Chrome** (Manifest V3) and **Firefox** (Manifest V2).

---

## 📸 How It Works

Once installed, simply navigate to your **iRH Picagens** page (`https://irh.pt/picagens/picagens_c`). The extension reads your clock entries from the page and displays a floating panel in the bottom-right corner showing:

| Info | Description |
|------|-------------|
| **Horas cumpridas** | Total hours worked so far |
| **Tempo restante** | Time remaining in your shift |
| **Horário estimado saída** | Estimated clock-out time |
| **Tempo excedido** | Overtime (if shift is complete) |

The panel auto-refreshes every **30 seconds** so the numbers stay accurate throughout your day!

---

## 🛠 Installation

### Firefox (Developer Edition Only)
1. Download the latest `irh-counter.xpi` from this repo latest [release](https://github.com/mariog0ncalves/irh-shift-widget/releases/latest).
2. Open Firefox and go to `about:config`.
3. Swap flag `xpinstall.signatures.required` to ``false``.
2. Open Firefox and go to `about:addons`.
3. Click the gear icon → **Install Add-on From File…**
4. Select the `.xpi` file — done!

### Chrome
1. Download this repo latest [release](https://github.com/mariog0ncalves/irh-shift-widget/releases/latest).
2. Unzip repo onto a folder.
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
