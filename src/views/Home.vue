<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="home">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Find out more information about your area</div>
        <PostcodeSearch></PostcodeSearch>
        <div class="constituencies">
          <label class="constituencies-title">Some of Scotland's constituencies</label>
          <div class="constituencies-wrapper">
            <div class="constituencies-group-by-2" v-for="(group, index) in spotlight" :key="index">
              <Constituency :id="group[0].ID" size="sm"></Constituency>
              <Constituency :id="group[1].ID" size="sm"></Constituency>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="brief-stats">
          <BorderedButton id="see-all-constituencies" href="/constituencies" icon="list-numbered" size="sm">See all constituencies</BorderedButton>
          <div class="stats-count">
            <div class="cities-count">
              <span class="emphasize">{{ cities.length }}</span>
              <span class="text"> cities </span>
            </div>
            <div class="constituencies-count">
              <span class="emphasize">{{ constituencies.length }}</span>
              <span class="text"> constituencies </span>
            </div>
          </div>
        </div>
        <div class="brief-about-us">
          <aside class="panel-info">
            <i class="icon icon-info"></i>
            <div class="text">
              Find information about employment, schooling, health and social care within your area
            </div>
          </aside>
          <aside class="panel-contact">
            <i class="icon icon-contact-us"></i>
            <div class="text">
              Get in contact with your area representative instantly. Express your feedback anytime!
            </div>
          </aside>
        </div>
      </div>
      <div class="site-map"></div>
    </div>
  </transition>
</template>

<script>
// ^((?!('AB|'DD|'FK|'G|'PA|'PH|'DG|'KA|'ML|'EH|'KY|'TD|'IV|'KW|'ZE|'HS|'KW)\d+\s).)*\n
// import axios from 'axios';
import _ from 'lodash';

import Loading from '@/components/Loading.vue';
import BorderedButton from '@/components/BorderedButton.vue';
import Constituency from '@/components/Constituency.vue';
import PostcodeSearch from '@/components/PostcodeSearch.vue';

export default {
  components: {
    Loading,
    BorderedButton,
    Constituency,
    PostcodeSearch,
  },
  data() {
    return {
      cities: [],
      constituencies: [],
      spotlight: [],
    };
  },
  async mounted() {
    await this.loadInReadyState();
  },
  methods: {
    async loadInReadyState() {
      if (!this.$store.getters.isLoadingInReadyState) { return; }
      await this.load();
    },
    async load() {
      // console.log(await axios.get('/api/getPostcodeInRadius.php'));
      // Start the loading process
      // Load cities API and parse the result
      this.$store.commit('loadingStart');
      if (this.cities.length === 0) {
        this.$store.commit('loadingMessage', { message: 'Loading cities' });
        this.cities = this.$store.getters.getCities;
      }
      if (this.constituencies.length === 0) {
        this.$store.commit('loadingMessage', { message: 'Loading constituencies' });
        this.constituencies = this.$store.getters.getConstituencies;
      }
      if (this.spotlight.length === 0) {
        // Add 4 random samples from the constituencies data and group them by 2
        this.$store.commit('loadingMessage', { message: 'Preparing spotlight' });
        this.spotlight = _.chain(this.constituencies)
          .sampleSize(4)
          .chunk(2)
          .value();
      }
      // End the loading process
      this.$store.commit('loadingSuccess');
    },
  },
  computed: {},
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

.home {
  display: flex;
  flex-direction: column;
  .top-wrapper {
    .constituencies {
      padding: 5px;
      border: 1px solid $border-blue;
      border-radius: 4px;
      background-color: rgba($bg-blue, .4);
      .constituencies-title {
        display: block;
        padding: 2px 4px;
      }
      .constituencies-wrapper {
        display: flex;
        flex-flow: row wrap;
        margin: 0 10px;
        .constituencies-group-by-2 {
          flex: 1;
          display: flex;
          flex-flow: row wrap;
          .constituency {
            flex: 1;
            margin: 10px;
          }
        }
      }
    }
  }
  .bottom-wrapper {
    padding: 20px 60px;
    border-top: 1px solid $border-blue;
    .brief-stats {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      .stats-count > * {
        display: inline-block;
        padding: 0 10px;
        font-size: 1.2em;
        &.constituencies-count {
          border-left: 2px solid lighten($text-blue, 10%);
        }
        .emphasize {
          color: lighten($text-blue, 10%);
          font-weight: 700;
        }
      }
    }
    .brief-about-us {
      display: flex;
      flex-flow: row wrap;
      margin: 20px 0;
      aside {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background-color: lighten($bg-blue-2, 5%);
        .text {
          margin: 0 50px;
          font-weight: 300;
        }
      }
    }
  }
  .site-map {
    background-color: lighten($bg-blue, 4%);
    height: 250px;
  }
}

@media (min-width: 320px)  {
  .home {
    .top-wrapper {
      .constituencies {
        .constituencies-title { text-align: center; }
        .constituencies-wrapper {
          .constituencies-group-by-2 {
            .constituency { min-width: 230px; }
          }
        }
      }
    }
    .bottom-wrapper {
      padding-left: 0;
      padding-right: 0;
      .brief-stats {
        justify-content: center;
        .stats-count {
          margin-top: 5px;
        }
      }
      .brief-about-us {
        aside {
          flex-flow: row wrap;
          margin: 5px;
          padding: 5px;
          .icon {
            font-size: 4em;
          }
          .text {
            margin: 0 20px;
            font-size: 1.2em;
          }
        }
      }
    }
  }
  /* smartphones, iPhone, portrait 480x320 phones */
}
@media (min-width: 481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
}
@media (min-width: 641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  .home {
    .top-wrapper {
      .constituencies {
        .constituencies-title { text-align: initial; }
        .constituencies-wrapper {
          .constituencies-group-by-2 {
            .constituency { min-width: 350px; }
          }
        }
      }
    }
    .bottom-wrapper {
      padding-left: 60px;
      padding-right: 60px;
      .brief-stats {
        justify-content: space-between;
        .stats-count {
          margin-top: 0;
        }
      }
      .brief-about-us {
        aside {
          flex-flow: row nowrap;
          min-width: 450px;
          margin: 40px;
          padding: 25px;
          .icon {
            font-size: 10em;
          }
          .text {
            margin: 0 50px;
            font-size: 1.8em;
            font-weight: 300;
          }
        }
      }
    }
  }
}
@media (min-width: 961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
}
@media (min-width: 1025px) { /* big landscape tablets, laptops, and desktops */
}
@media (min-width: 1281px) { /* hi-res laptops and desktops */
}
</style>
