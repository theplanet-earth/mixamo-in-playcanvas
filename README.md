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
│       ├── yessiree.glb
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

Here’s what I would add to your `README.md` to **explain in detail what the `index.html` and `main.ts` files are doing**, quoting the most relevant lines and contextualizing them in the scope of this Mixamo + PlayCanvas engine study.

---

### 📄 Breakdown of the Code

#### 🔹 `index.html` — Project Entry Point

```html
<canvas id="application"></canvas>
```

This defines the main HTML canvas where PlayCanvas will render the 3D scene. The canvas is styled to cover the full browser window:

```html
<style>body,html{margin:0;height:100%}canvas{width:100%;height:100%}</style>
```

This ensures the canvas stretches to fill the entire viewport — essential for immersive 3D experiences.

```html
<script type="module" src="./main.ts"></script>
```

We import our main logic written in TypeScript as a module, which will handle all rendering, scene creation, and model loading.

---

#### 🔹 `main.ts` — Application Logic and Scene Setup

```ts
import * as pc from 'playcanvas';
```

This imports the PlayCanvas engine as a module, unlocking all core APIs like `pc.Application`, `pc.Entity`, and `pc.Color`.

```ts
const canvas = document.getElementById('application') as HTMLCanvasElement;
```

We get a reference to the canvas element by ID so we can initialize the engine with it.

---

#### 🔧 Initialize the PlayCanvas Application

```ts
const app = new pc.Application(canvas, {
  mouse: new pc.Mouse(canvas),
  touch: new pc.TouchDevice(canvas),
  elementInput: new pc.ElementInput(canvas)
});
```

This creates a PlayCanvas application tied to our canvas. We also enable:

* 🖱️ Mouse input
* 🤏 Touch support
* 🔤 Element input (useful for UI elements if added later)

---

#### 📐 Handle Canvas Resizing

```ts
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  app.graphicsDevice.setResolution(canvas.width, canvas.height);
}
```

This function ensures the canvas is always correctly sized for high-DPI screens and adapts on window resize:

```ts
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

These lines ensure the canvas resizes initially and every time the window changes size, preserving a crisp visual experience on all devices.

---

#### 🏗️ Build the Scene Graph

```ts
const root = new pc.Entity();
```

Create a root node for our scene hierarchy — a good practice even in simple setups.

##### 📷 Add a Camera

```ts
const camera = new pc.Entity();
camera.addComponent('camera', { clearColor: new pc.Color(0.2, 0.2, 0.2) });
camera.setPosition(0, 1.5, 3);
```

* Adds a camera with a neutral dark gray background
* Positioned slightly above and in front of the scene
* Will later be re-aimed to frame the model

```ts
root.addChild(camera);
```

Attach the camera to the scene graph.

##### 💡 Add a Directional Light

```ts
const light = new pc.Entity();
light.addComponent('light', { type: 'directional', intensity: 1 });
light.setEulerAngles(45, 30, 0);
```

* A directional light (like sunlight) with full brightness
* Rotated to shine diagonally for a dynamic look

```ts
root.addChild(light);
```

Add the light to the root as well.

---

#### 🚀 Start the Engine

```ts
app.root.addChild(root);
app.start();
```

Adds the root entity (with camera and light) to the scene and starts the main game loop (`update`, `render`, etc.).

---

#### 📦 Load and Display Mixamo Model

```ts
app.assets.loadFromUrl('/assets/ybot.glb', 'container', (err, asset) => {
```

This loads a `ybot.glb` file (a rigged Mixamo character) as a container, which includes both the model and animations.

```ts
const modelRoot = (asset.resource as pc.ContainerResource).instantiateModelEntity();
```

Instantiates the actual 3D model entity from the GLB container.

```ts
modelRoot.setLocalPosition(0, 0, 0);
modelRoot.setLocalScale(1, 1, 1);
```

Places the model at the origin and gives it a standard scale.

```ts
app.root.addChild(modelRoot);
```

Adds the model to the scene so it's rendered.

```ts
camera.setPosition(0, 2, 5);
camera.lookAt(0, 1, 0);
```

Once the model is loaded, the camera is repositioned to frame it from above and in front, then aimed at the character's center.

---

This entire script sets up a minimal but complete 3D rendering environment — programmatically — that can be used to **experiment with Mixamo rigging and animations directly in PlayCanvas**, with full control over every aspect of rendering and asset loading. 🎯

---

### 🎞️ Playing Mixamo Animations from `.glb`

Once your Mixamo character (with animations, like `yessiree.glb`) is loaded, the next step is to **extract and play its embedded animations**. Mixamo exports `.glb` files with both the mesh and animation data bundled together — which PlayCanvas can use via its `AnimationComponent`.

#### ✅ Make Sure the GLB Contains Animations

Before playing any animation, ensure the Mixamo export was done with:

* ✅ **"With Skin"** selected
* ✅ **"Animation"** not removed during export
* ✅ Use `.glb` format (not `.fbx`, unless you convert it)

---

### 🧩 Extract and Assign the Animation

Right after instantiating the model entity, we can add animation logic like this:

```ts
// 🎬 Add animation component
modelRoot.addComponent('animation', {
  assets: container.animations,
  activate: true,
});

// 🏃 Play the first available animation
if (container.animations.length > 0) {
  modelRoot.animation.play(container.animations[0].name, 0);
} else {
  console.warn('No animations found in container!');
}
```

---

### 🧠 What’s Happening Here?

* **`container.animations`** contains all the animation clips embedded in the `.glb`.
* We **add an `animation` component** to the character and assign the clips to it.
* **`activate: true`** ensures the component is active and ready to play.
* We **play the first animation** using `.play(name, blendTime)`. Set blendTime to `0` for instant playback.

---

### 🚫 Gotchas and Debug Tips

* If `container.animations.length === 0` → double-check your Mixamo export.
* Animation won't show if:

  * the character has no skinning data
  * no animation component was added
* Blend times > 0 can cause delays or unexpected transitions on first play

---

### 🎉 Next Ideas

* ⏺️ Switch between multiple Mixamo animations
* 🔁 Loop or transition between animations
* 🎮 Bind animations to user input (e.g., walk, jump, idle)
* 🧩 Combine this with PlayCanvas `StateGraph` or custom FSM logic

---

### 🕹️ Simple Idle/Walking Animation Toggle

Now that you're able to play a Mixamo animation, let’s **toggle between an idle and a walking animation** using the **spacebar**.

This example assumes your `.glb` file contains both **Idle** and **Walking** animations — either as separate `.glb` clips merged together during import or added manually in Blender or PlayCanvas.

---

### ✅ Update Code to Handle Animation State

Replace your existing animation section with the following logic:

```ts
// Add animation component
modelRoot.addComponent('animation', {
  assets: container.animations,
  activate: true,
});

// Store animation names
const idleClip = container.animations.find(a => a.name === 'merged.glb/animation/0');
const walkClip = container.animations.find(a => a.name === 'merged.glb/animation/1');

if (!idleClip || !walkClip) {
  console.warn('Idle or Walking animation not found!');
} else {
  // Start in idle state
  modelRoot.animation.play(idleClip.name, 0.2);

  let isWalking = false;

  // Toggle on spacebar
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      isWalking = !isWalking;
      const nextAnim = isWalking ? walkClip.name : idleClip.name;
      modelRoot.animation.play(nextAnim, 0.2);
    }
  });
}
```

---

### 🧠 How It Works

* We **search the list of animations** for clips with "idle" and "walking" in their names.
* The character **starts in the idle animation**.
* When you press **Space**, it **toggles to walking**, and pressing again **returns to idle**.
* Animations are blended smoothly with a **0.2s transition**.

> ✅ Tip: You can log `container.animations.map(a => a.name)` to check clip names if unsure.

---

### 🔄 Suggested Workflow

If your GLB file only has one animation:

1. Export multiple animations from Mixamo as separate `.fbx` files.
2. Use Blender to combine them into one `.glb` file with multiple named actions.
3. Export to glTF (`.glb`) with animations split properly.
4. Test your toggle in the browser!

## ✅ Your New Requirements Implemented

### 💡 Summary of Behavior:

1. App starts in `"idle"` animation.
2. Pressing the ⬇️ Down Arrow:

   * **Always switches to `"walk"`**, regardless of what was playing.
3. Releasing ⬇️ Down Arrow:

   * **Always returns to `"idle"`**, no matter what was previously playing.
4. Pressing **Spacebar**:

   * **Plays `"yessiree"` once**, interrupting anything else (even walking).
   * **Returns to `"idle"`** once the animation completes.
   * **Down Arrow takes precedence** if pressed during or after.

## 🚨 Why `loop = false` **alone does not stop** `yessiree` from looping

In **PlayCanvas's `animation` component** (not `anim`), the `loop` flag on the `AnimationTrack` (i.e., `asset.resource.loop = false`) is *not respected* automatically unless you manually check for when the animation ends using a **time-based mechanism** or `update` listener — because `.once('end')` only fires **on blended out animations**, and sometimes not at all when `loop = false` is ignored or overridden internally.

So, here's a guaranteed fix:

## ✅ Robust Fix: Use `modelRoot.animation.loop = false` **before** playing the animation

Instead of setting it on the asset's resource, set it on the **entity's animation component**, like this:

```ts
modelRoot.animation.loop = false;
modelRoot.animation.play(animMap.yessiree.name, 0.1);
```

Then restore loop = true for idle/walk when switching back.

## ✅ Final Working Code Snippet for `keydown: Space`

Replace just the spacebar handling code with this:

```ts
if (e.code === 'Space') {
  if (!playingYessiree) {
    playingYessiree = true;

    // Override animation loop for this special case
    modelRoot.animation.loop = false;
    play('yessiree', 0.1);

    // Use time-based manual trigger to detect end of animation
    const duration = animMap.yessiree.resource.duration;
    setTimeout(() => {
      playingYessiree = false;

      // Restore default loop behavior
      modelRoot.animation.loop = true;

      if (walkPressed) {
        play('walk');
      } else {
        play('idle');
      }
    }, duration * 1000);
  }
}
```

## 🧠 Why This Works

* `modelRoot.animation.loop` actually affects **runtime behavior**
* The `animation.play(...)` function does **not re-read the asset’s `loop` flag**
* `setTimeout` works because we can read the `.duration` of the track in seconds

## ⏱ Optional Debug Log

You can add this if you're unsure how long your yessiree animation is:

```ts
console.log('Yessiree duration (sec):', animMap.yessiree.resource.duration);
```

---

### 🧠 Core FSM Design

We'll:

* Encapsulate states (`idle`, `walk`, `yessiree`) and transitions in a `StateMachine` object.
* Let the FSM handle all animation changes.
* Handle input events by simply calling `fsm.transition('walk')`, etc.
* Auto-return to `idle` when `yessiree` finishes.
* Support `walk` interrupting everything — including `yessiree`.

---

## ✅ Refactored `main.ts` FSM Version (Replace the logic inside `if (!animMap.idle || ...)`)

```ts
// Ensure correct loop settings
animMap.idle.resource.loop = true;
animMap.walk.resource.loop = true;
animMap.yessiree.resource.loop = false;

modelRoot.animation.loop = true;

// Finite State Machine
class StateMachine {
  current: string = 'idle';
  walkPressed: boolean = false;
  isPlayingSpecial: boolean = false;

  play(name: string, blend: number = 0.2, loop: boolean = true) {
    if (this.current === name) return;
    modelRoot.animation.loop = loop;
    modelRoot.animation.play(animMap[name].name, blend);
    this.current = name;
  }

  transition(to: string) {
    if (to === 'walk') {
      // Walk always takes over
      this.isPlayingSpecial = false;
      this.play('walk');
    } else if (to === 'idle') {
      if (!this.isPlayingSpecial && this.current !== 'idle') {
        this.play('idle');
      }
    } else if (to === 'yessiree') {
      if (this.isPlayingSpecial) return; // Don't stack spacebar presses

      this.isPlayingSpecial = true;
      this.play('yessiree', 0.2, false); // not looping

      const duration = animMap.yessiree.resource.duration;
      console.log('Yessiree duration (sec):', duration);

      setTimeout(() => {
        this.isPlayingSpecial = false;
        // Decide what to return to
        if (this.walkPressed) {
          this.play('walk');
        } else {
          this.play('idle');
        }
      }, duration * 1000);
    }
  }
}

const fsm = new StateMachine();

// Start in idle
fsm.play('idle');

// Inputs
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowDown') {
    fsm.walkPressed = true;
    fsm.transition('walk');
  }

  if (e.code === 'Space') {
    fsm.transition('yessiree');
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowDown') {
    fsm.walkPressed = false;
    fsm.transition('idle');
  }
});
```

---

## ✅ Behavior Recap (Fully FSM-Driven)

* ✅ `fsm.transition('walk')` **always interrupts**
* ✅ `fsm.transition('yessiree')` plays once, **only if not already playing**
* ✅ When `yessiree` ends, **returns to walk if held**, or idle
* ✅ `fsm.transition('idle')` **resets state only if not in a special animation**

---

## 🎯 Advantages of This FSM Pattern

| Benefit                        | Why it matters                                         |
| ------------------------------ | ------------------------------------------------------ |
| 💡 Clear separation            | Input logic is now clean, stateful logic is abstracted |
| 🔄 Easy to extend              | Add more states like `"jump"` or `"attack"` easily     |
| 🧪 Reusable for other entities | Can apply FSM pattern to other animated models         |
| 🔍 Easier to debug             | You know exactly what state you're in at any moment    |

## 🔍 What’s happening?

When you press the down arrow during `"yessiree"`:

* It **interrupts** `"yessiree"` and starts `"walk"` immediately.
* But... the `setTimeout` for `"yessiree"` is **still active** — and when it expires, it tells the FSM to transition (back to `"idle"` or `"walk"`), even though a new animation already started.

This causes the second `"yessiree"` (after spacebar is pressed again) to:

* **Re-use the previous timeout**
* Or get interrupted mid-way if multiple triggers stack

## ✅ Solution: Track the timeout and cancel it if interrupted

We’ll store the `timeoutId` from `setTimeout()` and clear it anytime the animation is forcefully interrupted.

### 🛠 Fix: Add timeout handling to your FSM class

Update your `StateMachine` class as follows:

```ts
class StateMachine {
  current: string = 'idle';
  walkPressed: boolean = false;
  isPlayingSpecial: boolean = false;
  private specialTimeout: ReturnType<typeof setTimeout> | null = null;

  play(name: string, blend: number = 0.2, loop: boolean = true) {
    if (this.current === name) return;
    modelRoot.animation.loop = loop;
    modelRoot.animation.play(animMap[name].name, blend);
    this.current = name;
  }

  cancelSpecialAnimation() {
    if (this.specialTimeout !== null) {
      clearTimeout(this.specialTimeout);
      this.specialTimeout = null;
      this.isPlayingSpecial = false;
    }
  }

  transition(to: string) {
    if (to === 'walk') {
      // Walk always takes over
      this.cancelSpecialAnimation();
      this.play('walk');
    } else if (to === 'idle') {
      if (!this.isPlayingSpecial && this.current !== 'idle') {
        this.play('idle');
      }
    } else if (to === 'yessiree') {
      if (this.isPlayingSpecial) return;

      this.isPlayingSpecial = true;
      this.play('yessiree', 0.2, false);

      const duration = animMap.yessiree.resource.duration;
      console.log('Yessiree duration (sec):', duration);

      // Store timeout so it can be canceled if interrupted
      this.specialTimeout = setTimeout(() => {
        this.isPlayingSpecial = false;
        this.specialTimeout = null;

        if (this.walkPressed) {
          this.play('walk');
        } else {
          this.play('idle');
        }
      }, duration * 1000);
    }
  }
}
```

---

### ✅ Behavior Now

* Pressing ⬇️ during `"yessiree"` interrupts it **and cancels the scheduled end**
* Pressing space again will start a fresh `"yessiree"` without legacy timeout interference
* Only one active `"yessiree"` timeout exists at any time

---

Let me know if you'd like to evolve this further into a full-featured FSM class with **event hooks (onEnter/onExit)** or **transition guards** — you're almost there!
