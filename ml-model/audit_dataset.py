import os

dataset_path = "dataset"
for cls in sorted(os.listdir(dataset_path)):
    cls_path = os.path.join(dataset_path, cls)
    if not os.path.isdir(cls_path):
        continue
    files = os.listdir(cls_path)
    exts = {}
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        exts[ext] = exts.get(ext, 0) + 1
    print(f"{cls}: {len(files)} files -> {exts}")