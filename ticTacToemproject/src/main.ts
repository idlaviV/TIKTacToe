import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'material-symbols'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { GameHandler } from './logic/GameHandler'
import { GraphBuilder } from './logic/ConfigurationGraph'

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

const builder = new GraphBuilder()
  builder.buildGraph()
