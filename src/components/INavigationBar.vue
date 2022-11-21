<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" style="background-color: #ffffff;">
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="navigationbar-container">
      <div class="nc-logo">
        <img v-if="propData.leftLogo" :src="IDM.url.getWebPath(propData.leftLogo)" />
        <img v-else :src="IDM.url.getModuleAssetsWebPath(require('../assets/logo.png'), moduleObject)" />
        <span>{{ propData.leftTitle || "IDM页面控制台" }}<label>{{ propData.betaTitle }}</label></span>
      </div>
      <div class="nc-menu">
        <a-menu mode="horizontal" :selectedKeys="selectedKeys" @click="menuObjClick" @select="handleSelect">
          <template v-for="item in menuList">
            <i-sub-menu v-if="item.children && item.children.length > 0" :key="item.id" :menu-info="item" />
            <a-menu-item v-else :key="item.id">
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </div>
      <div class="nc-user">
        <a-dropdown>
          <a-button type="danger">
            {{ propData.newBtnTitle || '我要建' }}
          </a-button>
          <a-menu slot="overlay" @click="clickNewHandle">
            <a-menu-item v-for="(item, index) in propData.newMenuList" :key="index">
              <a href="javascript:;">{{ item.title }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-dropdown>
          <div class="user-info">
            <a-avatar icon="user"
              :src="userPhoto || IDM.url.getModuleAssetsWebPath(require('../assets/default_bg_userphoto.png'), moduleObject)" />
            {{ userName }}
          </div>
          <a-menu slot="overlay" @click="clickUserMenuHandle">
            <a-menu-item v-for="(item, index) in propData.userMenuList" :key="index">
              <a href="javascript:;">{{ item.title }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import ISubMenu from '../innerComponents/ISubMenu.vue'
const defaultSelectedKeys = ['1', '1-1'],  // 默认选中的菜单
  menuList = [
    {
      id: '1',            // 菜单id
      title: '首页',      // 菜单标题
      openType: '_self',  // 打开窗口方式
      children: [         //Array<MenuItem>
        {
          id: '1-1',
          title: '首页 -1',
          url: '/sdaf',
          openType: '_self'
        }
      ]
    },
    {
      id: '2',
      title: '组件工厂',
      openType: '_self'
    },
    {
      id: '3',
      title: '组件市场',
      openType: '_self'
    },
    {
      id: '4',
      title: '业务组件',
      openType: '_self'
    },
    {
      id: '5',
      title: '页面管理',
      openType: '_self'
    },
    {
      id: '6',
      title: '在线升级',
      openType: '_self'
    },
    {
      id: '7',
      title: '数据源',
      openType: '_blank'
    },
    {
      id: '8',
      title: '数据建模',
      openType: '_blank',
      url: ''
    },
    {
      id: '9',
      title: 'IDM学院',
      openType: '_blank'
    },
    {
      id: '10',
      title: '帮助文档',
      openType: '_blank',
      url: 'https://yunit-code.github.io/zh/'
    }
  ]
export default {
  name: 'INavigationBar',
  components: {
    ISubMenu
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      userName: "用户名",
      userPhoto: "",
      menuList: [],
      selectedKeys: [],
      clickItem: null
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
    if (this.moduleObject.env == "production") {
      this.userName = this.getUserInfoField("userInfoField", "userInfoFunction");
      this.userPhoto = this.getUserInfoField("userPhotoField", "userPhotoFunction");
    }
  },
  mounted() {
  },
  destroyed() { },
  methods: {
    handleFindMenuItem(menuList, key) {
      menuList.forEach(el => {
        if (el.id == key) {
          this.clickItem = el
          return
        }
        if (!el.children || el.children.length == 0) return
        this.handleFindMenuItem(el.children, key)
      })
    },
    /**
     * 用户信息获取
     */
    getUserInfoField(fieldName, fieldFun) {
      var dataObject = { IDM: window.IDM };
      dataObject["userInfo"] = IDM.user.getCurrentUserInfo();

      var _defaultVal = "";
      if (this.propData[fieldName]) {
        var filedExp = this.propData[fieldName];
        filedExp = "userInfo" + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        _defaultVal = window.IDM.express.replace.call(this, "@[" + filedExp + "]", dataObject);
      }

      var dataFunction = this.propData[fieldFun];
      dataFunction && dataFunction.forEach(item => {
        _defaultVal = window[item.name] && window[item.name].call(this, {
          customParam: item.param,
          ...dataObject
        });
      })
      return _defaultVal;
    },
    menuClick(item) {
      if (!item.url) {
        return;
      }
      switch (item.openType) {
        case "_blank":
          window.open(IDM.url.getWebPath(item.url));
          break;
        case "_self":
          window.location.href = IDM.url.getWebPath(item.url);
          //防止加载自身时候不进行跳转加载
          // setTimeout(() => {
          //   window.location.reload();
          // }, 100);
          break;
        default:
          window.location.href = IDM.url.getWebPath(item.url);
          //防止加载自身时候不进行跳转加载
          // setTimeout(() => {
          //   window.location.reload();
          // }, 100);
          break;
      }
    },
    handleSelect({ selectedKeys }) {
      this.selectedKeys = selectedKeys
    },
    menuObjClick(e) {
      if (this.moduleObject.env == "develop") {
        //开发模式下不执行此事件
        return;
      }
      this.clickItem = null
      this.handleFindMenuItem(this.menuList, e.key)
      this.menuClick(this.clickItem)
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
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
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "box":
              if (element.marginTopVal) {
                styleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移

              break;
            case "positionY":
              //背景纵向偏移

              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
              break;
            case "border":
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] = element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] = element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] = element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] = element.border.left.colors.hex8;
                }
              }

              styleObject["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              styleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = element.fontColors.hex8;
              }
              styleObject["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              styleObject["font-style"] = element.fontStyle;
              styleObject["font-size"] = element.fontSize + element.fontSizeUnit;
              styleObject["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              styleObject["text-align"] = element.fontTextAlign;
              styleObject["text-decoration"] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      this.initData()
    },
    reload() {
      //请求数据源
      this.initData();
    },
    initData() {
      //reset
      if (this.moduleObject.env === 'develop') {
        this.menuList = menuList
        this.selectedKeys = defaultSelectedKeys
        return
      }
      IDM.datasource.request(this.propData?.dataSource?.[0]?.id, {
        moduleObject: this.moduleObject,
        param: {}
      }, (res) => {
        if (res.code == 200) {
          this.menuList = res.data.menuList
          this.selectedKeys = res.data.defaultSelectedKeys
          console.log(this.selectedKeys)
        } else {
          IDM.message.error(res.message)
        }
      })
    },
    /**
     * 我要建菜单点击事件
     */
    clickNewHandle(e) {
      let that = this;
      if (this.moduleObject.env == "develop") {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId = window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "";
      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickNewFunction = this.propData.newMenuList;
      clickNewFunction.forEach((item, index) => {
        if (index == e.key) {
          if (item.clickFunction && item.clickFunction.length > 0) {
            item.clickFunction.forEach(fitem => {
              window[fitem.name] && window[fitem.name].call(this, {
                urlData: urlObject,
                pageId,
                customParam: fitem.param,
                _this: this
              });
            })
          }
        }
      })
    },
    /**
     * 用户菜单点击事件
     */
    clickUserMenuHandle(e) {
      let that = this;
      if (this.moduleObject.env == "develop") {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId = window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "";
      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickNewFunction = this.propData.userMenuList;
      clickNewFunction.forEach((item, index) => {
        if (index == e.key) {
          if (item.clickFunction && item.clickFunction.length > 0) {
            item.clickFunction.forEach(fitem => {
              window[fitem.name] && window[fitem.name].call(this, {
                urlData: urlObject,
                pageId,
                customParam: fitem.param,
                _this: this
              });
            })
          }
        }
      })
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object 
     */
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object)
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object 
     */
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    }
  }
}
</script>
<style lang="scss">
.navigationbar-container {
  display: flex;
  justify-content: space-between;
  height: 60px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 60px;

  .nc-logo {
    white-space: nowrap;
    width: 25%;
    padding: 0px 20px;

    img {
      width: 36px;
    }

    span {
      font-size: 18px;
      font-weight: bold;
      margin-left: 10px;
      position: relative;

      label {
        color: red;
        position: absolute;
        top: -30px;
        right: -30px;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .nc-menu {
    width: 50%;
    // display: flex;
    // justify-content:center;
    font-size: 16px !important;
    white-space: nowrap;
    text-align: center;

    .ant-menu-horizontal {
      border: none;
      line-height: 58px;
    }

    .ant-menu {
      font-size: 16px !important;
    }

    >div {
      padding: 0px 18px;
      position: relative;
      cursor: pointer;

      &:hover {
        color: #40A9FF;
      }
    }

    >div.active {
      color: #40A9FF;

      &::before {
        content: ' ';
        position: absolute;
        bottom: 0px;
        height: 2px;
        width: 100%;
        left: 0px;
        background-color: #40A9FF;
      }
    }
  }

  .nc-user {
    width: 25%;
    padding: 0px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .user-info {
      margin-left: 20px;
      font-size: 14px;
    }
  }
}
</style>