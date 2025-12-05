# Vercel Troubleshooting: "Upload Preset Not Found"

If uploads work in development but fail in Vercel with "Upload preset not found", it means the **Environment Variables** are not being seen by the browser.

## 1. Check Variable Names (CRITICAL)
In Next.js, environment variables available to the browser **MUST** start with `NEXT_PUBLIC_`.

Go to your Vercel Dashboard > Settings > Environment Variables and check:

*   **Correct:** `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
*   **Incorrect:** `CLOUDINARY_UPLOAD_PRESET` (Browser cannot see this!)

**Action:** If you missed the prefix, rename the variable in Vercel.

## 2. Redeploy is Required
If you added or changed environment variables **after** your last deployment, they will **NOT** be active yet. Vercel bakes these variables in at build time.

**Action:**
1.  Go to Vercel Dashboard > Deployments.
2.  Click the three dots (...) on your latest deployment.
3.  Select **Redeploy**.
4.  Wait for it to finish and test again.

## 3. Verify in Browser Console
To confirm what the browser sees:
1.  Open your live site.
2.  Open Developer Tools (F12) > Console.
3.  Type `process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (this might not work directly in console due to bundling, but you can check the network request).
4.  Better yet: When you open the upload widget, look at the **Network** tab. Look for a request to `cloudinary`. Check the payload—is the `upload_preset` correct, or is it falling back to `unsigned_preset`?

## Summary
1.  Ensure keys start with `NEXT_PUBLIC_`.
2.  **Redeploy** your application.
