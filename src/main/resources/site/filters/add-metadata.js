var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util'),
    local: require('/lib/local')
};

var view = resolve('add-metadata.html');

exports.responseFilter = function(req, res) {
    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var isFrontpage = site._path === content._path;
    var pageTitle = libs.local.getPageTitle(content, site);
    var titleAppendix = libs.local.getAppendix(site, isFrontpage);

    var siteVerification = siteConfig.siteVerification || null;

    var url = libs.portal.pageUrl({ path: content._path, type: "absolute" });
    var fallbackImage = siteConfig.seoImage;
    var fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
    if (isFrontpage && siteConfig.frontpageImage) {
        fallbackImage = siteConfig.frontpageImage;
        fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
    }
    var image = libs.local.getOpenGraphImage(content, site, fallbackImage, fallbackImageIsPrescaled);

    var params = {
        title: pageTitle,
        description: libs.local.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: libs.local.getLang(content,site),
        type: isFrontpage ? 'website' : 'article',
        url: url,
        image: image,
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630,
        blockRobots: siteConfig.blockRobots || libs.local.getBlockRobots(content),
        siteVerification: siteVerification,
        canonical: siteConfig.canonical,
        twitterUserName : siteConfig.twitterUsername

    };

    var metadata = libs.thymeleaf.render(view, params);

    // Force arrays since single values will be return as string instead of array
    res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);
    res.pageContributions.headEnd.push(metadata);

    // Handle injection of title - use any existing tag by replacing its content.
	 // Also - Locate the <html> tag and make sure the "og" namespace is added.
    var titleHtml = '<title>' + pageTitle + titleAppendix + '</title>';
	 var ogAttribute = 'og:http://ogp.me/ns#';
    var titleAdded = false, ogAdded = false;
    if (res.contentType === 'text/html') {
         if (res.body) {
            if (typeof res.body === 'string') {
                // Find a title in the html and use that instead of adding our own title
                var titleHasIndex = res.body.indexOf('<title>') > -1;
                if (titleHasIndex) {
                    res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
                    titleAdded = true;
                }
					 // Find <html> and if it does not have proper "og"-prefix - inject it!
					 var htmlIndex = res.body.indexOf('<html');
					 var endHtmlIndex = res.body.indexOf('>', htmlIndex);
					 var htmlTagContents = res.body.substr(htmlIndex+5, endHtmlIndex-htmlIndex-5).trim(); // Inside <html XX> - 5 is number of characters for <html
					 var htmlTagAttributes = htmlTagContents.split(" "); // Split on space so we can locate
				 	 /*
					 log.info(htmlIndex+5);
					 log.info(endHtmlIndex-htmlIndex+5);
					 log.info(htmlIndex);
					 log.info(endHtmlIndex);
					 libs.util.log(htmlTagAttributes);
					 */
					 var prefixFound = false;
					 for (var i = 0; i < htmlTagAttributes.length; i++) {
					 	var keyValues = htmlTagAttributes[i].split("=");
						if (keyValues[0].trim() === 'prefix') {
							keyValues[1] += ' ' + ogAttribute;
							prefixFound = true;
							htmlTagAttributes[i] = keyValues.join("=");
						}
					 }
					 if (!prefixFound) {
						 htmlTagAttributes.push('prefix="' + ogAttribute + '"');
					 }
					 var fixedHtmlTag = htmlTagAttributes.join(" ");
					 res.body = res.body.substr(0, htmlIndex+5)
					 			 + ' '
					 			 + fixedHtmlTag
					 			 + res.body.substr(endHtmlIndex);
/*
					 var attributeIndex = res.body.indexOf('prefix=', htmlIndex);
					 if (attributeIndex > endHtmlIndex) { attributeIndex = -1; } // Reset attributeIndex if found outside of html-tag.
					 var htmlHasIndex = htmlIndex > -1;
					 var ogHasIndex = res.body.indexOf('<html' + ogAttribute) > -1;
                if (htmlHasIndex && !ogHasIndex) {
                    res.body = res.body.substr(0, htmlIndex+5) + ogAttribute + res.body.substr(htmlIndex+5);
                    ogAdded = true;
                }
*/
            }
        }
    }
    if (!titleAdded) {
        res.pageContributions.headEnd.push(titleHtml);
    }

    if (req.params) {
        if (req.params.debug === 'true') {
            res.applyFilters = false; // Skip other filters
        }
     }

    return res;
};
