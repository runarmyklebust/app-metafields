var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

var view = resolve('add-metadata.html');


exports.responseFilter = function (req, res) {

    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var trackingScript = '<!-- I was here - again =) -->';

	var params = {};
	var og = {};

	og.description = "I was here too";

    var pageTitle = libs.site.getPageTitle(content, site);
    var metaDescription = libs.site.getMetaDescription(content, site);

    var og = {};
    og.title = pageTitle;
    og.description = metaDescription;

	// Set Language/locale
	var lang;
    if (!content.language) {
        if (!site.language) {
            lang = "en";
        } else {
            lang = site.language;
        }
    } else {
        lang = content.language;
    }
    // Format locale into the ISO format that Open Graph wants
	var locale;
	switch (lang) {
		case "da": locale = "da_DK"; break;
		case "sv": locale = "sv_SE"; break;
		case "pl": locale = "pl_PL"; break;
		case "no": locale = "nb_NO"; break;
		default: locale = "en_GB"; break;
	}
	og.locale = locale;

    og.type = ( site['_path'] === content["_path"] ) ? "website" : "article";
    og.sitename = site['displayName'];

    var currentpage = libs.portal.pageUrl({
        path: content["_path"],
        type: "absolute"
    });
    og.url = currentpage;

    var ogImage = libs.site.getOpenGraphImage(content, siteConfig["og-default"]);

    og.image = ogImage;
    og.image_width = 600;
    og.image_height = 315;

    params.og = og;

	var metadata = libs.thymeleaf.render(view, params);

    if (!res.pageContributions.headEnd) {
        res.pageContributions.headEnd = [];
    }
    res.pageContributions.headEnd.push(trackingScript);
    res.pageContributions.headEnd.push(metadata);

    if (req.params.debug === 'true') {
        res.applyFilters = false; // skip other filters
    }

    return res;
};