module.exports = {
    entry: {
        //topcodes: './src/topcodes/app.js',
        app: './src/app.js'
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        ignored: '/node_modules/'
    }
};