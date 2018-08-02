var libs = {
	portal: require('/lib/xp/portal'),
	content: require('/lib/xp/content'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	util: require('/lib/enonic/util'),
	local: require('/lib/local')
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
/*
	TODO: Display content settings? If any, then fallbacks.
	x": {
     "com-enonic-app-metafields": {
         "meta-data"
*/
	var content = libs.content.get({ key: req.params.contentId });
	var site = exports.getSite();
	var siteConfig = libs.local.getSiteConfig(site, app.name);

	var isFrontpage = site._path === content._path;

	var pageTitle = libs.local.getPageTitle(content, site);
	var titleAppendix = libs.local.getAppendix(site, siteConfig, isFrontpage);
	var description = libs.local.getMetaDescription(content, site);
	if (description === '') description = null;

	var frontpageUrl = libs.portal.pageUrl({ path: site._path, type: "absolute" });
	var url = libs.portal.pageUrl({ path: content._path, type: "absolute" });
	var justThePath = url.replace(frontpageUrl,'');

	var fallbackImage = siteConfig.seoImage;
	var fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
	if (isFrontpage && siteConfig.frontpageImage) {
		 fallbackImage = siteConfig.frontpageImage;
		 fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
	}
	var image = libs.local.getOpenGraphImage(content, site, fallbackImage, fallbackImageIsPrescaled);

	var params = {
		summary: {
			title: pageTitle,
			fullTitle: (pageTitle + titleAppendix),
			description: description,
			image: image,
			canonical: (siteConfig.canonical ? justThePath : null),
			blockRobots: (siteConfig.blockRobots || libs.local.getBlockRobots(content))
		},
		og: {
			type: (isFrontpage ? 'website' : 'article'),
			title: pageTitle,
			description: description,
			siteName: site.displayName,
			url: justThePath,
			locale: libs.local.getLang(content,site),
			image: {
				src: image,
				width: 1200, // Twice of 600x315, for retina
				height: 630
			}
		},
		twitter: {
			active: (siteConfig.twitterUsername ? true : false),
			title: pageTitle,
			description: description,
			image: image,
			site: siteConfig.twitterUsername || null
		},
		assetsUrl: libs.portal.assetUrl({path: ""})
	};

	return {
		body: libs.thymeleaf.render( resolve('seo.html'), params),
		contentType: 'text/html'
	};
};
