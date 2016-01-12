var libs = {
    util: require('/lib/enonic/util/util'),
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    content: require('/lib/xp/content'),
    site: require('/lib/site')
};

var log = libs.util.log;

exports.getHandler = function(req, bodyclass, view){

    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var model = {};
    model.sitePath = site['_path'];
    model.siteLang = lang;
    model.pageTitle = libs.site.getPageTitle(content, site);
    model.metaDescription = libs.site.getMetaDescription(content, site);

    var eng_content = libs.content.get({
        'key': siteConfig.english
    });

// Language is not set per content automatically, so if empty check path for "en" ... kind of ugly, but works fast
/*
    var lang = "no";

    var eng_content = libs.content.get({
        'key': siteConfig.english
    });

    var thepath = eng_content._path; //"/kopinor/en/";
    var pathlength = thepath.length;

    if (!content.language) {
        if ( content._path.substring(0,pathlength) === thepath ) {
            lang = "en";
        } else {
            lang = "no";
        }
    } else {
        lang = content.language;
    }
*/
    var lang = libs.site.getLang(content);
// End language setting


// Start of Open Graph
    var og = {};
    og.title = model.pageTitle;
    og.description = model.metaDescription;
    og.type = ( model.sitePath === content["_path"] ) ? "website" : "article";
    og.sitename = site['displayName'];
    var locale;
    switch (lang) {
        case "en": locale = "en_GB"; break;
        default: locale = "nb_NO"; break;
    }
    og.locale = locale;
    var currentpage = libs.portal.pageUrl({
        path: content["_path"],
        type: "absolute"
    });
    og.url = currentpage;

    og.image = libs.site.getOpenGraphImage(content, siteConfig["og-default"]);
    og.image_width = 600;
    og.image_height = 315;

    model.og = og;
// End of Open Graph

    var footerContent = getFooterContent();

    var params = {
        loginUrl: loginUrl,//libs.portal.pageUrl(siteConfig.loginpage),
        searchResultUrl: searchResultUrl,//libs.portal.pageUrl(siteConfig.searchresultpage),
        bodyclass: bodyclass, //'defualt',
		displayName: content.displayName,
		title: site._name,
        path: site._path,
		mainRegion: content.page.regions['main'],
        showsubmenu: content.page.config['showsubmenu'],
        menuitems: menuitems,
        submenus: submenu,
        footerContent: footerContent,
        language: lang,

        siteLang: model.siteLang,
        og: model.og,
        pageTitle: model.pageTitle,
        metaDescription: model.metaDescription,
        lang_btn_url: lang_btn_url,
        lang_btn_label: lang_btn_label
    };


	return {
		body: libs.thymeleaf.render(view, params),
		contentType: 'text/html'
	};

};