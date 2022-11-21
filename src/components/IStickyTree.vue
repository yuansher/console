<template>
  <div idm-ctrl="idm_module" :style="stickyObject" class="idm-sticky-tree" :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id">
    <a-input-search v-if="propData.isShowSearch" class="search-input" placeholder="输入关键字搜索" @change="onChange" />
    <a-tree :expanded-keys="expandedKeys" :show-line="propData.isShowLine" @select="handleTreeSelect"
      :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand">
      <template slot="title" slot-scope="{ title }">
        <span class="title-text" v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span class="match-title-text">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span class="title-text" v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
const gData = [
  {
    "title": "0-0",
    "key": "0-0",
    "scopedSlots": {
      "title": "title"
    },
    "children": [
      {
        "title": "0-0-0",
        "key": "0-0-0",
        "scopedSlots": {
          "title": "title"
        },
        "children": [
          {
            "title": "0-0-0-0",
            "key": "0-0-0-0",
            "scopedSlots": {
              "title": "title"
            }
          },
          {
            "title": "0-0-0-1",
            "key": "0-0-0-1",
            "scopedSlots": {
              "title": "title"
            }
          },
          {
            "title": "0-0-0-2",
            "key": "0-0-0-2",
            "scopedSlots": {
              "title": "title"
            }
          }
        ]
      },
      {
        "title": "0-0-1",
        "key": "0-0-1",
        "scopedSlots": {
          "title": "title"
        },
        "children": [
          {
            "title": "0-0-1-0",
            "key": "0-0-1-0",
            "scopedSlots": {
              "title": "title"
            }
          },
          {
            "title": "0-0-1-1",
            "key": "0-0-1-1",
            "scopedSlots": {
              "title": "title"
            }
          },
          {
            "title": "0-0-1-2",
            "key": "0-0-1-2",
            "scopedSlots": {
              "title": "title"
            }
          }
        ]
      },
      {
        "title": "0-0-2",
        "key": "0-0-2",
        "scopedSlots": {
          "title": "title"
        }
      }
    ]
  }
];

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  name: 'IStickyTree',
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [],
      stickyObject: {}
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
  },
  mounted() {
  },
  methods: {
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    handleTreeSelect(selectedKeys, e) {
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
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
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
      if (topDis >= this.propData.stickyTop) {
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
      const styleObject = {}, fontStyleObj = {}, matchFontStyleObj = {}, searchStyleObj = {};
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
          }
        }
      }
      // const parentId = this.moduleObject.id.substr(0, this.moduleObject.id.indexOf('_inner'))
      // window.IDM.setStyleToPageHead(parentId, { ...styleObject, position: 'sticky' });
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .search-input', searchStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .title-text', fontStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .title-text .match-title-text', matchFontStyleObj);
      this.initData();
    },
    reload() {
      //请求数据源
      this.initData();
    },
    initData() {
      // bind scroll
      window.addEventListener('scroll', this.getScroll, true);
      if (this.moduleObject.env === 'develop') {
        generateList(gData)
        this.gData = gData
        return
      }

      IDM.datasource.request(this.propData?.dataSource?.[0]?.id, {
        moduleObject: this.moduleObject,
        param: {}
      }, (res) => {
        if (res.code == 200) {
          generateList(res.data)
          this.gData = res.data
        } else {
          IDM.message.error(res.message)
        }
      })
    },
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object)
      if (object.type && object.type == "linkageShowModule") {
        this.showThisModuleHandle();
      } else if (object.type && object.type == "linkageHideModule") {
        this.hideThisModuleHandle();
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