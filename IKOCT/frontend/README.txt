IKARA ORPHAN CHARITY TRUST — 2026 WEBSITE REDESIGN
====================================================

WHAT'S IN THIS FOLDER
----------------------
16 HTML pages (same content/information as your original site, restyled):
  index, about, programs, projects, stories, gallery, events, team,
  volunteer, sponsor, donate, blog, faq, contact, transparency, 404

style.css   - one shared stylesheet (design system: colors, type, components)
script.js   - one shared script (menu, counters, FAQ accordion, gallery
              filters/lightbox, countdown, forms, image fallback, etc.)
images/     - drop your real photos here (see below)

HOW TO VIEW IT
----------------------
Just double-click index.html (or open the folder in VS Code + a Live
Server extension) — no build step, no server required.

ADDING YOUR OWN PHOTOS
----------------------
The homepage now ships with original illustrated artwork (not stock
photos) so nothing on the page looks broken or placeholder-grey:

  images/hero.svg      - savanna sunset scene, children holding hands
                          (used as the hero section's background)
  images/gallery1.svg  - "Education" illustration
  images/gallery2.svg  - "Healthcare" illustration
  images/gallery3.svg  - "Community" illustration
  images/partner1-3.svg - simple placeholder partner marks (the names
                          on them — "Northern Relief Council" etc. —
                          are just placeholders; swap in your real
                          partner logos/names)

Why illustrations and not real photos: I'm not able to pull photos
from the internet into a file I hand to you, since almost everything
online is copyrighted and it wouldn't be right to embed someone else's
photography into your site without a license. The illustrations are
original artwork built for this redesign, in your brand colors, so
you have something polished to launch with immediately.

To swap in real photography of your children/programs/team later:
  1. Get properly licensed photos — your own photography is best;
     for stock, Unsplash.com and Pexels.com offer free-for-commercial-
     use photos (search "African children education", "Nigeria
     community outreach", "classroom Africa", etc.)
  2. Save the real photo as images/hero.jpg (or any name you like)
  3. In style.css, find the ".hero{" rule near the top and change
         background: ... url("images/hero.svg") center/cover no-repeat;
     to
         background: ... url("images/hero.jpg") center/cover no-repeat;
  4. For the gallery/partner slots, just replace the <img src="...">
     paths in index.html (and gallery.html, team.html, sponsor.html,
     etc.) with your real photo filenames — the rest of the layout,
     rounded corners and hover effects will apply automatically.

All other photo slots across the site (team portraits, gallery pages,
child sponsorship profiles, blog thumbnails, event photos) still use
the original file names from your source code and will show a soft
branded placeholder until you drop matching photos into /images.


WHAT CHANGED VS. THE ORIGINAL CODE
----------------------
- Full visual redesign: a warm "Ledger of Good Deeds" palette (deep
  indigo, gold, clay, warm sand) with Fraunces/Inter/IBM Plex Mono
  type, tied to your own tagline "Every deed is weighed" and the
  golden balance-scale mark.
- Fixed broken/duplicated markup (nested <header> tags, a stray
  half-typed JS line in the old preloader script, a video file used
  as an <img>, the missing "transparency.html" destination).
- Rebuilt navigation as one consistent header/footer across every
  page, with a working mobile drawer menu and active-link highlighting.
- Cleaned up obvious typos in the copy (e.g. "childs" → "child's",
  "beginneing" → "beginning") without changing any facts, numbers,
  names, prices, addresses, phone numbers or email addresses.
- Added smooth counters, scroll-reveal animation, FAQ accordion,
  working gallery filters + lightbox, a live event countdown, and
  friendly on-page confirmation messages for every form (no backend
  is wired up — connect your form handler / Paystack button / email
  service of choice where noted in donate.html and events.html).

ALL CONTACT DETAILS, PRICES, STATS AND ADDRESSES ARE UNCHANGED FROM
YOUR ORIGINAL CODE.
