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
    <div class="common-card-item-outbox">
      <div
        class="common-card-item-box"
        @click="itemClickHandle(item)"
        v-for="(item, index) in listData || []"
        :key="index"
      >
        <template v-for="alertItem in propData.alertOptionList">
          <div
            class="common-card-item-tip"
            v-if="
              alertItem.alertText &&
                (alertItem.alertShowType == 'default' ||
                  (alertItem.alertShowType == 'field' &&
                    getExpressData('data', alertItem.alertDataFiled, item)) ||
                  (alertItem.alertShowType == 'custom' &&
                    getFieldCustomRender(alertItem, 'alertDataFunction', item)))
            "
            :key="alertItem.key"
          >
            <a-alert
              :message="alertItem.alertText"
              :show-icon="alertItem.showIcon"
              :closable="alertItem.showCloseButton"
              :type="alertItem.alertType"
            />
          </div>
        </template>
        <div v-if="propData.showImageBox" :style="getImageBgStyle(item)" class="cc-item-img-container">
          <!-- <img
            v-if="item[propData.imageObjectDataFiled] && item[propData.imageObjectDataFiled].length > 0"
            :style="getStyle('itemimg', item[propData.imageObjectDataFiled][0])"
            :src="IDM.url.getWebPath(item[propData.imageObjectDataFiled][0].ourl)"
          /> -->
          <div class="cc-item-img-shade"></div>
          <div
            class="cc-item-img-preview-button"
            v-if="propData.showPreviewButton"
            @click="previewComponent($event, item)"
          >
            点击预览
          </div>
          <div class="cc-item-img-count-box" @click="showModal($event, item)">
            <svg
              t="1634889265711"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="10905"
            >
              <path
                d="M833.4016 222.45546667H82.56746667c-26.30506667 0-47.70133333 21.5104-47.70133334 48.04906666v588.0608c0 26.47253333 21.39626667 48.0416 47.70133334 48.0416h750.8352c26.3328 0 47.6928-21.54666667 47.6928-48.0416V270.47466667c-0.05653333-26.5696-21.36-48.0192-47.69386667-48.0192z m-47.6768 96.02453333V751.34933333L676.6784 618.0576c-4.02346667-4.86506667-11.11786667-5.75573333-16.20906667-2.0288l-126.84586666 93.26506667-217.8016-213.3504c-2.5344-2.49493333-6.03306667-3.584-9.42293334-3.3632-3.54773333 0.31146667-6.67306667 2.1952-8.66773333 5.06133333L130.2528 738.92266667V318.48h655.472z m-286.02773333 180.032c0-43.03466667 34.752-78.0448 77.44426666-78.0448 42.7424 0 77.43573333 35.0112 77.43573334 78.0448 0 42.93333333-34.69333333 77.97653333-77.43573334 77.97653333-42.69226667 0-77.44426667-35.0432-77.44426666-77.97653333z m450.928 233.98186667c-19.74293333 0-35.7472-16.12693333-35.7472-35.96373334V188.42133333H171.97546667c-19.74293333 0-35.73333333-16.0736-35.73333334-35.9584 0-19.86986667 15.9904-35.9584 35.73333334-35.9584h778.6496c19.73013333 0 35.76426667 16.08853333 35.76426666 35.9584v544.11093334c-0.00106667 19.79306667-16.03413333 35.92-35.76426666 35.92z"
                p-id="10906"
              ></path>
            </svg>
            {{ item[propData.imageObjectDataFiled] ? item[propData.imageObjectDataFiled].length : '' }}
          </div>
        </div>
        <div class="cc-item-info-container">
          <div class="cc-item-info-title">
            {{
              propData.titleCustomShowFunction && propData.titleCustomShowFunction.length > 0
                ? ''
                : item[propData.titleDataFiled]
            }}
            <span
              v-if="propData.titleCustomShowFunction && propData.titleCustomShowFunction.length > 0"
              v-html="getFieldCustomRender(propData, 'titleCustomShowFunction', item)"
            ></span>
          </div>
          <div v-if="propData.showSubTitle" class="cc-item-info-subtitle">
            {{
              propData.subtitleCustomShowFunction && propData.subtitleCustomShowFunction.length > 0
                ? ''
                : item[propData.subtitleDataFiled]
            }}
            <span
              v-if="
                propData.subtitleCustomShowFunction &&
                  propData.subtitleCustomShowFunction.length > 0
              "
              v-html="getFieldCustomRender(propData, 'subtitleCustomShowFunction', item)"
            ></span>
          </div>
          <div class="cc-item-info-footer-box">
            <div>
              <template v-for="tagItem in propData.tagsOptionList">
                <a-tag
                  v-if="
                    tagItem.tagText &&
                      (tagItem.tagShowType == 'default' ||
                        (tagItem.tagShowType == 'field' &&
                          getExpressData('data', tagItem.tagDataFiled, item)) ||
                        (tagItem.tagShowType == 'custom' &&
                          getFieldCustomRender(tagItem, 'tagDataFunction', item)))
                  "
                  :key="tagItem.key"
                  :color="tagItem.colorType == 'custom' ? IDM.hex8ToRgbaString(tagItem.colorValue?(tagItem.colorValue.hex8||'#F1F1F1'):'#F1F1F1') : tagItem.colorType"
                >
                  {{
                    tagItem.tagTextFunction && tagItem.tagTextFunction.length > 0
                      ? getFieldCustomRender(tagItem, 'tagTextFunction', item)
                      : tagItem.tagText
                  }}
                </a-tag>
              </template>
            </div>
            <div v-if="propData.showActionMenu" class="cc-item-bottom-right-action">
              <!--按钮类型的-->
              <template v-for="btnItem in propData.buttonOptionList">
                <a-button
                  v-if="
                    btnItem.type == 'button' &&
                      (btnItem.iconSvg || btnItem.buttonText) &&
                      (btnItem.buttonShowType == 'default' ||
                        (btnItem.buttonShowType == 'field' &&
                          getExpressData('data', btnItem.buttonDataFiled, item)) ||
                        (btnItem.buttonShowType == 'custom' &&
                          getFieldCustomRender(btnItem, 'buttonDataFunction', item)))
                  "
                  :key="btnItem.key"
                  :type="btnItem.buttoType"
                  shape="round"
                  size="small"
                  @click="btnClickEventFunHandle({ key: btnItem.key }, item)"
                >
                  <svg
                    :style="getButtonSvgIconCustomFont(btnItem, 'iconSvgFont', true)"
                    class="idm-common-filed-svg-icon"
                    v-if="btnItem.iconSvg && btnItem.iconSvg.length > 0"
                    aria-hidden="true"
                  >
                    <use :xlink:href="`#${btnItem.iconSvg[0]}`"></use>
                  </svg>
                  {{ btnItem.buttonText }}
                </a-button>
              </template>
              <!--菜单类型的-->
              <a-dropdown
                v-show="isShowMoreIcon(item)"
                placement="bottomRight"
                :overlayClassName="moduleObject.id + '-ddbox'"
              >
                <svg-icon className="cc-item-svg-icon" iconClass="gengduo-shuxiang"></svg-icon>
                <a-menu slot="overlay" @click="btnClickEventFunHandle($event, item)">
                  <template v-for="btnItem in propData.buttonOptionList">
                    <a-menu-item
                      v-if="
                        btnItem.type == 'menu' &&
                          (btnItem.iconSvg || btnItem.buttonText) &&
                          (btnItem.buttonShowType == 'default' ||
                            (btnItem.buttonShowType == 'field' &&
                              getExpressData('data', btnItem.buttonDataFiled, item)) ||
                            (btnItem.buttonShowType == 'custom' &&
                              getFieldCustomRender(btnItem, 'buttonDataFunction', item)))
                      "
                      :key="btnItem.key"
                    >
                      <svg
                        :style="getButtonSvgIconCustomFont(btnItem, 'iconSvgFont', true)"
                        class="idm-common-filed-svg-icon"
                        v-if="btnItem.iconSvg && btnItem.iconSvg.length > 0"
                        aria-hidden="true"
                      >
                        <use :xlink:href="`#${btnItem.iconSvg[0]}`"></use>
                      </svg>
                      <span
                        v-if="btnItem.buttonText"
                        :style="getButtonSvgIconCustomFont(btnItem, 'buttonTextFont')"
                      >
                        {{ btnItem.buttonText }}
                      </span>
                    </a-menu-item>
                  </template>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
        <!--选择的样式-->
        <div
          v-if="propData.cardIsSelect"
          class="cc-item-layer-shadow"
          :class="{ 'item-checked': item[propData.checkDataFiled||'idmItemChecked'] }"
        ></div>
        <div
          v-if="propData.cardIsSelect"
          class="cc-item-check-icon"
          :class="{ 'item-checked': item[propData.checkDataFiled||'idmItemChecked'] }"
          @click="changeCheckStatusHandle(item, index)"
        >
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="63648"
          >
            <path
              d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 73.142857a438.857143 438.857143 0 1 0 0 877.714286A438.857143 438.857143 0 0 0 512 73.142857z m277.577143 219.428572l14.994286 35.108571C641.097143 480.109714 507.245714 694.857143 464.822857 804.571429L219.428571 551.058286l62.902858-51.2L424.228571 612.937143l16.822858-19.748572C505.124571 518.582857 626.907429 393.654857 789.504 292.571429z"
              p-id="63649"
            ></path>
          </svg>
        </div>
      </div>
      <div
        v-if="!listData || (listData && listData.length == 0)"
        style="text-align: center;width:100%"
      >
        <a-spin v-if="listData == undefined" />
        <a-empty
          v-else
          :image-style="{ margin: '10px auto' }"
          :description="propData.emptyDescription || '暂无数据'"
        />
      </div>
    </div>
    <a-modal
      :title="'【' + CurrentModuleObject[propData.titleDataFiled] + '】效果图预览'"
      :visible="visible"
      cancelText="关闭"
      okText=""
      width="848px"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="cc-item-img-box">
        <template v-for="(item, index) in CurrentModuleObject[propData.imageObjectDataFiled]">
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
  name: 'ICommonCardItem',
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        cardIsSelect: true,
        maxSelectedNum: 0,
        selectedOverTips: '当前已选中项过多！',
        showPreviewButton: true,
        showSubTitle: true,
        showImageBox: true,
        height: '300px',
        bgColor: {
          hex8: '#FFFFFF'
        },
        hoverBgColor: {
          hex8: '#FF0000'
        },
        showActionMenu: true,
        buttonOptionList: [
          {
            key: 'xiugai',
            iconSvg: ['icon-jiaoshoujia'],
            buttonText: '修改例子',
            iconSvgFont: {
              fontSize: 14,
              fontSizeUnit: 'px',
              fontColors: {
                hex8: 'red'
              }
            },
            buttonTextFont: {
              fontSize: 14,
              fontSizeUnit: 'px',
              fontLineHeight: 20,
              fontLineHeightUnit: 'px'
            },
            buttonShowType: 'default',
            buttonHandleType: 'send',
            buttonCustomFunction: []
          },
          {
            key: 'shanchu',
            iconSvg: ['icon-jiaoshoujia'],
            buttonText: '删除',
            iconSvgFont: {},
            buttonTextFont: {},
            buttonShowType: 'default',
            buttonHandleType: 'send',
            buttonCustomFunction: []
          }
        ],
        titleDataFiled: 'moduleComName',
        subtitleDataFiled: 'moduleRemark',
        imageObjectDataFiled: 'modulePreviewImgObject'
      },
      listData: undefined,
      visible: false,
      //当前预览图片的组件对象
      CurrentModuleObject: {},
      //当前已选择的数组，提供内容选择的存储
      CurrentCheckedArray: []
    };
  },
  props: {},
  computed: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    if (this.moduleObject.env != 'production') {
      //开发模式下给例子数据
      this.listData = [
        {
          codePackageClassName: 'forms',
          codePackageVersion: '1.0.0',
          moduleClassName: 'IDemo',
          moduleClassId: 'idm.componet.forms.idemo',
          moduleComName: '例子数据例子数据例子数据例子数据',
          moduleRemark: '的可是可视打开就是地方的分担分担分担分担时代大厦的',
          moduleComLangue: 'Vue',
          moduleComType: 'vue',
          moduleGroupId: 'jczj',
          moduleBelongId: 'xmzj',
          moduleIconFont: 'idmicon idm-icon-duohangshurukuang',
          modulePreviewImgJson: '[]',
          modulePreviewImgObject: [],
          rowState: 0,
          isEditName: false,
          isModify: 0,
          itemIndex: 3
        },
        {
          codePackageClassName: 'forms',
          codePackageVersion: '1.0.0',
          moduleClassName: 'IDemo',
          moduleClassId: 'idm.componet.forms.idemo',
          moduleComName: '例子数据',
          moduleComLangue: 'Vue',
          moduleComType: 'vue',
          moduleGroupId: 'jczj',
          moduleBelongId: 'xmzj',
          moduleIconFont: 'idmicon idm-icon-duohangshurukuang',
          modulePreviewImgJson: '[]',
          modulePreviewImgObject: [],
          rowState: 0,
          isEditName: false,
          isModify: 0,
          itemIndex: 3
        }
      ];
    }
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /**
     * 判断是否显示更多图标
     */
    isShowMoreIcon(item) {
      let count = 0;
      this.propData.buttonOptionList &&
        this.propData.buttonOptionList.forEach(btnItem => {
          if (
            btnItem.type == 'menu' &&
            (btnItem.iconSvg || btnItem.buttonText) &&
            (btnItem.buttonShowType == 'default' ||
              (btnItem.buttonShowType == 'field' &&
                this.getExpressData('data', btnItem.buttonDataFiled, item)) ||
              (btnItem.buttonShowType == 'custom' &&
                this.getFieldCustomRender(btnItem, 'buttonDataFunction', item)))
          ) {
            count = count + 1;
          }
        });
      return count !== 0;
    },
    /**
     * 获取自定义函数处理后的结果
     */
    getFieldCustomRender(configObject, funname, itemObject) {
      return (
        window[configObject[funname][0].name] &&
        window[configObject[funname][0].name].call(this, {
          customParam: configObject[funname][0].param,
          configObject,
          itemObject
        })
      );
    },
    /**
     * 根据结果集来执行表达式的结果
     * dataName：结果集名，建议直接data即可
     * dataFiled：表达式
     * resultData：要查下的结果集
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject);
      }
      return _defaultVal;
    },
    removeItem(itemData, index) {
      let that = this;
      if (!this.propData.removeConfirmFont) {
        that.removeItemLater(itemData, index);
        return;
      }
      this.$confirm({
        title: this.propData.removeConfirmFont,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.removeItemLater(itemData, index);
        },
        onCancel() {}
      });
    },
    /**
     * 按钮点击事件
     */
    btnClickEventFunHandle(event, item) {
      this.propData.buttonOptionList &&
        this.propData.buttonOptionList.forEach(btnItem => {
          if (btnItem.key == event.key) {
            switch (btnItem.buttonHandleType) {
              case 'delete':
                //删除
                this.removeItem(item);
                break;
              case 'custom':
                //自定义函数
                this.commonEventFunHandle(btnItem.buttonCustomFunction, {
                  configObject: btnItem,
                  itemObject: item
                });
                break;
            }
          }
        });
    },
    /**
     * 通用自定义函数
     * customFunctionList：忽略name直接传自定义函数集合
     * otherObject：其他参数对象
     */
    commonEventFunHandle(customFunctionList, otherObject) {
      let that = this;
      var customHandle = customFunctionList;
      customHandle &&
        customHandle.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              customParam: item.param,
              that: this,
              ...otherObject
            });
        });
    },
    itemClickHandle(itemData) {
      let that = this;
      if (this.moduleObject.env == 'develop') {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId =
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '';

      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickFunction = this.propData.cardClickFunction;
      clickFunction &&
        clickFunction.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              urlData: urlObject,
              pageId,
              customParam: item.param,
              _this: this,
              itemData
            });
        });
    },
    /**
     * 移除事件
     */
    removeItemLater(itemData, index) {
      let that = this;
      if (this.moduleObject.env == 'develop') {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId =
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '';
      //移除数据
      //自定义接口
      var removeInterfaceUrl = this.propData.removeInterfaceUrl;
      removeInterfaceUrl &&
        window.IDM.http
          .post(
            removeInterfaceUrl,
            {
              urlData: urlObject,
              pageId,
              itemData
            },
            {
              headers: this.propData.removeInterfaceContentType
                ? {
                    'Content-Type':
                      this.propData.removeInterfaceContentType || 'application/json;charset=UTF-8'
                  }
                : {}
            }
          )
          .then(res => {
            //调用后续自定义函数
            that.removeRunLaterHandle(res);
          })
          .catch(function(error) {});
    },
    /**
     * 移除按钮动作后的执行函数
     */
    removeRunLaterHandle(res) {
      let urlObject = window.IDM.url.queryObject(),
        pageId =
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '';
      if (this.propData.removeRunLaterFunction && this.propData.removeRunLaterFunction.length > 0) {
        var removeRunLaterFunction = this.propData.removeRunLaterFunction;
        removeRunLaterFunction.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              urlData: urlObject,
              pageId,
              customParam: item.param,
              _this: this,
              resData: res
            });
        });
      }
    },
    /**
     * 获取操作列按钮自定义图标的大小
     */
    getButtonSvgIconCustomFont(fobj, fontAttr, issvg) {
      let styleObject = {};
      const element = fobj[fontAttr];
      if (element) {
        styleObject['font-family'] = element.fontFamily;
        if (element.fontColors && element.fontColors.hex8) {
          styleObject['color'] = element.fontColors.hex8;
        }
        styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
        styleObject['font-style'] = element.fontStyle;
        styleObject['font-size'] = element.fontSize + element.fontSizeUnit;
        styleObject['line-height'] =
          element.fontLineHeight +
          (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
        styleObject['text-align'] = element.fontTextAlign;
        styleObject['text-decoration'] = element.fontDecoration;
        if (issvg) {
          styleObject['max-height'] = element.fontSize + element.fontSizeUnit;
          styleObject['width'] = element.fontSize + element.fontSizeUnit;
        }
      }
      return styleObject;
    },
    showModal(e, item) {
      e.stopPropagation();
      e.preventDefault();
      if (
        !item[this.propData.imageObjectDataFiled] ||
        (item[this.propData.imageObjectDataFiled] &&
          item[this.propData.imageObjectDataFiled].length == 0)
      ) {
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
      this.convertAttrToStyleObject();
      // console.log('组件内属性发生变化，变化后====》', this.propData);
    },
    /**
     * 图片背景样式
     * @param {*} item 
     */
    getImageBgStyle(item){
      let styleObject = {};
      if(item[this.propData.imageObjectDataFiled] && item[this.propData.imageObjectDataFiled].length > 0){
        styleObject["background-image"]=`url(${IDM.url.getWebPath(item[this.propData.imageObjectDataFiled][0].ourl)})`;
        
        if (this.propData.imgBgSize && this.propData.imgBgSize == 'custom') {
          styleObject['background-size'] =
            (this.propData.imgBgSizeWidth
              ? this.propData.imgBgSizeWidth.inputVal + this.propData.imgBgSizeWidth.selectVal
              : 'auto') +
            ' ' +
            (this.propData.imgBgSizeHeight
              ? this.propData.imgBgSizeHeight.inputVal + this.propData.imgBgSizeHeight.selectVal
              : 'auto');
        } else if (this.propData.imgBgSize) {
          styleObject['background-size'] = this.propData.imgBgSize;
        }
        if(this.propData.imgPosition=="custom"){
          if (this.propData.imgPositionX && this.propData.imgPositionX.inputVal) {
            styleObject['background-position-x'] =
              this.propData.imgPositionX.inputVal + this.propData.imgPositionX.selectVal;
          }
          if (this.propData.imgPositionY && this.propData.imgPositionY.inputVal) {
            styleObject['background-position-y'] =
              this.propData.imgPositionY.inputVal + this.propData.imgPositionY.selectVal;
          }
        }else{
          styleObject['background-position']=this.propData.imgPosition;
        }
        
        if (this.propData.imgBgColor && this.propData.imgBgColor.hex8) {
            styleObject['background-color'] = this.propData.imgBgColor.hex8;
        }
        
        //平铺模式
        if (this.propData.imgBgRepeat) {
            styleObject['background-repeat'] = this.propData.imgBgRepeat;
        }
              
      }
      return styleObject;
    },

    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'width':
              styleObject[key] = element;
              break;
            case 'height':
              window.IDM.setStyleToPageHead(this.moduleObject.id + ' .cc-item-img-container', {
                height: element
              });
              break;
            case 'subTitleHeight':
              window.IDM.setStyleToPageHead(this.moduleObject.id + ' .cc-item-info-subtitle', {
                height: element + 'px'
              });
              break;
            case 'bgColor':
              if (element && element.hex8) {
                styleObject['background-color'] = element.hex8;
                window.IDM.setStyleToPageHead(
                  '.' + this.moduleObject.id + '-ddbox .ant-dropdown-menu',
                  { 'background-color': element.hex8 }
                );
              }
              break;
            case 'hoverBgColor':
              if (element && element.hex8) {
                window.IDM.setStyleToPageHead(
                  '.' +
                    this.moduleObject.id +
                    '-ddbox .ant-dropdown-menu-item:hover,.' +
                    this.moduleObject.id +
                    '-ddbox .ant-dropdown-menu-submenu-title:hover',
                  { 'background-color': element.hex8 }
                );
              }
              break;
            case 'box':
              if (element.marginTopVal) {
                styleObject['margin-top'] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject['margin-right'] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject['margin-bottom'] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject['margin-left'] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject['padding-top'] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject['padding-right'] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject['padding-bottom'] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject['padding-left'] = `${element.paddingLeftVal}`;
              }
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'positionX':
              //背景横向偏移

              break;
            case 'positionY':
              //背景纵向偏移

              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'border':
              if (element.border.top.width > 0) {
                styleObject['border-top-width'] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject['border-top-style'] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject['border-top-color'] = element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject['border-right-width'] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject['border-right-style'] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject['border-right-color'] = element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject['border-bottom-width'] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject['border-bottom-style'] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject['border-bottom-color'] = element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject['border-left-width'] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject['border-left-style'] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject['border-left-color'] = element.border.left.colors.hex8;
                }
              }

              styleObject['border-top-left-radius'] =
                element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleObject['border-top-right-radius'] =
                element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleObject['border-bottom-left-radius'] =
                element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleObject['border-bottom-right-radius'] =
                element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;

              window.IDM.setStyleToPageHead(this.moduleObject.id + ' .cc-item-img-container', {
                'border-top-left-radius': styleObject['border-top-left-radius'],
                'border-top-right-radius': styleObject['border-top-right-radius']
              });
              window.IDM.setStyleToPageHead(this.moduleObject.id + ' .cc-item-layer-shadow', {
                'border-top-left-radius': styleObject['border-top-left-radius'],
                'border-top-right-radius': styleObject['border-top-right-radius'],
                'border-bottom-left-radius': styleObject['border-bottom-left-radius'],
                'border-bottom-right-radius': styleObject['border-bottom-right-radius']
              });
              break;
            case 'font':
              styleObject['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject['color'] = element.fontColors.hex8;
              }
              styleObject['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
              styleObject['font-style'] = element.fontStyle;
              styleObject['font-size'] = element.fontSize + element.fontSizeUnit;
              styleObject['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              styleObject['text-align'] = element.fontTextAlign;
              styleObject['text-decoration'] = element.fontDecoration;
              break;
            case 'subFont':
              var styleObject1 = {};
              styleObject1['font-family'] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject1['color'] = element.fontColors.hex8;
              }
              styleObject1['font-weight'] = element.fontWeight && element.fontWeight.split(' ')[0];
              styleObject1['font-style'] = element.fontStyle;
              styleObject1['font-size'] = element.fontSize + element.fontSizeUnit;
              styleObject1['line-height'] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == '-' ? '' : element.fontLineHeightUnit);
              styleObject1['text-align'] = element.fontTextAlign;
              styleObject1['text-decoration'] = element.fontDecoration;
              window.IDM.setStyleToPageHead(
                this.moduleObject.id + ' .common-card-item-box .cc-item-info-subtitle',
                styleObject1
              );
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-card-item-box', styleObject);
      this.initData();
    },
    
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam(){
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload(){
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData(){
      let that = this;
      //所有地址的url参数转换
      var params = that.commonParam();
      switch (this.propData.dataSourceType) {
        case "customInterface":
          this.propData.customInterfaceUrl&&window.IDM.http.get(this.propData.customInterfaceUrl,params)
          .then((res) => {
            var resValue = res.data;
            if(that.propData.customFunction&&that.propData.customFunction.length>0){
              var params = that.commonParam();
              try {
                resValue = window[that.propData.customFunction[0].name]&&window[that.propData.customFunction[0].name].call(that,{
                  ...params,
                  ...that.propData.customFunction[0].param,
                  moduleObject:that.moduleObject,
                  interfaceData:res.data
                });
              } catch (error) {
              }
            }
            //res.data
            that.formatSourceData(resValue);
          })
          .catch(function (error) {
            
          });
          break;
        case "pageCommonInterface":
          //使用通用接口直接跳过，在setContextValue执行
          break;
        case "customFunction":
          if(this.propData.customFunction&&this.propData.customFunction.length>0){
            var resValue = "";
            try {
              resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{...params,...this.propData.customFunction[0].param,moduleObject:this.moduleObject});
            } catch (error) {
            }
            that.formatSourceData(resValue);
          }
          break;
      }
    },
    formatSourceData(data) {
      if (this.listData == undefined) {
        this.listData = [];
      }

      var filedExp = this.propData.dataFiled;
      var dataObject = { IDM: window.IDM, ...data };
      var _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject);
      if (this.propData.showCurrentPage) {
        _defaultVal.forEach(item => {
          item.modulePreviewImgObject = JSON.parse(item.modulePreviewImgJson || '[]');
          item.isEditName = false;
          this.propData.rowCustomFunction?.length&&IDM.invokeCustomFunctions.apply(this, [
            this.propData.rowCustomFunction,
            {
              moduleObject: this.moduleObject,
              rowData:item
            },
          ]);
          if(!this.propData.cardInitSelected){
            item[this.propData.checkDataFiled||'idmItemChecked'] = _.findIndex(this.CurrentCheckedArray, item) > -1;
          }else if(item[this.propData.checkDataFiled||'idmItemChecked']){
            this.CurrentCheckedArray.push(_.cloneDeep(item))
          }
          
        });
        this.listData = _defaultVal;
      } else {
        _defaultVal.forEach(item => {
          item.modulePreviewImgObject = JSON.parse(item.modulePreviewImgJson || '[]');
          item.isEditName = false;
          this.propData.rowCustomFunction?.length&&IDM.invokeCustomFunctions.apply(this, [
            this.propData.rowCustomFunction,
            {
              moduleObject: this.moduleObject,
              rowData:item
            },
          ]);
          if(!this.propData.cardInitSelected){
            item[this.propData.checkDataFiled||'idmItemChecked'] = _.findIndex(this.CurrentCheckedArray, item) > -1;
          }else if(item[this.propData.checkDataFiled||'idmItemChecked']){
            this.CurrentCheckedArray.push(_.cloneDeep(item))
          }
          this.listData.push(item);
        });
      }
      this.sendItemCheckMsg();
    },
    /**
     * 预览组件
     */
    previewComponent(e, itemData) {
      e.stopPropagation();
      e.preventDefault();
      let that = this;
      if (this.moduleObject.env == 'develop') {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId =
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '';

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
              itemData
            });
        });
      // window.open(IDM.url.getWebPath("@"+item.codePackageClassName+"/"+item.codePackageVersion+"/index.html#/?className="+item.moduleClassName))
    },
    clickButtonHandle(itemData, buttonItem) {
      let that = this;
      if (this.moduleObject.env == 'develop') {
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
        pageId =
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '';
      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickFunction = buttonItem.buttonClickFunction;
      clickFunction &&
        clickFunction.forEach(item => {
          window[item.name] &&
            window[item.name].call(this, {
              urlData: urlObject,
              pageId,
              customParam: item.param,
              _this: this,
              itemData
            });
        });
    },
    /**
     * 选中改变事件
     */
    changeCheckStatusHandle(item, index) {
      const seletedNum = this.CurrentCheckedArray && this.CurrentCheckedArray.length;
      if (
        !item[this.propData.checkDataFiled||'idmItemChecked'] &&
        seletedNum &&
        this.propData.maxSelectedNum > 0 &&
        seletedNum >= this.propData.maxSelectedNum&&this.propData.maxSelectedTip
      ) {
        IDM.message['warning'](this.propData.selectedOverTips);
        return;
      }
      //不提示，直接移除第一个
      if(!item[this.propData.checkDataFiled||'idmItemChecked'] &&
        seletedNum &&
        this.propData.maxSelectedNum > 0 &&
        seletedNum >= this.propData.maxSelectedNum&&!this.propData.maxSelectedTip){
        const firstKey = this.CurrentCheckedArray[0][this.propData.keyDataFiled];
        this.listData.forEach(sitem => {
          if(sitem[this.propData.keyDataFiled]==firstKey){
            sitem[this.propData.checkDataFiled||'idmItemChecked'] = false;
          }
        });
        this.CurrentCheckedArray.splice(0, 1);
      }

      item[this.propData.checkDataFiled||'idmItemChecked'] = !item[this.propData.checkDataFiled||'idmItemChecked'];
      if (item[this.propData.checkDataFiled||'idmItemChecked']) {
        this.CurrentCheckedArray.push(_.cloneDeep(item));
      } else {
        //移除
        this.CurrentCheckedArray.forEach(sitem => (sitem[this.propData.checkDataFiled||'idmItemChecked'] = false));
        let itemIndex = _.findIndex(this.CurrentCheckedArray, item);
        if (itemIndex > -1) {
          this.CurrentCheckedArray.splice(itemIndex, 1);
        }
      }
      this.propData.cardCheckedCustomFunction?.length&&IDM.invokeCustomFunctions.apply(this, [
        this.propData.cardCheckedCustomFunction,
        {
          moduleObject: this.moduleObject,
          item,
          CurrentCheckedArray:this.CurrentCheckedArray
        },
      ]);
      this.$forceUpdate();
      this.sendItemCheckMsg();
    },
    /**
     * 发送已选变更消息
     */
    sendItemCheckMsg() {
      if (
        this.propData.linkageDemandPageModule &&
        this.propData.linkageDemandPageModule.length > 0
      ) {
        var moduleIdArray = [];
        this.propData.linkageDemandPageModule.forEach(item => {
          moduleIdArray.push(item.moduleId);
        });
        this.sendBroadcastMessage({
          type: 'linkageDemand',
          message: this.CurrentCheckedArray,
          rangeModule: moduleIdArray,
          triggerType: 'MT'
        });
      }
    },
    /**
     * 选中改变事件
     */
    changeAllCheckStatusHandle() {
      let changeCount = 0;
      this.listData.forEach(sitem => {
        if (!sitem[this.propData.checkDataFiled||'idmItemChecked']) {
          sitem[this.propData.checkDataFiled||'idmItemChecked'] = true;
          this.CurrentCheckedArray.push(_.cloneDeep(sitem));
          changeCount++;
        }
      });
      if (changeCount > 0) {
        this.$forceUpdate();
        this.sendItemCheckMsg();
      }
    },
    /**
     * 结果值
     */
    valueBind(byValData) {
      let that = this;
      if (this.echoValue != null) {
        this.echoValue = null;
        return;
      }
      switch (this.propData.resType) {
        case 'none':
          if (byValData && byValData.type) {
            if (byValData.type == 'remove' && byValData.itemObject) {
              //单个移除
              byValData.itemObject[this.propData.checkDataFiled||'idmItemChecked'] = false;
              this.CurrentCheckedArray.forEach(sitem => (sitem[this.propData.checkDataFiled||'idmItemChecked'] = false));
              let itemIndex = _.findIndex(this.CurrentCheckedArray, byValData.itemObject);
              if (itemIndex > -1) {
                this.CurrentCheckedArray.splice(itemIndex, 1);
              }
              //取消选中效果
              byValData.itemObject[this.propData.checkDataFiled||'idmItemChecked'] = true;
              itemIndex = _.findIndex(this.listData, byValData.itemObject);
              if (itemIndex > -1) {
                this.listData[itemIndex][this.propData.checkDataFiled||'idmItemChecked'] = false;
              }
            } else if (byValData.type == 'removeAll') {
              //移除全部
              this.CurrentCheckedArray = [];
              this.listData.forEach(sitem => (sitem[this.propData.checkDataFiled||'idmItemChecked'] = false));
            }
            this.$forceUpdate();
            this.sendItemCheckMsg();
          }
          break;
        case 'customFun':
          if (this.propData.resFunction && this.propData.resFunction.length > 0) {
            try {
              window[this.propData.resFunction[0].name] &&
                window[this.propData.resFunction[0].name].call(this, {
                  ...this.propData.resFunction[0].param,
                  moduleObject: this.moduleObject,
                  byVal: byValData,
                  _this: this
                });
            } catch (error) {}
          }
          break;
      }
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object){
      if(object.type!="pageCommonInterface"){
        return;
      }
      object.key == this.propData.dataName&&this.formatSourceData(object.data);
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
      // console.log('组件收到消息:' + this.moduleObject.packageid, object);
      if (object.type && object.type == 'linkageDemand') {
        (this.propData.dataSourceType=="receiveMessage"||!this.propData.dataSourceType)&&this.formatSourceData(object.message);
      } else if (object.type && object.type == 'linkageResult') {
        //结果值设置
        this.valueBind(object.message);
      } else if (object.type && object.type == 'linkageClick') {
        if (object.messageKey && object.messageKey == 'selectAll') {
          //全选
          this.changeAllCheckStatusHandle();
        }
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
        case 'itemimg':
          if (object) {
            //285*300   实际 200*200  
            let imgObject = object;
            if (
              this.propData.width &&
              this.propData.height &&
              this.propData.width != 'auto' &&
              this.propData.height != 'auto'
            ) {
              if (
                parseInt(imgObject.width) / parseInt(imgObject.height) <
                parseInt(this.propData.width) / parseInt(this.propData.height)
              ) {
                styles['width'] = '100%';
                styles['min-height'] = '100%';
                //公式：(图片高度/(图片宽度/容器宽度)-容器高度)/2
                styles['margin-top'] =
                  '-' +
                  (parseInt(imgObject.height) /
                    (parseInt(imgObject.width) / parseInt(this.propData.width)) -
                    parseInt(this.propData.height)) /
                    2 +
                  'px';
              } else {
                styles['height'] = '100%';
                styles['min-width'] = '100%';
                //公式：(图片宽度/(图片高度/容器高度)-容器宽度)/2
                styles['margin-left'] =
                  '-' +
                  (parseInt(imgObject.width) /
                    (parseInt(imgObject.height) / parseInt(this.propData.height)) -
                    parseInt(this.propData.width)) /
                    2 +
                  'px';
              }
            }
          }
          break;
        default:
          break;
      }
      return styles;
    }
  }
};
</script>
<style lang="scss">
.common-card-item-outbox {
  display: flex;
  flex-wrap: wrap;
}
.common-card-item-box {
  background-color: #ffffff;
  border-radius: 5px;
  width: 285px;
  transition: all linear 0.3s;
  position: relative;
  .cc-item-img-container {
    position: relative;
    height: 210px;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
    img {
      // max-width: 100%;
      // min-height: 100%;
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
    .cc-item-img-count-box {
      position: absolute;
      right: 10px;
      bottom: 10px;
      background-color: rgba(0, 0, 0, 0.45);
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
    .cc-item-img-preview-button {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 90px;
      height: 24px;
      line-height: 22px;
      border-radius: 11px;
      text-align: center;
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.85);
      z-index: 2;
      margin-left: -45px;
      margin-top: -12px;
      cursor: pointer;
      transition: all linear 0.3s;
      opacity: 0;
      transition: all linear 0.3s;
      // &:hover{
      //   background: white;
      //   color: #333;
      // }
    }
    .cc-item-img-source-name,
    .cc-item-img-delete-btn {
      position: absolute;
      top: 0px;
      color: white;
      font-size: 12px;
      padding: 3px 10px;
      z-index: 2;
      cursor: pointer;
      transition: all linear 0.3s;
    }
    .cc-item-img-source-name {
      left: 0px;
      background-color: rgba(64, 169, 255, 0.7);
      &:hover {
        background-color: rgba(64, 169, 255, 0.9);
      }
      border-bottom-right-radius: 5px;
    }
    .cc-item-img-delete-btn {
      display: none;
      right: 0px;
      background-color: rgba(102, 102, 102, 0.4);
      &:hover {
        background-color: rgba(102, 102, 102, 0.6);
      }
      border-bottom-left-radius: 5px;
    }
  }
  .cc-item-info-container {
    // height: 120px;
    padding: 10px 16px;
    .cc-item-info-title {
      line-height: 33px;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      position: relative;
      font-weight: bold;
    }
    .cc-item-info-subtitle {
      font-size: 14px;
      color: #666;
      height: 42px;
      overflow: hidden;
      // padding:5px 0px;
    }
    .cc-item-info-classid {
      display: flex;
      justify-content: space-between;
      line-height: 33px;
      .cc-item-info-classid-font {
        color: #999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        span {
          color: #40a9ff;
        }
      }
      .ant-btn-round.ant-btn-sm {
        height: 22px;
        padding: 0 10px;
        font-size: 12px;
        line-height: 21px;
        border-radius: 22px;
      }
    }
  }
  .cc-item-info-button {
    display: none;
    button {
      margin-left: 6px;
    }
  }
  //遮罩层
  .cc-item-layer-shadow {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    display: none;
    &.item-checked {
      display: block;
    }
  }
  //选择图标
  .cc-item-check-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
    opacity: 0.25;
    cursor: pointer;
    &.item-checked {
      opacity: 1;
    }
    svg {
      color: #FFFFFF;
      fill: currentColor;
      width: 30px;
      max-height: 30px;
      vertical-align: -3px;
    }
  }
  .cc-item-info-footer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30px;
    .ant-tag {
      margin-bottom: 5px;
    }
  }
  .cc-item-bottom-right-action {
    display: none;
    // position: absolute;
    // right: 10px;
    // bottom: 5px;
    > * {
      margin-left: 5px;
      margin-bottom: 5px;
    }
  }
  &:hover {
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
    .cc-item-info-button,
    .cc-item-img-shade,
    .cc-item-img-preview-button,
    .cc-item-img-delete-btn {
      display: block;
      opacity: 1;
    }
    .cc-item-bottom-right-action {
      display: flex;
      align-items: center;
    }
  }
  //遮罩层
  .cc-item-layer-shadow {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    display: none;
    &.item-checked {
      display: block;
    }
  }
  .common-card-item-tip {
    position: absolute;
    left: 20px;
    top: 20px;
    right: 20px;
    z-index: 2;
  }
  .cc-item-svg-icon {
    outline: none;
  }
}
.cc-item-img-box {
  width: 800px;
  height: 500px;
  overflow: auto;
  text-align: center;
  img {
    max-width: 100%;
    margin-bottom: 5px;
  }
  p {
    margin-bottom: 10px;
  }
}
.idm-common-filed-svg-icon {
  font-size: 14px;
  max-height: 14px;
  width: 14px;
  fill: currentColor;
  vertical-align: -0.15em;
  // margin-right: 3px;
  outline: none;
}
</style>
