<template>
  <div id="app">
    <header>
      <router-link to="/" class="logo">
        <span class="logo-text">Scottish DB</span>
        <i class="icon icon-database"></i>
      </router-link>
      <div v-if="isHomePage && $resize && $mq.above(961)" class="navigation">
        <div class="menu">
          <HeaderButton v-bind="menuDropdown[0]">{{ menuDropdown[0].text }}</HeaderButton>
          <HeaderButton v-bind="menuDropdown[1]">{{ menuDropdown[1].text }}</HeaderButton>
          <HeaderButton v-bind="menuDropdown[2]">{{ menuDropdown[2].text }}</HeaderButton>
          <HeaderButton v-bind="menuDropdown[3]">{{ menuDropdown[3].text }}</HeaderButton>
          <HeaderButton v-bind="menuDropdown[4]">{{ menuDropdown[4].text }}</HeaderButton>
        </div>
      </div>
      <div v-else class="navigation compact">
        <MenuDropdown icon="menu" :dropdown="menuDropdown">Menu</MenuDropdown>
        <PostcodeSearch v-if="!isHomePage" :compact="true"></PostcodeSearch>
        <div v-if="!isHomePage" class="dummy-element"></div>
      </div>
    </header>
    <transition name="fade-quick" mode="out-in">
      <router-view class="page" />
    </transition>
    <footer>
      <span class="copyright">Copyright &copy; 2019-2019 Scottish DB. All rights reserved</span>
    </footer>
  </div>
</template>

<script>
import MenuDropdown from '@/components/MenuDropdown.vue';
import HeaderButton from '@/components/HeaderButton.vue';
import PostcodeSearch from '@/components/PostcodeSearch.vue';

export default {
  components: {
    MenuDropdown,
    HeaderButton,
    PostcodeSearch,
  },
  async mounted() {
    this.$store.commit('loadingStart');
    await this.$store.dispatch('loadConstituencies');
    await this.$store.dispatch('loadElectionMembers');
    await this.$store.dispatch('loadMembers');
    await this.$store.dispatch('loadEmailAddresses');
    await this.$store.dispatch('loadAddresses');
    await this.$store.dispatch('loadRegions');
    this.$store.commit('loadingSuccess');
  },
  data() {
    return {
      menuDropdown: [
        { text: 'Constituencies', icon: 'constituencies', href: { name: 'constituencies' } },
        { text: 'Cities', icon: 'cities', href: { name: 'cities' } },
        { text: 'Occupations', icon: 'occupations', href: { name: 'occupations' } },
        { text: 'Contact Us', icon: 'contact-us', href: { name: 'contact-us' } },
      ],
    };
  },
  methods: {},
  computed: {
    isHomePage() {
      return this.$route.name === 'home';
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_normalize.scss';
@import '@/scss/_colours.scss';
@import '@/scss/_icons.scss';

html, body, #app { min-height: 100vh; }
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Quicksand', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-blue;
  background: linear-gradient(to bottom, $bg-blue 0%, lighten($bg-blue, 1%) 50%, $bg-blue 100%);
  text-shadow: 1px 1px 1px black;

  header { flex: 1; flex-grow: 0; }
  .page { position: relative; flex: 1; flex-shrink: 0; }
  footer { flex: 1; flex-grow: 0; }
}
a {
  text-decoration: none !important;
  color: $text-blue;
}
::-webkit-input-placeholder,
::-moz-placeholder,
:-ms-input-placeholderm,
:-moz-placeholder,
::placeholder {
  color: inherit;
  font-style: oblique;
  text-align: center;
  opacity: .5;
}

.navigation {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $bg-blue-2;
  border: 1px solid $border-blue;
  border-left: 0;
  border-right: 0;

  .dummy-element {
    width: 85px;
  }
}
.page {
  display: flex;
  flex-direction: column;
  .top-wrapper {
    flex-shrink: 0;
    flex-grow: 1;
    position: relative;
    padding: 35px 60px;
    > * {
      position: relative;
    }
    .bg-city {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('./assets/images/wallpaper.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.5;
      &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(rgba(black, 0) 0%, rgba(black, 0.8) 60%);
      }
    }
    .heading {
      margin-bottom: 35px;
      font-weight: 300;
      text-align: center;
    }
  }
}
footer { text-align: center; padding: 20px 0; }

.logo {
  display: inline-flex;
  align-items: center;
  font-size: 2em;
  padding: 10px 1%;
  margin: 0 10%;
  .icon { margin-left: 10px; }
  .logo-text { font-weight: 500; }
}

.fade-enter-active { transition: opacity .4s ease; }
.fade-leave-active { transition: opacity .4s ease; }
.fade-enter, .fade-leave-to { opacity: 0; }
.fade-quick-enter-active { transition: opacity .2s ease; }
.fade-quick-leave-active { transition: opacity .2s ease; }
.fade-quick-enter, .fade-leave-to { opacity: 0; }
@keyframes rotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes fadeInOut { 0% { opacity: 1 } 50% { opacity: 0 } 100% { opacity: 1 } }

@media (min-width: 320px)  {
  #app header { text-align: center; }
  .navigation {
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
    .menu-dropdown {
      align-self: center;
    }
    .menu {
      flex: 1;
      .header-button {
        display: flex;
        justify-content: center;
      }
    }
  }
  .page {
    .top-wrapper {
      padding-left: 5px;
      padding-right: 5px;
      .heading {
        font-size: 2em;
      }
    }
  }
  /* smartphones, iPhone, portrait 480x320 phones */
}
@media (min-width: 481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  .page {
    .top-wrapper {
      padding-left: 60px;
      padding-right: 60px;
      .heading {
        font-size: 3em;
      }
    }
  }
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  #app header { text-align: initial; }
  .navigation {
    flex-direction: row;
    justify-content: initial;
    padding: 0 10%;
    .menu-dropdown {
      align-self: initial;
    }
    .menu {
      flex: initial;
      .header-button {
        display: inline-flex;
        justify-content: initial;
      }
    }
  }
  .navigation.compact {
    justify-content: space-between;
  }
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
