<template>
    <v-container grid-list-md text-center>
        <v-layout wrap>
            <v-flex xs12>
                <v-card v-for="movie in catalogo" :key="movie.title">
                    <v-tabs
                    v-model="tab"
                    fixed-tabs
                    background-color="indigo"
                    dark
                    >
                        <v-tab>Información</v-tab>
                        <v-tab>Trailer</v-tab>
                        <v-tab>Rentar</v-tab>
                        <v-tab-item>
                            <v-container grid-list-md text-center>
                                <v-layout wrap>
                                    <v-flex xs4>
                                        <v-img
                                            :src="movie.src"
                                            aspect-ratio="1"
                                            height="500px"
                                            width="300px"
                                            max-height="500px"
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
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-card-text class="white--text">
                                            <div class="headline mb-2">{{ movie.title }}</div>
                                            {{ movie.description }}
                                        </v-card-text>
                                        <br>
                                        <v-rating
                                        v-model="movie.stars"
                                        color="warning"
                                        readonly
                                        background-color="grey"
                                        >
                                        </v-rating>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="text-center">
                                
                                <v-btn @click="goToYT(movie.trailer)" color="error">
                                    <v-icon left>ondemand_video</v-icon>
                                    Ver trailer en YouTube
                                </v-btn>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            Purchase
                        </v-tab-item>
                    </v-tabs>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data: () =>(
        {
            catalogo: [
            // { id: 1, title: 'Avengers End Game', src: 'https://images-na.ssl-images-amazon.com/images/I/81hkRNYQhNL._SY679_.jpg' },
            // { id: 2, title: 'Annabelle 2', src: 'https://images-na.ssl-images-amazon.com/images/I/614rium%2BzxL._SY606_.jpg' },
            // { id: 3, title: 'Toy Story 4', src: 'http://pulpfictioncine.com/download/multimedia.normal.99b5cf13350c2332.746f7973746f72793420202831295f6e6f726d616c2e6a7067.jpg' },
            // { id: 4, title: 'Spiderman Homecoming', src: 'https://static.posters.cz/image/750/poster/spider-man-homecoming-teaser-i47518.jpg' },
            ],
            tab: null,
        }),
        created(){
            this.fetchMovies()
        },
        methods: {
            async fetchMovies()
            {
                const _movie = this.$route.params.movie
                await this.$axios.get(`${this.$API}catalog/search/${_movie}`).then(
                    (response) => {
                        console.log(response)
                        response.data.movies.forEach(movie => {
                            this.catalogo.push({
                                id: movie.id,
                                title: movie.title,
                                src: movie.url_image,
                                description: movie.description,
                                stars: movie.stars,
                                trailer: movie.url_video,
                            })
                        });
                    },
                    error => {
                        console.log(error)
                        alert('Ha ocurrido un error')
                    }
                )
            },
            goToYT(url)
            {
                window.open(url, '_blank')
            }
        }
    }
</script>