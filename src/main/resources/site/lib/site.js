var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util/util')
};

// "Globals":
var appNamePropertyName = app.name.replace(/\./g,'-');


exports.getPageTitle = function(content, site) {
	var metaTitle = '';
	var siteConfig = libs.portal.getSiteConfig();

	if (content.x[appNamePropertyName]) {
		if (content.x[appNamePropertyName]['meta-data']) {
			if (content.x[appNamePropertyName]['meta-data']['seo-title']) {
				metaTitle = content.x[appNamePropertyName]['meta-data']['seo-title'];
			}
		}
	}

	// No Content SEO title? Use displayName of Content instead (always set).
	if ( metaTitle.trim() === '') {
		metaTitle = content['displayName'];
	}

	// None of that either? Use the Apps defined default title.
	if ( metaTitle.trim() === '') {
		metaTitle = siteConfig["og-title"];
	}

	// None of that either? Use the Site's title instead. Used when not viewing a Content.
	if ( metaTitle.trim() === '') {
		metaTitle = site['displayName'];
	}

	metaTitle = metaTitle + ' - ' + site['displayName']; // Content Title + Site Title

	return metaTitle;
};

exports.getMetaDescription = function(content, site) {
	var metaDescription = '';
	var siteConfig = libs.portal.getSiteConfig();

	if (content.x[appNamePropertyName]) {
		if (content.x[appNamePropertyName]['meta-data']) {
			if (content.x[appNamePropertyName]['meta-data']['seo-preface']) {
				metaDescription = content.x[appNamePropertyName]['meta-data']['seo-preface'];
			}
		}
	}

	if ( metaDescription.trim() === '' ) {
		if (content.data.preface) {
			metaDescription = content.data.preface;
		}
	}

	// None of that either? Use the Apps defined default title.
	if ( metaDescription.trim() === '') {
		metaDescription = siteConfig["og-description"];
		libs.util.log(site);
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
			og_images_arr = libs.util.data.forceArray( og_images );

			if ( og_images_arr.length > 0 ) {
				image_url = libs.portal.imageUrl({
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
			image_url = libs.portal.imageUrl({
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
