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

1. Prepare the image and place it in `public/photos/<category>/`.
2. Add one typed metadata record to the matching file in `data/photos/`—for example, Street photos go in `data/photos/street.ts`.
3. Commit and push. Vercel will rebuild the gallery, photo page, collection, sitemap, and metadata automatically. No component changes are needed.

The included images and records are clearly marked sample content. Replace them before launch. Keep the same local path architecture or change only the `src` field when migrating to an image CDN later—the UI consumes a provider-agnostic `Photo` record.

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

## Content locations

- Photography metadata: category files inside `data/photos/`
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

All display components receive the typed `Photo` model rather than importing files directly. To adopt Cloudinary, S3, or R2 later, update the photo `src` values and add the CDN host to `next.config.ts`. The page and gallery architecture does not need to change.
