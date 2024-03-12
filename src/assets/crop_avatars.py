# Update the function to consider rows and columns for cropping
from PIL import Image
import os


# Update the function to crop the central part of the image considering margins
def central_crop_avatars(image_path, rows, columns, vertical_margin, horizontal_margin, save_dir):
    os.makedirs(save_dir, exist_ok=True)
    # Load the image
    with Image.open(image_path) as im:
        # Calculate the total margins
        total_vertical_margin = vertical_margin * 2
        total_horizontal_margin = horizontal_margin * 2

        # The dimensions of the cropped area
        crop_width = im.width - total_horizontal_margin
        crop_height = im.height - total_vertical_margin

        # The starting point of the cropped area
        start_x = horizontal_margin
        start_y = vertical_margin

        # Dictionary to store file paths
        file_paths = []

        # Crop out each avatar
        for i in range(rows):
            for j in range(columns):
                left = start_x + j * (crop_width // columns)
                right = left + (crop_width // columns)
                top = start_y + i * (crop_height // rows)
                bottom = top + (crop_height // rows)

                # Define the bounding box for cropping
                bbox = (left, top, right, bottom)
                # Crop the image
                avatar = im.crop(bbox)
                # Define the file path
                file_path = f"{save_dir}/avatar_center_{i*columns + j + 1}.webp"
                # Save the cropped image
                avatar.save(file_path)
                file_paths.append(file_path)

        return file_paths


# Define the vertical and horizontal margins for the central crop
vertical_margin = 120  # Replace with the desired margin
horizontal_margin = 180  # Replace with the desired margin

# Paths to the uploaded images
image_path1 = "vue-client/src/assets/icons1.webp"
image_path2 = "vue-client/src/assets/icons2.webp"

# Save directory
save_dir1 = "vue-client/src/assets/avatars1"
save_dir2 = "vue-client/src/assets/avatars2"

# Rows and columns for each image
rows1, columns1 = 2, 2
rows2, columns2 = 2, 4


# Crop the images with central margins
avatars1_center_paths = central_crop_avatars(image_path1, rows1, columns1, vertical_margin, horizontal_margin, save_dir1)
avatars2_center_paths = central_crop_avatars(image_path2, rows2, columns2, vertical_margin, horizontal_margin, save_dir2)
