<template>
  <div class="constituency" :class="[ size ]">
    <label class="area">{{ area }}</label>
    <div class="body">
      <div class="info">
        <slot></slot>
      </div>
      <div class="more-wrapper">
        <BorderedButton id="search-button" icon="contact-us" size="sm">Contact</BorderedButton>
        <OpaqueButton id="advanced-button" icon="ellipsis-h">More</OpaqueButton>
      </div>
    </div>
  </div>
</template>

<script>
import OpaqueButton from '@/components/OpaqueButton.vue';
import BorderedButton from '@/components/BorderedButton.vue';

export default {
  components: {
    OpaqueButton,
    BorderedButton,
  },
  props: ['area', 'size'],
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.constituency {
  display: flex;
  flex-direction: column;
  border: 1px solid $border-blue;
  border-radius: 4px;
  &.sm {
    height: 220px;
  }
  .area {
    display: block;
    border-bottom: 1px solid $border-blue;
    padding: 2px;
    background-color: $bg-blue;
    font-size: 0.8em;
    text-align: center;
  }
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    .info {
      flex: 1;
      flex-shrink: 0;
    }
    .more-wrapper {
      display: flex;
      align-items: center;
      align-self: stretch;
      justify-content: space-between;
      margin-top: 20px;
      > * {
        display: inline-flex;
      }
    }
  }
}
</style>
