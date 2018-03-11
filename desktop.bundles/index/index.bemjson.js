const fs = require('fs'),
    path = require('path'),
    BLOCK = 'icon'
    ICONS_PATH = path.resolve(`common.blocks/${BLOCK}`),
    ICON_MODS = [],
    modNames = fs.readdirSync(ICONS_PATH).filter(filename => filename[0] === '_');

    modNames.forEach(mod => {
        const files = fs.readdirSync(path.join(ICONS_PATH, mod)),
            iconScope = {
                name : mod.replace('_', ''),
                icons : files.map(filename => {
                    const parts = filename.replace('.bemhtml.js', '').split('_');
                    parts.shift();

                    const modName = parts[0],
                        modVal = parts.length > 1? parts.pop() : true;

                    return {
                        modName : modName,
                        modVal : modVal,
                        mods : {
                            [modName] : modVal
                        }
                    };
                })
            };

        ICON_MODS.push(iconScope);
    });

module.exports = {
    block : 'page',
    title : 'Title of the page',
    favicon : '/favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        {
            elem : 'css',
            content : `
                thead {font-weight: bold}
                td {line-height : 24px; vertical-align: top; padding-left: .5rem}
            `
        }
    ],
    content : [
        {
            tag: 'h1',
            content : 'Bem Material Icons'
        },
        ICON_MODS.map(iconScope => [
            {
                tag : 'table',
                content : [
                    {
                        tag : 'thead',
                        content : {
                            tag : 'tr',
                            content : {
                                tag : 'td',
                                attrs : { colspan : 2 },
                                content : iconScope.name
                            }
                        }
                    },
                    {
                        tag : 'tbody',
                        content : iconScope.icons.map(iconConf => [
                            {
                                tag : 'tr',
                                content : [
                                    {
                                        tag : 'td',
                                        content : {
                                            block : 'icon',
                                            tag : 'span',
                                            mods : Object.assign({ material : true, size : 24 }, iconConf.mods)
                                        }
                                    },
                                    {
                                        tag : 'td',
                                        content : `icon_${iconConf.modName}${iconConf.modVal !== true ? '_'+iconConf.modVal : ''}`
                                    }
                                ]
                            },
                        ])
                    }
                ]
            },
        ]),
        {
            block : 'icon',
            mods : {
                material : true,
                size : 24,
                visibility : true
            }
        },
        {
            block : 'icon',
            mods : {
                material : true,
                video : 'call'
            }
        },
        ['down', 'left', 'right', 'up'].map(val => {
            return {
                block : 'icon',
                mods : {
                    material : true,
                    keyboard : `arrow-${val}`
                }
            };
        }),
        {
            block : 'icon',
            mods : {
                material : true,
                keyboard : true
            }
        },
    ]
};
