const techs = {
        // essential
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),

        // bemhtml
        bemhtml: require('enb-bemxjst/techs/bemhtml'),
        bemjsonToHtml: require('enb-bemxjst/techs/bemjson-to-html')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'node_modules/bem-core/common.blocks', check: false },
        { path: 'node_modules/bem-core/desktop.blocks', check: false },
        'common.blocks',
    ];

module.exports = function(config) {
    const isProd = process.env.YENV === 'production';

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemjson.js' }],
            [enbBemTechs.bemjsonToBemdecl],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // bemhtml
            [techs.bemhtml, {
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                forceBaseTemplates: true
            }],

            // html
            [techs.bemjsonToHtml]
        ]);

        nodeConfig.addTargets(['?.html']);
    });
};
