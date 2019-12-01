<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="constituencies">
      <router-view v-if="$route.params.id"></router-view>
      <div v-else class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">List of Scotland constituencies</div>
        <aside class="navigator">
          <div ref="hAlphabet" class="alphabet horizontal">
            <BorderedButton v-for="letter in getAtoZ" :key="letter" :href="letterHref(letter)" append>{{ letter }}</BorderedButton>
          </div>
          <div class="search-constituency-wrapper">
            <div class="input-wrapper search-constituency">
              <label for="constituency">Enter constituency name/part of name:</label>
              <input type="text" name="constituency" id="constituency" placeholder="constituency name" v-model="constituencySearch" />
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
          <div class="constituencies-wrapper">
            <ul v-if="getFiltered.length > 0" class="constituencies">
              <li v-for="constituency in getPage" class="constituency" :key="constituency.ID">
                <label class="constituency-name">{{ constituency.Name }}</label>
              </li>
            </ul>
            <div v-else class="constituencies">
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
import axios from 'axios';
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
      constituencies: [],
      constituencySearch: '',
      page: 0,
      vAlphabetObserver: null,
      vAlphabetVisibile: false,
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.constituencySearch = '';
    next();
  },
  beforeDestroy() {
    if (this.vAlphabetObserver !== null) {
      this.vAlphabetObserver.unobserve(this.$refs.hAlphabet);
    }
  },
  async created() {
    // Start the loading process
    // Load constituencies API and parse the result
    this.$store.commit('loadingStart');
    if (_.isEmpty(this.constituencies)) {
      this.$store.commit('loadingMessage', { message: 'Loading constituencies' });
      const constituencies = await axios.get('https://data.parliament.scot/api/constituencies');
      this.constituencies = _.chain(constituencies.data)
        .filter(c => c.ValidUntilDate === null)
        .orderBy('Name')
        .value();
    }
    // End the loading process
    this.$store.commit('loadingFinish', { status: 1 });
  },
  computed: {
    getFiltered() {
      let filter;
      if (!_.isEmpty(this.constituencySearch)) {
        filter = _.chain(this.constituencies)
          .filter(c => new RegExp(this.constituencySearch, 'i').test(c.Name))
          .value();
      } else if (this.$route.query.letter) {
        filter = _.chain(this.constituencies)
          .filter(c => c.Name.charAt(0) === this.$route.query.letter)
          .value();
      } else {
        filter = this.constituencies;
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
        return { name: 'constituencies' };
      }
      return { query: { letter } };
    },
    vAlphabetVisibilityChange(entries) {
      entries.forEach((entry) => {
        this.vAlphabetVisibile = !entry.isIntersecting;
      });
    },
  },
  watch: {
    '$store.state.loading.ready'(to) { // eslint-disable-line
      if (to === true && !this.$route.params.id) {
        this.$nextTick(() => {
          this.vAlphabetObserver = new IntersectionObserver(this.vAlphabetVisibilityChange, {});
          this.vAlphabetObserver.observe(this.$refs.hAlphabet);
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.constituencies {
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
      .search-constituency-wrapper {
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
      .constituencies-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        .constituencies {
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
            height: 200px;
            position: relative;
            align-items: center;
            justify-content: center;
            background-color: rgba($bg-blue, .4);
            border: 1px solid $border-blue;
            margin: 40px 0;
            font-size: 4em;
            font-weight: 300;
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
</style>
