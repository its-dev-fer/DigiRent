<template>  
  <Detalles/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Detalles from '@/components/Detalles.vue'; // @ is an alias to /src

@Component({
  components: {
    Detalles,
  },
})
export default class Home extends Vue {}
</script>
