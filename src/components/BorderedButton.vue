<template>
  <a v-if="mail" :href="mail" class="bordered-button" :class="[ size ]">
    <span class="text"><slot></slot></span>
    <i v-if="icon" class="icon" :class="[ getIcon ]"></i>
  </a>
  <router-link v-else-if="href" :to="href" class="bordered-button" :class="[ size ]">
    <span class="text"><slot></slot></span>
    <i v-if="icon" class="icon" :class="[ getIcon ]"></i>
  </router-link>
  <div v-else class="bordered-button" :class="[ size ]" @click="OnButtonClick">
    <span class="text"><slot></slot></span>
    <i v-if="icon" class="icon" :class="[ getIcon ]"></i>
  </div>
</template>

<script>
export default {
  props: ['icon', 'size', 'href', 'click', 'mail'],
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

.bordered-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid $border-blue;
  border-radius: 5px;
  padding: 15px 30px;
  background: $bg-blue;
  cursor: pointer;
  transition: color .2s ease, background-color .2s ease;
  .icon { margin-left: 20px; }
  .text { font-weight: 500; }
  &:hover {
    color: lighten($text-blue, 30%);
    background: lighten($bg-blue, 3%);
  }
  &.sm {
    padding: 8px 15px;
    font-size: 1em;
    .icon { margin-left: 10px; }
  }
}
</style>
