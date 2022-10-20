const state = {
  showRedBlue: false,
  targetUrl: ''
}
const mutations = {
  SET_SHOW_RED_BLUE(state, showRedBlue) {
    state.showRedBlue = showRedBlue
  },
  SET_TARGET_URL(state, path) {
    state.targetUrl = path
  }
}
const actions = {
  setShowRedBlue({ commit }, arg) {
    commit('SET_SHOW_RED_BLUE', arg)
  },
  setTargetUrl({ commit }, arg) {
    commit('SET_TARGET_URL', arg)
  }
}
export default {
  state,
  mutations,
  actions
}
