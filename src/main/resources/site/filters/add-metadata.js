var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util/util'),
    site: require('/lib/site')
};

var view = resolve('add-metadata.html');

// Format locale into the ISO format that Open Graph wants
var localeMap = {
    da: 'da_DK',
    sv: 'sv_SE',
    pl: 'pl_PL',
    no: 'nb_NO',
    en: 'en_US' // 'en_GB' used before
};

exports.responseFilter = function(req, res) {
    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var lang = content.language || site.language || 'en';
    var frontpage = site._path === content._path;

    var params = {
        title: libs.site.getPageTitle(content, site, frontpage),
        description: libs.site.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: localeMap[lang] || localeMap.en,
        type: site._path === content._path ? 'website' : 'article',
        url: libs.portal.pageUrl({ path: content._path, type: "absolute" }),
        image: libs.site.getOpenGraphImage(content, siteConfig['og-default']),
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630
    };

	var metadata = libs.thymeleaf.render(view, params);

    if (!res.pageContributions.headEnd) {
        res.pageContributions.headEnd = [];
    }
    res.pageContributions.headEnd.push(metadata);

    if (req.params.debug === 'true') {
        res.applyFilters = false; // Skip other filters
    }

//    libs.util.log(req);
//    libs.util.log(res);

    return res;
};
