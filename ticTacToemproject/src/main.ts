import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'material-symbols'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { GameHandler } from './logic/GameHandler'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

GameHandler.getInstance()

const app = createApp(App)

app.use(vuetify).mount('#app')
