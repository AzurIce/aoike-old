import { createStore, createLogger } from 'vuex'

import settings from './modules/settings'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    modules: {
        settings: settings
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})