var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util/util')
};

// "Globals":
var appNamePropertyName = app.name.replace(/\./g,'-');

function getConfig() {
	return libs.portal.getSiteConfig();
}
function commaStringToArray(string) {
	var arr = [];
	string = string.replace(/ /g,''); // Remove all spaces in the string
	arr = string.split(',');
	return arr;
}
function findValueInJson(json,paths) {
	var value = null;
	var pathLength = paths.length;
	var jsonPath = ";"
	for (var i = 0; i < pathLength; i++) {
		if ( paths[i] ) {
			jsonPath = 'json.data.' + paths[i];
			if ( eval(jsonPath) ) {
				value = eval(jsonPath);
				break; // Expect the first property in the string is the most important one to use
			}
		}
	}
	return value;
}

exports.getPageTitle = function(content, site) {
	var siteConfig = getConfig();

	var setInMixin = content.x[appNamePropertyName]
		&& content.x[appNamePropertyName]['meta-data']
		&& content.x[appNamePropertyName]['meta-data']['seo-title'];

	var userDefinedPaths = siteConfig.pathsTitles;
	// If any string here (after trim) split it on comma (,) and loop this as different paths
	var userDefinedArray = commaStringToArray(userDefinedPaths);
//	userDefinedArray.push('title');

	var userDefinedValue = findValueInJson(content,userDefinedArray);

//	libs.util.log(userDefinedArray);
//	log.info(userDefinedValue);

	var metaTitle = setInMixin ? content.x[appNamePropertyName]['meta-data']['seo-title'] // Get from mixin
			:  content.displayName // Use content's display name
			|| userDefinedValue // json property defined by user as important
			|| content.data.title || content.data.heading || content.data.header // Use other typical content titles (overrides displayName)
			|| siteConfig["seo-title"] // Use default og-title for site
			|| site.displayName; // Use site default

	return metaTitle;
};

exports.getMetaDescription = function(content, site) {
	var siteConfig = getConfig();

	var userDefinedPaths = siteConfig.pathsDescriptions;
	var userDefinedArray = commaStringToArray(userDefinedPaths);
	var userDefinedValue = findValueInJson(content,userDefinedArray);

	var setWithMixin = content.x[appNamePropertyName]
			&& content.x[appNamePropertyName]['meta-data']
			&& content.x[appNamePropertyName]['meta-data']['seo-description'];
	var metaDescription = setWithMixin ? content.x[appNamePropertyName]['meta-data']['seo-description'] // Get from mixin
					: userDefinedValue
					|| content.data.preface || content.data.description || content.data.summary // Use typical content summary names
					|| siteConfig["seo-description"] // Use default for site
					|| site.description; // Use bottom default

	return metaDescription;
};

exports.getOpenGraphImage = function(content, defaultImg) {
	var siteConfig = getConfig();

	var userDefinedPaths = siteConfig.pathsImages;
	var userDefinedArray = commaStringToArray(userDefinedPaths);
	var userDefinedValue = findValueInJson(content,userDefinedArray);

	// Set basic image options
	var imageOpts = {
		scale: 'block(1200,630)',
		quality: 85,
		format: 'jpg',
		type: 'absolute'
	};


	// Try to find an image in the content's image or images properties
	var imageArray = libs.util.data.forceArray( userDefinedValue || content.data.image || content.data.images || []);

	// Set the ID to either the first image in the set or the default image ID
	imageOpts.id = imageArray.length ? imageArray[0] : defaultImg;

	// Return the image URL or nothing
	return imageOpts.id ? libs.portal.imageUrl(imageOpts) : null;
};
