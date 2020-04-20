<template>
  <div class="main flex">
    <div class="main-left">
      <el-menu
        :default-active="$route.path"
        :unique-opened="true"
        @select="handleSelect"
        class="el-menu-vertical-demo"
      >
        <el-menu-item :index="activeMenu.url" v-if="activeMenu.name=='首页'">
          <span slot="title">{{activeMenu.name}}</span>
        </el-menu-item>
        <div v-if="activeMenu.children_total>0">
          <div v-for="(item,index) in getLevel(activeMenu.menu_id)" :key="item.menu_id">
            <div v-if="item.children_total>0">
              <el-submenu :index="String(item.menu_id)">
                <template slot="title">{{item.name}}</template>
                <div v-for="(items,indexs) in getLevel(item.menu_id)" :key="items.menu_id">
                  <div v-if="items.children_total>0">
                    <el-submenu :index="String(items.menu_id)">
                      <template slot="title">{{items.name}}</template>
                      <el-menu-item
                        :index="itemss.url"
                        v-for="(itemss,indexss) in getLevel(items.menu_id)"
                        :key="itemss.menu_id"
                      >
                        <span slot="title">{{itemss.name}}</span>
                      </el-menu-item>
                    </el-submenu>
                  </div>
                  <el-menu-item :index="items.url" v-else>
                    <span slot="title">{{items.name}}</span>
                  </el-menu-item>
                </div>
              </el-submenu>
            </div>
            <el-menu-item :index="item.url" v-else>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </div>
        </div>
        <el-menu-item :index="activeMenu.url" v-else>
          <span slot="title">{{activeMenu.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-right">
      <div class="content">
        <div class="content-top">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              :label="item.name"
              :name="String(item.menu_id)"
              v-for="(item,index) in topMenu"
              :key="item.menu_id"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="content-main">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      menuList: [],
      topMenu: [],
      activeName: "",
      defaultActive: "",
      activeMenu: {},
      title: "首页"
    };
  },
  components: {},
  props: {},
  methods: {
    getMenu() {
      axios
        .get("/api/menu")
        .then(res => {
          if (res.status === 200) {
            this.menuList = res.data.data.data.slice(0, 100);
            this.topMenu = this.menuList.filter((item, index) => {
              return item.level === 0;
            });
            let path = this.$route.path;
            let index = this.find(path, "/", 1);
            if (index === -1) {
              this.activeMenu = this.topMenu[0];
            } else {
              this.activeMenu = this.topMenu.find(item => {
                return item.url === path.slice(0, index);
              });
            }
            this.activeName = String(this.activeMenu.menu_id);
            let a = this.menuList.find(item => item.url === path);
            document.title = a.name;
            // console.log(this.menuList);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    handleSelect(key, keyPath) {
      if (key !== this.$route.path) {
        this.title = this.menuList.find(item => item.url === key).name;
        this.$router.push(key);
        document.title = this.title;
      }
    },
    handleClick(tab) {
      this.activeMenu = this.topMenu[Number(tab.index)];
      this.defaultActive = tab.name;
      if (tab.label == "首页") {
        this.$router.push("/index");
        document.title = "首页";
        return;
      }
      let a = this.menuList.find(item => {
        return item.parent_id == tab.name;
      });
      this.$router.push(a.url);
      document.title = a.name;
    },
    getLevel(id) {
      return this.menuList.filter(item => {
        return item.parent_id === id;
      });
    }
  },
  mounted() {},
  beforeMount() {
    this.getMenu();
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log("object");
  //   if (to.path !== from.path) {
  //     next(vm => {
  //       document.title = vm.title;
  //       next();
  //     });
  //   }
  // },
  // beforeEach(to, from, next) {
  //   console.log(this.title);
  //   document.title = this.title;
  //   next();
  // },
  watch: {},
  computed: {
    leftMenu() {
      let menu = [];
      let a = this.topMenu.find(item => {
        item.menu_id == this.activeName;
      });
      if (!a) return [];
      if (a.name !== "首页") a.name = a.name + "首页";
      menu.push(a);
      this.menuList.map(item => {
        if (item.parent_id == this.activeName) {
          item.children = [];
          this.menuList.map(items => {
            if (items.parent_id === item.menu_id) {
              items.children = [];
              this.menuList.map(itemss => {
                if (itemss.parent_id === items.menu_id) {
                  items.children.push(itemss);
                }
              });
              item.children.push(items);
            }
          });
          menu.push(item);
        }
      });
      console.log(menu);
      return menu;
    }
  }
};
</script>

<style scoped lang='scss'>
.main {
  .main-left {
    position: fixed;
    padding-left: 40px;
    height: 100%;
    width: 200px;
    top: 0;
    left: 0;
    // min-height: 100vh;
  }
  .main-right {
    flex: 1;
    padding: 20px;
    padding-left: 280px;
  }
}
</style>