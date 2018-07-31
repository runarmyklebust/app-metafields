var libs = {
	portal: require('/lib/xp/portal'),
	content: require('/lib/xp/content'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	util: require('/lib/enonic/util'),
	local: require('/lib/local')
};

var localeMap = {
    da: 'da_DK',
    sv: 'sv_SE',
    pl: 'pl_PL',
    no: 'nb_NO',
    en: 'en_US'
};

exports.getSite = function() {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	var sitesResult = libs.content.query({
		query: "_path LIKE '/content/*' AND data.siteConfig.applicationKey = '" + app.name + "'",
		contentTypes: ["portal:site"]
	});
	//libs.util.log(sitesResult);
	// TODO: we need to order this result so we don't get random site.
	return sitesResult.hits[0];
}

exports.get = function(req) {

	var content = libs.content.get({
		key: req.params.contentId
	});
	//libs.util.log(content);
	//return;
/*
	TODO: Display content settings? If any, then fallbacks.
	x": {
     "com-enonic-app-metafields": {
         "meta-data"
*/

	var site = exports.getSite();
	//libs.util.log(site);
	var siteConfig = libs.local.getSiteConfig(site, app.name);
	//libs.util.log(siteConfig);
	//return;
	var lang = content.language || site.language || 'en';
	var frontpage = site._path === content._path;
	var pageTitle = libs.local.getPageTitle(content, site);
	var description = libs.local.getMetaDescription(content, site);

	// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
	var titleAppendix = '';
	if (siteConfig.titleBehaviour || !siteConfig.hasOwnProperty("titleBehaviour") ) {
		 var separator = siteConfig.titleSeparator || '-';
		 var titleRemoveOnFrontpage = siteConfig.hasOwnProperty("titleFrontpageBehaviour") ? siteConfig.titleFrontpageBehaviour : true; // Default true needs to be respected
		 if (!frontpage || !titleRemoveOnFrontpage) {
			  titleAppendix = ' ' + separator + ' ' + site.displayName;
		 }
	}

	var siteVerification = siteConfig.siteVerification || null;

	var url = libs.portal.pageUrl({ path: content._path, type: "absolute" });
	var isFrontpage = site._path === content._path;
	var fallbackImage = siteConfig.seoImage;
	var fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
	if (isFrontpage && siteConfig.frontpageImage) {
		 fallbackImage = siteConfig.frontpageImage;
		 fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
	}
	var image = libs.local.getOpenGraphImage(content, site, fallbackImage, fallbackImageIsPrescaled);
/*
	var params = {
		 title: pageTitle,
		 description: libs.local.getMetaDescription(content, site),
		 siteName: site.displayName,
		 locale: localeMap[lang] || localeMap.en,
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
*/
	// Handle injection of title - use any existing tag by replacing its content.
	var fullTitle = pageTitle + titleAppendix;

	var params = {
		summary: {
			title: pageTitle,
			fullTitle: fullTitle,
			description: description,
			image: image,
			canonical: url
		},
		og: {
			image: image
		},
		twitter: {
			image: image
		}
	};

	return {
		body: libs.thymeleaf.render( resolve('seo.html'), params),
		contentType: 'text/html'
	};
};
