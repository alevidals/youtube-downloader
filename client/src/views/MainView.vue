<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12">
        <v-form>
          <v-text-field
            v-model="url"
            label="Youtube Link"
            required
          ></v-text-field>
          <v-btn @click="downloadSong">
            <span v-if="!loading">
              Descargar
            </span>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Axios from 'axios'

@Component
export default class MainView extends Vue {
  public url: string = ''
  public format: string = 'mp3'
  public serverUrl: string = 'http://localhost:3000'
  public loading: boolean = false

  public downloadSong() {
    this.loading = true
    Axios.post(
      this.serverUrl,
      {
        url: this.url,
        format: this.format,
      },
      {
        responseType: 'blob',
      }
    )
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        // TODO: Get song name
        link.setAttribute('download', 'song.mp3')
        document.body.appendChild(link)
        link.click()
        console.log(res)
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
