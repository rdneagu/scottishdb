<template>
  <router-link v-if="href" :to="href" class="header-button">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text"><slot></slot></span>
  </router-link>
  <div v-else class="header-button" @click="OnButtonClick">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text"><slot></slot></span>
  </div>
</template>

<script>
export default {
  props: ['href', 'icon', 'text', 'click'],
  computed: {
    getIcon() {
      return `icon-${this.icon}`;
    },
  },
  methods: {
    OnButtonClick() {
      if (typeof (this.click) !== 'function') return false;
      return this.click();
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
  cursor: pointer;
  transition: color .2s ease, background-color .2s ease;
  .icon { margin-right: 8px; }
  &:hover { color: lighten($text-blue, 30%); }
  &.router-link-active, &.active { background-color: rgba($border-blue, .2); }
}
</style>
