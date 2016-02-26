var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util/util')
};

var appNamePropertyName = app.name.replace(/\./g,'-');

function getConfig() {
	return libs.portal.getSiteConfig();
}
function commaStringToArray(str) {
	return str.split(',').trim();
}
function findValueInJson(json, paths) {
	var value;
	var jsonPath = ';';

	for (var i = 0; i < paths.length; i++) {
		if ( paths[i] ) {
			jsonPath = 'json.data["' + paths[i] + '"]'; // Wrap property so we can have dashes in it
			var evaledJson = eval(jsonPath);
			if (evaledJson) {
				return evaledJson; // Expect the first property in the string is the most important one to use
			}
		}
	}
}

exports.getBlockRobots = function(content) {
	return content.x[appNamePropertyName]['meta-data'].blockRobots;
}

exports.getPageTitle = function(content, site) {
	var siteConfig = getConfig();

	var setInMixin = content.x[appNamePropertyName]
		&& content.x[appNamePropertyName]['meta-data']
		&& content.x[appNamePropertyName]['meta-data'].seoTitle;

	var userDefinedPaths = siteConfig.pathsTitles || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findValueInJson(content,userDefinedArray) : null;

	var metaTitle = setInMixin ? content.x[appNamePropertyName]['meta-data'].seoTitle // Get from mixin
			:  content.displayName // Use content's display name
			|| userDefinedValue // json property defined by user as important
			|| content.data.title || content.data.heading || content.data.header // Use other typical content titles (overrides displayName)
			|| siteConfig.seoTitle // Use default og-title for site
			|| site.displayName; // Use site default

	return metaTitle;
};

exports.getMetaDescription = function(content, site) {
	var siteConfig = getConfig();

	var userDefinedPaths = siteConfig.pathsDescription || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findValueInJson(content,userDefinedArray) : null;

	var setWithMixin = content.x[appNamePropertyName]
			&& content.x[appNamePropertyName]['meta-data']
			&& content.x[appNamePropertyName]['meta-data'].seoDescription;
	var metaDescription = setWithMixin ? content.x[appNamePropertyName]['meta-data'].seoDescription // Get from mixin
					: userDefinedValue
					|| content.data.preface || content.data.description || content.data.summary // Use typical content summary names
					|| siteConfig.seoDescription // Use default for site
					|| site.description; // Use bottom default

	return metaDescription;
};

exports.getOpenGraphImage = function(content, defaultImg) {
	var siteConfig = getConfig();

	var userDefinedPaths = siteConfig.pathsImages || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findValueInJson(content,userDefinedArray) : null;

	// Set basic image options
	var imageOpts = {
		scale: 'block(1200,630)', // Open Graph requires 600x315 for landscape format. Double that for retina display.
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
