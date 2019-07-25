<template>  
  <Search/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Search from '@/components/Search.vue'; // @ is an alias to /src

@Component({
  components: {
    Search,
  },
})
export default class Home extends Vue {}
</script>
