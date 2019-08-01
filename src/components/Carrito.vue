<template>
    <v-container>
        <v-layout align-center justify-center row fill-height v-if="hasMovies">
            <v-flex xs10>
                <v-alert
                    v-model="show"
                    v-bind="localAttrs"
                    :dismissible="dismissible"
                    :type="type"
                    class="mb-4"
                    >
                    {{ message }}
                </v-alert>
                <v-card
                    class="mx-auto"
                    style="padding: 3em"
                    v-if="peliculas.length > 0"
                >
                    <h1>Películas en tu carrito:</h1>
                    <br>
                    <ol>
                        <li style="font-size:1.25em" v-for="p in peliculas" :key="p.titulo">
                            {{ p.titulo }} - $ {{ p.precio }}
                        </li>
                    </ol>
                    <v-card-actions>
                        <!-- Modal de compra -->
                        <template>
                            <v-layout>
                                <v-dialog v-model="dialog" persistent max-width="500" style="padding:2em">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="green darken-1" text @click="dialog = true">Pagar</v-btn>
                                    </template>
                                    <v-card style="padding: 2em">
                                        <v-card-title class="headline">Ingresa tu información de pago</v-card-title>
                                        <div ref="card"></div>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red darken-1" text @click="dialog = false">Cancelar</v-btn>
                                            <v-btn color="green darken-1" text @click="dialog = false; payShoppingCart()">Pagar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-layout>
                        </template>
                    <!-- <v-btn text @click="dialog = true; payShoppingCart()">Pagar</v-btn> -->
                    </v-card-actions>
                </v-card>
                <v-card
                    class="mx-auto"
                    style="padding: 3em"
                    v-else
                >
                    <h1>Tu carrito de compras:</h1>
                    <h4>No has comprado ninguna película</h4>
                </v-card>
                <br>
            </v-flex>
        </v-layout>

        <v-layout align-center justify-center row fill-height>
            <v-flex xs10>
                <v-card
                    class="mx-auto"
                    style="padding: 3em"
                    v-if="peliculas_compradas.length > 0"
                >
                    <h1>Tu historial de compras:</h1>
                    <br>
                    <ul v-for="p in peliculas_compradas" :key="p">
                        <li style="font-size:1.25em">
                            {{ p }}
                        </li>
                        <hr>
                    </ul>
                    <v-card-actions>
                    </v-card-actions>
                </v-card>

                <v-card
                    class="mx-auto"
                    style="padding: 3em"
                    v-else
                >
                    <h1>Tu historial de compras:</h1>
                    <h4>No has comprado ninguna película</h4>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
    
</template>

<script>
let stripe = Stripe(`pk_test_4L1xahyRRzKSMg44DGikIXTS00TtkYMmdB`),
elements = stripe.elements(),
card = undefined;
export default {
    mounted: function () {
        const storage = JSON.parse(localStorage.getItem('cart'))
        if(storage.peliculas.length > 0)
        {
            card = elements.create('card',{hidePostalCode: true});
            card.mount(this.$refs.card);
        }
    },
    data: () => ({
        hasMovies: false,// Películas en el carrito de compras
        peliculas: [],
        peliculas_compradas: [],
        dialog: false,
        // Alerta
        border: 'left',
        coloredBorder: true,
        dismissible: true,
        show: false,
        type: 'success',
        variant: null,
        message: ''
    }),
    async created(){
        const storage = localStorage.getItem('cart')
        if(!storage)
        {
            localStorage.setItem('cart', JSON.stringify({
                peliculas: []
            }))
        }
        else
        {
            const json = JSON.parse(storage)
            this.hasMovies = true
            await json.peliculas.forEach(p => {
                this.peliculas.push({
                    titulo: p.titulo,
                    precio: p.precio
                })
            });
        }
        this.getHistory()
    },
    methods:{
        async getHistory()
        {
            // Películas compradas API
            const tok = localStorage.getItem('auth')
            await this.$axios.get(`${this.$API}users/current/historialCompras?token=${tok}`)
            .then(
                (response) => {
                    this.peliculas_compradas = []
                    let titulos = ``
                    let suma = 0
                    response.data.historial.forEach(comprada => {
                        const json = JSON.parse(comprada.JSON_peliculas)
                        json.forEach(el => {
                            titulos += `${el.titulo} (${el.precio}), `
                            suma += el.precio
                        });

                        titulos += `total: ${suma}`
                        this.peliculas_compradas.push(titulos)
                        titulos = ``
                        suma = 0
                        // const _total = el.price
                        // const _cat = el.created_at
                        // this.peliculas_compradas.push({
                        //     titulo: el.titulo,
                        //     precio: el.precio,
                        //     total: _total,
                        //     date: _cat
                        // })
                    });
                },
                (error) => {
                    console.error(error)
                }
            )
        },
        async payShoppingCart()
        {
            let token = await stripe.createToken(card).then(function(result) {
                if (result.error) {
                    self.hasCardErrors = true;
                    self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                    return;
                }
                return result.token.id
            });
            let t = 0
            const _peliculasDB = this.peliculas
            this.peliculas.forEach(p => {
                t += p.precio
            })
            await this.$axios.get(`${this.$STRIPE_API}cobrar/${token}/${t}`)
            .then(
                (response) => {
                    this.message = 'Gracias por comprar con nosotros'
                    this.show = true
                    this.type = 'success'
                    const cart = {
                        peliculas: []
                    }
                    localStorage.setItem('cart', JSON.stringify(cart))
                    this.peliculas = []
                },
                (error) => {
                    console.error(error)
                    this.message = 'Ocurrió un error al procesar la compra:'
                    this.show = true
                    this.type = 'error'
                }
            )

            await this.$axios.post(`${this.$API}users/current/historialCompras`,{
                token: localStorage.getItem('auth'),
                price: t,
                peliculas: JSON.stringify(_peliculasDB)
            })
            .then(
                (response) => {
                    // console.log(response.data.enlace_descarga)
                    Swal.fire(
                        'Aquí tienes tu enlace de descarga',
                        `${response.data.enlace_descarga}`,
                        'success'
                    )
                    // window.open(''+response.data.enlace_descarga)
                    this.getHistory()
                },
                (error) => {
                    console.error(error)
                }
            )
        }
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
