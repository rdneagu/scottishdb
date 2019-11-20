<template>
  <router-link :to="link" class="header-button">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text">
      <slot></slot>
    </span>
  </router-link>
</template>

<script>
export default {
  props: ['link', 'icon', 'text'],
  computed: {
    getIcon() {
      return `icon-${this.icon}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.header-button {
  display: inline-flex;
  align-items: center;
  padding: 10px;
  margin: 0 10px;
  border-radius: 2px;
  transition: color .2s ease, background-color .2s ease;
  .icon {
    margin-right: 8px;
  }

  &:hover {
    color: lighten($text-blue, 30%);
  }
  &.router-link-exact-active {
    background-color: rgba($border-blue, .2);
  }
}
</style>
