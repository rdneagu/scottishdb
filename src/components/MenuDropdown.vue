<template>
  <div class="menu-dropdown">
    <HeaderButton :icon="icon" :click="showMenu.bind()" :class="{ active: isVisible }"><slot></slot></HeaderButton>
    <transition name="fade">
      <div v-if="isVisible" class="dropdown">
        <template v-for="item in dropdown">
          <HeaderButton :key="item.id" v-bind="item">{{ item.text }}</HeaderButton>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import HeaderButton from '@/components/HeaderButton.vue';

export default {
  components: {
    HeaderButton,
  },
  props: ['icon', 'dropdown'],
  created() {
    window.addEventListener('click', this.close);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close);
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    showMenu() {
      this.isVisible = !this.isVisible;
    },
    close(e) {
      if (!this.$el.contains(e.target) || e.target.closest('.dropdown') !== null) {
        this.isVisible = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.menu-dropdown {
  display: flex;
  flex-direction: column;
  position: relative;
  .dropdown {
    position: absolute;
    left: -33%;
    top: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: darken($bg-blue, 2%);
    box-shadow: 0 10px 40px rgba(black, .5);
    border: 1px solid black;
    border-radius: 2px;
    overflow: hidden;
    z-index: 2;
    .header-button {
      margin: 0;
      padding: 10px 20px;
    }
  }
}
</style>
