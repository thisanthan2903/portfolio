# Thisanthan M S — Portfolio

**Live at:** https://thisanthan2903.github.io/portfolio *(after deployment)*

---

## 📁 Folder Structure

```
thisanthan-portfolio/
├── index.html          ← Main portfolio
├── css/style.css       ← Design system (light + dark)
├── js/main.js          ← All logic (ZipRAG, particles, slideshow)
├── assets/
│   └── profile.jpg     ← ← ← YOUR PHOTO GOES HERE
└── README.md
```

---

## 🖼️ HOW TO ADD YOUR PROFILE PHOTO

### Step 1 — Prepare your photo
- Use a clear, professional face photo
- **Rename it to:** `profile.jpg`
- Recommended size: **400×400 px** or square crop
- File size: under 500 KB (use https://squoosh.app to compress)

### Step 2 — Upload to GitHub
1. In your GitHub repo, click **Add file → Upload files**
2. Create an `assets/` folder by typing `assets/profile.jpg` in the path box
   *(GitHub will auto-create the folder)*
3. Upload your `profile.jpg`
4. Commit: "Add profile photo"

### Step 3 — Enable the photo in HTML
Open `index.html` and find these TWO comment blocks (search for `UNCOMMENT`):

**In the Hero section (~line 110):**
```html
<!-- Remove this line: -->
<div class="photo-placeholder">T</div>

<!-- Uncomment this line: -->
<img src="assets/profile.jpg" alt="Thisanthan M S — Data Engineer"/>
```

**In the About section (~line 155):**
```html
<!-- Remove this line: -->
<div class="ap-placeholder">👨‍💻</div>

<!-- Uncomment this line: -->
<img src="assets/profile.jpg" alt="Thisanthan M S"/>
```

---

## 🚀 Deploy to GitHub Pages (Step by Step)

### Step 1 — Create GitHub Account
- Go to **github.com** → Sign Up
- Username suggestion: `thisanthan2903` *(matches your existing repo)*

### Step 2 — Create Repository
- Click **+** → **New repository**
- Name: `portfolio`
- Make it: **Public**
- ✅ Check "Add README file"
- Click **Create repository**

### Step 3 — Upload Files
- Click **"uploading an existing file"**
- Drag & drop ALL contents from the zip:
  - `index.html`
  - `css/` folder
  - `js/` folder
  - `assets/` folder *(with your profile.jpg)*
- Commit message: `Deploy portfolio`
- Click **Commit changes**

> ⚠️ `index.html` must be in the ROOT — not inside any subfolder!

### Step 4 — Enable GitHub Pages
- Go to **Settings** → **Pages** (left sidebar)
- Source: **Deploy from a branch**
- Branch: **main** | Folder: **/ (root)**
- Click **Save**

### Step 5 — Get Your Link!
- Wait 2–3 minutes ⏳
- Go back to **Settings → Pages**
- See: `✅ Your site is live at https://thisanthan2903.github.io/portfolio`
- **Share this link on your resume, LinkedIn, WhatsApp!** 🎉

---

## ✏️ Personalise Before Deploying

Open `index.html` and update:

| Line | What to change |
|------|----------------|
| ~215 | Your real email |
| ~218 | Your LinkedIn URL |
| ~221 | Your GitHub URL |

---

## 🔄 Update Later

1. Go to your repo on GitHub
2. Click the file → pencil icon ✏️
3. Edit → Commit → Live in ~1 min

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎨 Light/Dark theme | Toggle saved in browser |
| 🌌 Particle background | Canvas constellation with mouse interaction |
| 📜 Scroll progress bar | Orange gradient bar at top |
| 🎠 Slideshow | Auto-plays your highlights |
| 🖼️ Profile photo | Spinning gradient ring |
| 📱 Fully responsive | Mobile → Desktop |
| 🤖 ZipRAG AI demo | Live Claude API powered |
| 💾 localStorage backend | Sessions saved in browser |
| ✨ Scroll reveal | Staggered section animations |
| 🔢 Animated counters | Numbers count up on scroll |
| ⌨️ Typing effect | Role name cycles automatically |

---

*Built for Thisanthan M S — Salem, Tamil Nadu 🇮🇳*
