/*This file contains all site-specific data, such as site name, site metadata, etc */


/*Site Constants Setting */
exports.sitedata = function() {
    return { 'sitename': 'JSTest', 'hostname': 'qa.cascade.emory.edu' };
}


/**
 * Format Setting
 */
exports.foldertype = function() {
    return {
        'file': ['_includes'],
        'scriptFormat': ['_cms/vm'],
        'xsltFormat': ['_cms/xslt']
    };
}
exports.remotetype = function() {
    return {
        'folder': 'folder',
        'page': 'page',
        'file': 'file',
        'scriptFormat': 'format_SCRIPT',
        'xsltFormat': 'format_XSLT'
    }
}
exports.remotecontent = function() {
    return {
        'file': ['data', 'text'],
        'scriptFormat': ['script', 'script'],
        'xsltFormat': ['xml', 'xml']
    }
}

exports.extention = function() {
    return {
        '_includes': { 'file': ['.css', '.js', '.jpg', 'png', '.scss', '.less'] },
        '_cms': { 'scriptFormat': ['vm', 'xslt'] },
        '': { 'page': '.html' },
        'front-end': { 'page': '.html' }
    }
}