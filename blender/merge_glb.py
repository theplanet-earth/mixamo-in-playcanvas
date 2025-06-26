import bpy
import sys
import os
import glob

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def import_and_label_animations(filepath, label, filetype):
    print(f"\n📦 Importing {filepath} as animation '{label}'")
    if filetype == "glb":
        bpy.ops.import_scene.gltf(filepath=filepath)
    elif filetype == "fbx":
        bpy.ops.import_scene.fbx(filepath=filepath)
    else:
        print(f"Unsupported type: {filetype}")
        return []

    imported_objects = bpy.context.selected_objects

    for obj in imported_objects:
        if obj.animation_data:
            # Rename Action
            if obj.animation_data.action:
                old = obj.animation_data.action.name
                obj.animation_data.action.name = label
                print(f"  ↳ Action renamed: {old} → {label}")

            # Rename NLA Tracks and Strips
            for track in obj.animation_data.nla_tracks:
                old_track = track.name
                track.name = label
                print(f"  ↳ NLA Track renamed: {old_track} → {label}")
                for strip in track.strips:
                    old_strip = strip.name
                    strip.name = label
                    if strip.action:
                        old_action = strip.action.name
                        strip.action.name = label
                        print(f"     • Strip renamed: {old_strip} → {label}")
                        print(f"       ↳ Action renamed: {old_action} → {label}")

    return imported_objects

def print_actions():
    print("\n=== FINAL ACTIONS IN SCENE ===")
    for action in bpy.data.actions:
        print(f"  🎬 Action: {action.name}")

def main(glb_dir, output_path, filetype):
    clear_scene()

    ext = ".glb" if filetype == "glb" else ".fbx"
    file_list = sorted(glob.glob(os.path.join(glb_dir, f"*{ext}")))

    if not file_list:
        print(f"No *{ext} files found in directory: {glb_dir}")
        sys.exit(1)

    print(f"🔍 Found {len(file_list)} *{ext} files in {glb_dir}")

    keep_objects = []

    for idx, filepath in enumerate(file_list):
        label = os.path.splitext(os.path.basename(filepath))[0].lower()
        imported = import_and_label_animations(filepath, label, filetype)

        if idx == 0:
            # Keep the geometry of the first imported
            keep_objects.extend(imported)
        else:
            # Remove all geometry, keep only animation data
            for obj in imported:
                bpy.data.objects.remove(obj, do_unlink=True)

    print_actions()

    print(f"\n💾 Exporting to: {output_path}")
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_animations=True)
    print("✅ Export complete.")

if __name__ == "__main__":
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    if len(argv) != 4 or argv[2] != "--type":
        print("Usage: blender --background --python merge_glb.py -- <input_dir> <output.glb> --type <glb|fbx>")
        sys.exit(1)

    input_dir = argv[0]
    output_file = argv[1]
    filetype = argv[3].lower()

    if filetype not in ("glb", "fbx"):
        print("❌ Error: filetype must be 'glb' or 'fbx'")
        sys.exit(1)

    main(input_dir, output_file, filetype)
