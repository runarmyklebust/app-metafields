# Open Graph app

This Enonic XP application adds [Open Graph](http://ogp.me/) meta-tags to your
site by applying mixin fields to each content (or as a site-wide setting). This
is a great way to improve your SEO and social sharing presence.

## Usage

Clone this project, deploy it to your server and add the `Open Graph App`
application to your site. This app introduces a few settings for you. One part
is for the default data to use when generating Open Graph meta data (it's always good
to have some fallbacks). The second part is for how to "design" your page titles as they
will be generated and inserted automatically into your site.

After adding this app you should see `SEO Metadata` fields on both
your site and on all of your contents. We select the information to use based on
the following:

### For title and description

- If a content has a SEO title or description field filled out, we use that
- If not, but the app config has custom json path / input names to look for,
we'll use these values (in the order defined)
- If no custom fields added, but the content has a `displayName` (title) or
`[preface, description, summary]` (description) field, we fall back to those fields.
- If not, but the site itself has the SEO Metadata fields filled out, we fall
back to those fields.
- As a last resort, we default to the site's name and description fields.

### For images
- If the app config has custom json path / input names to look for, we'll use these
values (in the order defined) to find an image on the current content.
- If no custom fields added, we'll check for commonly used field names like `image`
or `images` and use that
- If not, but the Opengraph app has been set up with a default image for the site in
question, we fall back to that image (your logo for example).
- If neither is set, we don't show an image (the tags are not added).
