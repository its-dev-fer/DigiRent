<template>
    <v-container grid-list-md text-center>
        <v-layout wrap>

            <v-flex xs12>
                <v-alert
                v-model="show"
                v-bind="localAttrs"
                :dismissible="dismissible"
                :type="type"
                class="mb-4"
                >
                {{ message }}
                </v-alert>
                <v-card>
                    <v-tabs
                    v-model="tab"
                    fixed-tabs
                    background-color="indigo"
                    dark
                    >
                        <v-tab>Información</v-tab>
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
                                            <div class="headline mb-2">{{ movie.title }} - $ {{ precio }}</div>
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
                                        <div class="text-center">
                                            <v-btn @click="goToYT(movie.trailer)" color="error">
                                                <v-icon left>ondemand_video</v-icon>
                                                Ver trailer en YouTube
                                            </v-btn>
                                        </div>

                                        <!-- Modal de compra -->
                                        <template>
                                            <v-layout>
                                                <v-dialog v-model="dialog" persistent max-width="290">
                                                <template v-slot:activator="{ on }">
                                                    <v-btn color="success" dark v-on="on">
                                                        <v-icon left>add_shopping_cart</v-icon>
                                                        Agregar al carrito
                                                    </v-btn>
                                                </template>
                                                <v-card v-if="currentSession">
                                                    <v-card-title class="headline">¿Deseas agregar {{ movie.title }}?</v-card-title>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="red darken-1" text @click="dialog = false">Cancelar</v-btn>
                                                        <v-btn color="green darken-1" text @click="dialog = false; addToCart()">Sí</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                                <v-card v-else>
                                                    <v-card-title class="headline">Para comprar necesitas tener una cuenta</v-card-title>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="red darken-1" text @click="dialog = false">Entendido</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                                </v-dialog>
                                            </v-layout>
                                        </template>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-tab-item>
                    </v-tabs>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// let stripe = Stripe(`pk_test_4L1xahyRRzKSMg44DGikIXTS00TtkYMmdB`),
// elements = stripe.elements(),
// card = undefined;
export default {
    // mounted: function () {
    //   card = elements.create('card',{hidePostalCode: true});
    //   card.mount(this.$refs.card);
      
    // },
    data: () => ({
        currentSession: null,
        tab: null,
        movie: {},
        dialog: false,
        tokenPago: '',
        precio: 0,
        // Alerta
        border: 'left',
        coloredBorder: false,
        dismissible: true,
        show: false,
        type: 'success',
        variant: null,
        message: ''
    }),
    created(){
        this.currentSession = localStorage.getItem('auth')
        this.fetchMovieData(this.currentSession)
    },
    methods: {
        async fetchMovieData(token)
        {
            const movieID = this.$route.params.id
            await this.$axios.get(`${this.$API}catalog/${movieID}?token=${token}`).then(
                (success) => {
                    this.movie = {
                        id: success.data.movie.id,
                        title: success.data.movie.title,
                        src: success.data.movie.url_image,
                        description: success.data.movie.description,
                        stars: success.data.movie.stars,
                        trailer: success.data.movie.url_video,
                    }
                },
                error => {
                    alert('Ha ocurrido un error')
                    console.error(error)
                }
            )

            await this.$axios.get(`${this.$API}catalog/price/${this.movie.id}?token=${token}`)
            .then(
                (response) => {
                    this.precio = Math.round(parseFloat(response.data.price).toFixed(2)*100)
                },
                (error) => {
                    console.error(error)
                }
            )
        },
        goToYT(url)
        {
            window.open(url, '_blank')
        },
        addToCart () {
            let carrito = JSON.parse(localStorage.getItem('cart'))
            if(!carrito){
                localStorage.setItem('cart',JSON.stringify(
                    {
                        peliculas: []
                    }
                ))

                carrito = JSON.parse(localStorage.getItem('cart'))
            }
            console.log(carrito.peliculas)
            carrito.peliculas.push({
                id: this.movie.id,
                titulo: this.movie.title,
                img: this.movie.src,
                precio: this.precio
            })
            localStorage.setItem('cart', JSON.stringify(carrito))
            this.message = 'Se ha agregado a tu carrito'
            this.show = true
            this.type = 'success'
            // let token = await stripe.createToken(card).then(function(result) {
            //     console.log(result)
            //     console.log(result.token)
            //     if (result.error) {
            //         self.hasCardErrors = true;
            //         self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
            //         return;
            //     }
            //     return result.token.id
            // });
            // await this.$axios.get(`http://ec41539b.ngrok.io/api/v1/cobrar/${token}/${this.precio}`)
            // .then(
            //     (response) => {
            //         this.message = 'Gracias por comprar con nosotros'
            //         this.show = true
            //         this.type = 'success'
            //     },
            //     (error) => {
            //         console.error(error)
            //         this.message = 'Ocurrió un error al procesar la compra:'
            //         this.show = true
            //         this.type = 'error'
            //     }
            // )
        },
    },
    computed: {
      localAttrs () {
        const attrs = {}

        if (this.variant === 'border') {
          attrs.border = this.border
          attrs.coloredBorder = this.coloredBorder
        } else {
          attrs[this.variant] = true
        }

        return attrs
      },
    },
}
</script>