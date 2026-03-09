# IFXTrades Database Management Guide

This guide explains how to manage your website content directly from the Supabase Dashboard.

## 1. Adding a Blog Post
Go to the `content_posts` table:
- **title**: The main title of the blog.
- **slug**: A URL-friendly version of the title (e.g., `how-to-trade-gold`). Must be unique.
- **bold_headline**: A short, catchy sub-headline that appears in bold.
- **content**: The main body (supports Markdown).
- **image_url**: Link to the cover image.
- **video_url**: (Optional) Link to a YouTube/Vimeo video.
- **author_name/bio**: Details about the writer.

## 2. Adding a Trading Algorithm (Product)
Go to the `products` table:
- **long_plan_offers**: This is a JSON field. Enter it like this:
  ```json
  [{"duration": "1 Year", "price": 899, "discount": "25% Off"}]
  ```
- **reviews**: Enter as JSON:
  ```json
  [{"user_name": "Alex", "rating": 5, "comment": "Amazing results!", "date": "2024-03-09"}]
  ```
- **q_and_a**: Enter as JSON:
  ```json
  [{"question": "What is the minimum capital?", "answer": "$500 is recommended."}]
  ```

## 3. Setting up the Academy (Freemium)
1. Add the course to the `courses` table first. Copy its `id`.
2. Go to the `chapters` table.
3. Add chapters using the `course_id` you copied.
4. **The Logic**: Set `is_free` to `true` for the first chapter. Set it to `false` for all others. The website will automatically lock the paid ones.

## 4. Managing Webinars
Go to the `webinars` table:
- **status**: Set to `upcoming` to show on the site, `live` when active, and `past` to move it to the archive.
- **registration_count**: This updates automatically when people sign up, but you can manually edit it to create "FOMO" (Fear Of Missing Out).

## 5. Uploading Images/Logos
1. Go to **Storage** in Supabase.
2. Create a public bucket named `assets`.
3. Upload your images (Brand logos, speaker photos, etc.).
4. Copy the **Public URL** of the image and paste it into the corresponding table column (e.g., `brand_logo_url`).
