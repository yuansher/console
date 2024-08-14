<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="layout-component-card-item-outbox">
      <div class="layout-component-card-item-box" v-if="propData.showNewItemCard" @click="itemClickHandle(null, 'newClickCustomFunction')">
        <div class="cc-item-img-shade"></div>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M426.666667 426.666667H85.546667A85.418667 85.418667 0 0 0 0 512c0 47.445333 38.314667 85.333333 85.546667 85.333333H426.666667v341.12c0 47.274667 38.186667 85.546667 85.333333 85.546667 47.445333 0 85.333333-38.314667 85.333333-85.546667V597.333333h341.12A85.418667 85.418667 0 0 0 1024 512c0-47.445333-38.314667-85.333333-85.546667-85.333333H597.333333V85.546667A85.418667 85.418667 0 0 0 512 0c-47.445333 0-85.333333 38.314667-85.333333 85.546667V426.666667z"
          ></path>
        </svg>
        <div class="cc-item-title-box">
          {{ propData.newCardTitle || "新建空白页面" }}
        </div>
      </div>
      <div class="layout-component-card-item-box" @click="itemClickHandle(item)" v-for="(item, index) in listData" :key="index">
        <img v-if="item.previewImgObject.length > 0" :style="getStyle('itemimg', item.previewImgObject[0])" :src="IDM.url.getWebPath(item.previewImgObject[0].ourl)" />
        <div class="cc-item-img-shade"></div>
        <div class="cc-item-img-buttons" :class="{ select: selectId == item.id }">
          <div class="cc-item-img-preview-button" v-if="propData.showPreviewButton" @click.stop="previewComponent(item)">点击预览</div>
          <div class="cc-item-img-use-button" :class="{ select: selectId == item.id }" v-if="propData.useClickSelect" @click.stop="itemClickHandle(item)">
            {{ selectId == item.id ? "已选用" : "点击选用" }}
          </div>
        </div>
        <div class="cc-item-img-count-box" @click.stop="showModal(item)">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10905">
            <path
              d="M833.4016 222.45546667H82.56746667c-26.30506667 0-47.70133333 21.5104-47.70133334 48.04906666v588.0608c0 26.47253333 21.39626667 48.0416 47.70133334 48.0416h750.8352c26.3328 0 47.6928-21.54666667 47.6928-48.0416V270.47466667c-0.05653333-26.5696-21.36-48.0192-47.69386667-48.0192z m-47.6768 96.02453333V751.34933333L676.6784 618.0576c-4.02346667-4.86506667-11.11786667-5.75573333-16.20906667-2.0288l-126.84586666 93.26506667-217.8016-213.3504c-2.5344-2.49493333-6.03306667-3.584-9.42293334-3.3632-3.54773333 0.31146667-6.67306667 2.1952-8.66773333 5.06133333L130.2528 738.92266667V318.48h655.472z m-286.02773333 180.032c0-43.03466667 34.752-78.0448 77.44426666-78.0448 42.7424 0 77.43573333 35.0112 77.43573334 78.0448 0 42.93333333-34.69333333 77.97653333-77.43573334 77.97653333-42.69226667 0-77.44426667-35.0432-77.44426666-77.97653333z m450.928 233.98186667c-19.74293333 0-35.7472-16.12693333-35.7472-35.96373334V188.42133333H171.97546667c-19.74293333 0-35.73333333-16.0736-35.73333334-35.9584 0-19.86986667 15.9904-35.9584 35.73333334-35.9584h778.6496c19.73013333 0 35.76426667 16.08853333 35.76426666 35.9584v544.11093334c-0.00106667 19.79306667-16.03413333 35.92-35.76426666 35.92z"
              p-id="10906"
            ></path>
          </svg>
          {{ item.previewImgObject.length }}
        </div>
        <div class="cc-item-grid-count-box">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3289">
            <path
              d="M448 563.2a12.8 12.8 0 0 1 12.5952 10.496l0.2048 2.304v358.4a12.8 12.8 0 0 1-10.496 12.5952L448 947.2h-358.4a12.8 12.8 0 0 1-12.5952-10.496L76.8 934.4v-358.4a12.8 12.8 0 0 1 10.496-12.5952L89.6 563.2h358.4z m486.4 0a12.8 12.8 0 0 1 12.5952 10.496l0.2048 2.304v358.4a12.8 12.8 0 0 1-10.496 12.5952L934.4 947.2h-358.4a12.8 12.8 0 0 1-12.5952-10.496L563.2 934.4v-358.4a12.8 12.8 0 0 1 10.496-12.5952L576 563.2h358.4zM358.4 665.6H179.2v179.2h179.2v-179.2z m486.4 0h-179.2v179.2h179.2v-179.2zM448 76.8a12.8 12.8 0 0 1 12.5952 10.496L460.8 89.6v358.4a12.8 12.8 0 0 1-10.496 12.5952L448 460.8h-358.4a12.8 12.8 0 0 1-12.5952-10.496L76.8 448v-358.4a12.8 12.8 0 0 1 10.496-12.5952L89.6 76.8h358.4z m486.4 0a12.8 12.8 0 0 1 12.5952 10.496L947.2 89.6v358.4a12.8 12.8 0 0 1-10.496 12.5952L934.4 460.8h-358.4a12.8 12.8 0 0 1-12.5952-10.496L563.2 448v-358.4a12.8 12.8 0 0 1 10.496-12.5952L576 76.8h358.4zM358.4 179.2H179.2v179.2h179.2V179.2z m486.4 0h-179.2v179.2h179.2V179.2z"
            ></path>
          </svg>
          {{ item.moduleContainerCount || 0 }}
        </div>
        <div class="cc-item-title-box">
          {{ item.title }}
        </div>
      </div>
      <div v-if="(!listData || (listData && listData.length == 0)) && !propData.showNewItemCard" style="text-align: center;width:100%">
        <a-empty :image-style="{ margin: '10px auto' }" :description="propData.emptyDescription || '暂无数据'" />
      </div>
    </div>
    <a-modal :title="'【' + CurrentModuleObject.title + '】效果图预览'" :visible="visible" cancelText="关闭" okText="" width="848px" :destroyOnClose="true" @cancel="handleCancel">
      <div class="cc-item-img-box">
        <template v-for="(item, index) in CurrentModuleObject.previewImgObject">
          <img :src="IDM.url.getWebPath(item.ourl)" :key="index" />
          <p :key="index">图{{ index + 1 }}：{{ item.name }}</p>
        </template>
      </div>
      <div slot="footer">
        <a-button @click="handleCancel">
          关闭
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "ILayoutComponentCardItem",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        showPreviewButton: true,
        useClickSelect: true,
      },
      listData: [],
      visible: false,
      //当前预览图片的组件对象
      CurrentModuleObject: {},
      selectId: "",
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    if (this.moduleObject.env != "production") {
      //开发模式下给例子数据
      this.listData = [
        {
          codePackageClassName: "forms",
          codePackageVersion: "1.0.0",
          moduleClassName: "IDemo",
          moduleClassId: "idm.componet.forms.idemo",
          moduleComName: "例子数据",
          moduleComLangue: "Vue",
          moduleComType: "vue",
          moduleGroupId: "jczj",
          moduleBelongId: "xmzj",
          moduleIconFont: "idmicon idm-icon-duohangshurukuang",
          previewImgJson: "[]",
          previewImgObject: [],
          rowState: 0,
          isEditName: false,
          isModify: 0,
          itemIndex: 3,
        },
        {
          codePackageClassName: "forms",
          codePackageVersion: "1.0.0",
          moduleClassName: "IDemo",
          moduleClassId: "idm.componet.forms.idemo",
          moduleComName: "例子数据",
          moduleComLangue: "Vue",
          moduleComType: "vue",
          moduleGroupId: "jczj",
          moduleBelongId: "xmzj",
          moduleIconFont: "idmicon idm-icon-duohangshurukuang",
          previewImgJson: "[]",
          previewImgObject: [],
          rowState: 0,
          isEditName: false,
          isModify: 0,
          itemIndex: 3,
        },
      ];
    }
    // console.log(this.moduleObject)
    this.initAttrToModule();
  },
  mounted() {},
  destroyed() {},
  methods: {
    showModal(item) {
      if (!item.previewImgObject || (item.previewImgObject && item.previewImgObject.length == 0)) {
        return;
      }
      this.CurrentModuleObject = item;
      this.visible = true;
    },
    handleCancel(e) {
      this.visible = false;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
      console.log("组件内属性发生变化，变化后====》", this.propData);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") +
          " " +
          (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto");
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
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .layout-component-card-item-box", styleObject);
    },
    initAttrToModule() {
      this.convertAttrToStyleObject();
    },
    formatSourceData(data) {
      var filedExp = this.propData.dataFiled;
      var dataObject = { IDM: window.IDM, ...data };
      var _defaultVal = window.IDM.express.replace.call(this, "@[" + filedExp + "]", dataObject);
      if (this.propData.showCurrentPage) {
        _defaultVal.forEach(item => {
          item.previewImgObject = JSON.parse(item.previewImgJson || "[]");
        });
        this.listData = _defaultVal;
      } else {
        _defaultVal.forEach(item => {
          item.previewImgObject = JSON.parse(item.previewImgJson || "[]");
          this.listData.push(item);
        });
      }
    },
    /**
     * 预览组件
     */
    previewComponent(itemData) {
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
      var clickFunction = this.propData.previewClickFunction;
      clickFunction &&
        clickFunction.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              urlData: urlObject,
              pageId,
              customParam: item.param,
              _this: this,
              itemData,
            });
        });
      // window.open(IDM.url.getWebPath("@"+item.codePackageClassName+"/"+item.codePackageVersion+"/index.html#/?className="+item.moduleClassName))
    },
    /**
     * 点击组件
     */
    itemClickHandle(itemData, propName) {
      let that = this;
      if (this.moduleObject.env == "develop") {
        //开发模式下不执行此事件
        return;
      }
      this.selectId = itemData.id;
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId = window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "";

      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickFunction = this.propData[propName || "itemClickCustomFunction"];
      clickFunction &&
        clickFunction.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              urlData: urlObject,
              pageId,
              customParam: item.param,
              _this: this,
              itemData,
            });
        });
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
      console.log("组件收到消息:" + this.moduleObject.packageid, object);
      if (object.type && object.type == "linkageDemand") {
        this.formatSourceData(object.message);
      }
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
    },
    getStyle(key, object) {
      let styles = {};
      switch (key) {
        case "itemimg":
          if (object) {
            let imgObject = object;
            if (this.propData.width && this.propData.height && this.propData.width != "auto" && this.propData.height != "auto") {
              if (parseInt(imgObject.width) / parseInt(imgObject.height) < parseInt(this.propData.width) / parseInt(this.propData.height)) {
                styles["width"] = "100%";
                styles["min-height"] = "100%";
                //公式：(图片高度/(图片宽度/容器宽度)-容器高度)/2
                styles["margin-top"] = "-" + (parseInt(imgObject.height) / (parseInt(imgObject.width) / parseInt(this.propData.width)) - parseInt(this.propData.height)) / 2 + "px";
              } else {
                styles["height"] = "100%";
                styles["min-width"] = "100%";
                //公式：(图片宽度/(图片高度/容器高度)-容器宽度)/2
                styles["margin-left"] = "-" + (parseInt(imgObject.width) / (parseInt(imgObject.height) / parseInt(this.propData.height)) - parseInt(this.propData.width)) / 2 + "px";
              }
            }
          }
          break;
        default:
          break;
      }
      return styles;
    },
  },
};
</script>
<style lang="scss">
.layout-component-card-item-outbox {
  display: flex;
  flex-wrap: wrap;
}
.layout-component-card-item-box {
  background-color: #ffffff;
  border-radius: 5px;
  width: 285px;
  height: 210px;
  transition: all linear 0.1s;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-color: #40a9ff;
  img {
    // max-width: 100%;
    // min-height: 100%;
  }
  > svg {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -40px;
    margin-top: -60px;
    fill: currentColor;
    width: 80px;
    max-height: 80px;
    color: #eee;
  }
  .cc-item-img-shade {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.41);
    opacity: 0;
    transition: all linear 0.3s;
  }
  .cc-item-title-box {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.25);
    color: white;
    z-index: 2;
    height: 40px;
    line-height: 40px;
    padding: 0px 12px;
    bottom: 0px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0.7;
    transition: all linear 0.1s;
    text-align: center;
  }
  .cc-item-img-count-box,
  .cc-item-grid-count-box {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.25);
    color: white;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    padding: 0px 12px;
    z-index: 2;
    cursor: pointer;
    svg {
      fill: currentColor;
      width: 16px;
      max-height: 16px;
      vertical-align: -3px;
    }
  }
  .cc-item-img-count-box {
    left: 10px;
    top: 10px;
  }
  .cc-item-img-buttons {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 90px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    &.select {
      opacity: 1;
    }
  }
  .cc-item-img-preview-button {
    width: 90px;
    height: 24px;
    line-height: 22px;
    border-radius: 11px;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: all linear 0.3s;
    opacity: 0;
    // &:hover{
    //   background: white;
    //   color: #333;
    // }
  }
  .cc-item-img-use-button {
    width: 90px;
    height: 24px;
    line-height: 22px;
    border-radius: 11px;
    margin-top: 30px;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid #40a9ff;
    cursor: pointer;
    transition: all linear 0.3s;
    background: #40a9ff;
    opacity: 0;
    // &:hover{
    //   background: white;
    //   color: #333;
    // }
    &.select {
      opacity: 1;
      margin-top: -12px;
    }
  }
  .cc-item-grid-count-box {
    right: 10px;
    top: 10px;
  }
  &:hover {
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
    border: 5px solid #40a9ff;
    .cc-item-title-box,
    .cc-item-img-buttons,
    .cc-item-img-shade {
      opacity: 1;
    }
    .cc-item-img-buttons {
      .cc-item-img-preview-button,
      .cc-item-img-use-button {
        opacity: 1;
      }
      .cc-item-img-use-button {
        margin-top: 30px !important;
      }
    }
    // .cc-item-img-shade{
    //   display: block;
    //   opacity: 0;
    // }
  }
}
</style>
