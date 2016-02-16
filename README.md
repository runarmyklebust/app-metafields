# SEO Meta Fields app for Enonic XP version 6

This Enonic XP application adds [Open Graph](http://ogp.me/) meta-tags to your [Enonic XP](https://github.com/enonic/xp) site, it also let's you better customize your site's title tag and meta description information on each page and content. By applying mixin fields to each content you can easily improve your SEO and social sharing presence for your sites and apps.

This app will add this to your site:

1. Open Graph meta data
2. Update (or insert) SEO friendly titles
3. SEO meta description

## Building and deploying

There are two options. One is to simply download the app [JAR file](http://repo.enonic.com/public/com/enonic/social/app-metafields/1.0.0/app-metafields-1.0.0.jar) and move it to the XP installation's `$XP_HOME/deploy` folder.

Or you can build this app with gradle. First, download the zip file of this repo. Unpack it locally. In the terminal, from the root of the project, type `./gradlew build`. On Windows, just type `gradlew build`. Next, move the JAR file from `build/libs` to your `$XP_HOME/deploy` directory. The SEO Meta Fields app will now be available to add to your websites through the Content Manager admin tool in Enonic XP.

If you are upgrading to a newer version of this app, make sure to remove the old version's JAR file from the `$XP_HOME/deploy` directory.

## How to use this app

This app introduces a few settings for you. The settings are controlled on the app itself on your site. These settings are used on the entire site, and/or as default fallback settings.

1. Default settings
2. Title behaviour
3. Custom json paths

### Default settings

This app adds Open Graph, description, and title meta fields on all your pages. If you have set any custom data inside any content, this data will be used. However, on some pages, there might not be any custom data set, like on your sites first page. That's what the first settings are for: default fallbacks. Here you can add an image to be used for Open Graph. You can at the same time customize any fallback title and meta description.

### Title behaviour

With the title configuration you can control how we create the titles for you. If you already have a `<title>` tag in your source html, we will overwrite it and use it's location in the source code. If you do not have this tag already, we will append it at the end of the `<head>`-tag.

The settings here let you control if you want to add the site's name at the end of all page's title's. You can activate this on all pages, but also control to not do this on the frontpage. There's also an option for controlling what separator sign to use between page name and site name (defaults to the dash character).

### Custom json paths

When figuring out what data to put in your meta fields, this app analyzes the current content you're viewing. It will fetch a pre-defined set of fields in a pre-defined order (more on that later). You might however have fields with different names, or want to add more fields, or control in which order the data is evaluated. Then these settings are for you.

Add field names as comma separated strings, like `field1, field2, long-fieldname3`. It will remove spaces and it will handle dashes and other special characters in your field names. These custom fields will preceed any other fields this app looks in. If you add more than one field here, we'll let the first one overwrite any other fields on it right hand side. So if we find data in `field2` we won't look in `long-fieldname3`.

We only evaluate for matches in the json `data`-node for each content.

## Waterfall logic for meta fields

After adding this app you should see `SEO Metadata` fields on both your site and on all of your contents. We will always add the meta fields for title and description, and most of the meta fields for Open Graph. However, if we cannot find any image to use, we won't add the meta fields for Open Graph image.

It's important to understand the waterfall logic we use when evaluating which data to use for our meta fields (with the first match/hit overwriting all the following ones):

### For the title

1. Current content's `SEO Metadata` mixin's `title` field
2. The app config has custom json path added (in the order defined)
3. Check in some commonly used fields: `title`, `header`, `heading`
4. The content's `displayName` field (all content has this field)
5. See if the site itself has the `SEO Metadata` field `title` filled out
6. As a last resort, we default to the site's `displayName` field.

### For the description

1. Current content's `SEO Metadata` mixin's `description` field
2. The app config has custom json path added (in the order defined)
3. Check in some commonly used fields: `preface`, `description`, `summary`
4. See if the site itself has the `SEO Metadata` field `description` filled out
5. As a last resort, we default to the site's `description` field.

### For images

1. The app config has custom json path added (in the order defined)
2. Check in some commonly used fields: `image`, `images`
3. Resort to the default images set on the app itself
4. If still nothing is found we won't show an image at all (the meta fields for the image are not added).

## Releases and Compatibility

| Version        | XP version |
| ------------- | ------------- |
| 1.0.0 | 6.3.1 |
| 0.5.0 | 6.3.0 |

## Changelog

### Version 1.0.0

* App is launched
* Renamed to SEO Meta Fields
* Multiple changes and improvements
* **NOT** compatible with the older versions

### Version 0.5.0

* First Beta-launch (as "Open Graph app")