'use strict';

const path = require('path');

module.exports =
{
    entry: './src/app.ts',
    resolve:
    {
        extensions:
        [
            '.js',
            '.html',
            '.css',
            '.ts'
        ]
    },
    output:
    {
        filename: 'embossCompile.js',
        path: '/Projects/Emboss/demo/js'
    },
    watch: true,
    watchOptions:
    {
        ignored: /node_modules/
    },
    module:
    {
        loaders:
        [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};