# Open Graph app

An app to give your Site support for Open Graph meta data, automatically extracted from current content (if possible) with possibility to define some default fallbacks.

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
- [ ] Support mixin as x-data and inline (waterfall through)
- [ ] Support more names for all fields ("image", "images", "photo", etc), create waterfall logic
- [x] If siteConfig (app config) not set, also fallback to parent site data

## Nice-to-have TODO:s

- [ ] Let user control how page title is built up
  - [ ] Always append site name?
  - [ ] Title page and site name separator?
  - [ ] Remove sitename append on frontpage?
- [ ] Ability to choose og-image format (small/portrait, wide) for site

## Big TODO:s

- [ ] Remove the mixin and "force" it to be added by all sites?
- [ ] Or ... expand this App to also do SEO-stuff (then mixin is useful for both)