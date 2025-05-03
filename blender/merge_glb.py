import bpy
import sys
import os

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def import_and_label_animations(filepath, label):
    print(f"\nImporting {filepath} and labeling animations as '{label}'")
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
        print(f"Action: {action.name}")

def main(first_path, second_path, output_path):
    print(f"First GLB: {first_path}")
    print(f"Second GLB: {second_path}")
    print(f"Output: {output_path}")

    clear_scene()

    # Just extract "idle" and "walking" from the filenames
    label_1 = os.path.splitext(os.path.basename(first_path))[0].lower()
    label_2 = os.path.splitext(os.path.basename(second_path))[0].lower()

    imported_1 = import_and_label_animations(first_path, label_1)
    imported_2 = import_and_label_animations(second_path, label_2)

    print_actions()

    # Cleanup second imported objects (we already retained animations)
    for obj in imported_2:
        bpy.data.objects.remove(obj, do_unlink=True)

    print(f"\n💾 Exporting to: {output_path}")
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_animations=True)
    print("✅ Export complete.")

if __name__ == "__main__":
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    if len(argv) != 3:
        print("Usage: blender --background --python merge_glb.py -- <first.glb> <second.glb> <output.glb>")
        sys.exit(1)

    main(argv[0], argv[1], argv[2])
