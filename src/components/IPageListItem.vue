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
    <div class="page-list-outbox">
      <div class="item" v-for="(item,index) in listData||[]" :key="index">
        <div class="item-top">
          <div class="item-top-img">
            <img :src="item.__url" class="item-top-img-img"/>
            <div class="item-top-img-layer" @click="preview(item)">
              <div class="item-top-img-layer-btn">点击预览</div>
            </div>
          </div>
          <div class="item-top-right">
            <div v-if="propData.titleShow" class="item-top-right-title" :class="hiddenClass[propData.titleType]"
                 :title="item.__titleTitle">{{item.__title}}
            </div>
            <div v-if="propData.contentShow" class="item-top-right-content" :class="hiddenClass[propData.contentType]"
                 :title="item.__contentTitle">{{item.__content}}
            </div>
            <div class="item-top-right-type">
              <span class="item-top-right-name">类名：</span>
              <span class="item-top-right-type-id">{{item.__componentId}}</span>
            </div>
          </div>
        </div>
        <div class="item-bottom">
          <a-checkbox class="item-bottom-item" :checked="item.__checked" @change="onChange(item, index)">全部版本
          </a-checkbox>
          <a-checkbox class="item-bottom-item" :checked="version.__checked" @change="onChange(version, index)"
                      v-for="version in item.__versionList" :key="version.id">{{version.__version}}
          </a-checkbox>
        </div>
      </div>
      <div v-if="!listData||(listData&&listData.length==0)" style="text-align: center;width:100%">
        <a-spin v-if="listData==undefined"/>
        <a-empty v-else :image-style="{margin: '10px auto'}" :description="propData.emptyDescription||'暂无数据'"/>
      </div>
    </div>

  </div>
</template>

<script>
  const SAMPLE_DATA = []
  // 测试数据
  for (let i = 0; i < 6; i++) {
    let versionList = []
    for (let j = 100; j < 115; j++) {
      let vData = {
        versionText: j.toString().split('').join('.'),
        version: j.toString().split('').join('.'),
        id: j
      }
      versionList.push(vData)
    }
    let data = {
      id: i + 1,
      pageRemark: `IDM控制台的页面管理页面，主要用于所有页面配置的管理，是一个列表页面IDM控制台的页面管理页面，主要用于所有页面配置的管理${i + 1}`,
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      title: 'IDM页面控制台-页面管理列表',
      moduleClassName: `idm_console_homepage_${i}`,
      versionList
    }
    SAMPLE_DATA.push(data)
  }
  export default {
    name: 'IPageListItem',
    data() {
      return {
        hiddenClass: {
          overflowHidden: 'overflowHidden', // 单行溢出隐藏
          showContent: 'showContent', // 内容正常排列展示
          hiddenNum: 'hiddenNum' // 根据字数隐藏
        }, // content部分样式 这里重新排列是为了前端能看到所有样式集合

        moduleObject: {},
        propData: this.$root.propData.compositeAttr || {
          titleShow: true,
          contentShow: true,
          imgParam: 'url',
          titleParam: 'title',
          contentParam: 'pageRemark',
          versionParam: 'versionText',
          componentParam: 'moduleClassName',
          versionListParam: 'versionList'
        },
        listData: undefined,
      }
    },
    props: {},
    computed: {},
    created() {
      this.moduleObject = this.$root.moduleObject;

      this.initAttrToModule();
    },
    mounted() {
    },
    destroyed() {
    },
    methods: {
      // 点击预览
      preview(itemObject) {
        // 判断当前选择的事件通知类型
        switch (this.propData.previewEventType) {
          case 'linkModules': this.sendToComponents('previewModule', itemObject); break;
          case 'itemAction': this.customFun('clickPreviewFunction', itemObject); break;
        }
      },
      // 多选框
      onChange(item, index) {

        item.__checked = !item.__checked; // 更改当前按键

        this.checkedAllStatus(item, index); // 处理全选案件和单选案件之间关系
        this.sendCheckedStatus(); // 查询当前选择的结果，广播发送


        // this.listData = JSON.parse(JSON.stringify(this.listData)) // 更新数据
      },
      // 处理全选案件和单选案件之间关系
      checkedAllStatus(item, index) {
        // 判断是否是全选 如果是 则对全部子集处理
        if (item.__versionList && item.__versionList.length > 0) {
          item.__versionList.map(v => {
            v.__checked = item.__checked;
          })
        } else {
          // 如果不是全选 检查父级
          let pItem = this.listData[index];
          let checked = true;
          for (let i = 0; i < pItem.__versionList.length; i++) {
            let v = pItem.__versionList[i];
            if (!v.__checked) {
              checked = false; // 有一项为false 则为false
            }
          }
          pItem.__checked = checked;
        }
        this.listData = JSON.parse(JSON.stringify(this.listData))
      },
      // 查询当前选择的结果，广播发送
      sendCheckedStatus() {
        const checkedList = [];
        this.listData.map(item => {
          const list = [];
          item.__versionList && item.__versionList.length > 0 && item.__versionList.map(v => {
            if (v.__checked) {
              list.push(v);
            }
          })
          if (list && list.length > 0) {
            let data = JSON.parse(JSON.stringify(item));
            data.checkVersionList = list;
            checkedList.push(data);
          }
        })
        // 判断当前选择的事件通知类型
        switch (this.propData.versionEventType) {
          case 'linkModules': this.sendToComponents('versionModule', checkedList); break;
          case 'itemAction': this.customFun('clickItemFunction', checkedList); break;
        }

        console.log('checkedList=====', checkedList)
      },
      // 发送数据给指定组件
      sendToComponents(key, data, type = 'linkageResult') {
        if (this.propData[key] && this.propData[key].length > 0) {
          let moduleIdArray = [];
          this.propData[key].forEach(item => {
            moduleIdArray.push(item.moduleId)
          });

          this.sendBroadcastMessage({
            type,
            message: data,
            rangeModule: moduleIdArray
          })
        }
      },
      // 自定义函数调用
      customFun(key, itemObject) {
        let urlObject = window.IDM.url.queryObject();
        let clickFunction = this.propData[key];
        clickFunction && clickFunction.forEach(item => {
          window[item.name] && window[item.name].call(this, {
            urlData: urlObject,
            customParam: item.param,
            itemObject,
            _this: this
          });
        })
      },
      /**
       * 对属性设置进行初始化
       */
      initAttrToModule() {
        // 处理属性样式
        this.convertAttr();
        this.initData(this.listData); //异步请求数据
        console.log("组件内属性发生变化，变化后====》", this.propData);
      },
      // 异步获取数据
      initData(messageData) {
        console.log('messageData=====', messageData)
        messageData = messageData || [];
        let listData = [];
        if (this.moduleObject.env == "develop" || !this.moduleObject.env) {
          //开发模式下不执行此事件
          listData = SAMPLE_DATA;
        } else {
          listData = messageData;
        }
        this.listData = this.initRes(listData); //数据处理

      },

      // 拿到后台获取的内容数据 并根据当前配置进行数据处理 获取展示需要的 __content __contentTitle __checked
      initRes(list) {
        let newList = [];
        // const hasContentParamFun = this.propData.contentParamFun && this.propData.contentParamFun.length > 0; // 判断是否使用了自定义显示函数
        list.map(item => {
          // 添加checked 属性
          item.__checked = false;
          let newVersionList = [];
          // 先确定版本号列表对应的数据
          item.__versionList = this.getParamData('versionListParam', 'versionListParamFun', item);
          item.__versionList.map(v => {
            v.__version = this.getParamData('versionParam', 'versionParamFun', v); // 标题
            v.__checked = false;
            newVersionList.push(v);
          });
          item.__versionList = newVersionList;

          item.__title = this.getParamData('titleParam', 'titleParamFun', item); // 标题
          item.__titleTitle = item.__title; // 鼠标放上显示的title
          item.__content = this.getParamData('contentParam', 'contentParamFun', item); // 内容
          item.__contentTitle = item.__content; // 鼠标放上显示的title
          item.__url = this.getParamData('imgParam', 'imgParamFun', item); // 图片
          item.__componentId = this.getParamData('componentParam', 'componentParamFun', item); // 类名

          // 根据字数隐藏处理
          if (this.propData.titleType == 'hiddenNum') { // 标题
            let newContent = this.propData.titleHiddenNum < item.__title.length ?
                (item.__title.slice(0, this.propData.titleHiddenNum) + '...') :
                item.__title;
            item.__title = newContent
          }
          // 根据字数隐藏处理
          if (this.propData.contentType == 'hiddenNum') { // 内容
            let newContent = this.propData.contentHiddenNum < item.__content.length ?
                (item.__content.slice(0, this.propData.contentHiddenNum) + '...') :
                item.__content;
            item.__content = newContent
          }

          newList.push(item)
        })
        // console.log('newList=====', JSON.stringify(newList))
        return newList;
      },
      // 判断参数应取 自定义方法结果 还是 自定义字段结果, 调用 getParamFun 获取自定义方法返回结果,调用 getExpressData 获取自定义字段结果
      getParamData(field, fun, data) {
        // 自定义展示字段处理
        const hasFun = this.propData[fun] && this.propData[fun].length > 0; // 判断是否使用了自定义显示函数
        let res;
        console.log('hasFun=====', hasFun, field, fun)
        if (hasFun) { // 标题
          res = this.getParamFun(fun, data);
        } else {
          res = this.getExpressData('data', this.propData[field], data) // 当前展示的标题
        }
        console.log(res)
        return res;
      },
      /**
       * 自定义显示函数处理每一项数据后返回的结果  (例如 传入key = titleParamFun 传入item  返回__title应有的值)
       */
      getParamFun(key, itemObject) {
        const configObject = this.propData;
        return (
            window[configObject[key][0].name] &&
            window[configObject[key][0].name].call(this, {
              customParam: configObject[key][0].param,
              configObject,
              itemObject
            })
        );
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
       * 通用自定义函数
       * customFunctionList：忽略name直接传自定义函数集合
       * otherObject：其他参数对象
       */
      commonEventFunHandle(customFunctionList, otherObject) {
        let that = this;
        var customHandle = customFunctionList;
        customHandle &&
        customHandle.forEach((item) => {
          window[item.name] &&
          window[item.name].call(this, {
            customParam: item.param,
            that: this,
            ...otherObject,
          });
        });
      },
      /**
       * 提供父级组件调用的刷新prop数据组件
       */
      propDataWatchHandle(propData) {
        this.propData = propData.compositeAttr || {};
        this.initAttrToModule();

      },

      /**
       * 处理属性样式
       */
      convertAttr() {
        // 不同模块样式 使用不同对象存储  由于效率原因 一层循环即可处理完所有 因此不进行函数分割
        const boxStyleObject = {}; // 盒子样式
        const imgStyleObject = {}; // 图片样式
        const rightBoxStyleObject = {}; // 图片高度改变后需要计算右边高度
        const titleFontStyleObject = {}; // 标题文字
        const contentFontStyleObject = {}; // 内容文字
        const leiMingFontStyleObject = {}; // 类名文字
        const leiMingContentFontStyleObject = {}; // 类名内容文字
        const lineStyleObject = {}; // 分割线样式
        const versionFontStyleObject = {}; // 版本号文字

        for (const key in this.propData) {
          if (this.propData.hasOwnProperty.call(this.propData, key)) {
            const element = this.propData[key];
            // console.log('element========', key, element);
            if (!element && element !== false && element != 0) {
              continue;
            }
            switch (key) {
                // 盒子样式 宽度，阴影，背景色，背景图，盒子模型，边框，圆角
              case "boxWidth":
                boxStyleObject["width"] = element;
                break;
              case "boxShadow":
                boxStyleObject["box-shadow"] = element;
                break;
              case "boxBgColor":
                if (element && element.hex8) {
                  boxStyleObject["background-color"] = element.hex8;
                }
                break;
              case "boxBgImgUrl":
                boxStyleObject[
                    "background-image"
                    ] = `url(${window.IDM.url.getWebPath(element)})`;
                break;
              case "box":
                if (element.marginTopVal) {
                  boxStyleObject["margin-top"] = `${element.marginTopVal}`;
                }
                if (element.marginRightVal) {
                  boxStyleObject["margin-right"] = `${element.marginRightVal}`;
                }
                if (element.marginBottomVal) {
                  boxStyleObject["margin-bottom"] = `${element.marginBottomVal}`;
                }
                if (element.marginLeftVal) {
                  boxStyleObject["margin-left"] = `${element.marginLeftVal}`;
                }
                if (element.paddingTopVal) {
                  boxStyleObject["padding-top"] = `${element.paddingTopVal}`;
                }
                if (element.paddingRightVal) {
                  boxStyleObject["padding-right"] = `${element.paddingRightVal}`;
                }
                if (element.paddingBottomVal) {
                  boxStyleObject["padding-bottom"] = `${element.paddingBottomVal}`;
                }
                if (element.paddingLeftVal) {
                  boxStyleObject["padding-left"] = `${element.paddingLeftVal}`;
                }
                break;
              case "boxBorder":
                if (element.border.top.width > 0) {
                  boxStyleObject["border-top-width"] =
                      element.border.top.width + element.border.top.widthUnit;
                  boxStyleObject["border-top-style"] = element.border.top.style;
                  if (element.border.top.colors.hex8) {
                    boxStyleObject["border-top-color"] =
                        element.border.top.colors.hex8;
                  }
                }
                if (element.border.right.width > 0) {
                  boxStyleObject["border-right-width"] =
                      element.border.right.width + element.border.right.widthUnit;
                  boxStyleObject["border-right-style"] = element.border.right.style;
                  if (element.border.right.colors.hex8) {
                    boxStyleObject["border-right-color"] =
                        element.border.right.colors.hex8;
                  }
                }
                if (element.border.bottom.width > 0) {
                  boxStyleObject["border-bottom-width"] =
                      element.border.bottom.width + element.border.bottom.widthUnit;
                  boxStyleObject["border-bottom-style"] =
                      element.border.bottom.style;
                  if (element.border.bottom.colors.hex8) {
                    boxStyleObject["border-bottom-color"] =
                        element.border.bottom.colors.hex8;
                  }
                }
                if (element.border.left.width > 0) {
                  boxStyleObject["border-left-width"] =
                      element.border.left.width + element.border.left.widthUnit;
                  boxStyleObject["border-left-style"] = element.border.left.style;
                  if (element.border.left.colors.hex8) {
                    boxStyleObject["border-left-color"] =
                        element.border.left.colors.hex8;
                  }
                }
                boxStyleObject["border-top-left-radius"] =
                    element.radius.leftTop.radius +
                    element.radius.leftTop.radiusUnit;
                boxStyleObject["border-top-right-radius"] =
                    element.radius.rightTop.radius +
                    element.radius.rightTop.radiusUnit;
                boxStyleObject["border-bottom-left-radius"] =
                    element.radius.leftBottom.radius +
                    element.radius.leftBottom.radiusUnit;
                boxStyleObject["border-bottom-right-radius"] =
                    element.radius.rightBottom.radius +
                    element.radius.rightBottom.radiusUnit;
                break;

                // 图片宽高，图片距离右侧距离，图片边框圆角
              case "imgWidth":
                imgStyleObject["width"] = element;
                break;
              case "imgHeight":
                imgStyleObject["height"] = element;
                rightBoxStyleObject["height"] = element;
                break;
              case "imgRight":
                imgStyleObject["margin-right"] = element + 'px';
                break;
              case "imgBgColor":
                if (element && element.hex8) {
                  imgStyleObject["background-color"] = element.hex8;
                }
                break;
              case "imgBorder":
                if (element.border.top.width > 0) {
                  imgStyleObject["border-top-width"] =
                      element.border.top.width + element.border.top.widthUnit;
                  imgStyleObject["border-top-style"] = element.border.top.style;
                  if (element.border.top.colors.hex8) {
                    imgStyleObject["border-top-color"] =
                        element.border.top.colors.hex8;
                  }
                }
                if (element.border.right.width > 0) {
                  imgStyleObject["border-right-width"] =
                      element.border.right.width + element.border.right.widthUnit;
                  imgStyleObject["border-right-style"] = element.border.right.style;
                  if (element.border.right.colors.hex8) {
                    imgStyleObject["border-right-color"] =
                        element.border.right.colors.hex8;
                  }
                }
                if (element.border.bottom.width > 0) {
                  imgStyleObject["border-bottom-width"] =
                      element.border.bottom.width + element.border.bottom.widthUnit;
                  imgStyleObject["border-bottom-style"] =
                      element.border.bottom.style;
                  if (element.border.bottom.colors.hex8) {
                    imgStyleObject["border-bottom-color"] =
                        element.border.bottom.colors.hex8;
                  }
                }
                if (element.border.left.width > 0) {
                  imgStyleObject["border-left-width"] =
                      element.border.left.width + element.border.left.widthUnit;
                  imgStyleObject["border-left-style"] = element.border.left.style;
                  if (element.border.left.colors.hex8) {
                    imgStyleObject["border-left-color"] =
                        element.border.left.colors.hex8;
                  }
                }
                imgStyleObject["border-top-left-radius"] =
                    element.radius.leftTop.radius +
                    element.radius.leftTop.radiusUnit;
                imgStyleObject["border-top-right-radius"] =
                    element.radius.rightTop.radius +
                    element.radius.rightTop.radiusUnit;
                imgStyleObject["border-bottom-left-radius"] =
                    element.radius.leftBottom.radius +
                    element.radius.leftBottom.radiusUnit;
                imgStyleObject["border-bottom-right-radius"] =
                    element.radius.rightBottom.radius +
                    element.radius.rightBottom.radiusUnit;
                break;

                // 分割线样式 分割线样式，颜色，宽度
              case "lineType":
                lineStyleObject["border-top-style"] = element;
                break;
              case "lineWidth":
                lineStyleObject["border-top-width"] = element.inputVal + element.selectVal;
                break;
              case "lineColor":
                if (element && element.hex8) {
                  lineStyleObject["border-top-color"] = element.hex8;
                }
                break;

                // 标题文字
              case "titleFont":
                titleFontStyleObject["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                  titleFontStyleObject["color"] = element.fontColors.hex8;
                }
                titleFontStyleObject["font-weight"] =
                    element.fontWeight && element.fontWeight.split(" ")[0];
                titleFontStyleObject["font-style"] = element.fontStyle;
                titleFontStyleObject["font-size"] =
                    element.fontSize + element.fontSizeUnit;
                titleFontStyleObject["line-height"] =
                    element.fontLineHeight +
                    (element.fontLineHeightUnit == "-"
                        ? ""
                        : element.fontLineHeightUnit);
                titleFontStyleObject["text-align"] = element.fontTextAlign;
                titleFontStyleObject["text-decoration"] = element.fontDecoration;
                break;

                // 内容文字
              case "contentFont":
                contentFontStyleObject["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                  contentFontStyleObject["color"] = element.fontColors.hex8;
                }
                contentFontStyleObject["font-weight"] =
                    element.fontWeight && element.fontWeight.split(" ")[0];
                contentFontStyleObject["font-style"] = element.fontStyle;
                contentFontStyleObject["font-size"] =
                    element.fontSize + element.fontSizeUnit;
                contentFontStyleObject["line-height"] =
                    element.fontLineHeight +
                    (element.fontLineHeightUnit == "-"
                        ? ""
                        : element.fontLineHeightUnit);
                contentFontStyleObject["text-align"] = element.fontTextAlign;
                contentFontStyleObject["text-decoration"] = element.fontDecoration;
                break;

                // 类名文字
              case "leiMingFont":
                leiMingFontStyleObject["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                  leiMingFontStyleObject["color"] = element.fontColors.hex8;
                }
                leiMingFontStyleObject["font-weight"] =
                    element.fontWeight && element.fontWeight.split(" ")[0];
                leiMingFontStyleObject["font-style"] = element.fontStyle;
                leiMingFontStyleObject["font-size"] =
                    element.fontSize + element.fontSizeUnit;
                leiMingFontStyleObject["line-height"] =
                    element.fontLineHeight +
                    (element.fontLineHeightUnit == "-"
                        ? ""
                        : element.fontLineHeightUnit);
                leiMingFontStyleObject["text-align"] = element.fontTextAlign;
                leiMingFontStyleObject["text-decoration"] = element.fontDecoration;
                break;

                // 类名内容文字
              case "leiMingContentFont":
                leiMingContentFontStyleObject["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                  leiMingContentFontStyleObject["color"] = element.fontColors.hex8;
                }
                leiMingContentFontStyleObject["font-weight"] =
                    element.fontWeight && element.fontWeight.split(" ")[0];
                leiMingContentFontStyleObject["font-style"] = element.fontStyle;
                leiMingContentFontStyleObject["font-size"] =
                    element.fontSize + element.fontSizeUnit;
                leiMingContentFontStyleObject["line-height"] =
                    element.fontLineHeight +
                    (element.fontLineHeightUnit == "-"
                        ? ""
                        : element.fontLineHeightUnit);
                leiMingContentFontStyleObject["text-align"] = element.fontTextAlign;
                leiMingContentFontStyleObject["text-decoration"] = element.fontDecoration;
                break;

                // 版本号文字
              case "versionFont":
                versionFontStyleObject["font-family"] = element.fontFamily;
                if (element.fontColors.hex8) {
                  versionFontStyleObject["color"] = element.fontColors.hex8;
                }
                versionFontStyleObject["font-weight"] =
                    element.fontWeight && element.fontWeight.split(" ")[0];
                versionFontStyleObject["font-style"] = element.fontStyle;
                versionFontStyleObject["font-size"] =
                    element.fontSize + element.fontSizeUnit;
                versionFontStyleObject["line-height"] =
                    element.fontLineHeight +
                    (element.fontLineHeightUnit == "-"
                        ? ""
                        : element.fontLineHeightUnit);
                versionFontStyleObject["text-align"] = element.fontTextAlign;
                versionFontStyleObject["text-decoration"] = element.fontDecoration;
                break;
            }
          }
        }


        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item', boxStyleObject);  // 盒子样式
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-img', imgStyleObject);  // 图片样式
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-right', rightBoxStyleObject);  // 图片高度改变后需要计算右边高度
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-right-title', titleFontStyleObject);  // 标题文字
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-right-content', contentFontStyleObject);  // 内容文字
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-right-name', leiMingFontStyleObject);  // 类名文字
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-top-right-type-id', leiMingContentFontStyleObject);  // 类名内容文字
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-bottom', lineStyleObject);  // 分割线样式
        window.IDM.setStyleToPageHead(this.moduleObject.id + ' .item-bottom-item', versionFontStyleObject);  // 版本号文字
      },
      // 数据处理
      formatSourceData(data) {
        if (this.listData == undefined) {
          this.listData = [];
        }

        let filedExp = this.propData.dataFiled;
        let dataObject = {IDM: window.IDM, ...data};
        let _defaultVal = window.IDM.express.replace.call(this, "@[" + filedExp + "]", dataObject);
        this.initData(_defaultVal); //
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
      /**
       * 根据结果集来执行表达式的结果
       * dataName：结果集名，建议直接data即可
       * dataFiled：表达式
       * resultData：要查下的结果集
       */
      getExpressData(dataName, dataFiled, resultData) {
        //给defaultValue设置dataFiled的值
        let _defaultVal = undefined;
        if (dataFiled) {
          let filedExp = dataFiled;
          filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
          let dataObject = { IDM: window.IDM };
          dataObject[dataName] = resultData;
          _defaultVal = window.IDM.express.replace.call(
              this,
              "@[" + filedExp + "]",
              dataObject
          );
        }
        return _defaultVal;
      },
    }
  }
</script>
<style lang="scss">
  .page-list-outbox {
    overflow: hidden;

    .item {
      display: flex;
      flex-direction: column;
      background: #fff;
      margin: 20px 0;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
      padding: 10px;

      &-top {
        display: flex;
        align-items: center;
        padding: 10px 0;

        &-img {
          display: block;
          flex-shrink: 0;
          width: 200px;
          height: 120px;
          margin-right: 20px;
          overflow: hidden;
          position: relative;

          &-img {
            display: block;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          //遮罩层
          &-layer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: 9;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            display: block;
            cursor: pointer;
            transition: all ease .2s;

            &:hover {
              opacity: 1;
            }

            &-btn {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              border: 1px solid #fff;
              line-height: 25px;
              color: #fff;
              font-size: 14px;
              padding: 0px 20px;
              border-radius: 25px;
            }
          }

          .cc-item-svg-icon {
            outline: none;
          }
        }

        &-right {
          width: calc(100% - 220px);
          height: 120px;
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }
          &::-webkit-scrollbar {
            background: transparent;
          }
          &::-webkit-scrollbar-thumb {
            background: rgba(37,36,36,.57);
          }

          .overflowHidden {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
          }

          &-title {
            font-weight: bold;
            font-size: 24px;
            color: #333333;
            width: 100%;
          }

          &-content {
            font-size: 20px;
            color: #818181;
            width: 100%;
          }

          &-type {
            font-size: 14px;
            color: #a0a1af;

            &-id {
              color: #4fb9ff;
            }
          }
        }
      }

      &-bottom {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 10px 0;
        border-top: 1px solid #eee;

        .item-bottom-item {
          margin-right: 10px;
          margin-left: 0 !important;
        }
      }
    }
  }

  .common-card-item-box {
    background-color: #ffffff;


  }
</style>
