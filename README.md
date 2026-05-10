Check it out here: [perzsa.vercel.app](https://perzsa.vercel.app/)
# 💻 React Windows 10 Portfolio OS

A premium, fully interactive Windows 10-inspired personal portfolio. Built with Next.js, Tailwind CSS, and Framer Motion, this template ditches the standard scrolling website for a cinematic, operating-system-themed desktop experience. Perfect for SaaS founders, full-stack developers, and designers.

---

## ✨ Features

* **🪟 Physics-Based Window Manager:** Drag, minimize, maximize, and dynamically resize application windows smoothly using Framer Motion.
* **🎨 Real-Time Personalization:** Change desktop wallpapers instantly through a functional Settings app.
* **👨‍💻 Interactive Terminal:** A working command-line interface that outputs your resume data, skills, and project links.
* **📂 Native App Ecosystem:** Includes pre-built windows for "About Me", "Experience", "Projects" (with a grid layout), "CV/Resume", and a "Contact" form.
* **🖱️ Authentic OS Mechanics:** Features a working taskbar, live system clock, interactive right-click context menu, and a realistic boot sequence.
* **📱 Fully Responsive:** Adapts gracefully from massive ultra-wide monitors down to mobile screens.

---

## 🚀 Quick Start (How to Use)

Want to run this locally? Follow these steps to get your OS booting up in seconds.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/perzsa/windows-portfolio-template.git](https://github.com/perzsa/windows-portfolio-template.git)
Navigate into the folder:

Bash
cd windows-portfolio-template
Install the dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser to see the result!

🛠️ How to Customize (Make it Yours!)
This template is designed to be highly modular. Everything you need to change is located inside src/app/page.tsx. Here is how to swap out my placeholder data for your actual portfolio content.

📝 1. Update Your Personal Data
At the very top of src/app/page.tsx, you will find several constants (PROFILE, SKILLS, EXPERIENCE, PROJECTS). Simply replace the text inside these arrays with your own information! The UI will automatically update to reflect your new data across all apps.

🖼️ 2. Change the Desktop Wallpapers
Want to add your own aesthetic? Look for the WALLPAPERS array in the code. You can easily add new themes by providing a CSS background value (like a gradient or an image URL):

JavaScript
const WALLPAPERS = [
  // Example of adding a custom image from Unsplash:
  { 
    id: "my-custom-bg", 
    name: "Neon City", 
    val: "url('[https://images.unsplash.com/your-image-id](https://images.unsplash.com/your-image-id)') center/cover no-repeat" 
  },
  // You can also use solid colors or CSS gradients!
];
Once added, your new wallpaper will automatically appear in the Settings App for users to select.

🗂️ 3. Change the App Icons
This project uses react-icons/fc (Flat Color icons) to give it that authentic, chunky OS feel.
To change an icon, simply import a new one at the top of the file, and then update the APPS registry array:

JavaScript
// Find this section:
const APPS = [
  { id: "about", title: "About Me", icon: FcManager, initX: 20, initY: 20, w: 700, h: 560 },
  // Just swap 'FcManager' with your new icon!
];
⌨️ 4. Add Custom Terminal Commands
Open the TerminalApp component and look for the CMDS object. You can easily write new terminal commands by adding a new key-value pair.

JavaScript
const CMDS = {
  // Add your custom command here:
  secret: () => [
    "You found the secret command!",
    "Here is a hidden easter egg.",
    "",
  ],
};
🏗️ Tech Stack
Framework: Next.js (App Router)

Library: React

Animations & Physics: Framer Motion

Styling: Tailwind CSS (Inline mapped for single-file portability)

Icons: React Icons & Lucide

📜 License
This project is licensed under the MIT License - feel free to clone it, rip it apart, and use it for your own personal portfolio! If you use it, a star on the repository is always appreciated. ⭐
