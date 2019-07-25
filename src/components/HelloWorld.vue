<template>
  <v-container grid-list-md text-center>
    <v-layout wrap>
      <v-flex v-for="card in catalogo" :key="card.title">
        <v-hover v-slot:default="{ hover }">
          <v-card
          :elevation="hover ? 12 : 2"
          height="400px"
          width="200px"
          >
            <v-img
              :src="card.src"
              class="white--text"
              height="400px"
              width="200px"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              @click="$router.push({ name: 'details', params:{ 'id':card.id }  })"
            >
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
      { id: 1, title: 'Avengers End Game', src: 'https://images-na.ssl-images-amazon.com/images/I/81hkRNYQhNL._SY679_.jpg' },
      { id: 2, title: 'Annabelle 2', src: 'https://images-na.ssl-images-amazon.com/images/I/614rium%2BzxL._SY606_.jpg' },
      { id: 3, title: 'Toy Story 4', src: 'http://pulpfictioncine.com/download/multimedia.normal.99b5cf13350c2332.746f7973746f72793420202831295f6e6f726d616c2e6a7067.jpg' },
      { id: 4, title: 'Spiderman Homecoming', src: 'https://static.posters.cz/image/750/poster/spider-man-homecoming-teaser-i47518.jpg' },
    ]
  })
}
</script>
