# Reusable governance document packages

The buildless page contains pre-rendered native details/summary markup. Packages expand with keyboard, touch, or mouse, even without JavaScript. document-packages.css supplies the shared layout; document-packages.js opens nested categories when following a deep link.

## Add or update a package
1. Add an entry to document-packages.json. Use a stable id, entryId matching an existing governance document entry, and categoryId for its category. Keep titles, descriptions, adoption status, optional note, contact action, public documents, and related policies in this content file.
2. Only include public policies and blank public forms. Set public:true explicitly on each document. Store its original PDF under docs/<package>/ and use that relative path in file. Leave file absent for unpublished documents; no download link is generated.
3. Use "Not verified" for adoption unless approval is verified. Optional version/effectiveDate appears only with metadataVerified:true. A related policy becomes a link only with an actual file and publishedVerified:true. Never add sensitive or internal files to this repository.
4. Run `node scripts/render-document-packages.mjs` from the repository. Commit the updated page, manifest, and approved public PDFs together. The renderer checks that each linked file exists and starts with the PDF signature. It updates marked package blocks without rebuilding the other categories.
5. Deep-link to `foundation-governance.html#package-<id>`. Review desktop and mobile, document links, and any preselected contact topic.

Student Participation, Financial Management, Youth Protection, and Outreach Committee can use the same schema and renderer when their public files and statuses are ready. No page or stylesheet redesign is required. Do not create publication claims for missing files.

The mentorship package is the first working example. Generated markup is committed so GitHub Pages needs no build step. Preserve the outer li entry ID so existing Essential Documents links continue to work.
