import os

# Base directory
base_dir = os.path.dirname(os.path.abspath(__file__))

# Client folder structure
folders = [
    "app/client/public",
    "app/client/src",
    "app/client/src/components",
    "app/client/src/pages",
    "app/client/src/styles",
    "app/client/src/utils",
    "app/client/src/context"
]

# Create folders
for folder in folders:
    folder_path = os.path.join(base_dir, folder.replace('/', os.sep))
    os.makedirs(folder_path, exist_ok=True)
    print(f"Created: {folder_path}")

print("Client folder structure created successfully!")
