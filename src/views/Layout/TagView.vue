<template>
  <div class="tags-scroll-content">
    <el-scrollbar @scroll="onScroll" ref="scrollbar">
      <div class="tags-scroll-body">
        <el-tag
          v-for="(item, index) in pageTagsList"
          :key="item.name"
          ref="scrolltag"
          class="tags-scroll-item"
          :class="{ active: activeTag == item.name }"
          :closable="item.name != 'Home'"
          @click="clickTag(item, index)"
          @close="closeTag(item, index)"
        >
          {{ $t(item.title) }}
        </el-tag>
      </div>
    </el-scrollbar>
    <!-- :class="{'active':activeTag==item.name}" :effect="activeTag==item.name?'dark':'plain'"-->
    <div class="close-tag-content">
      <el-dropdown
        transfer
        trigger="hover"
        @command="handleTagsOption"
        placement="bottom-end"
        popper-class="close-tag-dropdown"
      >
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOthers">{{
              $t("system.tag.closeothers")
            }}</el-dropdown-item>
            <el-dropdown-item command="clearAll">{{ $t("system.tag.closeall") }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import { ArrowDown} from '@element-plus/icons-vue'
export default {
  name: "tagsPageOpened",
  components: {
    // ArrowDown
  },
  data() {
    return {
      scrollLeft: 0,
    };
  },
  props: {
    beforePush: {
      type: Function,
      default: (item) => {
        console.debug(item);
        return true;
      },
    },
  },
  mounted() {
    this.initTagScroll();
  },
  watch: {
    $route() {
      this.initTagScroll();
    },
  },
  computed: {
    pageTagsList() {
      return this.$store.state.menu.tagList;
    },
    activeTag() {
      return this.$store.state.menu.activeTag;
    },
    textColor() {
      return this.$store.state.theme.textColor;
    },
  },
  methods: {
    initTagScroll(index) {
      return this.$nextTick().then(() => {
        if (index == undefined || index == null) {
          this.pageTagsList.forEach((item, i) => {
            if (item.name == this.activeTag) {
              index = i;
            }
          });
        }
        console.debug("tagIndex", index);
        if (index == undefined || index == null) {
          return Promise.resolve();
        }
        let tag = this.$refs.scrolltag[index];
        if (!tag) {
          return Promise.reject();
        }
        let el = tag.$el;
        console.debug("currentTag", index, tag, el.offsetWidth, el.offsetLeft);
        // console.debug(el.parentNode,el.parentNode.offsetWidth,this.$refs.scrollbar.$el.offsetWidth)
        // this.$refs.scrollbar.setScrollLeft(el.offsetLeft)
        let preTag = this.$refs.scrolltag[index - 1];
        if (preTag) {
          console.debug("preTag", preTag.$el.offsetWidth, preTag.$el.offsetLeft, this.scrollLeft);
          if (
            this.scrollLeft == 0 ||
            preTag.$el.offsetWidth + preTag.$el.offsetLeft < this.scrollLeft + 50
          ) {
            this.$refs.scrollbar.setScrollLeft(preTag.$el.offsetLeft);
            console.debug("preTag", true);
          }
        }
        let postTag = this.$refs.scrolltag[index + 1];
        if (postTag) {
          console.debug("postTag", postTag.$el.offsetLeft);
          if (postTag.$el.offsetLeft - this.scrollLeft > el.parentNode.offsetWidth - 50) {
            this.$refs.scrollbar.setScrollLeft(this.scrollLeft + postTag.$el.offsetWidth + 10);
            console.debug("postTag", true);
          }
        }
        this.$refs.scrollbar.update();
        return Promise.resolve();
      });
    },
    clickTag(item, index) {
      this.initTagScroll(index).then(() => {
        console.log("tag", item);
        this.linkTo(item);
      });
    },
    closeTag(item, index) {
      const tagList = this.pageTagsList.filter((a) => a.name != item.name);
      this.$store.commit("setTagList", tagList);
      this.$store.commit("removeCacheRoute", [item.name]);

      let newIndex = index >= this.pageTagsList.length ? this.pageTagsList.length - 1 : index;
      if (this.activeTag == item.name) {
        const currentTag = this.pageTagsList[newIndex];
        this.$store.commit("setActiveTag", currentTag.name);
        let tag = this.$refs.scrolltag[newIndex];
        let el = tag.$el;
        console.debug(newIndex, tag, el.offsetWidth, el.offsetLeft);
        // this.$refs.scrollbar.setScrollLeft(el.offsetLeft)
        this.clickTag(currentTag, newIndex);
      }
    },
    onScroll({ scrollLeft, scrollTop }) {
      this.scrollLeft = scrollLeft;
      console.debug(scrollLeft);
    },
    linkTo(item) {
      if (this.$route.name == item.name) {
        return;
      }
      let routerObj = {};
      routerObj.name = item.name;
      if (item.params) {
        routerObj.params = item.params;
      }
      if (item.query) {
        routerObj.query = item.query;
      }
      if (this.beforePush(item)) {
        console.debug(routerObj);
        this.$router.push(routerObj);
      }
    },
    handleTagsOption(type) {
      if (type == "clearAll") {
        const tagList = this.pageTagsList.filter((a) => a.name == "Home");
        this.$store.commit("setTagList", tagList);

        const removedTagList = this.pageTagsList.filter((a) => a.name != "Home");
        this.$store.commit(
          "removeCacheRoute",
          removedTagList.map((a) => a.name)
        );
        this.$router.push({
          name: "Home",
        });
      } else if (type == "clearOthers") {
        const tagList = this.pageTagsList.filter(
          (a) => a.name == "Home" || a.name == this.activeTag
        );
        this.$store.commit("setTagList", tagList);
        const removedTagList = this.pageTagsList.filter(
          (a) => !(a.name == "Home" || a.name == this.activeTag)
        );
        this.$store.commit(
          "removeCacheRoute",
          removedTagList.map((a) => a.name)
        );
      }
    },
    findRoute() {},
  },
};
</script>

<style lang="scss" scoped>
.tags-scroll-content {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  z-index: 0;
  overflow: hidden;
  background: #f0f2f5;
  padding-right: 40px;

  .tags-scroll-body {
    padding: 1px 10px 2px 5px;
    overflow: visible;
    white-space: nowrap;
    transition: left 0.3s ease;
    display: flex;

    .tags-scroll-item {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 26px;
      margin: 0 2px 0px 0;
      text-align: center;
      border-radius: 4px;
      background: var(--el-bg-color-primary-light-2);
      color: v-bind(textColor);
      border-color: v-bind(textColor);
      :deep(.el-tag__close) {
        color: v-bind(textColor);
      }
      &:hover {
        cursor: pointer;
      }
    }
    .tags-scroll-item.active {
      background: var(--el-color-primary);
      color: var(--el-color-white);
      border-color: var(--el-color-primary);
      :deep(.el-tag__close) {
        color: white;
      }
    }
  }
  .close-tag-content {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    border-left: 1px solid #e6e6e6;
    text-align: center;
    .el-dropdown-link {
      line-height: 34px;
    }
  }
}
.close-tag-dropdown {
  right: 5px !important;
  position: fixed;
  overflow: visible;
}
</style>
