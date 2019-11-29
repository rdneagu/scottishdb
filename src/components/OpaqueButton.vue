<template>
  <router-link v-if="href" :to="href" class="opaque-button">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text"><slot></slot></span>
  </router-link>
  <div v-else class="opaque-button" @click="OnButtonClick">
    <i class="icon" :class="[ getIcon ]"></i>
    <span class="text"><slot></slot></span>
  </div>
</template>

<script>
export default {
  props: ['icon', 'href', 'click'],
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

.opaque-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color .2s ease;
  .icon { margin-right: 8px; }
  .text { transition: padding-left .2s ease; }
  &:hover {
    color: lighten($text-blue, 30%);
    .text { padding-left: 10px; }
  }
}
</style>
