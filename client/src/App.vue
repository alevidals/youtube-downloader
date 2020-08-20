<template>
  <v-app>
    <TopBarComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TopBarComponent from '@/components/TopBarComponent.vue'

@Component({
  components: {
    TopBarComponent,
  },
})
export default class App extends Vue {}
</script>
