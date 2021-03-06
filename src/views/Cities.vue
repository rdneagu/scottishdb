<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="cities">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">List of Scotland cities covered</div>
        <aside class="navigator">
          <div ref="hAlphabet" class="alphabet horizontal">
            <BorderedButton v-for="letter in getAtoZ" :key="letter" :href="letterHref(letter)" append>{{ letter }}</BorderedButton>
          </div>
          <div class="search-city-wrapper">
            <div class="input-wrapper search-city">
              <label for="city">Enter city name/part of name:</label>
              <input type="text" name="city" id="city" placeholder="city name" v-model="citySearch" />
            </div>
          </div>
        </aside>
        <div class="content-wrapper">
          <aside v-if="vAlphabetVisibile" class="navigator">
            <div class="alphabet-spacer"></div>
            <div class="alphabet vertical">
              <BorderedButton v-for="letter in getAtoZ" :key="letter" :href="letterHref(letter)" append>{{ letter }}</BorderedButton>
            </div>
          </aside>
          <div class="cities-wrapper">
            <ul v-if="getFiltered.length > 0" class="cities-result">
              <li v-for="city in getPage" class="city" :key="city.Region">
                <label class="city-name">{{ city.Region }}</label>
              </li>
            </ul>
            <div v-else class="cities-result">
              <div class="no-result">No results have been found matching your request!</div>
            </div>
            <div v-if="getFiltered.length > 1" class="page-wrapper">
              <div class="page-left">
                <BorderedButton :click="changePage.bind(this, page-1)" icon="arr-left"></BorderedButton>
              </div>
              <div class="pages">
                <BorderedButton v-for="page in getFiltered.length" :key="page" :click="changePage.bind(this, page-1)"
                  :class="{ 'active-page': isCurrentPage(page-1) }">{{ page }}</BorderedButton>
              </div>
              <div class="page-right">
                <BorderedButton :click="changePage.bind(this, page+1)" icon="arr-right"></BorderedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import axios from 'axios';
import _ from 'lodash';

import Loading from '@/components/Loading.vue';
// import OpaqueButton from '@/components/OpaqueButton.vue';
import BorderedButton from '@/components/BorderedButton.vue';

export default {
  components: {
    Loading,
    BorderedButton,
  },
  data() {
    return {
      cities: [],
      citySearch: '',
      page: 0,
      vAlphabetObserver: null,
      vAlphabetVisibile: false,
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.citySearch = '';
    next();
  },
  beforeDestroy() {
    if (this.vAlphabetObserver !== null) {
      this.vAlphabetObserver.unobserve(this.$refs.hAlphabet);
    }
  },
  async mounted() {
    document.title = 'Scottish DB - List of cities';
    await this.loadInReadyState();
  },
  computed: {
    getFiltered() {
      let filter;
      if (!_.isEmpty(this.citySearch)) {
        filter = _.chain(this.cities)
          .filter(c => new RegExp(this.citySearch, 'i').test(c.Region))
          .value();
      } else if (this.$route.query.letter) {
        filter = _.chain(this.cities)
          .filter(c => c.Region.charAt(0) === this.$route.query.letter)
          .value();
      } else {
        filter = this.cities;
      }
      this.page = 0; // eslint-disable-line
      return _.chain(filter)
        .chunk(5)
        .value();
    },
    getPage() {
      return this.getFiltered[this.page];
    },
    getAtoZ() {
      const alphabet = [];
      alphabet.push('#');
      for (let n = 0; n < 26; n++) {
        alphabet.push(String.fromCharCode(65 + n));
      }
      return alphabet;
    },
  },
  methods: {
    async loadInReadyState() {
      if (!this.$store.getters.isLoadingInReadyState || this.cities.length !== 0) { return; }
      await this.load();
    },
    async load() {
      if (this.vAlphabetObserver === null) { this.vAlphabetObserverInit(); }
      // Start the loading process
      // Load cities API and parse the result
      this.$store.commit('loadingStart');
      this.$store.commit('loadingMessage', { message: 'Loading cities' });
      this.cities = this.$store.getters.getCities;
      // End the loading process
      this.$store.commit('loadingSuccess');
    },
    changePage(page) {
      if (page >= this.getFiltered.length) {
        this.page = 0;
      } else if (page < 0) {
        this.page = this.getFiltered.length - 1;
      } else {
        this.page = page;
      }
    },
    isCurrentPage(page) {
      return this.page === page;
    },
    letterHref(letter) {
      if (letter === '#') {
        return { name: 'cities' };
      }
      return { query: { letter } };
    },
    vAlphabetVisibilityChange(entries) {
      entries.forEach((entry) => {
        this.vAlphabetVisibile = !entry.isIntersecting;
      });
    },
    vAlphabetObserverInit() {
      this.$nextTick(() => {
        this.vAlphabetObserver = new IntersectionObserver(this.vAlphabetVisibilityChange, {});
        this.vAlphabetObserver.observe(this.$refs.hAlphabet);
      });
    },
  },
  watch: {
    '$store.state.loading.ready': async function (to, from) { // eslint-disable-line
      if (to === true && from === false) {
        await this.loadInReadyState();
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.cities {
  .top-wrapper {
    display: flex;
    flex-direction: column;
    .alphabet-spacer {
      width: 150px;
    }
    .navigator {
      align-self: center;
      border: 1px solid $border-blue;
      border-radius: 4px;
      background-color: rgba($bg-blue, .4);
      padding: 20px 40px;
      .alphabet {
        display: flex;
        align-items: center;
        &.horizontal {
          flex-flow: row wrap;
          .bordered-button {
            padding: 2px 4px;
            margin: 0 2px;
          }
        }
        &.vertical {
          position: fixed !important;
          flex-flow: column wrap;
          padding: 40px 20px;
          top: 50%;
          transform: translateY(-50%);
          .bordered-button {
            padding: 2px 4px;
            margin: 2px 0;
          }
        }
        .bordered-button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 15px;
          &.router-link-exact-active {
              background-color: darken(orange, 40%);
              border-color: orange;
              color: orange;
          }
        }
      }
      .search-city-wrapper {
        display: flex;
        margin-top: 20px;
        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid lighten($bg-blue, 5%);
          padding: 4px 0;
          label {
            flex-shrink: 0;
            display: flex;
            background-color: lighten($bg-blue, 5%);
            padding: 8px 4px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          input {
            color: $text-blue;
            flex: 1;
            padding: 8px 4px;
            background: none;
            border: none;
            margin: 0;
          }
        }
      }
    }
    .content-wrapper {
      display: flex;
      /* Vertical alphabet navigator */
      .navigator {
        width: 75px;
        border: none;
        padding: 0;
      }
      .cities-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        .cities-result {
          flex: 1;
          margin: 0;
          padding: 0;
          list-style: none;
          overflow: hidden;
          .no-result {
            margin-top: 20px;
            color: #ff6347;
            font-size: 1.4em;
            text-align: center;
          }
          li {
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            background-color: rgba($bg-blue, .4);
            border: 1px solid $border-blue;
            margin: 40px 0;
            font-weight: 300;
            word-break: break-all;
            &:before {
              content: "";
              position: absolute;
              top: 0;
              bottom: 0;
              width: 8px;
              background-color: $border-blue;
            }
            &:nth-child(even) {
              border-radius: 5px 0 0 5px;
              &:before { right: 0; }
            }
            &:nth-child(odd) {
              border-radius: 0 5px 5px 0;
              &:before { left: 0; }
            }
          }
        }
        .page-wrapper {
          display: flex;
          align-items: center;
          align-self: center;
          padding: 20px 40px;
          border: 1px solid $border-blue;
          border-radius: 4px;
          background-color: rgba($bg-blue, .4);
          .page-left {
            margin-right: 20px;
          }
          .pages {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
          }
          .page-right {
            margin-left: 20px;
          }
          .bordered-button {
            display: flex;
            align-items: center;
            min-width: 20px;
            padding: 0 5px;
            margin: 5px 5px;
            .icon { margin-left: 0; }
            &.active-page {
              background-color: darken(green, 20%);
              border-color: green;
              color: green;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 320px)  { /* smartphones, iPhone, portrait 480x320 phones */
  .cities {
    .top-wrapper {
      .navigator .search-city-wrapper .input-wrapper label {
        display: none;
      }
      .content-wrapper {
        .navigator {
          display: none;
        }
        .cities-wrapper .cities-result li {
          font-size: 1.5em;
          height: 120px;
        }
      }
    }
  }
}
@media (min-height: 0px) {
  .cities .top-wrapper .content-wrapper .navigator { display: none; }
}
@media (min-width: 481px) and (min-height: 800px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
  .cities .top-wrapper .content-wrapper .navigator { display: block; }
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  .cities {
    .top-wrapper {
      .navigator .search-cities-wrapper .input-wrapper label {
        display: flex;
      }
      .content-wrapper {
        .cities-wrapper .cities-result li {
          font-size: 4em;
          height: 200px;
        }
      }
    }
  }
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
