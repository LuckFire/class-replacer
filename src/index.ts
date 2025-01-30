#!/usr/bin/env bun

import sade from 'sade';
import { getScssFiles, readFile, writeFile, replaceClasses } from './util';

const prog = sade('class-replacer');

prog
    .command('run')
    .describe('Run the class replacer')
    .option('--path, -p', 'The path that includes all of your css/scss files. Root is the directory that the cli command was ran in. Default path is \`src\`')
    .option('--ignore, -i', 'Ignore certain files when replacing classes. Separate multiple by commas.')
    .action(async ({ path, ignore }) => {
        const files = getScssFiles(
            path || 'src',
            ignore !== undefined ? ignore.split(',') : [],
        );

        for (const file of files) {
            const scss = readFile(file);
            const lines = scss.split('\n');

            const updatedScss = replaceClasses(lines);
            writeFile(file, updatedScss.join('\n'));
        }
    });

prog.parse(process.argv);