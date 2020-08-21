<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="6">
        <v-form v-model="valid">
          <v-text-field
            v-model="url"
            label="Youtube Link"
            :rules="[v => !!v || 'Item is required']"
          ></v-text-field>
          <v-select
            :rules="[v => !!v || 'Item is required']"
            :items="formatItems"
            solo
            label="Format"
            v-model="format"
          ></v-select>
          <v-btn @click="generateLink" :disabled="!valid">
            <span v-if="!loading">
              Generar link
            </span>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-btn>
          <v-btn @click="downloadSong" v-if="ready">Descargar</v-btn>
        </v-form>
      </v-col>
      <v-col cols="6" class="text-center">
        <span>{{ title }}</span>
        <v-img class="mx-auto mt-3" max-width="50%" :src="imageUrl"></v-img>
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
  public format: string = ''
  public serverUrl: string = 'http://localhost:3000'
  public loading: boolean = false
  public imageUrl: string = ''
  public title: string = ''
  public ready: boolean = false
  public formatItems: any[] = ['mp3', 'mp4']
  public valid: boolean = false

  public generateLink() {
    this.loading = true
    Axios.post(this.serverUrl, {
      url: this.url,
      format: this.format,
    })
      .then(res => {
        this.imageUrl = res.data.info.videoDetails.thumbnail.thumbnails[3].url
        this.title = res.data.info.videoDetails.title
      })
      .finally(() => {
        this.loading = false
        this.ready = true
      })
  }

  public downloadSong() {
    const name = this.title + '.' + this.format
    console.log(name)
    Axios.post(
      this.serverUrl + '/download',
      {
        name: name,
      },
      { responseType: 'blob' }
    ).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      // link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
    })
  }
}
</script>
