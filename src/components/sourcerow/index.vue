<template>
  <van-popup v-model="show" position="center" :style="{ height: '50%', width: '100%' }">
    <van-picker
      show-toolbar
      title="选择源单行记录"
      :columns="columns"
      :default-index="defaulIndex"
      @cancel="cancel"
      @confirm="select"
    />
  </van-popup>
</template>
<script>
export default {
  name: `sourcerow`,
  props: {
    source: {
      type: Array,
      default() {
        return []
      }
    },
    defaulIndex: Number
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    show(newV, oldV) {
      if (!newV) {
        this.$emit('cancel')
      }
    }
  },
  computed: {
    columns() {
      return this.$props.source.map(m => {
        return `行：${m.iRowno}||${m.cInvName}`
      })
    }
  },
  methods: {
    open() {
      this.show = true
    },
    dismiss() {
      this.show = false
    },
    cancel() {
      this.$emit('cancel')
      this.show = false
    },
    select(value, index) {
      this.$emit('choose', this.$props.source[index])
      this.show = false
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
