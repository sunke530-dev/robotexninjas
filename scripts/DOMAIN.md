# Foundation web domain

The intended public address is `https://www.ninjasstemfoundation.com/`.

- `CNAME` declares the GitHub Pages custom domain.
- `index.html` redirects to the existing `ninjasstemfoundation.html` homepage, preserving query parameters and fragment links. The HTML refresh and visible links also work without JavaScript.
- `team.html` contains the Robotex Ninjas team homepage formerly served by `index.html`. Team links in the Foundation pages and gallery use this explicit path.
- Local page, document, and image links are relative, so they work both at a GitHub project path and at the custom-domain root.

Keep the Foundation homepage source in `ninjasstemfoundation.html`; do not duplicate its content into the redirect page.

## DNS configuration

In Squarespace, point the `www` CNAME to `sunke530-dev.github.io` (no repository path). Configure the apex A records as `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153` so the bare domain redirects to `www` through GitHub Pages. Add the domain to GitHub Pages before pointing its DNS at GitHub. Enable Enforce HTTPS when GitHub's certificate is ready.

Preserve the existing Google Workspace MX, SPF, DKIM, DMARC, and verification records, all unrelated records, and the current nameservers. Do not replace the entire DNS zone or use a preset that changes email records.

Deployment is only complete after the public domain loads the Foundation homepage over HTTPS and the Google Workspace records match the pre-change snapshot.
