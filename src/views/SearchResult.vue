<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="search-result">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Search Result</div>
        <aside class="nearest-wrapper">
          <label class="nearest-title"><strong>{{ nearest.length }}</strong> areas found within <strong>{{ query.distance }} miles</strong></label>
          <div class="nearest-areas">
            <Constituency v-for="zone in nearest"
              :key="zone.postcode"
              :size="getSize"
              :zone="zone.outcode"
              :distance="zone.distance"
              :id="zone.constituency.ID"></Constituency>
          </div>
        </aside>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import postcodes from 'node-postcodes.io';

import Loading from '@/components/Loading.vue';
import Constituency from '@/components/Constituency.vue';

function mToKm(miles) {
  return Math.floor(Number.parseInt(miles, 10) * 1.609344) * 1000;
}

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) { return 0; }
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) { dist = 1; }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') { dist *= 1.609344; }
  if (unit === 'N') { dist *= 0.8684; }
  return dist;
}

export default {
  components: {
    Loading,
    Constituency,
  },
  props: ['query'],
  data() {
    return {
      nearest: [],
    };
  },
  async mounted() {
    await this.loadInReadyState();
  },
  methods: {
    async loadInReadyState() {
      if (!this.$store.getters.isLoadingInReadyState || this.nearest.length !== 0) { return; }
      await this.load();
    },
    async load() {
      // Start the loading process
      // Load cities API and parse the result
      this.$store.commit('loadingStart');
      this.$store.commit('loadingMessage', { message: 'Validating postcode' });
      const status = await postcodes.lookup(this.query.postcode);
      if (status.error) {
        this.$store.commit('loadingFail', { message: 'Invalid postcode!' });
        return;
      }
      this.$store.commit('loadingMessage', { message: 'Consulting map' });
      const nearest = await postcodes.outcodes(status.result.postcode.split(' ')[0], {
        limit: 100,
        radius: mToKm(this.query.distance) || 1,
      });
      const geodata = [];
      _.forEach(nearest.result, (postcode) => {
        geodata.push({
          longitude: postcode.longitude,
          latitude: postcode.latitude,
          limit: 15,
        });
      });
      const areas = await postcodes.geo(geodata);
      this.nearest = await Promise.all(_.chain(areas.result)
        .reject(area => area.result === null)
        .map(async (area) => {
          try {
            const postcode = (area.result[0].outcode === status.result.outcode) ? this.query.postcode : area.result[0].postcode;
            const tmpPostcode = await axios.get(`https://api.postcodes.io/scotland/postcodes/${postcode}`);
            const constituency = this.$store.getters.getConstituencies.find(c => c.Name === tmpPostcode.data.result.scottish_parliamentary_constituency);
            return {
              constituency,
              postcode,
              outcode: area.result[0].outcode,
              latitude: area.result[0].latitude,
              longitude: area.result[0].longitude,
              distance: distance(status.result.latitude, status.result.longitude, area.result[0].latitude, area.result[0].longitude),
            };
          } catch (e) {
            // console.error(e);
            // console.error(`Failed to load constituency data for postcode ${area.result[0].postcode}`);
            return false;
          }
        })
        .value());
      this.nearest = _.orderBy(this.nearest, 'distance', 'asc');
      // End the loading process
      this.$store.commit('loadingSuccess');
    },
  },
  computed: {
    getSize() {
      return (this.nearest.length > 1) ? 'sm' : 'full';
    },
  },
  watch: {
    query: {
      deep: true,
      async handler() {
        await this.load();
      },
    },
    '$store.state.loading.ready': async function (to, from) {
      if (to === true && from === false) {
        await this.loadInReadyState();
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_colours.scss';

.search-result {
  .top-wrapper {
    .nearest-wrapper {
      border: 1px solid $border-blue;
      border-radius: 4px;
      background-color: rgba($bg-blue, .4);
      padding: 4px 8px;
      .nearest-title {
        display: inline-block;
        padding: 2px 4px;
      }
      .nearest-areas {
        display: flex;
        overflow: auto;
        .constituency {
          flex: 1;
          min-width: 350px;
          margin: 10px;
          &:first-child { margin-left: 0; }
          &:last-child { margin-right: 0; }
        }
      }
    }
  }
}
</style>
