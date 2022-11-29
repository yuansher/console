<template>
  <div idm-ctrl="idm_module" :style="stickyObject" class="idm-sticky-tree" :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id">
    <div class="search-input-container">
      <a-input v-if="propData.isShowSearch" placeholder="输入关键字搜索" @change="onChange">
      </a-input>
      <a-icon type="redo" class="refresh-icon" @click.native="initData" :class="[isLoading ? 'refresh-animate' : '']" />
    </div>
    <a-tree :expanded-keys="expandedKeys" :selectedKeys.sync="selectedKeys" class="tree-container scrollbar_style"
      :replace-fields="replaceFieldsObj" :show-line="propData.isShowLine" @select="handleTreeSelect"
      :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand">
      <template slot="title" slot-scope="scope">
        <span class="title-text"
          v-if="scope[replaceFieldsObj.title] && scope[replaceFieldsObj.title].indexOf(searchValue) > -1">
          {{ scope[replaceFieldsObj.title].substr(0, scope[replaceFieldsObj.title].indexOf(searchValue)) }}
          <span class="match-title-text">{{ searchValue }}</span>
          {{ scope[replaceFieldsObj.title].substr(scope[replaceFieldsObj.title].indexOf(searchValue) +
              searchValue.length)
          }}
        </span>
        <span class="title-text" v-else>{{ scope[replaceFieldsObj.title] }}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
const gData = [
  {
    "title": "0-0",
    "key": "0-0",
    "children": [
      {
        "title": "0-0-0",
        "key": "0-0-0",
        "children": [
          {
            "title": "0-0-0-0",
            "key": "0-0-0-0"
          },
          {
            "title": "0-0-0-1",
            "key": "0-0-0-1"
          },
          {
            "title": "0-0-0-2",
            "key": "0-0-0-2"
          }
        ]
      },
      {
        "title": "0-0-1",
        "key": "0-0-1",
        "children": [
          {
            "title": "0-0-1-0",
            "key": "0-0-1-0"
          },
          {
            "title": "0-0-1-1",
            "key": "0-0-1-1"
          },
          {
            "title": "0-0-1-2",
            "key": "0-0-1-2"
          }
        ]
      },
      {
        "title": "0-0-2",
        "key": "0-0-2"
      }
    ]
  }
];

const dataList = [];

export default {
  name: 'IStickyTree',
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [],
      isLoading: false,
      stickyObject: {}
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
  },
  mounted() {
    window.addEventListener('scroll', this.getScroll, true);
  },
  computed: {
    replaceFieldsObj() {
      let obj = null
      try {
        obj = JSON.parse(this.propData.replaceFieldsStr)
      } catch { }
      return Object.assign({ title: 'title', key: 'key', children: 'children' }, obj)
    }
  },
  methods: {
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node[this.replaceFieldsObj.key];
        const title = node[this.replaceFieldsObj.title];
        data[i].scopedSlots = {
          title: this.replaceFieldsObj.title
        }
        dataList.push({ [this.replaceFieldsObj.key]: key, [this.replaceFieldsObj.title]: title });
        if (node[this.replaceFieldsObj.children]) {
          this.generateList(node[this.replaceFieldsObj.children]);
        }
      }
    },

    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node[this.replaceFieldsObj.children]) {
          if (node[this.replaceFieldsObj.children].some(item => item[this.replaceFieldsObj.key] === key)) {
            parentKey = node[this.replaceFieldsObj.key];
          } else if (this.getParentKey(key, node[this.replaceFieldsObj.children])) {
            parentKey = this.getParentKey(key, node[this.replaceFieldsObj.children]);
          }
        }
      }
      return parentKey;
    },
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    handleTreeSelect(selectedKeys, e) {
      console.log(selectedKeys, this.selectedKeys)
      if (this.propData?.customClickFunction?.length > 0) {
        const funcName = this.propData.customClickFunction[0].name
        window?.[funcName].call(this, selectKeys)
        return
      }
      if (!this.propData?.triggerComponents?.length > 0) {
        return IDM.message.warning('请配置菜单的联动组件')
      }
      this.sendBroadcastMessage({
        type: 'stickyTreeKeysChange',
        rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
        message: selectedKeys
      })
      //传递联动需求值，因为很多地方都是指定这个消息类型的消息作为接收组件本身所需要的需求值
      this.sendBroadcastMessage({
        type: "linkageDemand",
        message: selectedKeys,
        rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
        messageKey: this.propData.formFiledKey || this.propData.ctrlId,
      });
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item[this.replaceFieldsObj.title]?.indexOf(value) > -1) {
            return this.getParentKey(item[this.replaceFieldsObj.key], gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    getScroll(e) {
      //手机端只能通过e.target.scrollTop获取组件的滑动距离
      let topDis = window.pageYOffset || document.documentElement.scrollTop ||
        document.body.scrollTop || e.target.scrollTop;
      //此处660为测试组件滑动到顶部的距离；
      if (topDis >= this.propData.fixedValue && this.propData.isOpenSticky && this.moduleObject.env !== 'develop') {
        this.stickyObject = {
          position: 'fixed',
          top: this.propData.stickyTop + 'px',
          zIndex: this.propData.zIndex
        }
      } else {
        this.stickyObject = {
          position: 'relative'
        }
      }
    },
    convertAttrToStyleObject() {
      const styleObject = {}, fontStyleObj = {}, matchFontStyleObj = {}, searchStyleObj = {}, treeObj = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            // case 'stickyTop':
            //   styleObject['top'] = element + 'px';
            //   break
            // case 'zIndex':
            //   styleObject['z-index'] = element;
            //   break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element)
              break
            case 'border':
              IDM.style.setBorderStyle(styleObject, element)
              break
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case 'font':
              IDM.style.setFontStyle(fontStyleObj, element)
              break
            case 'matchFont':
              IDM.style.setFontStyle(matchFontStyleObj, element)
              break
            case 'searchWidth':
              searchStyleObj['width'] = element
              break
            case 'treeMaxHeight':
              treeObj['max-height'] = element

              break
          }
        }
      }
      // const parentId = this.moduleObject.id.substr(0, this.moduleObject.id.indexOf('_inner'))
      // window.IDM.setStyleToPageHead(parentId, { ...styleObject, position: 'sticky' });
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search-input-container', searchStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .title-text', fontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .title-text .match-title-text', matchFontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .tree-container', treeObj);
      this.initData(true);
    },
    reload() {
      //请求数据源
      this.initData(true);
    },
    handleExpendNumber(data, arr, number) {
      if (!number || number == 0) return
      number--
      data.forEach(el => {
        arr.push(el[this.replaceFieldsObj.key])
        if (el[this.replaceFieldsObj.children]) {
          this.handleExpendNumber(el[this.replaceFieldsObj.children], arr, number)
        }
      })
    },
    initData(isFirst = false) {
      this.isLoading = true
      if (this.moduleObject.env === 'develop') {
        this.generateList(gData)
        this.gData = gData
        let arr = []
        this.handleExpendNumber(gData, arr, this.propData.defaultExpendNumber)
        this.expandedKeys = arr
        setTimeout(() => {
          this.isLoading = false
        }, 600)
        return
      }
      // 保留选中和展开
      let expandedKeys = _.cloneDeep(this.expandedKeys), selectedKeys = _.cloneDeep(this.selectedKeys);
      IDM.datasource.request(this.propData?.dataSource?.[0]?.id, {
        moduleObject: this.moduleObject,
        param: {}
      }, (resData) => {
        this.generateList(resData.treeData)
        this.gData = resData.treeData
        console.log(resData)
        if (isFirst) {
          this.selectedKeys = resData.selectedKeys
          if (resData?.expandedKeys?.length > 0) {
            this.expandedKeys = resData.expandedKeys
          } else {
            // 组件配置展开几层
            let arr = []
            this.handleExpendNumber(resData.treeData, arr, this.propData.defaultExpendNumber)
            this.expandedKeys = arr
          }
        } else {
          this.expandedKeys = expandedKeys
          this.selectedKeys = selectedKeys

        }
        // if (res.code == 200) {
        //   this.generateList(res.data)
        //   this.gData = res.data
        //   console.log(res.data)
        // } else {
        //   IDM.message.error(res.message)
        // }
      }, () => { }, () => {

        this.isLoading = false
      })
    },
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object)
      switch (object.type) {
        case 'refreshTreeData': // 消息刷新数据
          this.initData()
          break
      }
    },
    setContextValue(object) {
      console.log("统一接口设置的值", object);
    },
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-container {
  overflow-y: auto;
}

@keyframes rotateAnimate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.search-input-container {
  display: flex;
  align-items: center;

  .refresh-icon {
    font-size: 18px;
    margin: 0 10px;
    cursor: pointer;
  }

  .refresh-animate {
    animation: rotateAnimate .6s infinite linear;
  }
}


.scrollbar_style {
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    min-height: 28px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .2);
  }

  &::-webkit-scrollbar-track-piece,
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
}
</style>