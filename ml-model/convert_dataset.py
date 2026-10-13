"""
convert_dataset.py

Converts .jfif / .webp / .avif images inside each class folder under
dataset/ into .jpg files that Keras's image_dataset_from_directory can
actually read (it only accepts .bmp .gif .jpeg .jpg .png).

.jfif files are just JPEG data with a non-standard extension, so this is a
safe re-save, not a lossy re-encode of a different format.

Usage (run from the ml-model/ folder, next to train_model.py):
    python convert_dataset.py
"""

import os
from PIL import Image

DATASET_PATH = "dataset"
CONVERT_EXTENSIONS = {".webp", ".jfif", ".avif"}


def convert_dataset(dataset_path: str = DATASET_PATH) -> None:
    if not os.path.isdir(dataset_path):
        print(f"Dataset folder not found: {dataset_path}")
        return

    converted = 0
    failed = 0

    for cls in sorted(os.listdir(dataset_path)):
        cls_path = os.path.join(dataset_path, cls)
        if not os.path.isdir(cls_path):
            continue

        cls_converted = 0
        for fname in os.listdir(cls_path):
            fpath = os.path.join(cls_path, fname)
            ext = os.path.splitext(fname)[1].lower()

            if ext not in CONVERT_EXTENSIONS:
                continue

            try:
                img = Image.open(fpath).convert("RGB")
                new_path = os.path.splitext(fpath)[0] + ".jpg"

                # Avoid clobbering an existing .jpg with the same base name
                if os.path.exists(new_path) and new_path != fpath:
                    base, _ = os.path.splitext(new_path)
                    suffix = 1
                    while os.path.exists(f"{base}_{suffix}.jpg"):
                        suffix += 1
                    new_path = f"{base}_{suffix}.jpg"

                img.save(new_path, "JPEG", quality=95)
                os.remove(fpath)
                converted += 1
                cls_converted += 1
            except Exception as e:
                print(f"  Failed on {fpath}: {e}")
                failed += 1

        if cls_converted:
            print(f"{cls}: converted {cls_converted} file(s)")

    print("\n----------------------------------------")
    print(f"Done. Converted: {converted}   Failed: {failed}")
    print("----------------------------------------\n")


def audit_dataset(dataset_path: str = DATASET_PATH) -> None:
    if not os.path.isdir(dataset_path):
        print(f"Dataset folder not found: {dataset_path}")
        return

    print("Post-conversion audit:")
    for cls in sorted(os.listdir(dataset_path)):
        cls_path = os.path.join(dataset_path, cls)
        if not os.path.isdir(cls_path):
            continue

        files = os.listdir(cls_path)
        exts = {}
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            exts[ext] = exts.get(ext, 0) + 1
        print(f"  {cls}: {len(files)} files -> {exts}")


if __name__ == "__main__":
    convert_dataset()
    audit_dataset()
    