import intercept from 'intercept-require';
import webpack from 'webpack';

const {DefinePlugin, ProvidePlugin} = webpack;

// webpack config hook
const hookWebpackConfig = (configBuilder) => (webpackEnv) => {
    // generate webpack config from react-script
    const config = configBuilder(webpackEnv);

    config.resolve.fallback = {
        process: false,
    };

    config.plugins.push(new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }));

    const i = config.plugins.findIndex((p) => p.constructor.name === 'ForkTsCheckerWebpackPlugin');
    config.plugins.splice(i, 1);

    return config;
};

// install require interception on webpack.config.js
intercept((moduleExport, info) => {
    if (info.moduleId.endsWith('/config/webpack.config')) {
        return hookWebpackConfig(moduleExport);
    }
    return moduleExport;
});

// remove our rogue parameter
process.argv.splice(1, 1);

// retrieve script to be executed
const script = process.argv.slice(1).find((arg) => arg.replace(/\\/g, '/').includes('react-scripts/scripts'));
if (script) {
    // execute react-script
    import(`file:${script}`);
} else {
    console.log('Cannot determined the react-script to be executed');
}
