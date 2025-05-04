import bpy
import sys
import os
import glob

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def import_and_label_animations(filepath, label):
    print(f"\n📦 Importing {filepath} as animation '{label}'")
    bpy.ops.import_scene.gltf(filepath=filepath)
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

def main(glb_dir, output_path):
    clear_scene()

    glb_files = sorted(glob.glob(os.path.join(glb_dir, "*.glb")))
    if not glb_files:
        print(f"No .glb files found in directory: {glb_dir}")
        sys.exit(1)

    print(f"🔍 Found {len(glb_files)} .glb files in {glb_dir}")

    keep_objects = []

    for idx, glb_path in enumerate(glb_files):
        label = os.path.splitext(os.path.basename(glb_path))[0].lower()
        imported_objects = import_and_label_animations(glb_path, label)

        if idx == 0:
            # Keep the geometry of the first imported glb
            keep_objects.extend(imported_objects)
        else:
            # Remove all geometry, keep only animation data
            for obj in imported_objects:
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

    if len(argv) != 2:
        print("Usage: blender --background --python merge_glb.py -- <input_glb_dir> <output.glb>")
        sys.exit(1)

    main(argv[0], argv[1])
