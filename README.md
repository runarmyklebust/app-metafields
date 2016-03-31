# SEO Meta Fields app for Enonic XP version 6

This Enonic XP application adds [Open Graph](http://ogp.me/) meta-tags to your [Enonic XP](https://github.com/enonic/xp) site, it also let's you better customize your site's title tag and meta description information on each page and content. By applying mixin fields to each content you can easily improve your SEO and social sharing presence for your sites and apps.

This app will add this functionality to your site:

1. SEO friendly titles
2. SEO meta description
3. Open Graph meta data
4. Google search console tag
5. Robots exclude setting

## Building and deploying

There are two options. One is to simply download the app [JAR file](http://repo.enonic.com/public/com/enonic/app/metafields/1.1.2/metafields-1.1.2.jar) and move it to the XP installation's `$XP_HOME/deploy` folder.

Or you can build this app with Gradle. First, download the zip file of this repo. Unpack it locally. In the terminal, from the root of the project, type `./gradlew build`. On Windows, just type `gradlew build`. Next, move the JAR file from `build/libs` to your `$XP_HOME/deploy` directory. The SEO Meta Fields app will now be available to add to your websites through the Content Manager admin tool in Enonic XP.

If you are upgrading to a newer version of this app, make sure to remove the old version's JAR file from the `$XP_HOME/deploy` directory.

## How to use this app

After adding this app you should see `SEO Metadata` fields on both your site and on all of your contents. With these fields you can on each content set a custom title and description to be used on your site for SEO purposes.

**NB!** You do not need to change anything in your sites code for this app to work. It will however add meta description and open graph meta fields even if you already added this in your code, so please remove those fields first! The logic behind adding a SEO friendly title is smarter and it will never insert duplicate `<title>` tags.

This app introduces a few settings. They're controlled on the app itself on your site and are used on the entire site, and/or as default fallback settings.

1. Default settings
2. Search engine settings
3. Title behavior
4. Custom JSON paths

### Default settings

This app tries to figure out which data to use for all the meta fields based on the current content. However, on some pages, there might not be any custom data set, like on your site's first page. That's what the first settings are for: default fallbacks. Here is where you add an image to be used for Open Graph and any fallback title and meta description.

### Search engine settings

Add meta tag for Google search console (formerly known as Google Webmaster Tools). Just fill in your ID here to generate the proper tag on all pages.
Here we also introduce a setting for hiding the entire site from search engine robots.

### Title behavior

With the title configuration you can control how we create the titles for you. If you already have a `<title>` tag in your source html, we will overwrite it and use it's location in the source code. If you do not have this tag already, we will append it at the end of the `<head>`-tag.

The settings here let you control if you want to add the site's name at the end of all page's title's. You can activate this on all pages, but also control to not do this on the front page. There's also an option for controlling what separator sign to use between page name and site name (defaults to the dash character).

Meta fields for Open Graph does not use these settings, it never adds site name to it's title meta field as it is redundant data.

### Custom json paths

When figuring out what data to put in your meta fields, this app analyzes the current content you're viewing. It will fetch a pre-defined set of fields in a pre-defined order (more on that later). You might however have fields with different names, or want to add more fields, or control in which order the data is evaluated. Then these settings are for you.

Add field names as comma separated strings, like `field1, field2, long-fieldname3`. It will remove spaces and it will handle dashes and other special characters in your field names. These custom fields will be checked before any other fields. If you add more than one field here, we'll let the first one overwrite any other fields on it right hand side. So if we find data in `field2` we won't look in `long-fieldname3`.

We only evaluate for matches in the JSON `data`-node for each content.

## Waterfall logic for meta fields

We will always add the meta fields for title and description, and most of the meta fields for Open Graph. However, if we cannot find any image to use, we won't add the meta fields for Open Graph image.

It's important to understand the waterfall logic we use when evaluating which data to use for our meta fields (with the first match/hit overwriting all the following ones):

### For the title

1. Current content's `SEO Metadata` mixin's `title` field
2. The app config has custom JSON path added (in the order defined)
3. Check in some commonly used fields: `title`, `header`, `heading`
4. The content's `displayName` field (all content has this field)
5. See if the site itself has the `SEO Metadata` field `title` filled out
6. As a last resort, we default to the site's `displayName` field.

### For the description

1. Current content's `SEO Metadata` mixin's `description` field
2. The app config has custom JSON path added (in the order defined)
3. Check in some commonly used fields: `preface`, `description`, `summary`
4. See if the site itself has the `SEO Metadata` field `description` filled out
5. As a last resort, we default to the site's `description` field.

### For images

1. The app config has custom JSON path added (in the order defined)
2. Check in some commonly used fields: `image`, `images`
3. Resort to the default images set on the app itself
4. If still nothing is found we won't show an image at all (the meta fields for the image are not added).

## Releases and Compatibility

| Version        | XP version |
| ------------- | ------------- |
| 1.1.2 | 6.4.0 |
| 1.1.1 | 6.4.0 |
| 1.1.0 | 6.4.0 |
| 1.0.0 | 6.3.1 |
| 0.5.0 | 6.3.0 |

## Changelog

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
