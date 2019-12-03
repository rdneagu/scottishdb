<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="error">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Page not found</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  components: {
    Loading,
  },
  mounted() {
    document.title = 'Scottish DB - Page not found';
  },
};
</script>

<style lang="scss">
.error {
  .bg-city {
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      mix-blend-mode: color;
      background-color: rgba(#ff6347, .6);
    }
  }
  .heading {
    color: #ff6347;
  }
}

@supports not (mix-blend-mode: color) {
  .error .bg-city:after {
    background-color: rgba(#ff6347, .1);
  }
}
</style>
