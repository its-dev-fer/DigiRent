<template>
    <v-container grid-list-md text-center>
        <v-layout wrap>
            <v-flex xs12>
                <v-card>
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
    data: () => ({
        tab: null,
        movie: {}
    }),
    created(){
        this.fetchMovieData()
    },
    methods: {
        async fetchMovieData()
        {
            const movieID = this.$route.params.id
            await this.$axios.get(`${this.$API}catalog/${movieID}`).then(
                (success) => {
                    this.movie = {
                        title: success.data.movie.title,
                        src: success.data.movie.url_image,
                        description: success.data.movie.description,
                        stars: success.data.movie.stars,
                        trailer: success.data.movie.url_video,
                    }
                    console.log(success.data.movie)
                },
                error => {
                    alert('Ha ocurrido un error')
                    console.error(error)
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