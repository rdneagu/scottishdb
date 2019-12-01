import _ from 'lodash';
import axios from 'axios';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      ready: false,
      error: false,
      message: 'Loading',
    },
    gov: {
      constituencies: undefined,
      electionMembers: undefined,
      members: undefined,
      emailAddresses: undefined,
      addresses: undefined,
      regions: undefined,
    },
  },
  getters: {
    getConstituencies(state) {
      return state.gov.constituencies;
    },
    getElectionMembers(state) {
      return state.gov.electionMembers;
    },
    getMembers(state) {
      return state.gov.members;
    },
    getEmailAddresses(state) {
      return state.gov.emailAddresses;
    },
    getAddresses(state) {
      return state.gov.addresses;
    },
    getRegions(state) {
      return state.gov.regions;
    },
    getCities(state) {
      return _.chain(state.gov.addresses)
        .filter(address => address.AddressTypeID === 2)
        .forEach(address => address.Region = (_.isEmpty(address.Region) ? address.Town : address.Region)) // eslint-disable-line
        .uniqBy('Region')
        .orderBy('Region', 'asc')
        .value();
    },
    isLoadingInReadyState(state) {
      return state.loading.ready;
    },
    isLoadingInErrorState(state) {
      return state.loading.error;
    },
  },
  mutations: {
    loadingStart(state) {
      state.loading.ready = false;
      state.loading.error = false;
    },
    loadingMessage(state, { message }) {
      state.loading.message = message;
    },
    loadingSuccess(state) {
      if (!state.loading.error) {
        state.loading.ready = true;
      }
    },
    loadingFail(state, { message }) {
      state.loading.error = true;
      state.loading.message = message || `Error when loading data: ${state.loading.message}`;
    },
    storeConstituencies(state, result) {
      state.gov.constituencies = result;
    },
    storeElectionMembers(state, result) {
      state.gov.electionMembers = result;
    },
    storeMembers(state, result) {
      state.gov.members = result;
    },
    storeEmailAddresses(state, result) {
      state.gov.emailAddresses = result;
    },
    storeAddresses(state, result) {
      state.gov.addresses = result;
    },
    storeRegions(state, result) {
      state.gov.regions = result;
    },
  },
  actions: {
    async loadConstituencies({ commit, state }) {
      if (state.gov.constituencies !== undefined) return;

      commit('loadingMessage', { message: 'Loading constituencies' });
      const response = await axios.get('https://data.parliament.scot/api/constituencies');
      const result = _.chain(response.data)
        .filter(constituency => constituency.ValidUntilDate === null)
        .orderBy('Name')
        .value();
      commit('storeConstituencies', result);
    },
    async loadElectionMembers({ commit, state }) {
      if (state.gov.electionMembers !== undefined) return;

      commit('loadingMessage', { message: 'Loading election members' });
      const response = await axios.get('https://data.parliament.scot/api/MemberElectionConstituencyStatuses');
      const result = _.chain(response.data)
        .filter(member => member.ValidUntilDate === null)
        .value();
      commit('storeElectionMembers', result);
    },
    async loadMembers({ commit, state }) {
      if (state.gov.members !== undefined) return;

      commit('loadingMessage', { message: 'Loading members' });
      const response = await axios.get('https://data.parliament.scot/api/members');
      const result = _.chain(response.data)
        .filter(member => member.IsCurrent === true)
        .value();
      commit('storeMembers', result);
    },
    async loadEmailAddresses({ commit, state }) {
      if (state.gov.emailAddresses !== undefined) return;

      commit('loadingMessage', { message: 'Loading email addresses' });
      const response = await axios.get('https://data.parliament.scot/api/emailaddresses');
      const result = _.chain(response.data)
        .filter(address => address.IsDefault === true)
        .value();
      commit('storeEmailAddresses', result);
    },
    async loadAddresses({ commit, state }) {
      if (state.gov.addresses !== undefined) return;

      commit('loadingMessage', { message: 'Loading addresses' });
      const response = await axios.get('https://data.parliament.scot/api/addresses');
      const result = response.data;
      commit('storeAddresses', result);
    },
    async loadRegions({ commit, state }) {
      if (state.gov.regions !== undefined) return;

      commit('loadingMessage', { message: 'Loading regions' });
      const response = await axios.get('https://data.parliament.scot/api/regions');
      const result = response.data;
      commit('storeRegions', result);
    },
  },
  modules: {
  },
});
