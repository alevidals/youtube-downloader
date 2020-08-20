<template>
  <div>
    <v-app-bar color="primary" dense>
      <div class="mx-auto d-flex">
        <v-icon color="white" class="mr-3">mdi-youtube</v-icon>
        <h1 class="white--text">Youtube Downloader</h1>
        <v-icon color="white" class="ml-3">mdi-youtube</v-icon>
      </div>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class TopBarComponent extends Vue {}
</script>
