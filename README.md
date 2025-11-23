````markdown
# 🌍 Dweldubai - The Future of Visa Consultancy

![Project Status](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20Tailwind%20%7C%20Three.js-blueviolet)

### 🔴 **[View Live Website](https://zeenat2134.github.io/DwelDubai/)**

**Dweldubai** is a futuristic, high-performance landing page for a modern visa consultancy firm specializing in Saudi Arabia (KSA) and United Arab Emirates (UAE) immigration. 

Unlike traditional consultancy sites, this project utilizes **3D interactive visuals**, **gamification**, and **cyberpunk aesthetics** to create an immersive user experience.

---

## ✨ Key Features

### 🌐 **Cinematic 3D Globe**
- Powered by **Three.js**.
- Features **neon-filled borders** for Saudi Arabia and UAE using real-world GeoJSON data.
- **Scroll-to-Zoom:** The camera dynamically zooms in on the Middle East as the user scrolls down the page.
- Background starfield animation.

### 🎮 **Gamified User Experience**
- **Passport Stamp Collector:** A floating FAB (Floating Action Button) collects digital stamps as users explore different sections of the site.
- **Neon Flip Cards:** Service cards flip on hover to reveal details with a satisfying "Neon Stamp" animation (Approved/Verified/Granted).
- **Interactive Journey:** - **Step 1:** A simulated "Laser Scanner" for document verification.
  - **Step 2:** A "Terminal" typing effect for security checks.
  - **Step 3:** A holographic "Visa Granted" card animation.

### 🛠️ **Interactive Tools**
- **Visa Budget Planner:** A functional calculator with range sliders and toggles (Express Processing, Insurance) to estimate costs.
- **AI Eligibility Quiz:** A multi-step interactive form to check visa approval odds.

### 🎨 **Modern Design**
- **Glassmorphism:** Ultra-transparent, frosted-glass UI elements.
- **Tailwind CSS:** Utilized for rapid, responsive styling.
- **Mobile Optimized:** Custom cursor logic and 3D performance adjustments for touch devices.

---

## 💻 Tech Stack

* **Core:** HTML5, CSS3, Vanilla JavaScript.
* **Styling:** Tailwind CSS (via CDN for rapid prototyping).
* **3D Graphics:** Three.js (WebGL).
* **Icons:** FontAwesome.
* **Backend/Database:** Google Firebase (Firestore) for form submissions.

---

## 📂 Project Structure

```text
/dweldubai-website
│
├── index.html      # Main HTML structure
├── style.css       # Custom animations, glass effects, and responsive overrides
├── script.js       # Logic for Three.js globe, calculator, quiz, and Firebase
├── Logo.jpg        # Project Logo
└── README.md       # Project Documentation
````

-----

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/zeenat2134/DwelDubai.git](https://github.com/zeenat2134/DwelDubai.git)
    ```
2.  **Navigate to the folder:**
    ```bash
    cd DwelDubai
    ```
3.  **Run the project:**
      * Since this project uses ES Modules and Three.js, it is best run via a local server (to avoid CORS issues with loading textures or scripts).
      * If using **VS Code**, simply right-click `index.html` and select **"Open with Live Server"**.
      * Alternatively, just open `index.html` in your browser (Chrome/Edge recommended).

-----

## ⚙️ Configuration

### Firebase Setup

The project is currently configured with a Firebase API key in `script.js`.

  * **Note:** For a production deployment, ensure you lock down your **Firestore Security Rules** in the Firebase Console to prevent unauthorized spam, or move the API keys to environment variables using a build tool (like Vite/Webpack).

### Logo

Ensure a file named `Logo.jpg` is present in the root directory for the header logo to render correctly.

-----

## 📞 Contact

**Dweldubai Consultants** 📍 Sheikh Zayad Road, Blue Tower 301, Dubai  
📧 [dweldubai@gmail.com](mailto:dweldubai@gmail.com)

-----

*© 2025 Dweldubai. Designed for the future.*

```
```
