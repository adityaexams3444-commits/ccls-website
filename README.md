# CCLS Admin Portal — Setup Guide

## Files Included

```
admin/
  index.html          ← Login page
  dashboard.html      ← Full admin dashboard
  content-bridge.js   ← Script to connect admin data to public pages
```

## Login Credentials

| Username | Password   | Role          |
|----------|------------|---------------|
| admin    | ccls2026   | Administrator |
| editor   | editor2026 | Editor        |

**Change the password** after first login via Settings → Change Admin Password.

## How to Use

### 1. Access the Admin Panel
Open `admin/index.html` in your browser and log in.

### 2. Edit Content
- **Homepage** — Edit hero text, stats, about section, leadership message, and countdown timer
- **Events** — Add/edit/delete events with Draft/Publish control
- **Articles** — Manage articles with Draft/Publish control
- **Partners** — Add partner organisations with logos across 4 categories
- **Organogram** — Manage team members with photos, roles, and tiers
- **Contact Details** — Update all contact information and social links
- **Footer** — Edit footer links and copyright text
- **Media Library** — Upload and manage images; upload the main logo here

### 3. Connect to Public Pages
Add this one line at the bottom of any public HTML page (before `</body>`):

```html
<script src="admin/content-bridge.js"></script>
```

Once added, the public page will automatically display the latest admin-managed content.

### 4. Draft vs Published
- **Draft** — Content is saved but NOT shown on the public site
- **Published** — Content is live and visible to visitors
- Use Draft to prepare content before it goes live

## Technical Notes

- All content is stored in the browser's `localStorage` under the key `ccls_content_v1`
- Images are stored as base64 data URLs (keep images under 1–2MB for performance)
- To move content between devices, use **Settings → Export Content JSON** and **Import Content JSON**
- No server or database required — everything runs client-side

## Adding to Existing Pages
To enable dynamic content on an existing page, add this script tag:

```html
<!-- Add just before </body> on any public page -->
<script src="admin/content-bridge.js"></script>
```

## Folder Structure Recommendation
```
your-site/
  index.html
  events.html
  articles.html
  partners.html
  faculty-team.html
  contact.html
  admin/
    index.html
    dashboard.html
    content-bridge.js
```
