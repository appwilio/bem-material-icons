'strict mode';

const fs = require('fs');
const path = require('path');
const ICONS_ROOT = path.resolve('node_modules/material-design-icons');
const ICONS_PATH = 'svg/production';
const BASE_SIZE = 24;

var mods = [];
var icons = [];
var sources = [];

var scopes = [
    'action',
    'alert',
    'av',
    'communication',
    'content',
    'device',
    'editor',
    'file',
    'hardware',
    'image',
    'maps',
    'navigation',
    'notification',
    'places',
    'social',
    'toggle'
];
sources.push(scopes.map(processScope));

function processScope(scopeName){
    var scopeDir = path.resolve(ICONS_ROOT, scopeName, ICONS_PATH);
    var scopeIcons = fs.readdirSync(scopeDir);
    var filteredIcons = scopeIcons.filter(filterIcon);
    var bemEntites = filteredIcons.map(bemify);

    bemEntites.map(function(entity){
        var filePath = 'common.blocks/icon/_'+entity.modName,
            fileModVal = entity.modVal !== true? '_' + entity.modVal : '',
            templateName = 'icon_' + entity.modName + fileModVal + '.bemhtml.js';
        try{fs.accessSync(filePath)}
        catch (e) {
            if(e.code == 'ENOENT')
                fs.mkdirSync(filePath);
        }
        return fs.writeFileSync(path.resolve(filePath, templateName), getTemplateContent(
            entity.modName,
            entity.modVal,
            fs.readFileSync(path.resolve(scopeDir, entity.file), 'utf8')
        ));
    });
    return bemEntites;
}

function filterIcon(filename){
    var fileData = filename.split('_');
    return fileData.pop() === BASE_SIZE+'px.svg';
}

function bemify(filename){
    var fileData = filename.split('_'),
        modName,
        modVal;

    fileData.splice(0,1); //delete unused ic_ prefix
    fileData.pop(); //delete unused file extension

    modName = fileData.splice(0, 1)[0];
    modVal = fileData.join('-') || true;

    var entity = {
        file : filename,
        modName : modName,
        modVal : modVal
    };
    return entity;
}

function getTemplateContent(mod, val, svg){
    var modVal = val === true || '\''+val+'\'';
    return [
        'block(\'icon\').mod(\'material\', true).mod(\''+mod+'\', '+modVal+')(',
        '    content()(\''+svg+'\')',
        ');'
    ].join('\n');
}

module.exports = icons;
