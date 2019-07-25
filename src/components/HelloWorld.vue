<template>
  <v-container grid-list-md text-center>
    <v-layout wrap>
      <v-flex xs6 md4 v-for="card in catalogo" :key="card.title">
        <v-hover v-slot:default="{ hover }">
          <v-card
          :elevation="hover ? 12 : 2"
          >
            <v-img
              :src="card.src"
              class="white--text"
              height="100%"
              width="100%"
              max-height="500px"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              @click="$router.push({ name: 'details', params:{ 'id':card.id }  })"
            >
            <template v-slot:placeholder>
              <v-layout
                fill-height
                align-center
                justify-center
                ma-0
              >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </template>
            </v-img>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
</style>

<script>
export default {
  name: 'App',
  data: () =>({
    catalogo: [
      // { id: 1, title: 'Avengers End Game', src: 'https://images-na.ssl-images-amazon.com/images/I/81hkRNYQhNL._SY679_.jpg' },
      // { id: 2, title: 'Annabelle 2', src: 'https://images-na.ssl-images-amazon.com/images/I/614rium%2BzxL._SY606_.jpg' },
      // { id: 3, title: 'Toy Story 4', src: 'http://pulpfictioncine.com/download/multimedia.normal.99b5cf13350c2332.746f7973746f72793420202831295f6e6f726d616c2e6a7067.jpg' },
      // { id: 4, title: 'Spiderman Homecoming', src: 'https://static.posters.cz/image/750/poster/spider-man-homecoming-teaser-i47518.jpg' },
    ],
  }),
  created(){
    this.fetchMovies()
  },
  methods: {
      async fetchMovies()
      {
        await this.$axios.get(`${this.$API}catalog`).then(
          (response) => {
            console.log(response)
            response.data.catalog.forEach(movie => {
              this.catalogo.push({
                id: movie.id,
                title: movie.title,
                src: movie.url_image
              })
            });
          },
          error => {
            console.log(error)
            alert('Ha ocurrido un error')
          }
        )
      }
  }
}
</script>
