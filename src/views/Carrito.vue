<template>  
  <Carrito/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Carrito from '@/components/Carrito.vue'; // @ is an alias to /src

@Component({
  components: {
    Carrito,
  },
})
export default class Home extends Vue {}
</script>
