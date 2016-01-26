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
- If a content has an `image` or `images` ContentSelector, we use that
- If not, but the Opengraph app has been set up with a default image for the
site in question, we fall back to that image (your logo for example).
- If neither is set, we don't show an image (the tags are not added).
