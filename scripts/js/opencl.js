'use strict';

const fs = require('fs');


function bin2h(buf, namespace, name)
{
    const size = buf.byteLength;
    let out    = `#pragma once\n\nnamespace ${namespace} {\n\nstatic unsigned char ${name}[${size}] = {\n    `;

    let b = 32;
    for (let i = 0; i < size; i++) {
        out += `0x${buf.readUInt8(i).toString(16).padStart(2, '0')}${size - i > 1 ? ',' : ''}`;

        if (--b === 0) {
            b = 32;
            out += '\n    ';
        }
    }

    out += `\n};\n\n} // namespace ${namespace}\n`;

    return out;
}


function text2h(text, namespace, name)
{
    const buf  = Buffer.from(text);
    const size = buf.byteLength;
    let out    = `#pragma once\n\nnamespace ${namespace} {\n\nstatic char ${name}[${size + 1}] = {\n    `;

    let b = 32;
    for (let i = 0; i < size; i++) {
        out += `0x${buf.readUInt8(i).toString(16).padStart(2, '0')},`;

        if (--b === 0) {
            b = 32;
            out += '\n    ';
        }
    }

    out += '0x00';

    out += `\n};\n\n} // namespace ${namespace}\n`;

    return out;
}


function addInclude(input, name)
{
    return input.replace(`#include "${name}"`, fs.readFileSync(name, 'utf8'));
}


function addIncludes(inputFileName, names)
{
    let data = fs.readFileSync(inputFileName, 'utf8');

    for (let name of names) {
        data = addInclude(data, name);
    }

    return data;
}


module.exports.bin2h        = bin2h;
module.exports.text2h       = text2h;
module.exports.addInclude   = addInclude;
module.exports.addIncludes  = addIncludes;