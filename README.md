# TA Shanto Photography

A production-ready personal photography portfolio for **TA Shanto**, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and local image assets.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production check:

```bash
npm run lint
npm run build
npm start
```

## Add a photograph

1. Export a web-ready image and place it in `public/photos/<category>/`.
2. Run `npm run photos:sync`.
3. Edit the generated entry in the matching `data/photos/<category>.json` file.
4. Run `npm run photos:validate`, then commit and push. Vercel rebuilds the gallery, photo page, collection, sitemap, and metadata automatically.

The sync command detects dimensions, orientation, safe EXIF fields, a tiny blur placeholder, dominant colour and file size. Re-running it preserves human-written titles, descriptions, stories, locations, tags, alt text and featured settings. It never renames, deletes or modifies photographs.

## Photography workflow

### Add a new photo

Use a descriptive lowercase filename such as `rainy-evening-old-dhaka.jpg`, then copy it to its category folder—for example `public/photos/street/`. Avoid camera filenames such as `IMG_8372.JPG`, `DSC01923.JPG`, or ambiguous names such as `final-photo-2-new.jpg`.

To preview an optional safe rename, run `npm run photos:rename -- --from street/IMG_8372.JPG --to street/rainy-evening-old-dhaka.jpg`. Nothing changes without the explicit `--apply` flag. Add `--apply` only after reviewing the paths, then run sync. Existing creative metadata is retained.

Run:

```bash
npm run photos:sync
```

For `public/photos/street/rainy-evening-dhaka.jpg`, the command creates an entry in `data/photos/street.json`. It detects `width`, `height`, `aspectRatio`, `orientation`, camera/lens/exposure details when available, `blurDataURL`, `dominantColor`, and file size. GPS, serial numbers, maker notes and private EXIF fields are never published.

### Edit creative metadata

Open the generated JSON entry and review these fields:

- `title`, `description`, and optional `story`
- `alt` and remove `altNeedsReview` after writing accurate alt text
- optional `location`, `city`, `country`, and `dateCaptured`
- `tags`, `featured`, and `homepageFeatured`
- optional `featuredOrder` or `sortOrder`

Technical fields are refreshed by sync; creative fields are preserved. `dateAdded` controls the Latest Frames section, while `dateCaptured` describes when the photograph was made.

### Validate and audit

```bash
npm run photos:validate
npm run photos:audit
```

Validation catches duplicate IDs/slugs/sources, missing files, invalid categories, dimensions, orientations and dates. Optional creative or EXIF metadata produces review warnings rather than blocking the build. The audit warns above 4 MB and marks files above 8 MB as critical; customize with `PHOTO_WARN_MB` and `PHOTO_CRITICAL_MB`.

Production builds automatically run `photos:validate` first.

### Remove or move a photo safely

Delete both the web image and its JSON entry in the same commit. If only the image is removed, validation reports the exact broken `src`; sync never silently deletes metadata. To change collection, move the image to the new category folder, run sync, transfer any creative metadata to the new entry, then remove the old entry after review.

### Collection covers and featured work

Collections derive their photographs and counts directly from photo metadata. Set `coverPhotoSlug` in `data/collections.ts` when you want a specific cover; otherwise the first ordered photograph is used. Set `homepageFeatured: true` to include a photograph on the homepage and optionally use `featuredOrder` for precise ordering.

### Recommended photo preparation

- Export JPEG, WebP, or AVIF in sRGB.
- Rename exports descriptively before adding them: use `rainy-evening-old-dhaka.jpg`, not `IMG_5840.JPG`. Keep filenames lowercase and separate words with hyphens.
- Use 2400–3200 px on the long edge for most portfolio photographs; reserve larger files only when they materially improve fullscreen viewing.
- Aim for roughly 300–900 KB per image after visual quality review.
- Strip unnecessary metadata if privacy matters, but retain capture information in the relevant `data/photos/<category>.ts` file when you want it shown.
- Enter the exact pixel `width` and `height`; Next.js uses them to prevent layout shift.
- Write specific alt text that describes what is visible, not the filename.
- Set `dominantColor` to a representative dark/mid tone for a polished loading state.
- Mark only a few photographs as `featured`; the first featured photograph is the homepage LCP image.
- Keep camera-original 20–50 MB files in a private archive outside this deployed repository. Only web-ready exports belong in `public/photos/`.
- A practical target is 2400–3200 px on the long edge and roughly 300–900 KB; retain a larger web export only when fullscreen presentation genuinely benefits.
- Dedicated thumbnails are intentionally not generated. Next.js Image Optimization creates correctly sized AVIF/WebP responses without duplicating every photograph in Git.

## Content locations

- Photography metadata: category JSON files inside `data/photos/`
- Combined photo export: `data/photos.ts` (normally no editing needed)
- Collection introductions/covers: `data/collections.ts`
- Biography and gear: `app/about/page.tsx`
- Contact/social links: `app/contact/page.tsx` and `components/layout/footer.tsx`
- Site identity and SEO defaults: `app/layout.tsx`

The contact form validates locally and opens a prefilled email draft—there is no database, API key, or server-side form service.

## Deploy to Vercel

1. Push the project to a Git repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework as Next.js and the default build command (`npm run build`).
4. Deploy. No environment variables are required.
5. Open the project’s **Settings → Domains**, add `photos.tashanto.com`, and follow Vercel’s DNS instructions.
6. At the DNS provider for `tashanto.com`, add the CNAME record Vercel provides (commonly host `photos` pointing to `cname.vercel-dns.com`). Use the exact value shown by Vercel because their guidance can change.
7. After DNS verification, Vercel provisions HTTPS automatically. Set `photos.tashanto.com` as the primary domain.

The canonical origin is already configured as `https://photos.tashanto.com` in metadata, sitemap, and robots output.

## Google Search Console

After the production domain is live:

1. Add `photos.tashanto.com` to Google Search Console. A domain property is preferred when you can add the requested DNS verification record.
2. Complete ownership verification through your domain provider.
3. Submit `https://photos.tashanto.com/sitemap.xml` in the **Sitemaps** section.
4. Use **URL Inspection** to request indexing for the homepage, Gallery, important collections, and your strongest photograph pages.

Search Console is optional and the website works normally without it. Analytics is not installed; Vercel Analytics or Google Analytics can be added later if measurement is needed.

## Image CDN migration

All display components receive the typed `Photo` model and URL handling is isolated from filtering and page composition. To adopt Cloudinary, S3, or R2 later, update the metadata source/URL resolver and add the CDN host to `next.config.ts`. The page and gallery architecture does not need to change.

## Requirements

- Node.js 20.9 or newer
- No globally installed image utilities

`sharp` performs local image inspection and placeholder generation; `exifr` reads a deliberately limited set of EXIF fields. Both run only in developer scripts, not in the browser.
