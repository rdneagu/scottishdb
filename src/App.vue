<template>
  <div id="app">
    <header>
      <router-link to="/" class="logo">
        <span class="logo-text">Scottish DB</span>
        <i class="icon icon-database"></i>
      </router-link>
      <div class="navigation">
        <div class="menu">
          <HeaderButton link="/representatives" icon="representatives">Representatives</HeaderButton>
          <HeaderButton link="/cities" icon="cities">Cities</HeaderButton>
          <HeaderButton link="/areas" icon="areas">Areas</HeaderButton>
          <HeaderButton link="/about-us" icon="about-us">About Us</HeaderButton>
          <HeaderButton link="/contact-us" icon="contact-us">Contact Us</HeaderButton>
        </div>
        <div class="account">
          <HeaderButton link="/" icon="bookmark-l">5</HeaderButton>
          <HeaderButton link="/" icon="user">Andreea Cora</HeaderButton>
        </div>
      </div>
    </header>
    <router-view class="page" />
    <footer>
      <span class="copyright">Copyright &copy; 2019-2019 [name] Company. All rights reserved</span>
    </footer>
  </div>
</template>

<script>
import HeaderButton from '@/components/HeaderButton.vue';

export default {
  components: {
    HeaderButton,
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

  header { flex: 1; flex-grow: 0; }
  .page { flex: 1; flex-shrink: 0; }
  footer { flex: 1; flex-grow: 0; }
}
a {
  text-decoration: none !important;
  color: $text-blue;
}

.navigation {
  display: flex;
  justify-content: space-between;
  padding: 10px 10%;
  background-color: $bg-blue-2;
  border: 1px solid $border-blue;
  border-left: 0;
  border-right: 0;
}
footer {
  text-align: center;
  padding: 20px 0;
}

.logo {
  display: inline-flex;
  align-items: center;
  font-size: 2em;
  padding: 10px 1%;
  margin: 0 10%;
  .icon {
    margin-left:10px;
  }
  .logo-text{
    font-weight:500;
  }
}
</style>
