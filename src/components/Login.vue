<template>
    <v-container fluid>
        <v-layout align-center justify-center row fill-height>
            <v-flex xs10>
                <v-card
                    class="mx-auto"
                >
                    <v-card-title
                        style="font-weight:bold; font-size: 2em"
                    >Inicio de sesión</v-card-title>
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="Ingresa tu correo"
                        required
                        style="padding: 2em"
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        label="Ingresa tu contraseña"
                        :rules="passwordRules"
                        required
                        style="padding: 2em"
                        type="password"
                    ></v-text-field>

                    <div class="text-center" style="margin-left: 2em; margin-right:2em">
                        <v-btn block color="white" class="black--text" @click="login()">Iniciar sesión</v-btn>
                    </div>
                    <br>
                    <div class="text-center" style="margin-left: 2em; margin-right:2em">
                        <v-btn block color="white" class="black--text" @click="$router.push({ name: 'register' })">Crear una cuenta</v-btn>
                    </div>
                    <br>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data: () =>({
        email: '',
        emailRules: [
            v => !!v || 'Olvidaste llenar este campo',
            v => /.+@.+/.test(v) || 'El correo no es válido',
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Olvidaste llenar este campo',
            v => (v || '').indexOf(' ') < 0 || 'Los espacios no son permitidos'
        ],
    }),
    created(){
        const tok = localStorage.getItem('auth')
        if(tok)
            this.$router.push({ name:'home' })
    },
    methods: {
        async login(){
            if(this.email.trim().length == 0 || this.password.trim().length == 0)
            {
                alert('Llena bien los datos')
            }
            else
            {
                await this.$axios.post(`${this.$API}login`, {
                    email: this.email,
                    password: this.password
                })
                .then(
                    (response) => {
                        localStorage.setItem('auth',response.data.token.token )
                        this.$router.push({ name: 'home' })
                    },
                    (error) => {
                        alert('algo salió  mal')
                        console.error(error)
                    }
                )
            }
        }
    }
}
</script>
