<template>
  <div class="loading-wrapper" :class="{ fail: hasFailed }">
    <div class="loading">
      <i class="icon icon-cog"></i>
      <span class="status">{{ getStatus }}</span>
    </div>
    <span class="loading-message">{{ $store.state.loading.message }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    hasFailed() {
      return this.$store.state.loading.error;
    },
    getStatus() {
      return (this.$store.state.loading.error) ? 'ERROR' : 'LOADING';
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.loading-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid $border-blue;
  .loading {
    display: flex;
    align-items: center;
    font-size: 10em;
    .icon {
      margin: 0 50px;
      animation: rotate 1.5s linear infinite forwards;
    }
    .status {
      font-weight: 700;
    }
  }
  .loading-message {
    animation: fadeInOut 2s linear infinite forwards;
  }

  &.fail {
    color: #ff6347;
    .loading .icon { animation: none; }
    .loading-message { animation: none; }
  }
}
</style>
