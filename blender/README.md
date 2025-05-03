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
