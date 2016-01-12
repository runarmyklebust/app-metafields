var portal = require('/lib/xp/portal');
var content = require('/lib/xp/content');
var UTIL = require('/lib/enonic/util/util');

// A place for site specific functions that I don't want to polute the controllers with.
// Include it in any controller like so:

// var SITE = require('/lib/site');

// Use any of the functions like so:

// SITE.getPageTitle(content, site);


// "Globals":
var moduleNamePropertyName = app.name.replace(/\./g,'-');


// Get current language based on site, current content, or parent content
exports.getLang = function(data) {

	var siteConfig = portal.getSiteConfig();
	var eng_content = content.get({
		'key': siteConfig.english
	});

	var lang = "no";
	var thepath = eng_content._path;
	var pathlength = thepath.length;

	//log.info(thepath);

	if ( Object.keys(data).length ) {
		//log.info("data.length / object.length = true");
		if (!data.hasOwnProperty('language')) {
			//log.info("has not language setting");
			if ( data._path.substring(0,pathlength) === thepath ) {
				//log.info( "content path: " + data._path.substring(0,pathlength) );
				lang = "en";
			} else {
				lang = "no";
			}
		} else {
			lang = data.language;
		}
	}

	//log.info(lang);

	return lang;
}

exports.getPageTitle = function(content, site) {
	var metaTitle = '';

	if (content.x[moduleNamePropertyName]) {
		if (content.x[moduleNamePropertyName]['metadata']) {
			if (content.x[moduleNamePropertyName]['metadata']['seo-title']) {
				metaTitle = content.x[moduleNamePropertyName]['metadata']['seo-title'];
			}
		}
	}

	// No Content SEO title? Use displayName of Content instead (always set).
	if ( metaTitle.trim() === '') {
		metaTitle = content['displayName'];
	}

	// None of that either? Use the Site's title instead. Used when not viewing a Content.
	if ( metaTitle.trim() === '') {
		metaTitle = site.data.title;
	}

	metaTitle = metaTitle + ' - ' + site['displayName']; // Content Title + Site Title

	return metaTitle;
};

exports.getMetaDescription = function(content, site) {
	var metaDescription = '';

	if (content.x[moduleNamePropertyName]) {
		if (content.x[moduleNamePropertyName]['metadata']) {
			if (content.x[moduleNamePropertyName]['metadata']['seo-preface']) {
				metaDescription = content.x[moduleNamePropertyName]['metadata']['seo-preface'];
			}
		}
	}

	if ( metaDescription.trim() === '' ) {
		if (content.data.preface) {
			metaDescription = content.data.preface;
		}
	}

	if ( metaDescription.trim() === '') {
		metaDescription = site.data.description;
	}

	return metaDescription;
};

exports.getOpenGraphImage = function(content, default_img) {
	var image_url = '';
	var og_scale = 'block(600,315)';

	// Find out if there are any images added to this content, and use it for Open Graph
	if ( content.data.image || content.data.images ) {
		var og_images;
		var og_images_arr;

		// Choose the correct attribute - look foor data fields on content called "image" or "images"
		if ( content.data.image ) {
			og_images = content.data.image;
		} else if ( content.data.images ) {
			og_images = content.data.images;
		}

		if (og_images) {
			og_images_arr = UTIL.data.forceArray( og_images );

			if ( og_images_arr.length > 0 ) {
				image_url = portal.imageUrl({
					id: og_images_arr[0],
					scale: og_scale,
					quality: 75,
					format: 'jpg',
					type: 'absolute'
				});
			}
		}
	}

	// No image found, fallback to the default one that's been uploaded in Admin.
	if ( image_url === '' ) {
		if ( default_img ) {
			image_url = portal.imageUrl({
				id: default_img,
				scale: og_scale,
				quality: 75,
				format: 'jpg',
				type: 'absolute'
			});
		}
	}

	if ( image_url === '' ) {
		image_url = null;
	}

	return image_url;
};

// Explode by "/", remove the last element with pop, join again with "/".
exports.removeLastDirectoryPart = function(the_url) {
	var the_arr = the_url.split('/');
	the_arr.pop();
	return( the_arr.join('/') );
};

exports.isSubMenuActivated = function(content) {
	var has_submenu = false;

	// Does it have children
	if ( content.hasChildren ) {

		// Is the menuitem activated
		if ( content.data.menuItem ) {
			has_submenu = true;
		}
	}

	return has_submenu;
};

// We need a unique ID for the html code sometimes, get that from the title. But format must be html valid
exports.getIdFromTitle = function(title) {
	var id = title;
	id = id.toLowerCase();
	id = id.replace(/ /g,"_");
	id = id.replace(/å|æ/g,"a");
	id = id.replace(/ø/g,"o");
	return id;
};
