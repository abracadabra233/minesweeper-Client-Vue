# Function to convert webp images to png
from PIL import Image
import os


def convert_to_png(webp_paths):
    png_paths = []
    for webp_path in webp_paths:
        # Load the webp image
        with Image.open(webp_path) as im:
            # Define the png path
            png_path = webp_path.rsplit(".", 1)[0] + ".png"
            # Convert and save as png
            im.save(png_path, "PNG")
            png_paths.append(png_path)
    return png_paths


# Paths to the uploaded images
image_path1 = "vue-client/src/assets/icons1.webp"
image_path2 = "vue-client/src/assets/icons2.webp"

# Convert all the cropped avatars to png
avatars1_png_paths = convert_to_png([image_path1, image_path2])
