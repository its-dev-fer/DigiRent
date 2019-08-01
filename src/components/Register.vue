<template>
    <v-container fluid>
        <v-layout align-center justify-center row fill-height>
            <v-flex xs10>
                <v-card
                    class="mx-auto"
                >
                    <v-card-title
                        style="font-weight:bold; font-size: 2em"
                    >Crea tu cuenta</v-card-title>
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="Ingresa tu nombre"
                        required
                        style="padding: 2em"
                    ></v-text-field>
                    <v-text-field
                        v-model="lastname"
                        :rules="lastnameRules"
                        label="Ingresa tus apellidos"
                        required
                        style="padding: 2em"
                    ></v-text-field>
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
                        <v-btn block color="white" class="black--text" @click="signup()">Registrarme</v-btn>
                    </div>
                    <br>
                    <div class="text-center" style="margin-left: 2em; margin-right:2em">
                        <v-btn block color="white" class="black--text" @click="$router.push({ name: 'login' })">Ya tengo cuenta</v-btn>
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
        name: '',
        nameRules: [
            v => !!v || 'Olvidaste llenar este campo',
            v => (v || '').indexOf(' ') < 0 || 'Los espacios no son permitidos'
        ],
        lastname: '',
        lastnameRules: [
            v => !!v || 'Olvidaste llenar este campo',
            v => (v || '').indexOf(' ') < 0 || 'Los espacios no son permitidos'
        ],
    }),
    methods:{
        async signup(){
            let hasErrors = false
            if(this.email.trim().length == 0 || this.password.trim().length == 0 || this.name.trim().length == 0 || this.lastname.trim().length == 0)
            {
                hasErrors = true
            }
            if(!hasErrors)
            {
                await this.$axios.post(`${this.$API}signup`, {
                    name: this.name,
                    lastname: this.lastname,
                    email: this.email,
                    password: this.password
                })
                .then(
                    (data) => {
                        alert('Hemos creado tu cuenta')
                        localStorage.setItem('auth', data.data.token)
                        this.$router.push({ name: 'home' })
                    },
                    (error) => {
                        alert('Algo salió mal')
                        console.error(error)
                    }
                )
            }
            else
            {
                alert('Necesitas llenar bien algunos datos')
            }
        }
    }
}
</script>
