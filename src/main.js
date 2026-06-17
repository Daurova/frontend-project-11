import './style.css'
import './i18n.js'
import '../src/scripts/view.js'
import updateAllFeeds from './scripts/updateFeeds.js'

setTimeout(updateAllFeeds, 5000)
console.log('started')
