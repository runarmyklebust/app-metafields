var libs = {
    portal: require('/lib/xp/portal'),
    content: require('/lib/xp/content'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

var view = resolve('add-metadata.html');


exports.responseFilter = function (req, res) {

    var trackingScript = '<!-- I was here - again =) -->';

	var params = {};
	var og = {};

	og.description = "I was here too";

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