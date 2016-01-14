# Open Graph app

This Enonic XP application adds [Open Graph](http://ogp.me/) meta-tags to your
site by applying mixin fields to each content (or as a site-wide setting). This
is a great way to improve your SEO and social sharing presence.

## Usage

Clone this project, deploy it to your server and add the `Opengraph App`
application to your site. You should now see `SEO Metadata` fields on both
your site and on all of your contents. We select the information to use based on
the following:

### For title and description

- If a content has a SEO title or description field filled out, we use that
- If not, but the content has a `displayName` (title) or
`[preface, description, summary]` (description) field, we fall back to those
fields.
- If not, but the site itself has the SEO Metadata fields filled out, we fall
back to those fields.
- As a last resort, we default to the site's name and description fields.

### For images
- If a content has a `image` or `images` ContentSelector, we use that
- If not, but the Opengraph app has been set up with a default image for the
site in question, we fall back to that image (your logo for example).
- If neither is set, we don't show an image (the tags are not added).

## Important TODO

- [x] Add mixin for SEO override per content (title, description)
- [x] Default settings in site.xml
- [x] Function to get Title
- [x] Function to get Description
- [x] Function to get og image
- [x] Create metadata html and send with filter + pageContributions to head
  - [x] Filter controller
  - [x] Filter view
- [x] Actually use the data from site.xml (defaults)
- [ ] Support more names for all fields ("image", "images", "photo", etc), create waterfall logic
  - [x] On Title
  - [x] On Description
  - [ ] On Image
- [x] If siteConfig (app config) not set, also fallback to parent site data

## Nice-to-have TODO:s

- [ ] Let user control how page title is built up
  - [ ] Always append site name?
  - [ ] Title page and site name separator?
  - [ ] Remove sitename append on frontpage?
- [ ] Ability to choose og-image format (small/portrait, wide) for site
- [ ] ~~Support mixin as both x-data and inline (waterfall through)~~ (not needed because we supply the mixin!)

## Big TODO:s

- [ ] Expand this App to also do SEO-stuff (then mixin is useful for both)
  - [x] Control meta description
  - [ ] Control title (detect if already present - then replace)
