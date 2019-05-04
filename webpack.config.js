module.exports = {
    entry: {
        topcodes: './src/topcodes/app.js'
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        ignored: '/node_modules/'
    }
};