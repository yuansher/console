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
    <div class="component-card-item-outbox">
      <div class="component-card-item-box" v-for="(item,index) in listData||[]" :key="index">
        <div class="cc-item-img-container">
          <img v-if="item.modulePreviewImgObject.length>0" :style="getStyle('itemimg',item.modulePreviewImgObject[0])" :src="IDM.url.getWebPath(item.modulePreviewImgObject[0].ourl)"/>
          <div class="cc-item-img-shade"></div>
          <div class="cc-item-img-preview-button" v-if="propData.showPreviewButton" @click="previewComponent(item)">点击预览</div>
          <div class="cc-item-img-count-box" @click="showModal(item)">
            <svg t="1634889265711" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10905"><path d="M833.4016 222.45546667H82.56746667c-26.30506667 0-47.70133333 21.5104-47.70133334 48.04906666v588.0608c0 26.47253333 21.39626667 48.0416 47.70133334 48.0416h750.8352c26.3328 0 47.6928-21.54666667 47.6928-48.0416V270.47466667c-0.05653333-26.5696-21.36-48.0192-47.69386667-48.0192z m-47.6768 96.02453333V751.34933333L676.6784 618.0576c-4.02346667-4.86506667-11.11786667-5.75573333-16.20906667-2.0288l-126.84586666 93.26506667-217.8016-213.3504c-2.5344-2.49493333-6.03306667-3.584-9.42293334-3.3632-3.54773333 0.31146667-6.67306667 2.1952-8.66773333 5.06133333L130.2528 738.92266667V318.48h655.472z m-286.02773333 180.032c0-43.03466667 34.752-78.0448 77.44426666-78.0448 42.7424 0 77.43573333 35.0112 77.43573334 78.0448 0 42.93333333-34.69333333 77.97653333-77.43573334 77.97653333-42.69226667 0-77.44426667-35.0432-77.44426666-77.97653333z m450.928 233.98186667c-19.74293333 0-35.7472-16.12693333-35.7472-35.96373334V188.42133333H171.97546667c-19.74293333 0-35.73333333-16.0736-35.73333334-35.9584 0-19.86986667 15.9904-35.9584 35.73333334-35.9584h778.6496c19.73013333 0 35.76426667 16.08853333 35.76426666 35.9584v544.11093334c-0.00106667 19.79306667-16.03413333 35.92-35.76426666 35.92z" p-id="10906"></path></svg>
            {{item.modulePreviewImgObject.length}}
          </div>
          <!--顶部的原组件名称、删除按钮-->
          <div v-if="propData.showLeftTopTitle&&item.moduleOriginalName" class="cc-item-img-source-name">
            {{item.moduleOriginalName}}
          </div>
          <div v-if="propData.showRemoveButton" @click="removeItem(item,index)" class="cc-item-img-delete-btn">
            {{propData.removeButtonFont}}
          </div>
        </div>
        <div class="cc-item-info-container">
          <div class="cc-item-info-title">
            <div v-if="!item.isEditName" class="cc-item-info-title-comname">
              {{item.moduleComName}}
              <span v-if="propData.showEditTitleIcon" title="点击修改" @click="changeNameEdit(item)"><svg t="1634993939644" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11559"><path d="M872 137.6L791.08571469 56.68571469a93.94285688 93.94285688 0 0 0-132.34285781 5.48571375L124.57142844 596.34285688a27.42857156 27.42857156 0 0 0-8.22857156 15.08571468l-56.22857157 218.05714313a30.85714312 30.85714312 0 0 0 8.91428625 30.17142844 30.17142844 30.17142844 0 0 0 30.17142844 7.54285687l218.05714313-56.22857156a34.97142844 34.97142844 0 0 0 15.08571375-7.54285688l534.17142843-531.42857156a92.57142844 92.57142844 0 0 0 5.48571469-137.14285688zM136.22857156 791.77142844l39.08571375-154.28571375 115.2 114.51428531z m200.91428532-84.34285688l-116.57142844-116.57142843 398.4-397.71428625 115.88571469 116.57142843z m483.42857156-480l-39.77142844 40.45714313-116.57142844-116.57142938 40.45714313-40.45714218A30.17142844 30.17142844 0 0 1 745.14285687 100.57142844l80.22857157 82.28571469a30.17142844 30.17142844 0 0 1-4.8 41.14285687z" p-id="11560"></path><path d="M32 923.42857156m34.28571469 0l891.42857062 0q34.28571469 0 34.28571469 34.28571375l0 0q0 34.28571469-34.28571469 34.28571469l-891.42857062 0q-34.28571469 0-34.28571469-34.28571469l0 0q0-34.28571469 34.28571469-34.28571375Z" p-id="11561"></path></svg></span>
            </div>
            <div v-else>
              <a-input placeholder="请输入" autoFocus @blur="item.isEditName=false;onInputSave(item)" v-model="item.moduleComName" size="small">
              </a-input>
            </div>
            <div class="cc-item-info-title-version" :title="propData.titleShowTipContent">{{item.codePackageVersion||item.moduleNewVersion}}</div>
          </div>
          <div v-if="propData.showSubTitle" class="cc-item-info-subtitle">
            {{item.moduleRemark}}
          </div>
          <div class="cc-item-info-tags">
            <a-tag v-if="item.moduleBelongText||getCode(item.moduleBelongId)">
              {{item.moduleBelongText||getCode(item.moduleBelongId)}}
            </a-tag>
            <a-tag v-if="item.moduleGroupText||getCode(item.moduleGroupId)">
              {{item.moduleGroupText||getCode(item.moduleGroupId)}}
            </a-tag>
            <a-tag v-if="item.moduleTypeText||getCode(item.moduleType)">
              {{item.moduleTypeText||getCode(item.moduleType)}}
            </a-tag>
          </div>
          <div class="cc-item-info-classid">
            <div class="cc-item-info-classid-font">类名：<span>{{item.moduleClassName}}</span></div>
            <div class="cc-item-info-button" v-if="propData.buttonList&&propData.buttonList.length>0">
              <template v-for="(bitem,bindex) in propData.buttonList" >
                <a-button v-if="bitem.buttonName" :key="bindex" :type="bitem.buttoType" shape="round" size="small" @click="clickButtonHandle(item,bitem)">{{bitem.buttonName}}</a-button>
              </template>
            </div>
          </div>
        </div>
        <!--选择的样式-->
        <div v-if="propData.cardIsSelect" class="cc-item-layer-shadow" :class="{'item-checked':item.idmItemChecked}"></div>
        <div v-if="propData.cardIsSelect" class="cc-item-check-icon" :class="{'item-checked':item.idmItemChecked}" @click="changeCheckStatusHandle(item,index)">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="63648"><path d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 73.142857a438.857143 438.857143 0 1 0 0 877.714286A438.857143 438.857143 0 0 0 512 73.142857z m277.577143 219.428572l14.994286 35.108571C641.097143 480.109714 507.245714 694.857143 464.822857 804.571429L219.428571 551.058286l62.902858-51.2L424.228571 612.937143l16.822858-19.748572C505.124571 518.582857 626.907429 393.654857 789.504 292.571429z" p-id="63649"></path></svg>
        </div>
      </div>
      <div v-if="!listData||(listData&&listData.length==0)" style="text-align: center;width:100%">
        <a-spin v-if="listData==undefined" />
        <a-empty v-else :image-style="{margin: '10px auto'}" :description="propData.emptyDescription||'暂无数据'"/>
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
      <div class="cc-item-img-box">
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
  name: 'IComponentCardItem',
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{},
      listData:undefined,
      visible:false,
      //当前预览图片的组件对象
      CurrentModuleObject:{},
      //当前已选择的数组，提供内容选择的存储
      CurrentCheckedArray:[]
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
    changeNameEdit(item){
      item.isEditName=true;
      //点击不更新，暂时使用强制刷新
      this.$forceUpdate();
    },
    removeItem(itemData,index) {
      let that = this;
      if(!this.propData.removeConfirmFont){
        that.removeItemLater(itemData,index);
        return;
      }
      this.$confirm({
        title: this.propData.removeConfirmFont,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.removeItemLater(itemData,index);
        },
        onCancel() {
        }
      });
    },
    /**
     * 移除事件
     */
    removeItemLater(itemData,index){
      let that = this;
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      //移除数据
      if(this.propData.removeActionType=="customInterface"){
        //自定义接口
        var removeInterfaceUrl = this.propData.removeInterfaceUrl;
        removeInterfaceUrl&&window.IDM.http.post(removeInterfaceUrl, {
          urlData:urlObject,
          pageId,
          itemData
        },{
          headers:this.propData.removeInterfaceContentType?{
              "Content-Type": this.propData.removeInterfaceContentType||"application/json;charset=UTF-8"
            }:{}
        }).then((res) => {
          //调用后续自定义函数
          that.removeRunLaterHandle(res);
        })
        .catch(function (error) {
        })
      }else if(this.propData.removeActionType=="customFunction"){
        //自定义函数
        /**
         * [
         * {name:"",param:{}}
         * ]
         */
        var removeClickFunction = this.propData.removeClickFunction;
        removeClickFunction.forEach(item=>{
          window[item.name]&&window[item.name].call(this,{
            urlData:urlObject,
            pageId,
            itemData,
            customParam:item.param,
            _this:this,
            callback:this.removeRunLaterHandle
          });
        })
      }
    },
    /**
     * 移除按钮动作后的执行函数
     */
    removeRunLaterHandle(res){
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      if(this.propData.removeRunLaterFunction&&this.propData.removeRunLaterFunction.length>0){
        var removeRunLaterFunction = this.propData.removeRunLaterFunction;
        removeRunLaterFunction.forEach(item=>{
          window[item.name]&&window[item.name].call(this,{
            urlData:urlObject,
            pageId,
            customParam:item.param,
            _this:this,
            resData:res
          });
        })
      }
    },
    /**
     * 标题文本框失去焦点事件
     */
    onInputSave(itemData){
      //点击不更新，暂时使用强制刷新
      this.$forceUpdate();
      if(!itemData.moduleComName){
        itemData.moduleComName = itemData.moduleOriginalName;
        IDM.message["warning"]("不能为空，已为你替换原名称!")
        return;
      }
      let that = this;
      if(this.moduleObject.env=="develop"){
        //开发模式下不执行此事件
        return;
      }
      //获取所有的URL参数、页面ID（pageId）、以及所有组件的返回值（用范围值去调用IDM提供的方法取出所有的组件值）
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      // console.log(item.moduleComName);
      //保存标题
      if(this.propData.editTitleActionType=="customInterface"){
        //自定义接口
        var editTitleInterfaceUrl = this.propData.editTitleInterfaceUrl;
        editTitleInterfaceUrl&&window.IDM.http.post(editTitleInterfaceUrl, {
          urlData:urlObject,
          pageId,
          itemData
        },{
          headers:this.propData.editTitleInterfaceContentType?{
              "Content-Type": this.propData.editTitleInterfaceContentType||"application/json;charset=UTF-8"
            }:{}
        }).then((res) => {
          //调用后续自定义函数
          // that.commitRunLaterHandle(res);
        })
        .catch(function (error) {
        })
      }else if(this.propData.editTitleActionType=="customFunction"){
        //自定义函数
        /**
         * [
         * {name:"",param:{}}
         * ]
         */
        var editTitleSaveFunction = this.propData.editTitleSaveFunction;
        editTitleSaveFunction.forEach(item=>{
          window[item.name]&&window[item.name].call(this,{
            urlData:urlObject,
            pageId,
            itemData,
            customParam:item.param,
            _this:this
            // callback:this.commitRunLaterHandle
          });
        })
      }
    },
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
    //临时方法
    getCode(code){
      let result = "";
      switch (code) {
        case "bjzj":
          result="布局组件";
          break;
        case "jczj":
          result="基础组件";
          break;
        case "bdzj":
          result="表单组件";
          break;
        case "gjzj":
          result="高级组件";
          break;
        case "tbzj":
          result="图表组件";
          break;
        case "qtzj":
          result="其他组件";
          break;
        case "ptzj":
          result="平台组件";
          break;
        case "xmzj":
          result="项目组件";
          break;
        case "0":
          result="PC";
          break;
        case "1":
          result="移动端";
          break;
        case "2":
          result="响应式";
          break;
        case "kjym":
          result="框架页面";
          break;
        case "syym":
          result="首页页面";
          break;
        case "lbym":
          result="列表页面";
          break;
        case "bdym":
          result="表单页面";
          break;
        case "ybym":
          result="一般页面";
          break;
        case "qtym":
          result="其他页面";
          break;
        case "ptym":
          result="平台页面";
          break;
        case "xmym":
          result="项目页面";
          break;
      }
      return result;
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
            case "height":
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .cc-item-img-container",{
                "height":element
              });
              break;
            case "subTitleHeight":
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .cc-item-info-subtitle",{
                "height":element+"px"
              });
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
              
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .cc-item-img-container",{
                "border-top-left-radius":styleObject["border-top-left-radius"],
                "border-top-right-radius":styleObject["border-top-right-radius"]
              });
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .cc-item-layer-shadow",{
                "border-top-left-radius":styleObject["border-top-left-radius"],
                "border-top-right-radius":styleObject["border-top-right-radius"],
                "border-bottom-left-radius":styleObject["border-bottom-left-radius"],
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
              var styleObject1 = {};
              styleObject1["font-family"]=element.fontFamily;
              if(element.fontColors.hex8){
                styleObject1["color"]=element.fontColors.hex8;
              }
              styleObject1["font-weight"]=element.fontWeight&&element.fontWeight.split(" ")[0];
              styleObject1["font-style"]=element.fontStyle;
              styleObject1["font-size"]=element.fontSize+element.fontSizeUnit;
              styleObject1["line-height"]=element.fontLineHeight+(element.fontLineHeightUnit=="-"?"":element.fontLineHeightUnit);
              styleObject1["text-align"]=element.fontTextAlign;
              styleObject1["text-decoration"]=element.fontDecoration;
              window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-card-item-box .cc-item-info-subtitle",styleObject1);
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id +" .component-card-item-box",styleObject);
    },
    formatSourceData(data){
      if(this.listData==undefined){
        this.listData = [];
      }
      var filedExp = this.propData.dataFiled;
      var dataObject = {IDM:window.IDM,...data};
      var _defaultVal = window.IDM.express.replace.call(this, "@["+filedExp+"]", dataObject);
      if(this.propData.showCurrentPage){
        _defaultVal.forEach(item=>{
          item.modulePreviewImgObject = JSON.parse(item.modulePreviewImgJson||"[]");
          item.isEditName = false;
          item.idmItemChecked = _.findIndex(this.CurrentCheckedArray,item)>-1;
        })
        this.listData = _defaultVal;
      }else{
        _defaultVal.forEach(item=>{
          item.modulePreviewImgObject = JSON.parse(item.modulePreviewImgJson||"[]");
          item.isEditName = false;
          item.idmItemChecked = _.findIndex(this.CurrentCheckedArray,item)>-1;
          this.listData.push(item);
        })
      }
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
    clickButtonHandle(itemData,buttonItem){
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
      var clickFunction = buttonItem.buttonClickFunction;
      clickFunction&&clickFunction.forEach(item=>{
        window[item.name]&&window[item.name].call(this,{
          urlData:urlObject,
          pageId,
          customParam:item.param,
          _this:this,
          itemData
        });
      })
    },
    /**
     * 选中改变事件
     */
    changeCheckStatusHandle(item,index){
      item.idmItemChecked=!item.idmItemChecked;
      if(item.idmItemChecked){
        this.CurrentCheckedArray.push(_.cloneDeep(item))
      }else{
        //移除
        this.CurrentCheckedArray.forEach(sitem=>sitem.idmItemChecked=false);
        let itemIndex = _.findIndex(this.CurrentCheckedArray,item);
        if(itemIndex>-1){
          this.CurrentCheckedArray.splice(itemIndex,1);
        }
      }
      this.$forceUpdate();
      this.sendItemCheckMsg();
    },
    /**
     * 选中改变事件
     */
    changeAllCheckStatusHandle(){
      let changeCount = 0;
      this.listData.forEach(sitem=>{
        if(!sitem.idmItemChecked){
          sitem.idmItemChecked = true;
          this.CurrentCheckedArray.push(_.cloneDeep(sitem));
          changeCount++;
        }
      });
      if(changeCount>0){
        this.$forceUpdate();
        this.sendItemCheckMsg();
      }
    },
    /**
     * 发送已选变更消息
     */
    sendItemCheckMsg(){
      if(this.propData.linkageDemandPageModule&&this.propData.linkageDemandPageModule.length>0){
        var moduleIdArray = [];
        this.propData.linkageDemandPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
        this.sendBroadcastMessage({
          type:"linkageDemand",
          message:this.CurrentCheckedArray,
          rangeModule:moduleIdArray,
          triggerType:'MT'
        })
      }
    },
    /**
     * 结果值
     */
    valueBind(byValData){
      let that = this;
      if(this.echoValue!=null){
        this.echoValue=null;
        return;
      }
      switch (this.propData.resType) {
        case "none":
          if(byValData&&byValData.type){
            if(byValData.type=="remove"&&byValData.itemObject){
              //单个移除
              byValData.itemObject.idmItemChecked = false;
              this.CurrentCheckedArray.forEach(sitem=>sitem.idmItemChecked=false);
              let itemIndex = _.findIndex(this.CurrentCheckedArray,byValData.itemObject);
              if(itemIndex>-1){
                this.CurrentCheckedArray.splice(itemIndex,1);
              }
              //取消选中效果
              byValData.itemObject.idmItemChecked = true;
              itemIndex = _.findIndex(this.listData,byValData.itemObject);
              if(itemIndex>-1){
                this.listData[itemIndex].idmItemChecked = false;
              }
            }else if(byValData.type=="removeAll"){
              //移除全部
              this.CurrentCheckedArray=[];
              this.listData.forEach(sitem=>sitem.idmItemChecked=false);
            }
            this.$forceUpdate();
            this.sendItemCheckMsg();
          }
          break;
        case "customFun":
          if(this.propData.resFunction&&this.propData.resFunction.length>0){
            try {
              window[this.propData.resFunction[0].name]&&window[this.propData.resFunction[0].name].call(this,{...this.propData.resFunction[0].param,moduleObject:this.moduleObject,byVal:byValData,_this:this});
            } catch (error) {
            }
          }
          break;
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
      }else if(object.type&&object.type=="linkageResult"){
        //结果值设置
        this.valueBind(object.message)
      }else if(object.type&&object.type=="linkageClick"){
        if(object.messageKey&&object.messageKey=="selectAll"){
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
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
    getStyle(key,object){
        let styles = {};
        switch (key) {
            case "itemimg":
                if(object){
                    let imgObject=object;
                    if(this.propData.width&&this.propData.height&&this.propData.width!="auto"&&this.propData.height!="auto"){
                      if(parseInt(imgObject.width)/parseInt(imgObject.height)<parseInt(this.propData.width)/parseInt(this.propData.height)){
                        styles["width"]="100%";
                        styles["min-height"]="100%";
                        //公式：(图片高度/(图片宽度/容器宽度)-容器高度)/2
                        styles["margin-top"]="-"+(parseInt(imgObject.height)/(parseInt(imgObject.width)/parseInt(this.propData.width))-parseInt(this.propData.height))/2+"px";
                      }else{
                        styles["height"]="100%";
                        styles["min-width"]="100%";
                        //公式：(图片宽度/(图片高度/容器高度)-容器宽度)/2
                        styles["margin-left"]="-"+(parseInt(imgObject.width)/(parseInt(imgObject.height)/parseInt(this.propData.height))-parseInt(this.propData.width))/2+"px";
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
.component-card-item-outbox{
  display: flex;
  flex-wrap: wrap;
}
.component-card-item-box{
  background-color: #ffffff;
  border-radius: 5px;
  width: 285px;
  transition: all linear 0.3s;
  position: relative;
  .cc-item-img-container{
    position: relative;
    height: 210px;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
    img{
      // max-width: 100%;
      // min-height: 100%;
    }
    .cc-item-img-shade{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-color: rgba(0,0,0,0.41);
      opacity: 0;
      transition: all linear 0.3s;
    }
    .cc-item-img-count-box{
      position: absolute;
      right: 10px;
      bottom: 10px;
      background-color: rgba(0,0,0,0.45);
      color: white;
      height: 24px;
      line-height: 24px;
      border-radius: 12px;
      padding: 0px 12px;
      z-index: 2;
      cursor: pointer;
      svg{
        fill: currentColor;
        width: 16px;
        max-height: 16px;
        vertical-align: -3px;
      }
    }
    .cc-item-img-preview-button{
      position: absolute;
      left: 50%;
      top: 50%;
      width: 90px;
      height: 24px;
      line-height: 22px;
      border-radius: 11px;
      text-align: center;
      color: rgba(255,255,255,0.85);
      border:1px solid rgba(255,255,255,0.85);
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
    .cc-item-img-source-name,.cc-item-img-delete-btn{
      position: absolute;
      top: 0px;
      color: white;
      font-size: 12px;
      padding: 3px 10px;
      z-index: 2;
      cursor: pointer;
      transition: all linear 0.3s;
    }
    .cc-item-img-source-name{
      left: 0px;
      background-color: rgba(64,169,255,0.7);
      &:hover{
        background-color: rgba(64,169,255,0.9);
      }
      border-bottom-right-radius: 5px;
    }
    .cc-item-img-delete-btn{
      display: none;
      right: 0px;
      background-color: rgba(102,102,102,0.4);
      &:hover{
        background-color: rgba(102,102,102,0.6);
      }
      border-bottom-left-radius: 5px;
    }
  }
  .cc-item-info-container{
    // height: 120px;
    border-top: 1px solid #F2F2F2;
    padding: 10px 16px;
    .cc-item-info-title{
      display: flex;
      justify-content: space-between;
      line-height: 33px;
      .cc-item-info-title-comname{
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 20px;
        position: relative;
        margin-right: 10px;
        font-weight: bold;
        svg{
          cursor: pointer;
          position: absolute;
          right: 0px;
          top: 50%;
          margin-top: -8px;
          color: #cccccc;
          fill: currentColor;
          width: 16px;
          max-height: 16px;
          vertical-align: -3px;
        }
      }
      .cc-item-info-title-version{
        font-size: 12px;
        color: #40A9FF;
      }
    }
    .cc-item-info-subtitle{
      font-size: 14px;
      color: #666;
      height: 42px;
      overflow: hidden;
      // padding:5px 0px;
    }
    .cc-item-info-tags{
      line-height: 33px;
    }
    .cc-item-info-classid{
      display: flex;
      justify-content: space-between;
      line-height: 33px;
      .cc-item-info-classid-font{
        color: #999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        span{
          color: #40A9FF;
        }
      }
      .ant-btn-round.ant-btn-sm{
        height: 22px;
        padding: 0 10px;
        font-size: 12px;
        line-height: 21px;
        border-radius: 22px;
      }
    }
  }
  .cc-item-info-button{
    display: none;
    button{
      margin-left: 6px;
    }
  }
  &:hover{
    box-shadow: 0px 0px 15px rgba(0,0,0,0.15);
    .cc-item-info-button,.cc-item-img-shade,.cc-item-img-preview-button,.cc-item-img-delete-btn{
      display: block;
      opacity: 1;
    }
  }
  //遮罩层
  .cc-item-layer-shadow{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    display: none;
    &.item-checked{
      display: block;
    }
  }
  //选择图标
  .cc-item-check-icon{
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
    opacity: 0.25;
    cursor: pointer;
    &.item-checked{
      opacity: 1;
    }
    svg{
      color: #40A9FF;
      fill: currentColor;
      width: 30px;
      max-height: 30px;
      vertical-align: -3px;
    }
  }
}
.cc-item-img-box{
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