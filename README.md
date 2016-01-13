# Open Graph app

An app to give your Site support for Open Graph meta data, automatically extracted from current content (if possible) with possibility to define some default fallbacks.

## TODO

- [x] Actually use the data from site.xml (defaults)
- [ ] Let user control how page title is built up
  - [ ] Always append site name?
  - [ ] Title page and site name separator?
  - [ ] Remove sitename append on frontpage?
- [ ] Support mixin as x-data and inline (waterfall through)
- [ ] Support more names for all fields ("image", "images", "photo", etc), create waterfall logic
- [ ] If siteConfig (app config) not set, also fallback to parent site data

## Big TODO:s

- [ ] Remove the mixin and "force" it to be added by all sites?
- [ ] Or ... expand this App to also do SEO-stuff (then mixin is useful for both)