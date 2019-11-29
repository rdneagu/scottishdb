<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="home">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Find out more information about your area</div>
        <div class="postcode-wrapper">
          <div class="input-wrapper postcode">
            <label for="postcode">POSTCODE</label>
            <input type="text" name="postcode" id="postcode"/>
          </div>
          <div class="input-wrapper distance">
            <label for="distance">DISTANCE</label>
            <input type="text" name="distance" id="distance" @blur="blurDistance" @focus="focusDistance" v-model="miles"/>
          </div>
        </div>
        <div class="control-wrapper">
          <OpaqueButton id="advanced-button" icon="cog">Advanced</OpaqueButton>
          <BorderedButton id="search-button" icon="search">Search</BorderedButton>
        </div>
        <div class="constituencies">
          <label class="constituencies-title">Some of Scotland's constituencies</label>
          <div class="constituencies-wrapper">
            <div class="constituencies-group-by-2" v-for="(group, index) in spotlight" :key="index">
              <Constituency size="sm" :zone="group[0].Area">{{ group[0].Name }}</Constituency>
              <Constituency size="sm" :zone="group[1].Area">{{ group[1].Name }}</Constituency>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="brief-stats">
          <BorderedButton id="see-all-constituencies" icon="list-numbered" size="sm">See all constituencies</BorderedButton>
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
import axios from 'axios';
import _ from 'lodash';

import Loading from '@/components/Loading.vue';
import OpaqueButton from '@/components/OpaqueButton.vue';
import BorderedButton from '@/components/BorderedButton.vue';
import Constituency from '@/components/Constituency.vue';

export default {
  components: {
    Loading,
    OpaqueButton,
    BorderedButton,
    Constituency,
  },
  data() {
    return {
      cities: [],
      constituencies: [],
      spotlight: [],
      distance: 0,
      distanceIsActive: false,
    };
  },
  async created() {
    // Start the loading process
    // Load cities API and parse the result
    this.$store.commit('loadingStart');
    if (_.isEmpty(this.cities)) {
      this.$store.commit('loadingMessage', { message: 'Loading cities' });
      const addresses = await axios.get('https://data.parliament.scot/api/addresses');
      this.cities = _.chain(addresses.data)
        .filter(a => a.AddressTypeID === 2)
        .forEach(a => a.Region = (_.isEmpty(a.Region) ? a.Town : a.Region)) // eslint-disable-line        
        .uniqBy('Region')
        .value();
    }
    if (_.isEmpty(this.constituencies)) {
      // Load constituencies API
      this.$store.commit('loadingMessage', { message: 'Loading constituencies' });
      const constituencies = await axios.get('https://data.parliament.scot/api/constituencies');
      this.constituencies = constituencies.data;
    }
    if (_.isEmpty(this.spotlight[0])) {
      const [constituencies] = [this.constituencies];
      // Add 4 random samples from the constituencies data and group them by 2
      this.spotlight = _.chain(constituencies)
        .sampleSize(4)
        .chunk(2)
        .value();
      console.log(this.spotlight);
      // Load members elected and regions
      const mecs = await axios.get('https://data.parliament.scot/api/MemberElectionConstituencyStatuses');
      const regions = await axios.get('https://data.parliament.scot/api/regions');
      _.forEach(this.spotlight, (group) => {
        _.forEach(group, (element) => {
          const member = _.chain(mecs.data)
            .filter(m => m.ConstituencyID === element.ID)
            .orderBy('ValidFromDate', 'desc')
            .head()
            .value();
          const region = _.chain(regions.data)
            .filter(r => _.find(constituencies, c => c.ID === member.ConstituencyID && c.RegionID === r.ID))
            .head()
            .get('Name')
            .value();
          element.Area = region; // eslint-disable-line
        });
      });
    }
    // End the loading process
    this.$store.commit('loadingFinish', { status: 1 });
  },
  methods: {
    blurDistance() {
      this.distanceIsActive = false;
    },
    focusDistance() {
      this.distanceIsActive = true;
    },
  },
  computed: {
    citiesCount() {
      return _.uniqBy(this.cities, 'Region');
    },
    miles: {
      get() {
        if (this.distanceIsActive) {
          return this.distance.toString();
        }
        return `${this.distance} mi.`;
      },
      set(newValue) {
        let distance = parseInt(newValue.replace(/[^\d]/g, ''), 10);
        if (Number.isNaN(distance)) {
          distance = 0;
        }
        this.distance = distance;
      },
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
    .postcode-wrapper {
      margin: 10px 15%;
      display: flex;
      text-align: center;
      justify-content: center;
      .input-wrapper {
        display: flex;
        flex-direction: column;
        border: 1px solid $text-blue;
        border-radius: 8px;
        text-align: center;
        &.postcode {
          width: 70%;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
        &.distance {
          width: 25%;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-left: none;
        }
        input {
          font-size: 3em;
          background: rgba($border-blue, 0.2);
          border: none;
          outline: none;
          box-shadow: none;
          color: $text-blue;
          text-align: center;
          height: 70px;
        }
        &.distance input{
          font-size: 2em;
          font-weight: 500;
        }
        label {
          font-size: 0.9em;
          padding: 2px 0;
          font-weight: 500;
        }
      }
    }
    .control-wrapper {
      display: flex;
      flex-flow: row-wrap;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin: 20px 15%;
      padding: 0 2%;
      #advanced-button {
        .icon {
          transform: rotate(0deg);
          transition: transform .2s ease;
        }
        &:hover .icon {
          transform: rotate(90deg);
        }
      }
    }
    .constituencies {
      padding: 5px;
      border: 1px solid $border-blue;
      border-radius: 4px;
      background-color: rgba($bg-blue, .4);
      .constituencies-title {
        display: inline-block;
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
            min-width: 350px;
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
      justify-content: space-between;
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
        min-width: 450px;
        flex: 1;
        display: flex;
        align-items: center;
        padding: 25px;
        margin: 40px;
        border-radius: 8px;
        background-color: lighten($bg-blue-2, 5%);
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
  .site-map {
    background-color: lighten($bg-blue, 4%);
    height: 250px;
  }
}
</style>
