<template>
  <div class="rep">
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
  props: ['area'],
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.rep {
  display: flex;
  flex-direction: column;
  flex: 0 0 300px;
  height: 180px;
  border: 1px solid $border-blue;
  margin: 10px;
  label {
    display: block;
    border-bottom: 1px solid $border-blue;
    text-align: center;
    background-color: $bg-blue;
    font-size: 0.8em;
  }
  .body{
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
      >* {
        display: inline-flex;
      }
    }
  }
}
</style>
