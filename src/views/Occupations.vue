<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!$store.state.loading.ready || $store.state.loading.error" />
    <div v-else class="cities">
      <div class="top-wrapper">
        <div class="bg-city"></div>
        <div class="heading">Search for occupations</div>
        <aside class="navigator">
          <div class="search-city-wrapper">
            <div class="input-wrapper search-city">
              <label for="city">Enter occupation name/part of name:</label>
              <input type="text" name="city" id="city" placeholder="occupation name (e.g: Software Developer)" v-model="occupation" />
            </div>
            <BorderedButton id="find-occupation-button" size="sm" icon="search" :href="searchHref">Search</BorderedButton>
          </div>
        </aside>
        <div class="content-wrapper">
          <div class="occupation-wrapper">
            <div v-if="soc.length > 0" class="occupation">
              {{ soc[page].occupationTitle }}
              <div class="charts">
                <apexchart class="apexchart" width="400" type="line" v-bind="readAnnualChange"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedHoursOverall"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedHoursByGender"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedHoursByStatus"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedPayOverall"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedPayByGender"></apexchart>
                <apexchart class="apexchart" width="400" type="bar" v-bind="readEstimatedPayByStatus"></apexchart>
              </div>
            </div>
            <div v-else-if="soc.length <= 0 && query.search.length > 0" class="occupation">
              <div class="no-result">No results have been found matching your request!</div>
            </div>
            <div v-if="soc.length > 1" class="page-wrapper">
              <div class="page-left">
                <BorderedButton :click="changePage.bind(this, page-1)" icon="arr-left"></BorderedButton>
              </div>
              <div class="pages">
                <BorderedButton v-for="page in soc.length" :key="page" :click="changePage.bind(this, page-1)"
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
  props: ['query'],
  data() {
    return {
      occupation: '',
      soc: [],
      page: 0,
    };
  },
  async mounted() {
    await this.loadInReadyState();
    this.$nextTick(() => {
      setTimeout(() => {
        this.occupation = this.query.search || this.occupation;
      }, 500);
    });
  },
  computed: {
    searchHref() {
      if (this.occupation.length <= 0) { return undefined; }
      return { name: 'occupations', query: { search: this.occupation } };
    },
    getOccupation() {
      return this.soc[this.page];
    },
    readAnnualChange() {
      const categories = [];
      const seriesName = ['Annual Change'];
      const series = [];
      _.chain(this.getOccupation.ashe.annualChanges)
        .reject(data => data.change <= -50)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          if (id === 0) {
            series[0] = {
              name: seriesName[0],
              data: [],
            };
          }
          series[0].data.push(data.change);
        })
        .commit();
      return this.lineChartOptions('Annual Changes to Pay Rate (%)', categories, series);
    },
    readEstimatedHoursOverall() {
      const categories = [];
      const seriesName = ['Overall'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimateHours.overall)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          if (id === 0) {
            series[0] = {
              name: seriesName[0],
              data: [],
            };
          }
          series[0].data.push(data.hours);
        })
        .commit();
      return this.lineChartOptions('Estimated Hours', categories, series);
    },
    readEstimatedHoursByGender() {
      const categories = [];
      const seriesName = ['Male', 'Female'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimateHours.byGender)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          _.forEach(data.breakdown, (s) => {
            if (id === 0) {
              series[s.gender - 1] = {
                name: seriesName[s.gender - 1],
                data: [],
              };
            }
            series[s.gender - 1].data.push(s.hours);
          });
        })
        .commit();
      return this.lineChartOptions('Estimated Hours by Gender', categories, series);
    },
    readEstimatedHoursByStatus() {
      const categories = [];
      const seriesName = ['Full-Time', 'Part-Time'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimateHours.byStatus)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          _.forEach(data.breakdown, (s) => {
            if (id === 0) {
              series[s.status - 1] = {
                name: seriesName[s.status - 1],
                data: [],
              };
            }
            series[s.status - 1].data.push(s.hours);
          });
        })
        .commit();
      return this.lineChartOptions('Estimated Hours by Employment Status', categories, series);
    },
    readEstimatedPayOverall() {
      const categories = [];
      const seriesName = ['Overall'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimatePay.overall)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          if (id === 0) {
            series[0] = {
              name: seriesName[0],
              data: [],
            };
          }
          series[0].data.push(data.estpay);
        })
        .commit();
      return this.lineChartOptions('Estimated Weekly Pay', categories, series);
    },
    readEstimatedPayByGender() {
      const categories = [];
      const seriesName = ['Male', 'Female'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimatePay.byGender)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          _.forEach(data.breakdown, (s) => {
            if (id === 0) {
              series[s.gender - 1] = {
                name: seriesName[s.gender - 1],
                data: [],
              };
            }
            series[s.gender - 1].data.push(s.estpay);
          });
        })
        .commit();
      return this.lineChartOptions('Estimated Weekly Pay by Gender', categories, series);
    },
    readEstimatedPayByStatus() {
      const categories = [];
      const seriesName = ['Full-Time', 'Part-Time'];
      const series = [];
      _.chain(this.getOccupation.ashe.estimatePay.byStatus)
        .orderBy('year', 'asc')
        .forEach((data, id) => {
          categories.push(data.year);
          _.forEach(data.breakdown, (s) => {
            if (id === 0) {
              series[s.status - 1] = {
                name: seriesName[s.status - 1],
                data: [],
              };
            }
            series[s.status - 1].data.push(s.estpay);
          });
        })
        .commit();
      return this.lineChartOptions('Estimated Weekly Pay by Employment Status', categories, series);
    },
  },
  methods: {
    async loadInReadyState() {
      if (!this.$store.getters.isLoadingInReadyState || this.soc.length !== 0) { return; }
      await this.load();
    },
    async load() {
      if (_.isEmpty(this.query.search)) { return; }
      // Start the loading process
      // Load occupations API and parse the result
      this.$store.commit('loadingStart');
      this.$store.commit('loadingMessage', { message: 'Loading occupations' });
      const soc = await axios.get(`http://api.lmiforall.org.uk/api/v1/soc/search?q=${this.query.search}`);
      try {
        this.soc = await Promise.all(_.chain(soc.data)
          .map(async (occupation) => {
            const annualChanges = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/annualChanges?soc=${occupation.soc}&filters=region%3A11`);
            const estimateHours = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimateHours?soc=${occupation.soc}&coarse=false&filters=region%3A11`);
            const estimateHoursByGender = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimateHours?soc=${occupation.soc}&coarse=false&filters=region%3A11&breakdown=gender`);
            const estimateHoursByStatus = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimateHours?soc=${occupation.soc}&coarse=false&filters=region%3A11&breakdown=status`);
            const estimatePay = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=${occupation.soc}&coarse=false&filters=region%3A11`);
            const estimatePayByGender = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=${occupation.soc}&coarse=false&filters=region%3A11&breakdown=gender`);
            const estimatePayByStatus = await axios.get(`http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=${occupation.soc}&coarse=false&filters=region%3A11&breakdown=status`);
            const ess = await axios.get(`http://api.lmiforall.org.uk/api/v1/ess/region/11/${occupation.soc}?coarse=true`);
            const unempRate = await axios.get(`http://api.lmiforall.org.uk/api/v1/lfs/unemployment?soc=${occupation.soc}`);
            const unempRateByMale = await axios.get(`http://api.lmiforall.org.uk/api/v1/lfs/unemployment?soc=${occupation.soc}&filterBy=gender%3A1`);
            const unempRateByFemale = await axios.get(`http://api.lmiforall.org.uk/api/v1/lfs/unemployment?soc=${occupation.soc}&filterBy=gender%3A2`);
            const wfTrendStatus = await axios.get(`http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/status?soc=${occupation.soc}&minYear=2018`);
            const wfTrendGender = await axios.get(`http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/gender?soc=${occupation.soc}&minYear=2018`);
            return {
              occupationTitle: occupation.title,
              ashe: {
                annualChanges: annualChanges.data.annual_changes,
                estimateHours: {
                  overall: estimateHours.data.series,
                  byGender: estimateHoursByGender.data.series, // 1 male | 2 female
                  byStatus: estimateHoursByStatus.data.series, // 1 ft | 2 pt
                },
                estimatePay: {
                  overall: estimatePay.data.series,
                  byGender: estimatePayByGender.data.series,
                  byStatus: estimatePayByStatus.data.series,
                },
              },
              ess: ess.data,
              unemploymentRate: {
                overall: unempRate.data.years,
                byGender: {
                  male: unempRateByMale.data.years,
                  female: unempRateByFemale.data.years,
                },
              },
              wtfTrend: {
                byStatus: wfTrendStatus.data.predictedEmployment,
                byGender: wfTrendGender.data.predictedEmployment,
              },
            };
          })
          .value());
      } catch (e) {
        return;
      }
      console.log(this.soc);
      // End the loading process
      this.$store.commit('loadingSuccess');
    },
    changePage(page) {
      if (page >= this.soc.length) {
        this.page = 0;
      } else if (page < 0) {
        this.page = this.soc.length - 1;
      } else {
        this.page = page;
      }
    },
    isCurrentPage(page) {
      return this.page === page;
    },
    lineChartOptions(title, categories, series) {
      return {
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          title: {
            text: title,
            align: 'center',
          },
          xaxis: {
            categories,
          },
          grid: {
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
        },
        series,
      };
    },
  },
  watch: {
    query: {
      deep: true,
      async handler() {
        await this.load();
      },
    },
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
    .navigator {
      align-self: stretch;
      border: 1px solid $border-blue;
      border-radius: 4px;
      background-color: rgba($bg-blue, .4);
      padding: 20px 40px;
      margin: 0 20%;
      .search-city-wrapper {
        display: flex;
        align-items: center;
        flex: 1;
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
        #find-occupation-button {
          margin-left: 10px;
        }
      }
    }
    .content-wrapper {
      display: flex;
      flex-direction: column;
      .title {
        padding: 5px;
        background-color: rgba(darken($text-blue, 20%), .4);
        font-weight: 500;
      }
      .occupation-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        .occupation {
          flex: 1;
          margin: 0;
          padding: 0;
          list-style: none;
          overflow: hidden;
          .charts {
            display: flex;
            flex-flow: row wrap;
            .apexchart {
              margin: 0 4px;
              * {
                font-family: 'Quicksand' !important;
                font-weight: 500 !important;
                font-size: 1em !important;
              }
              .apexcharts-canvas {
                background: rgba($bg-blue, .8);
                border: 1px solid $border-blue;
                border-radius: 4px;
              }
              .apexcharts-title-text {
                fill: $text-blue;
                transform: translateY(5px);
              }
              .apexcharts-yaxis text { fill: $text-blue; }
              .apexcharts-xaxis text { fill: $text-blue; }
              .apexcharts-tooltip {
                background-color: $bg-blue;
                border: 1px solid $border-blue;
              }
              .apexcharts-tooltip-title {
                border: none;
                border-bottom: 1px solid $border-blue;
                background-color: $bg-blue;
              }
              .apexcharts-xaxistooltip {
                background-color: $bg-blue;
                border: 1px solid $border-blue;
                border-radius: 4px;
                color: $text-blue;
                &:before, &:after {
                  border-bottom-color: $border-blue;
                }
              }
              .apexcharts-xaxis-tick, .apexcharts-xaxis line { stroke: $border-blue; }
              .apexcharts-legend-text { color: $text-blue !important; }
            }
          }
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
