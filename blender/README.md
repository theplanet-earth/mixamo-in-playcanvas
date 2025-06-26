## ✅ Step-by-Step CLI Setup

### 🔹 1. `merge_glb.py` – The Blender Python Script

This script is meant to be run like:

```bash
blender --background --python merge_glb.py -- <first.glb> <second.glb> <output.glb>
```
---

### 🔹 2. Run the Script via Blender CLI

Example usage:

```bash
blender --background --python merge_glb.py -- idle.glb walking.glb merged.glb
```

✅ This runs Blender in background, merges animations, and saves the output.

---

### 🔹 3. Optional: Virtual Environment Support (outside Blender)

If you need to **preprocess** GLB files, run asset checks, or automate file discovery using regular Python, then:

```bash
python -m venv glb-env
source glb-env/bin/activate
pip install pygltflib
```

Create a helper `prepare.py` for such tasks, but **note**: Blender doesn't use `venv` unless you manually link its Python to it, which is usually unnecessary unless you want to install custom Python modules *inside* Blender.

---

### ✅ Summary

| Feature                  | Supported          |
| ------------------------ | ------------------ |
| Blender CLI-friendly     | ✅                  |
| Animation merging        | ✅                  |
| Redundant object cleanup | ✅                  |
| Compatible with venv     | ✅ (external tasks) |

## ✅ New Behavior - multiple `.glb` files

You'll now run the script like this:

```bash
blender --background --python merge_glb.py -- ./input_glbs merged.glb
```

Where:

* `./input_glbs/` contains any number of `.glb` files (`idle.glb`, `walk.glb`, `jump.glb`, etc.)
* Each animation (Action, Track, Strip) is renamed using the filename (`idle`, `walk`, `jump`, ...).
* All animations are merged into a single file: `merged.glb`.

### 🧠 Script Logic

* Loop over all `.glb` files in the given directory (sorted for determinism).
* Use the filename (without extension) as the animation label.
* Import the `.glb`, rename its animation data to that label.
* Keep the first imported mesh/armature; delete the others but keep their animations.
* Export everything to the specified `.glb` output.

### ✅ Example Usage

```bash
blender --background --python merge_glb.py -- ./animations merged.glb
```

Where `./animations/` contains:

```
idle.glb
walk.glb
run.glb
jump.glb
```

The output `merged.glb` will contain:

* Geometry from `idle.glb`
* 4 clean animations named: `idle`, `walk`, `run`, `jump`

## ✅ New Behavior - multiple `.fbx` files

```bash
# Merge all .glb files
blender --background --python merge_glb.py -- ./animations merged.glb --type glb

# Merge all .fbx files
blender --background --python merge_glb.py -- ./animations merged.glb --type fbx
```

### ✅ Example Usage

**1. Merge GLBs**

```bash
blender --background --python merge_glb.py -- ./animations merged.glb --type glb
```

**2. Merge FBXs**

```bash
blender --background --python merge_glb.py -- ./animations merged.glb --type fbx
```

### Expected sample output

    ...

    === FINAL ACTIONS IN SCENE ===
    🎬 Action: ascending stairs
    🎬 Action: descending stairs
    🎬 Action: happy walk
    🎬 Action: left strafe walking
    🎬 Action: right strafe walking
    🎬 Action: sad walk
    🎬 Action: standard walk
    🎬 Action: stop walking
    🎬 Action: walk strafe left
    🎬 Action: walk strafe right
    🎬 Action: walking backwards
    🎬 Action: walking up the stairs
    🎬 Action: walking while texting

    💾 Exporting to: merged.glb
    19:29:23 | INFO: Draco mesh compression is available, use library at C:\Program Files\Blender Foundation\Blender 3.6\3.6\python\lib\site-packages\extern_draco.dll
    19:29:23 | INFO: Starting glTF 2.0 export
    19:29:23 | INFO: Extracting primitive: Alpha_Joints
    19:29:24 | INFO: Primitives created: 1
    19:29:24 | INFO: Extracting primitive: Alpha_Surface
    19:29:24 | INFO: Primitives created: 1
    19:34:50 | INFO: Finished glTF 2.0 export in 326.5166347026825 s

    ✅ Export complete.

    Blender quit