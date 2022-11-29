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
    <div v-if="propData.headerDisplay" class="console-paging-header-container">
      <div class="drag_container" :idm-ctrl-id="moduleObject.id" idm-container-index="2">
        
      </div>
      <div v-if="propData.searchDisplay">
        <a-input-search placeholder="请输入关键词" style="width: 250px" @search="onSearch" />
      </div>
    </div>
    <div class="console-paging-content-container">
      <div class="drag_container" :idm-ctrl-id="moduleObject.id" idm-container-index="1">
        
      </div>
    </div>
    <div class="console-paging-footer-container">
      <a-config-provider :locale="locale">
        <a-pagination
          v-model="current"
          show-quick-jumper
          show-size-changer
          :default-current="1"
          :page-size.sync="pageSize"
          :total="totalCount"
          :pageSizeOptions="propData.pageSizeOptions?propData.pageSizeOptions.split(','):['10', '20', '30', '40']"
          @change="initData"
          @showSizeChange="onShowSizeChange"
        />
      </a-config-provider>
    </div>
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/locale/zh_CN';
export default {
  name: 'IPagingContainer',
  data(){
    return {
      locale,
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{},
      pageSize: 10,
      current: 1,
      listResultData:null,
      conditionObject:{},
      conditionObjectRetain:{},
      searchText:"",
      totalCount:0
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
  },
  mounted() {
    //赋值给window提供跨页面调用
    this.$nextTick(function(params) {
      window[this.moduleObject.packageid] = this;
    });
  },
  destroyed() {},
  methods:{
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
      console.log("组件内属性发生变化，变化后====》",this.propData);
    },
    /**
     * 把属性转换成外部的样式对象
     */
    convertAttrToStyleOutObject(){
      var styleObject = {};
      if(this.propData.bgSize&&this.propData.bgSize=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
      }else if(this.propData.bgSize){
        styleObject["background-size"]=this.propData.bgSize;
      }
      if(this.propData.positionX&&this.propData.positionX.inputVal){
        styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
      }
      if(this.propData.positionY&&this.propData.positionY.inputVal){
        styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key]=element;
              break;
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "box":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              
              break;
            case "positionY":
              //背景纵向偏移
              
              break;
            case "bgRepeat":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment":
              //背景模式
                styleObject["background-attachment"]=element;
              break;
            case "border":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            case "font":
              styleObject["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject["color"]=element.fontColors.hex8;
              }
              styleObject["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject["font-style"]=element.fontStyle;
              styleObject["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject["text-align"]=element.fontTextAlign;
              styleObject["text-decoration"]=element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
    },
    /**
     * 把属性转换成头部的样式对象
     */
    convertAttrToStyleHeaderObject(){
      var styleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "headerBgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "headerBox":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "headerBorder":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
            // case "headerFont":
            //   var styleObject1 = {};
            //   styleObject1["font-family"]=element.fontFamily;
            //   if(element.fontColors.hex8){
            //     styleObject1["color"]=element.fontColors.hex8;
            //   }
            //   styleObject1["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
            //   styleObject1["font-style"]=element.fontStyle;
            //   styleObject1["font-size"]=element.fontSize+element.fontSizeUnit;
            //   styleObject1["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
            //   styleObject1["text-align"]=element.fontTextAlign;
            //   styleObject1["text-decoration"]=element.fontDecoration;
            //   window.IDM.setStyleToPageHead(this.moduleObject.id+" .console-paging-header-container .console-header-text",styleObject1);
            //   break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id+" .console-paging-header-container",styleObject);
    },
    /**
     * 把属性转换成底部的样式对象
     */
    convertAttrToStyleFooterObject(){
      var styleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "footerBgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "footerBox":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "footerBorder":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id+" .console-paging-footer-container",styleObject);
    },
    /**
     * 把属性转换成内容的样式对象
     */
    convertAttrToStyleContentObject(){
      var styleObject = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "contentBgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "contentBox":
              if(element.marginTopVal){
                styleObject["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject["padding-left"]=`${element.paddingLeftVal}`;
              }
              break;
            case "contentBorder":
              if(element.border.top.width>0){
                styleObject["border-top-width"]=element.border.top.width+element.border.top.widthUnit;
                styleObject["border-top-style"]=element.border.top.style;
                if(element.border.top.colors.hex8){
                  styleObject["border-top-color"]=element.border.top.colors.hex8;
                }
              }
              if(element.border.right.width>0){
                styleObject["border-right-width"]=element.border.right.width+element.border.right.widthUnit;
                styleObject["border-right-style"]=element.border.right.style;
                if(element.border.right.colors.hex8){
                  styleObject["border-right-color"]=element.border.right.colors.hex8;
                }
              }
              if(element.border.bottom.width>0){
                styleObject["border-bottom-width"]=element.border.bottom.width+element.border.bottom.widthUnit;
                styleObject["border-bottom-style"]=element.border.bottom.style;
                if(element.border.bottom.colors.hex8){
                  styleObject["border-bottom-color"]=element.border.bottom.colors.hex8;
                }
              }
              if(element.border.left.width>0){
                styleObject["border-left-width"]=element.border.left.width+element.border.left.widthUnit;
                styleObject["border-left-style"]=element.border.left.style;
                if(element.border.left.colors.hex8){
                  styleObject["border-left-color"]=element.border.left.colors.hex8;
                }
              }
              
              styleObject["border-top-left-radius"]=element.radius.leftTop.radius+element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"]=element.radius.rightTop.radius+element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"]=element.radius.leftBottom.radius+element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"]=element.radius.rightBottom.radius+element.radius.rightBottom.radiusUnit;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id+" .console-paging-content-container",styleObject);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      this.pageSize = this.propData.defaultPageSize||10;
      this.convertAttrToStyleOutObject();
      if(this.propData.headerDisplay){
        this.convertAttrToStyleHeaderObject();
      }
      this.convertAttrToStyleFooterObject();
      this.convertAttrToStyleContentObject();
      //请求数据源
      this.initData();
    },
    initData(){
      let that = this;
      //所有地址的url参数转换
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"",
        urlData:JSON.stringify(urlObject)
      };
      params[this.propData.searchKey] = this.searchText;
      this.conditionObject&&Object.keys(this.conditionObject).forEach(key=>{
        params[key] = typeof this.conditionObject[key]=='object'?JSON.stringify(this.conditionObject[key]):this.conditionObject[key];
      })
      this.conditionObjectRetain&&Object.keys(this.conditionObjectRetain).forEach(key=>{
        params[key] = typeof this.conditionObjectRetain[key]=='object'?JSON.stringify(this.conditionObjectRetain[key]):this.conditionObjectRetain[key];
      })
      params["pageIndex"] = this.current;
      params["pageSize"] = this.pageSize;
      switch (this.propData.dataSourceType) {
        case "customInterface":
          this.propData.customInterfaceUrl&&window.IDM.http.get(this.propData.customInterfaceUrl,params)
          .then((res) => {
            //res.data
            that.listResultData = res&&res.data;
            that.change();
          })
          .catch(function (error) {
            that.listResultData = null;
            that.change();
          });
          break;
        case "pageCommonInterface":
          //使用通用接口直接跳过，在setContextValue执行
          break;
        case "customFunction":
          if(this.propData.customFunction&&this.propData.customFunction.length>0){
            var resValue = [];
            try {
              resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{...params,...this.propData.customFunction[0].param,moduleObject:this.moduleObject});
            } catch (error) {
            }
            that.listResultData = resValue;
            that.change();
          }
          break;
      }
    },
    reload(reloadFirstPage){
      if(reloadFirstPage){
        //  this.pageSize =20;
         this.current = 1;
      }
      //请求数据源
      this.initData();
    },
    change(){
      if(this.propData.linkageDemandPageModule&&this.propData.linkageDemandPageModule.length>0){
        var moduleIdArray = [];
        this.propData.linkageDemandPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageDemand",
          message:this.listResultData,
          rangeModule:moduleIdArray,
          triggerType:'MT'
        })
      }
      var totalCount = this.listResultData?this.listResultData.data&&this.listResultData.data.total:-1;
      if(totalCount==-1){
        totalCount = this.listResultData&&this.listResultData.total;
      }
      if(totalCount&&totalCount!=-1){
        this.totalCount = totalCount
      }
    },
    onShowSizeChange(current, pageSize) {
      // console.log(current, pageSize);
      this.current = current;
      this.initData();
    },
    onSearch(value) {
      //this.propData.searchKey
      // console.log(value);
      this.searchText = value;
      this.reload(true);
    },
    onReInitData(conditionObject){
      this.conditionObject = conditionObject||this.conditionObject||{};
      this.reload(true);
    },
    onReInitDataMsgKey(conditionObject,messageKey){
      if(this.propData.conditionRetainArray&&this.propData.conditionRetainArray.split(",").indexOf(messageKey)>-1){
        this.conditionObjectRetain[messageKey] = conditionObject;
      }else{
        this.conditionObject[messageKey] = conditionObject;
      }
      this.reload(true);
    },
    getHeaderFontText(){
      var result = this.propData.headerFontText;
      if(this.propData.headerFontTextFunction&&this.propData.headerFontTextFunction.length>0){
        try {
          var param = {...this.propData.headerFontTextFunction[0].param,moduleObject:this.moduleObject,listResultData:this.listResultData};
          result = window[this.propData.headerFontTextFunction[0].name]&&window[this.propData.headerFontTextFunction[0].name].call(this,param);
        } catch (error) {
        }
      }
      return result;
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
    receiveBroadcastMessage(object){
      console.log("组件收到消息:"+this.moduleObject.packageid, object);
      if(object.type&&object.type=="linkageDemand"){
        if(object.messageKey){
          this.onReInitDataMsgKey(object.message,object.messageKey);
        }else{
          this.onReInitData(object.message);
        }
      }else if(object.type&&object.type=="linkageReload"){
        this.reload(object.message&&object.message.reloadFirstPage);
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
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
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
      console.log("统一接口设置的值",object)
      if(object.type!="pageCommonInterface"){
        return;
      }
      //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
      if(object.key==this.propData.dataName){
        //给defaultValue设置dataFiled的值
        var filedExp = this.propData.dataFiled;
        filedExp = this.propData.dataName+(filedExp.startsWiths("[")?"":".")+filedExp;
        var dataObject = {IDM:window.IDM};
        dataObject[this.propData.dataName] = object.data;
        var _defaultVal = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
        this.listResultData = _defaultVal;
        this.change();
      }
    }
  }
}
</script>
<style lang="scss">
.console-paging-header-container{
  display: flex;
  justify-content: space-between;
  align-items:center;
  padding: 10px 0px;
  .console-header-text{
  }
}
.console-paging-footer-container{
  padding: 10px 0px;
  background-color: #ffffff;
  text-align: center;
  margin-top: 10px;
}
</style>