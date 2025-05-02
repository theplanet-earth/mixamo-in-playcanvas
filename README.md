## 🕹️ PlayCanvas + Mixamo + Vite — Study Project

Welcome to this **experimental study** focused on integrating **Mixamo animations** into a **PlayCanvas engine-only** runtime environment. This project is entirely code-driven and **does not rely on the PlayCanvas web editor** — giving you full control over the rendering pipeline, asset loading, and animation blending.

---

### 🚧 Project Goals

* 🔍 **Explore Mixamo character and animation import workflows** (via `.fbx` → `.glb` or `.gltf`)
* 🧠 **Understand PlayCanvas’s runtime animation system**
* 🧰 **Build a minimal dev stack** using modern tools like **Vite** and **TypeScript**
* ✂️ Bypass the PlayCanvas Editor entirely for full transparency and reproducibility

---

### ⚙️ Development Workflow

This project uses **Vite** for fast dev server reloads and **TypeScript** for clean structure and type safety.

> Make sure to run the tasks using VSCode for maximum comfort!

#### ✅ VSCode Tasks

You can run the following pre-configured tasks from the VSCode Task Runner (⇧⌘P → "Tasks: Run Task"):

* **🚀 Start Dev Server** → Launches the app with hot module reload on `http://localhost:8080`
* **🏗️ Build for Production** → Bundles the app into `/dist` with optimized assets
* **🔍 Preview Production Build** → Serves the static build locally for testing

---

### 📦 Structure Overview

```
📁 src/          → TypeScript and HTML source code
📁 public/       → Static assets (models, textures, etc.)
📁 dist/         → Production-ready output (after build)
📄 vite.config.ts → Vite setup with PlayCanvas-specific config
```

Here below a detailed directory tree structure to help you navigate this project:

```
mixamo-in-playcanvas/
├── public/
│   └── assets/
│       └── ybot.glb
├── src/
│   ├── index.html
│   └── main.ts
├── .devcontainer/
│   └── devcontainer.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

### 🧪 Current Focus

* ✅ Load a Mixamo rigged model with animations
* ✅ Apply animations programmatically using `AnimationComponent`
* 🔄 Experiment with animation blending, masking, and transitions
* ⛏️ Tune asset import/export pipeline from Blender or other DCC tools

---

### 🚀 Why This Matters

By **avoiding the PlayCanvas web editor**, this project demystifies how the engine works under the hood and can serve as a **template for more complex, programmatically controlled WebGL experiences**. Perfect for developers looking to go beyond visual scripting and embrace full code-first control.

