<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="ifilter-condition-box">
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="ifilter-condition-container">
      <div class="icc-check-box">
        <div v-if="propData.selectedDisplay" class="icc-check-condition">
          <div class="icc-check-condition-title">{{propData.selectedTitle}} <svg t="1634697781677" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1199"><path d="M761.6 489.6l-432-435.2c-9.6-9.6-25.6-9.6-35.2 0-9.6 9.6-9.6 25.6 0 35.2l416 416-416 425.6c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0l432-441.6C771.2 515.2 771.2 499.2 761.6 489.6z" p-id="1200"></path></svg> </div>
          <div>
            <template v-for="(item,index) in conditionList">
              <a-tag :key="index" v-if="!isNoActive(item)" closable @close="closeAllSelected(item,index)">
                {{getAllName(item)}}
              </a-tag>
            </template>
          </div>
        </div>
        <div v-else></div>
        <a-button v-if="propData.rightButtonDisplay" class="icc-op-button" @click="clickButtonHandle" :type="propData.rightButtoType||'default'">
          {{propData.rightButtoTitle}}
        </a-button>
      </div>
      <template v-for="(item,index) in conditionList">
        <div class="icc-condition-box" :key="index" v-show="!propData.defaultConditionNumber||(propData.defaultConditionNumber&&propData.defaultConditionNumber>=index+1)||isOpenAllCondition">
          <div class="icc-condition-item">{{item.conditionName}}</div>
          <div class="icc-condition-item" :class="{'active':isNoActive(item)}" @click="closeAllSelected(item,index)" v-if="item.showAllOption">{{item.allOptionName}}</div>
          <template v-for="(sitem,sindex) in item.resData||[]">
            <div class="icc-condition-item" @click="conditionActiveHandle(index,sitem,sindex)" v-show="!item.defaultOptionNumber||(item.defaultOptionNumber&&item.defaultOptionNumber>=sindex+1)||item.allActive" :class="{'active':sitem.active}" :key="sindex">{{sitem.text}}</div>
          </template>
          <a class="icc-condition-item-more" href="javascript:;" @click="item.allActive=!item.allActive" v-if="item.defaultOptionNumber&&item.resData&&item.resData.length>item.defaultOptionNumber">
            <span v-if="!item.allActive">更多<svg t="1634698919595" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2954"><path d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z" p-id="2955"></path></svg></span>
            <span v-else>收起<svg t="1634699094211" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3197"><path d="M483.029333 286.165333l30.165334-30.208 415.957333 415.829334c16.426667 16.426667 16.64 43.648 0 60.288a42.538667 42.538667 0 0 1-60.330667 0.042666L513.28 376.746667l-355.242667 355.413333a42.496 42.496 0 0 1-60.288 0 42.837333 42.837333 0 0 1-0.085333-60.330667l383.701333-383.872 1.706667-1.749333z" p-id="3198"></path></svg></span>
          </a>
        </div>
      </template>
      <!-- <div class="icc-condition-box">
        <div class="icc-condition-item">归属：</div>
        <div class="icc-condition-item active">全部</div>
        <div class="icc-condition-item">布局组件</div>
        <div class="icc-condition-item">基础组件</div>
      </div> -->
      <div class="icc-condition-box-more" v-if="propData.defaultConditionNumber&&propData.defaultConditionNumber<conditionList.length">
        <a v-if="!isOpenAllCondition" href="javascript:;" @click="isOpenAllCondition=!isOpenAllCondition">全部条件<svg t="1634698919595" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2954"><path d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z" p-id="2955"></path></svg></a>
        <a v-else href="javascript:;" @click="isOpenAllCondition=!isOpenAllCondition">收起<svg t="1634699094211" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3197"><path d="M483.029333 286.165333l30.165334-30.208 415.957333 415.829334c16.426667 16.426667 16.64 43.648 0 60.288a42.538667 42.538667 0 0 1-60.330667 0.042666L513.28 376.746667l-355.242667 355.413333a42.496 42.496 0 0 1-60.288 0 42.837333 42.837333 0 0 1-0.085333-60.330667l383.701333-383.872 1.706667-1.749333z" p-id="3198"></path></svg></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IFilterCondition',
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{},
      conditionList:[],
      isOpenAllCondition:false
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
    this.conditionDataInit();
  },
  mounted() {
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
      this.conditionDataInit();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
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
     * 检索条件
     */
    conditionDataInit(){
      let conditionDataSource = this.propData.conditionDataSource||[];
      this.conditionList = [];
      conditionDataSource.forEach(item=>{
        item.allActive = false;
        this.conditionList.push(item);
      });
      //所有地址的url参数转换
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"",
        urlData:JSON.stringify(urlObject)
      };
      this.conditionDataInitInner(conditionDataSource,0,params);
    },
    /**
     * 内部的有序加载
     */
    conditionDataInitInner(dataSourceList,index,params){
      if(dataSourceList.length<=index){
        return;
      }
      var item = dataSourceList[index];
      index = index+1;
      let that = this;
      switch (item.dataSourceType) {
        case "customInterface":
          item.customInterfaceUrl?window.IDM.http.get(item.customInterfaceUrl,params)
          .then((res) => {
            //res.data
            that.conditionList[index-1].resData = res&&res.data&&res.data.data||[];
            that.optionBindAfter(that.conditionList[index-1]);
            //给index的赋值
            that.conditionDataInitInner(dataSourceList,index,params);
          })
          .catch(function (error) {
            that.conditionDataInitInner(dataSourceList,index,params);
          }):that.conditionDataInitInner(dataSourceList,index,params);
          break;
        case "pageCommonInterface":
          //使用通用接口直接跳过，在setContextValue执行
          that.conditionDataInitInner(dataSourceList,index,params)
          break;
        case "customFunction":
          if(item.customFunction&&item.customFunction.length>0){
            var resValue = [];
            try {
              resValue = window[item.customFunction[0].name]&&window[item.customFunction[0].name].call(this,{...params,...item.customFunction[0].param,moduleObject:this.moduleObject});
            } catch (error) {
            }
            that.conditionList[index-1].resData = resValue;
            that.optionBindAfter(that.conditionList[index-1]);
          }
          that.conditionDataInitInner(dataSourceList,index,params)
          break;
        default:
          that.conditionDataInitInner(dataSourceList,index,params)
          break;
      }
    },
    /**
     * 选项绑定之后执行的操作
     */
    optionBindAfter(item){
      //自定义渲染选择项
      if(item.renderOptionFunction&&item.renderOptionFunction.length>0){
        item&&item.resData&&item.resData.forEach(sitem=>{
            try {
              sitem.text = window[item.renderOptionFunction[0].name]&&window[item.renderOptionFunction[0].name].call(this,{...item.renderOptionFunction[0].param,moduleObject:this.moduleObject,itemObject:sitem});
            } catch (error) {
            }
        })
      }
      item&&item.resData&&item.resData.forEach(sitem=>{
        if(sitem.active===undefined){
          sitem.active = false;
        }
      })
    },
    isNoActive(item){
      let result = true;
      item&&item.resData&&item.resData.forEach(item=>{
        if(item.active){
          result = false;
        }
      })
      return result;
    },
    getAllName(item){
      var _active = [],activeCount = 0;
      item&&item.resData&&item.resData.forEach(sitem=>{
        if(_active.length<3){
          sitem.active&&_active.push(sitem.text)
        }
        sitem.active&&activeCount++;
      })
      if(activeCount>3){
        _active.push("...");
      }
      return _active.join(",")
    },
    conditionActiveHandle(index,item,sindex){
      this.conditionList[index].isMultiple!==true&&this.conditionList[index]&&this.conditionList[index].resData&&this.conditionList[index].resData.forEach((sitem,ssindex)=>{
        if(ssindex!=sindex){
          sitem.active = false;
          }
      })
      item.active=!item.active;
      this.change(index);
      //嵌套发现有问题，点击不更新，暂时使用强制刷新
      this.$forceUpdate();
    },
    closeAllSelected(item,index){
      item&&item.resData&&item.resData.forEach(sitem=>{
        sitem.active = false;
      })
      this.change(index);
      //嵌套发现有问题，点击不更新，暂时使用强制刷新
      this.$forceUpdate();
    },
    clickButtonHandle(e){
      let that = this;
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      //自定义函数
      /**
       * [
       * {name:"",param:{}}
       * ]
       */
      var clickFunction = this.propData.clickRightButtonFunction;
      clickFunction&&clickFunction.forEach(item=>{
        window[item.name]&&window[item.name].call(this,{
          urlData:urlObject,
          pageId,
          customParam:item.param,
          _this:this
        });
      })
    },
    change(index){
      let selectObject={};
      this.conditionList.forEach(item=>{
        let newValue = [];
        if(item&&item.resData){
          item.resData.forEach(sitem=>{
            if(sitem.active){
              newValue.push(sitem);
            }
          })
        }
        if(newValue.length>0){
          selectObject[item.conditionKey] = newValue;
        }
      })
      if(this.propData.linkageDemandPageModule&&this.propData.linkageDemandPageModule.length>0){
        var moduleIdArray = [];
        this.propData.linkageDemandPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageDemand",
          message:selectObject,
          rangeModule:moduleIdArray,
          triggerType:'MT'
        })
      }
      //调用自定义的值改变的函数
      if(this.propData.changeOptionFunction&&this.propData.changeOptionFunction.length>0){
        try {
          window[this.propData.changeOptionFunction[0].name]&&window[this.propData.changeOptionFunction[0].name].call(this,{...this.propData.changeOptionFunction[0].param,moduleObject:this.moduleObject,changeIndex:index,conditionList:this.conditionList});
        } catch (error) {
        }
      }
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
      console.log("组件收到消息",object)
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
      this.conditionList.forEach(element => {
        if(object.key==element.dataName){
          //给defaultValue设置dataFiled的值
          var filedExp = element.dataFiled;
          filedExp = element.dataName+(filedExp.startsWiths("[")?"":".")+filedExp;
          var dataObject = {IDM:window.IDM};
          dataObject[element.dataName] = object.data;
          var _defaultVal = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
          element.resData = _defaultVal;
          this.optionBindAfter(element);
        }
      });
    }
  }
}
</script>
<style lang="scss">
.ifilter-condition-box{
  padding: 20px 20px 20px 20px;
}
.ifilter-condition-container{
  position: relative;
  .icc-condition-box{
    padding-left: 100px;
    padding-right: 50px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    .icc-condition-item{
      padding: 3px 10px;
      margin-right: 5px;
      margin-bottom: 5px;
      transition: all linear 0.3s;
      cursor: pointer;
      &:first-child{
        color: #999999;
        cursor: default;
        position: absolute;
        left: 0;
        padding-left: 0;
        max-width: 96px;
      }
      &.active,&:not(:first-child):hover{
        background-color: #E9F2FA;
        color: #40A9FF;
        border-radius: 4px;
      }
    }
    .icc-condition-item-more{
      position: absolute;
      right: 0px;
      top: 3px;
      svg{
        fill: currentColor;
        width: 12px;
        max-height: 12px;
        vertical-align: -1px;
      }
    }
  }
  .icc-condition-box-more{
    text-align: center;
    margin-top: 10px;
    svg{
      fill: currentColor;
      width: 12px;
      max-height: 12px;
      vertical-align: -1px;
    }
  }
  .icc-check-box{
    display: flex;
    justify-content: space-between;
    .icc-check-condition{
      display: flex;
      justify-content:flex-start;
      &>div{
        margin-right: 10px;
      }
      .icc-check-condition-title{
        svg{
          fill: currentColor;
          width: 12px;
          max-height: 12px;
          vertical-align: -1px;
        }
      }
    }
  }
}
</style>