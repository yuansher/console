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
    <div class="component-selected-display-title" v-show="!propData.cardTitleShowType||(propData.cardTitleShowType&&listData.length>0)">
      <div class="component-selected-display-titlefont">
        <span>{{propData.cardTitle}}（{{listData.length}}）</span>
        <a href="javascript:;" @click="removeSelectedItem()">清空</a>
      </div>
      <div v-if="propData.showSwitchStyleButton" class="component-selected-display-switch">
        <a href="javascript:;" @click="listType=='card'?listType='tag':listType='card'">
          <svg t="1635749640833" viewBox="0 0 1098 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2882"><path d="M272.050167 118.609623 916.711307 118.609623C978.164319 118.609623 1020.51595 147.136626 1042.685301 192.882911 1055.122564 218.547112 1059.082196 243.610871 1058.929203 263.04521L1057.549809 272.4473 951.899019 645.526665C946.395692 664.960301 926.180286 676.253044 906.746646 670.749714 887.313013 665.246384 876.020268 645.030979 881.523602 625.597343L987.174393 252.517978C987.174393 252.517978 985.793243 262.045215 985.792527 262.12607 985.861603 253.280423 983.533188 238.541964 976.8643 224.780779 966.533654 203.463572 949.147187 191.75248 916.711307 191.75248L265.823594 191.75248 317.397849 243.326735C331.67988 257.608766 331.67988 280.764514 317.397849 295.046546 303.115818 309.328576 279.96007 309.328576 265.678038 295.046546L154.785736 184.154244C140.503706 169.872212 140.503706 146.716464 154.785736 132.434433L266.851405 20.368765C281.133436 6.086734 304.289184 6.086734 318.571215 20.368765 332.853247 34.650796 332.853247 57.806544 318.571215 72.088575L272.050167 118.609623ZM206.505547 181.786919C206.911917 182.170306 207.327069 182.544485 207.750668 182.909123L206.505547 184.154244 206.505547 181.786919ZM825.092688 885.072918 180.431548 885.072918C118.978539 885.072918 76.626911 856.545916 54.457557 810.799631 42.020291 785.135426 38.060662 760.071665 38.213653 740.63733L39.593044 731.235239 145.243838 358.155875C150.747168 338.722239 170.962573 327.429496 190.396209 332.932826 209.829844 338.436157 221.122588 358.651562 215.619257 378.085197L109.968464 751.164562C109.968464 751.164562 111.349611 741.637325 111.350332 741.556473 111.281257 750.402114 113.609672 765.140575 120.278554 778.90176 130.6092 800.218968 147.995668 811.930061 180.431548 811.930061L831.319267 811.930061 779.745009 760.355803C765.462974 746.073776 765.462974 722.918026 779.745009 708.635994 794.027037 694.353963 817.182786 694.353963 831.464821 708.635994L942.357124 819.528294C956.639152 833.81033 956.639152 856.966078 942.357124 871.248106L830.291449 983.313774C816.009421 997.595809 792.853672 997.595809 778.571644 983.313774 764.289609 969.031746 764.289609 945.875997 778.571644 931.593962L825.092688 885.072918ZM890.637312 821.895621C890.230938 821.512236 889.815786 821.138052 889.392187 820.77342L890.637312 819.528294 890.637312 821.895621ZM786.285714 432.761905C806.483558 432.761905 822.857143 416.388318 822.857143 396.190476 822.857143 375.992634 806.483558 359.619048 786.285714 359.619048L416.507936 359.619048C396.310094 359.619048 379.936508 375.992634 379.936508 396.190476 379.936508 416.388318 396.310094 432.761905 416.507936 432.761905L786.285714 432.761905ZM680.634921 644.063492C700.832763 644.063492 717.20635 627.689906 717.20635 607.492064 717.20635 587.294221 700.832763 570.920635 680.634921 570.920635L310.857143 570.920635C290.659301 570.920635 274.285714 587.294221 274.285714 607.492064 274.285714 627.689906 290.659301 644.063492 310.857143 644.063492L680.634921 644.063492Z" p-id="2883"></path></svg>
          {{listType=="card"?"标签模式":"卡片模式"}}
        </a>
      </div>
    </div>
    <div class="component-selected-display-outbox" :class="{'min-csd-outbox':listType=='tag'}">
      <div class="component-selected-display-box" v-for="(item,index) in listData" :key="index">
        <div class="csd-item-img-container">
          <img v-if="item.modulePreviewImgObject.length>0" :style="getStyle('itemimg',item.modulePreviewImgObject[0])" :src="IDM.url.getWebPath(item.modulePreviewImgObject[0].ourl)"/>
          <div class="csd-item-img-preview-button" v-if="propData.showPreviewButton" @click="previewComponent(item)">点击预览</div>
          <div class="csd-item-img-count-box" @click="showModal(item)">
            <svg t="1634889265711" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10905"><path d="M833.4016 222.45546667H82.56746667c-26.30506667 0-47.70133333 21.5104-47.70133334 48.04906666v588.0608c0 26.47253333 21.39626667 48.0416 47.70133334 48.0416h750.8352c26.3328 0 47.6928-21.54666667 47.6928-48.0416V270.47466667c-0.05653333-26.5696-21.36-48.0192-47.69386667-48.0192z m-47.6768 96.02453333V751.34933333L676.6784 618.0576c-4.02346667-4.86506667-11.11786667-5.75573333-16.20906667-2.0288l-126.84586666 93.26506667-217.8016-213.3504c-2.5344-2.49493333-6.03306667-3.584-9.42293334-3.3632-3.54773333 0.31146667-6.67306667 2.1952-8.66773333 5.06133333L130.2528 738.92266667V318.48h655.472z m-286.02773333 180.032c0-43.03466667 34.752-78.0448 77.44426666-78.0448 42.7424 0 77.43573333 35.0112 77.43573334 78.0448 0 42.93333333-34.69333333 77.97653333-77.43573334 77.97653333-42.69226667 0-77.44426667-35.0432-77.44426666-77.97653333z m450.928 233.98186667c-19.74293333 0-35.7472-16.12693333-35.7472-35.96373334V188.42133333H171.97546667c-19.74293333 0-35.73333333-16.0736-35.73333334-35.9584 0-19.86986667 15.9904-35.9584 35.73333334-35.9584h778.6496c19.73013333 0 35.76426667 16.08853333 35.76426666 35.9584v544.11093334c-0.00106667 19.79306667-16.03413333 35.92-35.76426666 35.92z" p-id="10906"></path></svg>
            {{item.modulePreviewImgObject.length}}
          </div>
        </div>
        <div class="csd-item-info-container">
          <div class="csd-item-info-title">
              {{item.moduleComName}}
          </div>
          <div class="csd-item-info-version">
            {{item.codePackageVersion}}
          </div>
          <div class="csd-item-info-classid">
            {{item.moduleClassName}}
          </div>
        </div>
        <!--移除-->
        <div class="csd-item-remove-button" @click="removeSelectedItem(item,index)">
          <svg t="1635747501911" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4511"><path d="M580.82424219 512.55757531L944.751515 148.64242438c18.3757575-18.3757575 18.3757575-48.65454562 0-67.03030313l-1.98787875-1.98787875c-18.3757575-18.3757575-48.65454562-18.3757575-67.03030313 0L511.80606031 444.048485 147.89090937 79.6242425c-18.3757575-18.3757575-48.65454562-18.3757575-67.03030312 0l-1.98787875 1.98787875c-18.86060625 18.3757575-18.86060625 48.65454562 0 67.03030313l363.92727281 363.92727281L78.8727275 876.48484812c-18.36363656 18.3757575-18.36363656 48.65454562 0 67.03030313l1.98787875 1.98787875c18.3757575 18.3757575 48.65454562 18.3757575 67.03030313 0L511.80606031 581.57575719l363.92727281 363.91515187c18.3757575 18.3757575 48.65454562 18.3757575 67.03030313 0l1.98787875-1.98787875c18.3757575-18.3757575 18.3757575-48.65454562 0-67.03030312L580.82424219 512.55757531z m0 0" p-id="4512"></path></svg>
        </div>
      </div>
    </div>
    <a-modal
      :title="'【'+CurrentModuleObject.moduleComName+'】效果图预览'"
      :visible="visible"
      cancelText="关闭"
      okText=""
      width="848px"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="csd-item-img-box">
        <template v-for="(item,index) in CurrentModuleObject.modulePreviewImgObject" >
          <img :src="IDM.url.getWebPath(item.ourl)" :key="index"/>
          <p :key="index">图{{index+1}}：{{item.name}}</p>
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
  name: 'IComponentSelectedDisplay',
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{},
      listData:[],
      visible:false,
      //当前预览图片的组件对象
      CurrentModuleObject:{},
      listType:"tag"
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    if(this.moduleObject.env=="develop"){
      //开发模式下给例子数据
      this.listData=[{
        "codePackageClassName":"forms",
        "codePackageVersion":"1.0.0",
        "moduleClassName":"IDemo",
        "moduleClassId":"idm.componet.forms.idemo",
        "moduleComName":"例子数据",
        "moduleComLangue":"Vue",
        "moduleComType":"vue",
        "moduleGroupId":"jczj",
        "moduleBelongId":"xmzj",
        "moduleIconFont":"idmicon idm-icon-duohangshurukuang",
        "modulePreviewImgJson":"[]",
        "modulePreviewImgObject":[],
        "rowState":0,
        "isEditName":false,
        "isModify":0,
        "itemIndex":3
      },{
        "codePackageClassName":"forms",
        "codePackageVersion":"1.0.0",
        "moduleClassName":"IDemo",
        "moduleClassId":"idm.componet.forms.idemo",
        "moduleComName":"例子数据",
        "moduleComLangue":"Vue",
        "moduleComType":"vue",
        "moduleGroupId":"jczj",
        "moduleBelongId":"xmzj",
        "moduleIconFont":"idmicon idm-icon-duohangshurukuang",
        "modulePreviewImgJson":"[]",
        "modulePreviewImgObject":[],
        "rowState":0,
        "isEditName":false,
        "isModify":0,
        "itemIndex":3
      }];
    }
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
  },
  mounted() {
  },
  destroyed() {},
  methods:{
    showModal(item) {
      if(!item.modulePreviewImgObject||(item.modulePreviewImgObject&&item.modulePreviewImgObject.length==0)){
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
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject();
      console.log("组件内属性发生变化，变化后====》",this.propData);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      this.listType = this.propData.cardStyle||"tag";
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
              styleObject[key]=element;
              break;
            case "imgWidth":
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .csd-item-img-container",{
                "width":element
              });
              break;
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "cardBox":
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
            case "box":
              let styleObject1 = {};
              if(element.marginTopVal){
                styleObject1["margin-top"]=`${element.marginTopVal}`;
              }
              if(element.marginRightVal){
                styleObject1["margin-right"]=`${element.marginRightVal}`;
              }
              if(element.marginBottomVal){
                styleObject1["margin-bottom"]=`${element.marginBottomVal}`;
              }
              if(element.marginLeftVal){
                styleObject1["margin-left"]=`${element.marginLeftVal}`;
              }
              if(element.paddingTopVal){
                styleObject1["padding-top"]=`${element.paddingTopVal}`;
              }
              if(element.paddingRightVal){
                styleObject1["padding-right"]=`${element.paddingRightVal}`;
              }
              if(element.paddingBottomVal){
                styleObject1["padding-bottom"]=`${element.paddingBottomVal}`;
              }
              if(element.paddingLeftVal){
                styleObject1["padding-left"]=`${element.paddingLeftVal}`;
              }
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-selected-display-outbox",styleObject1);
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
              
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .csd-item-img-container",{
                "border-top-left-radius":styleObject["border-top-left-radius"],
                "border-bottom-left-radius":styleObject["border-bottom-left-radius"]
              });
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .csd-item-img-preview-button",{
                "border-top-left-radius":styleObject["border-top-left-radius"],
                "border-bottom-right-radius":styleObject["border-bottom-right-radius"]
              });
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
            case "subFont":
              let styleObject2 = {};
              styleObject2["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject2["color"]=element.fontColors.hex8;
              }
              styleObject2["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject2["font-style"]=element.fontStyle;
              styleObject2["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject2["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject2["text-align"]=element.fontTextAlign;
              styleObject2["text-decoration"]=element.fontDecoration;
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-selected-display-box .csd-item-info-container .csd-item-info-version",styleObject2);
              break;
            case "moduleTitleFont":
              let styleObject3 = {};
              styleObject3["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject3["color"]=element.fontColors.hex8;
              }
              styleObject3["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject3["font-style"]=element.fontStyle;
              styleObject3["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject3["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject3["text-align"]=element.fontTextAlign;
              styleObject3["text-decoration"]=element.fontDecoration;
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-selected-display-titlefont span",styleObject3);
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-selected-display-box",styleObject);
      let imgWidth = this.propData.imgWidth||"100px",boxWidth = this.propData.width||"250px";
      window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-selected-display-box .csd-item-info-container",{
        "width":"calc("+boxWidth+" - "+imgWidth+")"
      });
    },
    /**
     * 预览组件
     */
    previewComponent(itemData){
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
      var clickFunction = this.propData.previewClickFunction;
      clickFunction&&clickFunction.forEach(item=>{
        window[item.name]&&window[item.name].call(this,{
          urlData:urlObject,
          pageId,
          customParam:item.param,
          _this:this,
          itemData
        });
      })
      // window.open(IDM.url.getWebPath("@"+item.codePackageClassName+"/"+item.codePackageVersion+"/index.html#/?className="+item.moduleClassName))
    },
    formatSourceData(data){
      var filedExp = this.propData.dataFiled;
      if(!filedExp){
        this.listData = data;
      }else{
        var dataObject = {IDM:window.IDM,...data};
        var _defaultVal = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
        this.listData = _defaultVal;
      }
    },
    /**
     * 删除item
     */
    removeSelectedItem(itemObject,itemIndex){
      //移除
      if(itemObject){
        this.listData.splice(itemIndex,1);
      }else{
        this.listData=[];
      }
      this.$forceUpdate();
      
      if(this.propData.linkageResultPageModule&&this.propData.linkageResultPageModule.length>0){
        var moduleIdArray = [];
        this.propData.linkageResultPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageResult",
          message:{
            type:itemObject?"remove":"removeAll",
            itemObject
          },
          rangeModule:moduleIdArray,
          triggerType:'MT'
        })
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
      console.log("组件收到消息:"+this.moduleObject.packageid, object);
      if(object.type&&object.type=="linkageDemand"){
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
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：获取需要返回的值，返回格式如下
     * @return {
     *    type:"success",
     *    message:"type为失败的时候原因",
     *    key:"定义的key标识，一般组件定义了一个属性，然后获取指定属性填写的值，这样返回后就能识别对应的字段或者元数据",
     *    data:{要返回的值，内容为：字符串 or 数组 or 对象},
     * }
     */
    getContextValue(){
      let result = {
        type: "success",
        message: "",
        key: this.propData.formFiledKey || this.propData.ctrlId,
      };
      if (this.listData.length==0&&this.propData.noSelectMessage) {
        result.type = "error";
        result.message = "未选中任何一项内容";
        IDM.message["warning"](this.propData.noSelectMessage)
      } else {
        result.data = this.listData;
      }
      return result;
    },
    getStyle(key,object){
        let styles = {};
        switch (key) {
            case "itemimg":
                if(object){
                    let imgObject=object;
                    let propWidth = this.propData.imgWidth,
                    propHeight = 70,
                    imgWidth = parseInt(imgObject.width),
                    imgHeight = parseInt(imgObject.height);
                    if(propWidth&&propWidth!="auto"){
                      if(imgWidth/imgHeight<parseInt(propWidth)/propHeight){
                        styles["width"]="100%";
                        styles["min-height"]="100%";
                        //公式：(图片高度/(图片宽度/容器宽度)-容器高度)/2
                        styles["margin-top"]="-"+(imgHeight/(imgWidth/parseInt(propWidth))-propHeight)/2+"px";
                      }else{
                        styles["height"]="100%";
                        styles["min-width"]="100%";
                        //公式：(图片宽度/(图片高度/容器高度)-容器宽度)/2
                        styles["margin-left"]="-"+(imgWidth/(imgHeight/propHeight)-parseInt(propWidth))/2+"px";
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
}
</script>
<style lang="scss">
.component-selected-display-outbox{
  display: flex;
  flex-wrap: wrap;
  .component-selected-display-box{
    background-color: #ffffff;
    border-radius: 5px;
    width: 250px;
    transition: all linear 0.3s;
    position: relative;
    display: flex;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.15);
    .csd-item-img-container{
      position: relative;
      width: 100px;
      height: 70px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      overflow: hidden;
      .csd-item-img-count-box{
        position: absolute;
        right: 5px;
        bottom: 5px;
        background-color: rgba(0, 0, 0, 0.25);
        color: white;
        height: 18px;
        line-height: 18px;
        border-radius: 10px;
        padding: 0px 7px;
        z-index: 2;
        cursor: pointer;
        font-size: 12px;
        svg{
          fill: currentColor;
          width: 12px;
          max-height: 12px;
          vertical-align: -2px;
        }
      }
      .csd-item-img-preview-button{
        position: absolute;
        left: 0;
        top: 0;
        width: 60px;
        height: 20px;
        line-height: 20px;
        border-top-left-radius: 5px;
        border-bottom-right-radius: 5px;
        text-align: center;
        color: rgba(255,255,255,0.85);
        z-index: 2;
        cursor: pointer;
        transition: all linear 0.3s;
        background-color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
        // opacity: 0;
        // &:hover{
        //   background: white;
        //   color: #333;
        // }
      }
    }
    .csd-item-info-container{
      border-left: 1px solid #F2F2F2;
      padding: 5px 10px;
      width: 150px;
      &>div{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        position: relative;
      }
      .csd-item-info-title{
        font-size: 14px;
        font-weight: bold;
      }
      .csd-item-info-version{
        font-size: 12px;
        color: #999;
        height: 18px;
        // padding:5px 0px;
      }
      .csd-item-info-classid{
        color: #40A9FF;
      }
    }
    .csd-item-remove-button{
      position: absolute;
      right: -12px;
      top: -12px;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.15);
      text-align: center;
      background-color: white;
      cursor: pointer;
      color: #aaaaaa;
      transition: all linear 0.3s;
      svg{
        fill: currentColor;
        width: 12px;
        max-height: 12px;
        vertical-align: -3px;
      }
      &:hover{
        color: #666666;
      }
    }
  }
}
.min-csd-outbox{
  .component-selected-display-box{
    width: auto !important;
    .csd-item-img-container{
      display: none;
    }
    .csd-item-info-container{
      width: auto !important;
      .csd-item-info-version{
        display: none;
      }
      .csd-item-info-classid{
        display: none;
      }
    }
    .csd-item-remove-button{
      right: -9px;
      top: -9px;
      width: 18px;
      height: 18px;
      border-radius: 9px;
      svg{
        width: 10px;
        max-height: 10px;
        vertical-align: 1px;
      }
    }
  }
}
.component-selected-display-title{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .component-selected-display-titlefont{
    span{
      font-size: 16px;
    }
  }
  .component-selected-display-switch{
      svg{
        margin-right: 1px;
        fill: currentColor;
        width: 16px;
        max-height: 16px;
        vertical-align: -3px;
      }
  }
}
.csd-item-img-box{
  width: 800px;
  height: 500px;
  overflow: auto;
  text-align: center;
  img{
    max-width: 100%;
    margin-bottom: 5px;
  }
  p{
    margin-bottom: 10px;
  }
}
</style>