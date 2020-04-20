<template>
  <div>
    <el-button type="primary" @click="send">按钮</el-button>
  </div>
</template>

<script>
import childOne from "../components/Child1";
import childTwo from "../components/Child2";
import axios from "axios";
export default {
  name: "",
  props: {},
  components: {
    childOne,
    childTwo
  },
  data() {
    return {
      msg: "我是home组件的数据"
    };
  },
  methods: {
    send() {
      this.$bus.$emit("send", this.msg);
    },
    getMenu() {
      axios
        .get("/api/menu")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getMenu();
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
</style>