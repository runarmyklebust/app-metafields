var libs = {
    portal: require('/lib/xp/portal'),
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
    var pageTitle = libs.site.getPageTitle(content, site);

    // Concat site title?
    var titleAppendix = "";
    if (siteConfig.titleBehaviour) {
        var concatenator = siteConfig.titleSeparator || '-';
        if (!frontpage || !siteConfig.titleFrontpageBehaviour) {
            titleAppendix = ' ' + concatenator + ' ' + site.displayName; // Content Title + Site Title
        }
    }

    var params = {
        title: pageTitle,
        description: libs.site.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: localeMap[lang] || localeMap.en,
        type: site._path === content._path ? 'website' : 'article',
        url: libs.portal.pageUrl({ path: content._path, type: "absolute" }),
        image: libs.site.getOpenGraphImage(content, siteConfig.seoImage),
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630,
        blockRobots: siteConfig.blockRobots || libs.site.getBlockRobots(content)
    };

	var metadata = libs.thymeleaf.render(view, params);

    if (!res.pageContributions.headEnd) {
        res.pageContributions.headEnd = [];
    }

    res.pageContributions.headEnd.push(metadata);

    if ( res.body ) {
        // Can we find a title in the html? Use that instead of adding our own title
        var titleStart = res.body.indexOf('<title>');
        if ( titleStart > -1 ) {
            res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, '<title>' + pageTitle + titleAppendix + '</title>');
            //log.info("Title found, just inserted new title");
        } else {
            // Add title tag, it's not there
            res.pageContributions.headEnd.push('<title>' + pageTitle + titleAppendix + '</title>');
            //log.info("Title not found, appending new title tag with data");
        }
    }

    if (req.params.debug === 'true') {
        res.applyFilters = false; // Skip other filters
    }

    return res;
};
