<template>
  Settings
  <a-form>
    <a-form-item label="PostsDir">
      <a-input :value="postsDir" readonly>
        <template #suffix>
          <FolderOutlined @click="onSelectFolder"/>
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onSave">Save</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState, mapMutations } from 'vuex'
import { FolderOutlined } from '@ant-design/icons-vue'

export default {
  name: 'Settings',
  components: { FolderOutlined },
  data() {

  },
  computed: mapState({
    postsDir: state => state.settings.postsDir
  }),
  methods: {
    ...mapMutations({
      setPostsDir: 'settings/setPostsDir'
    }),
    onSelectFolder() {
      ipcRenderer.invoke('onSelectFolder').then((res) => {
        if (res.filePaths.length > 0) {
          this.setPostsDir(res.filePaths[0].replace(/\\/g, '/'))
        }
      })
    },
    onSave() {

    }
  },
  mounted() {
    this.currentPostsDir = this.postsDir
    // console.log(this.postsDir)
    // console.log(this.$store.state.settings.postsDir)
  }
}
</script>

<style>

</style>