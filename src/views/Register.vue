<template>  
  <Register/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Register from '@/components/Register.vue'; // @ is an alias to /src

@Component({
  components: {
    Register,
  },
})
export default class Home extends Vue {}
</script>
