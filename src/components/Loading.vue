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

@media (min-width: 320px)  { /* smartphones, iPhone, portrait 480x320 phones */
  .loading-wrapper .loading .status {
    display: none;
  }
}
@media (min-width: 481px) and (min-height: 800px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  .loading-wrapper .loading .status {
    display: inline;
  }
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
