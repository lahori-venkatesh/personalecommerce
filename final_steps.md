# Final Steps: Verify Cloudinary Integration

You have set up your environment variables. Now, let's verify everything works.

## 1. Restart Development Server
Since you modified `.env`, you **MUST** restart the server for the changes to be picked up.

1.  Go to your terminal where `npm run dev` is running.
2.  Press `Ctrl + C` to stop it.
3.  Run `npm run dev` again.

## 2. Test the Upload
1.  Open your browser to `http://localhost:3000/admin/services`.
2.  Click **Add Service**.
3.  Scroll down to the **Resume Preview Image URL** field.
4.  Click the **Upload Image** button.
5.  The Cloudinary widget should open.
6.  Select an image from your computer and upload it.
7.  **Success:** The widget should close, and the input field should automatically fill with a URL starting with `https://res.cloudinary.com/...`.

## 3. Save and Verify
1.  Fill in the rest of the required fields (Title, Description, Price).
2.  Click **Create Service**.
3.  Go to the main website (`http://localhost:3000`) or the specific service page.
4.  Verify the image loads instantly!

---
**Troubleshooting:**
*   **Widget doesn't open?** Check the browser console (F12) for errors.
*   **Upload fails?** Verify your "Upload Preset" in Cloudinary is set to **Unsigned**.
