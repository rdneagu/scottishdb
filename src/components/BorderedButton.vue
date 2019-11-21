<template>
  <div class="bordered-button" :class="[ size ]">
      <span class="text"><slot></slot>
      </span>
    <i class="icon" :class="[ getIcon ]"></i>
  </div>
</template>

<script>
export default {
  props: ['link', 'icon', 'size'],
  computed: {
    getIcon() {
      return `icon-${this.icon}`;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.bordered-button {
  display: flex;
  align-items: center;
  border: 1px solid $border-blue;
  border-radius: 5px;
  padding: 15px 40px;
  background: $bg-blue;
  cursor: pointer;
  transition: color .2s ease, background-color .2s ease;
  .icon {
    margin-left: 0px;
  }
  .text {
    margin-right: 8px;
    font-weight: 500;
  }
  &:hover {
    color: lighten($text-blue, 30%);
    background: lighten($bg-blue, 3%);
  }
  &.sm{
    padding: 5px 15px;
    font-size: 0.9em;
  }
}
</style>
