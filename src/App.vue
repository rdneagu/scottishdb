<template>
  <div id="app">
    <header>
      <div class="logo">
        <router-link to="/">Logo</router-link>
      </div>
      <div class="navigation">
        <router-link to="/representatives">Representatives</router-link>
        <router-link to="/cities">Cities</router-link>
        <router-link to="/areas">Areas</router-link>
        <router-link to="/about-us">About Us</router-link>
        <router-link to="/contact-us">Contact Us</router-link>
        <router-link to="/bm">_bm_</router-link>
        <router-link to="/acc">_acc_</router-link>
      </div>
    </header>
    <router-view class="page" />
    <footer>
      <span class="copyright">Copyright &copy; 2019-2019 [name] Company. All rights reserved</span>
    </footer>
  </div>
</template>

<script>
export default { };
</script>

<style lang="scss">
@import '@/scss/_normalize.scss';
@import '@/scss/_colours.scss';

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

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: lighten($text-blue, 5%);
    &.router-link-exact-active { color: #42b983; }
  }
}
</style>
