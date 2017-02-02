# SEO Meta Fields app for Enonic XP

This Enonic XP application adds a multitude of helpful meta fields for your [Enonic XP](https://github.com/enonic/xp) site. Like [Open Graph](http://ogp.me/) meta fields, [Twitter Cards](https://dev.twitter.com/cards/overview) meta fields, [Google Search Console](https://www.google.com/webmasters/tools) meta tag, and more! It also let's you better customize your site's and contents' title tag and meta description information. By applying mixin fields to each content you can easily finetune your sites' SEO and social sharing!

This app will add the following functionality to your site:

1. SEO friendly titles
2. SEO meta description
3. Open Graph meta data
4. Twitter Cards meta data
5. Google Search Console meta tag
6. Canonical meta tag
7. Robots.txt exclude setting

## Building and deploying

You have three options: One is to simply download the app [JAR file](http://repo.enonic.com/public/com/enonic/app/metafields/1.3.1/metafields-1.3.1.jar) and move it to the XP installation's `$XP_HOME/deploy` folder.

Or you can build this app with Gradle. First, download the zip file of this repo. Unpack it locally. In the terminal, from the root of the project, type `./gradlew build`. On Windows, just type `gradlew build`. Next, move the newly generated JAR file from `build/libs` to your `$XP_HOME/deploy` directory.

Or you can just go into the Enonic XP Application admin tool and install the app from the [Enonic Market](https://market.enonic.com/).

The SEO Meta Fields app will then be available to add to your websites through the Content Studio admin tool in Enonic XP. Edit your site content to add an Enonic XP app like this one.

## How to use this app

After adding this app you should see `SEO Metadata` fields on your site and on all of your contents. With these fields you can set a custom title and description on each content, used only for SEO purposes.

**NB!** You do not need to change anything in your sites code for this app to work. It will however add meta description, Twitter Cards, and Open Graph meta fields even if you already added this in your code, so please remove those fields first! The logic behind adding a SEO friendly title is smarter and it will never insert duplicate `<title>` tags.

This app introduces a few settings. They're controlled on the app itself on your site and are used on the entire site, and/or as default fallback settings.

1. General settings
2. Twitter Cards
3. Fallback settings
4. Title config
5. Advanced: prioritized JSON paths

### General settings

**"Generate Canonical meta?"**  
Turn generation of canonical meta field on or off. Default is off, since most sites ship with this already. If checked, it will generate the meta tag with current URL. The logic is simple, it will use the current content's path as value, something we know in Enonic XP always is unique.

**"Google Search Console (site verification code)"**  
Add meta tag for Google Search Console (formerly known as Google Webmaster Tools). Just fill in your ID here to generate the proper tag on all pages. Consult your Google Search Console login for finding this ID.

**"Hide site from search engines?"**  
We also introduce a setting for hiding the entire site from search engine robots. This might be handy when wanting to have a live beta site but not letting search engine index it. It's up to the search engines to respect this setting, and this setting does not hide the pages from outside visitors as links to them and direct URL's will still work.

### Twitter Cards

For Twitter Cards to work we need a Twitter username (starting with `@`). When that is in place we can generate meta data for improved Twitter sharing called "Twitter Cards". By omitting the username no such meta data will be generated.

### Fallback settings

This app tries to figure out which data to use for all the meta fields based on the current content. However, on some pages, there might not be any custom data set, like on your site's first page. That's what these settings are for: default fallbacks. Here is where you add a default image to fallback on for Open Graph and Twitter Cards, and any fallback title and meta description. If nothing is added here, and the app can't figure out any suitable data to use for a content, the meta fields are not generated at all.

### Title config

With the title configuration you can control how we create the titles for you. If you already have a `<title>` tag in your source html, we will overwrite it and use it's location in the source code. It's pretty clever this way. If you do not have this tag already, we will append it at the end of the `<head>`-tag.

The settings here let you control if you want to add the site's name at the end of all pages' titles. You can activate this on all pages, but also control to not do this on the front page. There's also an option for controlling what separator sign to use between page name and site name (defaults to the dash character).

Note: Meta fields for Open Graph and Twitter Cards does not use these settings, it never adds site name to it's title meta field as it is redundant data.

### Advanced: prioritized JSON paths

When figuring out what data to put in your meta fields, this app analyzes the current content you're viewing. It will fetch a pre-defined set of fields in a pre-defined order (more on that later in the "Waterfall logic" section). You might however have fields with different names, or want to add more fields, or control in which order the data is evaluated. Then these settings are for you.

Add field names as comma separated strings, like `field1, field2, long-fieldname3`. It will remove spaces and it will handle dashes and other special characters in your field names. These custom fields will be checked before any other fields. If you add more than one field here, we'll let the first one overwrite any other fields on its right hand side. So if we find data in `field2` we won't look in `long-fieldname3`. This gives you powerful control over your SEO!

We only evaluate for matches in the JSON `data`-node for each content. So if you fill in `myField`, we'll look for `data.myField` in the content JSON (refer to Enonic XP's documentation on `getContent()` function).

## Waterfall logic for meta fields

We will always add the meta fields for title and description, and most of the meta fields for Open Graph. However, if we cannot find any image to use, we won't add the meta fields for Open Graph image or Twitter Cards image.

It's important to understand the waterfall logic we use when evaluating which data to use for our meta fields (with the first match overwriting all the following ones):

### For titles

1. Current content's `SEO Metadata` mixin's `title` field.
2. The app config's custom JSON paths, if any (in the order defined).
3. Check in some commonly used fields: `title`, `header`, `heading`.
4. The content's `displayName` field (all content has this field).
5. See if the site itself has the `SEO Metadata` field `title` filled out.
6. As a last resort, we default to the site's `displayName` field.

For titles there is no way it can be empty, at least the last fallback will always trigger.

### For descriptions

1. Current content's `SEO Metadata` mixin's `description` field.
2. The app config's custom JSON paths, if any (in the order defined).
3. Check in some commonly used fields: `preface`, `description`, `summary`.
4. See if the site itself has the `SEO Metadata` field `description` filled out.
5. As a last resort, we default to the site's `description` field (default Enonic XP data).
6. An empty description is created.

### For images

1. The app config's custom JSON paths, if any (in the order defined).
2. Check in some commonly used fields: `image`, `images`.
3. Resort to the fallback image set on the app itself.
4. If nothing is found the meta fields for the image are not created.

## Releases and Compatibility

| Version | XP version |
| ------------- | ------------- |
| 1.3.1 | 6.7.0 |
| 1.3.0 | 6.7.0 |
| 1.2.0 | 6.7.0 |
| 1.1.4 | 6.7.0 |
| 1.1.3 | 6.4.0 |
| 1.1.2 | 6.4.0 |
| 1.1.1 | 6.4.0 |
| 1.1.0 | 6.4.0 |
| 1.0.0 | 6.3.0 |
| 0.5.0 | 6.3.0 |

## Changelog

### Version 1.3.1

* Greatly improved usability of app by adding help texts to all the fields.
* Changed the overall structure of settings for the app. Now with more logical groups (field sets).
* Gave multiple labels improved names, making it more obvious what they do.
* Improved documentation (this file).
* Regex force Twitter username to always begin with the @ symbol.
* Added default settings for frontpage behavior, it now starts as checked.
* Setting for "Append site name to title" now starts out as checked.
* Added "-" as the default page-site title separator.

### Version 1.3.0

* Added Twitter Card meta data generation.
* Added canonical meta data generation.

### Version 1.2.0

* Fixed bug where user-defined paths for meta description always failed.
* Fixed a bug on how multiple user-defined paths (for all scenarios) where trimmed (only first field worked if space characters where used between the commas).
* Prefer user-defined paths before content DisplayName, when generating titles.
* Updates to readme to reflect the new and improved "waterfall" logic (also contained some errors).

### Version 1.1.4

* Upgrade to version 6.7.3

### Version 1.1.3

* Better handle data from CMS2XP (empty data fields) for custom fields setting

### Version 1.1.2

* Fix some minor code consistency things
* Use the new lib-util library (1.1.1)

### Version 1.1.1

* Fix crash on page contribution handling on new sites
* Fix crash on "robot" toggle on new sites

### Version 1.1.0

* Added settings on app, and for all content, to "exclude from search" (robots)
* Added setting for Google search console (old webmaster tools)
* Improved handling of nulls, empties, and multiple app setups

### Version 1.0.0

* App is launched
* Renamed to SEO Meta Fields
* Multiple changes and improvements
* **NOT** compatible with the older versions

### Version 0.5.0

* First Beta-launch (as "Open Graph app")
