<template>
  <div class="opaque-button">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: ['link', 'icon'],
  computed: {
    getIcon() {
      return `icon-${this.icon}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.opaque-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    margin-right: 8px;
  }
  .text {
    padding-left: 0px;
    transition: padding-left .2s ease;
  }
  &:hover .text {
    padding-left: 10px;
  }
}
</style>
