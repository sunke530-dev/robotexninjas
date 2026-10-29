# Donation page

`foundation-donate.html` uses the Foundation's shared navigation, typography, logo, and an existing privacy-edited community photograph. `foundation-donate.css` contains only donation-page styles.

The donation page connects to **Support Ninjas STEM Foundation**, campaign `support-ninjas-stem-foundation`. The user confirmed this campaign on October 29, 2026, replacing the earlier UUID-linked campaign. Its public page showed the Foundation's mission text, a $5,000 goal, one-time and monthly giving, and preset amounts. The exact embed URL was retrieved from this campaign's Share → More ways to share → Embed → Campaign dialog. Check these details when replacing a campaign; its title alone is not enough to distinguish it. Amounts are controlled by Zeffy and are not hard-coded on the Foundation site.

Public campaign: https://www.zeffy.com/en-US/donation-form/support-ninjas-stem-foundation

Embed: https://www.zeffy.com/embed/donation-form/support-ninjas-stem-foundation

`foundation-donate.js` loads Zeffy's official responsive embed script, which manages checkout sizing. If that script fails to load, the page uses the verified iframe URL. A direct public campaign link always remains available, including without JavaScript. Donation and payment fields belong to Zeffy; the Foundation site does not collect them.

## Connect the real campaign

1. The Foundation manages its Zeffy account, organization, representative, bank verification, campaign content, and automated receipts itself.
2. In Zeffy, select the correct Foundation campaign, then Share → Copy link. Obtain the exact campaign link from the user.
3. Select Share → More ways to share → Embed → Campaign. Obtain the exact generated code; use its embed URL. Do not guess the embed path from the share link.
4. Set `data-zeffy-campaign-url` and `data-zeffy-embed-url` on `#give`, `data-form-url` on the embed container, and the direct link's `href` in the HTML. All must refer to the same campaign. Full URLs must use HTTPS on zeffy.com or www.zeffy.com. The script accepts only an `/embed/` URL for the iframe. No account keys or secrets belong in the repository.
5. Confirm the live campaign is NSF's, that payment and receipt settings are correct, and that the amount/frequency options match the organization's intended setup. Review the optional contribution to Zeffy and make its optional nature clear.
6. Verify the real checkout on desktop and mobile, iframe sizing and scrolling, keyboard access, the direct-link fallback, and successful receipt/payout verification before saying online giving works. Never infer successful payment from an iframe load.
7. Publish related changes together. The homepage support button and Get Involved Donate card link to the branded donation page. Keep general contact forms and sponsorship documents distinct from payment collection.

Do not initiate financial transactions or open financial accounts on the user's behalf. Any live test payment must be completed by the user.

Official embedding instructions: https://support.zeffy.com/how-to-embed-your-zeffy-campaign-on-your-website-km0gv

The embed omits campaign branding and story; the Foundation page provides those. A direct public campaign link remains visible whenever checkout is configured.

Run `node scripts/test-donation.cjs` for local checks of URL validation, script-failure fallback, and campaign/link consistency. These checks do not submit donations or verify payment, email delivery, tax receipt issuance, or payouts.
