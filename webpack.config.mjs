import path from 'path';
import url from 'url';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const fileName = url.fileURLToPath(import.meta.url),
    dirName = path.dirname(fileName);

export default {
    entry: './src/index.mjs',
    devtool: 'source-map',
    mode: 'production',
    experiments: {
        outputModule: true
    },
    resolve: {
        extensions: ['.mjs', '.js', '.json'],
        extensionAlias: {
            '.js': ['.js'],
            '.mjs': ['.mjs']
        }
    },
    output: {
        clean: true,
        library: {
            type: 'module'
        },
        module: true,
        filename: 'index.mjs',
        path: path.resolve(dirName, 'dist'),
    },
    plugins: [
        new ESLintWebpackPlugin({
            extensions: ['.mjs', '.js', '.json'],
            exclude: ['node_modules', 'dist', 'coverage'],
            fix: true
        })
    ]
};