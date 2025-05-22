import os

# Base directory
base_dir = os.path.dirname(os.path.abspath(__file__))

# Folder structure based on README.md
folders = [
    "app/client/components",
    "app/client/pages",
    "app/client/styles",
    "app/server/routes",
    "app/server/controllers",
    "app/server/models",
    "app/server/utils",
    "app/prisma",
    "app/config"
]

# Create folders
for folder in folders:
    folder_path = os.path.join(base_dir, folder.replace('/', os.sep))
    os.makedirs(folder_path, exist_ok=True)
    print(f"Created: {folder_path}")

print("Folder structure created successfully!")
