
const state = () => ({
  postsDir: '---'
})

const mutations = {
  setPostsDir(state, postsDir) {
    state.postsDir = postsDir
  }
}

export default {
  namespaced: true,
  state,
  mutations
}