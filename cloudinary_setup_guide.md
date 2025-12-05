# Cloudinary Setup Guide

Follow these steps to get your **Cloud Name** and **Upload Preset** for the project.

## 1. Get Your Cloud Name
1.  Log in to your [Cloudinary Console](https://console.cloudinary.com/).
2.  Look at the **Dashboard** (main page).
3.  In the "Product Environment Credentials" section (top left), copy the **Cloud Name**.
    *   *Example:* `dxyz123`

## 2. Create an Upload Preset
This is required to allow users (your admin panel) to upload images without a backend server signature.

1.  Click the **Settings** icon (gear ⚙️) in the bottom left sidebar.
2.  Click on **Upload** in the left menu.
3.  Scroll down to the **Upload presets** section.
4.  Click **Add Upload Preset**.
5.  **Important:** Change **Signing Mode** to **Unsigned**.
6.  (Optional) You can change the "Name" to something simple like `personal_project_preset`, or keep the random one generated.
7.  (Optional) You can set a specific folder (e.g., `personal-project`) if you want to organize uploads.
8.  Click **Save**.
9.  Copy the **Name** of the preset you just created.

## 3. Add to Project
Open your `.env` file in the project root and add these lines:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=paste_your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=paste_your_preset_name_here
```

**Restart your development server** (`Ctrl+C` then `npm run dev`) for the changes to take effect.
