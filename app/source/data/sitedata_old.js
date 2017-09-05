/*This file contains all site-specific data, such as site name, site metadata, etc */


/*Site Constants and Dirctory Setting */
exports.sitedata = function() {
        return {
            'sitename': 'JSTest',
            'hostname': 'qa.cascade.emory.edu',
            'baseSrc': 'src',
            'resourceSrc': '_includes',
            'cmsSrc': '_cms',
            'dest': 'dest',
            'tempDelete': 'tempDeletion'
        }
    }
    /**
     * Fixed Constants
     */


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
exports.contenttype = function() {
    return {
        'buffer': ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'pptx', 'ppt', 'xls', 'xlsx'],
        'data': ['css', 'js', 'php', 'csv']
    }
}