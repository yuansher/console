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
    <div class="online-upgrade-container">
      <div class="ouc-message" v-if="msgType!=''">
        <a-alert :message="msgType=='success'?'升级成功！':'升级失败！'" @close="onClose" closable :description="alertMsg" :type="msgType">
        </a-alert>
      </div>
      <a-spin :spinning="spinning" :tip="spinningTip">
        <a-upload-dragger
            name="file"
            :multiple="false"
            :customRequest="uploadFile"
            :showUploadList="false"
            @change="handleChange"
        >
            <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
            {{propData.hintTitle||'点击或将文件拖拽到这里上传'}}
            </p>
            <p class="ant-upload-hint">
            {{propData.hintSubTitle||'支持单个或批量上传，支持扩展名：.zip'}}
            </p>
            <div class="ant-upload-notice">
                注意事项：<br/>
1、一个代码包一个压缩包，压缩包不能套一层文件夹，以index.html为准，必须要在根目录，例如解压后应该有四个文件(夹)：index.html、lib、static、favicon.ico<br/>
2、不能更改程序打包后的任何文件，否则将会解析升级失败<br/>
3、代码包名（className）、组件名称（className）都是整个平台唯一的，上传之前请确认名称是否已被使用，避免后续出现组件串台问题<br/>
4、上传后会把已经维护的组件添加一个版本，并且会设置该版本为最新版本<br/>
            </div>
          </a-upload-dragger>
        </a-spin>
        <a-modal
          :title="propData.modalTitle"
          :visible="visible"
          :confirm-loading="confirmLoading"
          okText="确定"
          cancelText="取消"
          :bodyStyle="{maxHeight:'500px',overflow:'auto'}"
          :width="800"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <div :style="{ borderBottom: '1px solid #E9E9E9',paddingBottom:'10px',marginBottom:'10px' }">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="checkedValues" @change="onChange" >
            <div v-for="(item,index) in propData.importOptionList" :key="index">
               <a-checkbox :value="item.value">
                <b>{{item.title}}</b>
                <div style="color:#999">
                  {{item.subTitle}}
                </div>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </a-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IOnlineUpgrade',
  data(){
    return {
      moduleObject:{},
      thisValue: [
      ],
      propData:this.$root.propData.compositeAttr||{
        importOptionList:[
          {
            value:"pageUpdateNew",
            title:"更新页面最新版本",
            subTitle:"更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本",
            defaultCheck:true
          },
          {
            value:"pageUpdateNew1",
            title:"更新页面最新版本",
            subTitle:"更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本",
            defaultCheck:false
          },
          {
            value:"pageUpdateNew2",
            title:"更新页面最新版本",
            subTitle:"更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本更新页面最新版本",
            defaultCheck:true
          }
        ]
      },
      spinning:false,
      spinningTip:"正在上传解析升级中...",
      alertMsg:"",
      msgType:"",
      visible: true,
      confirmLoading: false,
      UploadResultInfo:{},
      indeterminate: false,
      optionList:[],
      checkAll:false,
      checkedValues:[]
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
  },
  destroyed() {},
  methods:{
     onChange(checkedValues) {
      console.log('checked = ', checkedValues);
      this.checkAll = checkedValues.length==this.propData.importOptionList.length;
      this.propData.importOptionList&&this.propData.importOptionList.forEach(item=>{
        item.defaultCheck = checkedValues.indexOf(item.value)>-1
      });
    },
    onCheckAllChange(e) {
      debugger
      Object.assign(this, {
        checkedList: e.target.checked ? this.optionList : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      this.propData.importOptionList&&this.propData.importOptionList.forEach(item=>{
        item.defaultCheck=e.target.checked;
      });
      this.initStartCheck();
    },
    initStartCheck(){
      this.checkedValues = [];
      this.propData.importOptionList&&this.propData.importOptionList.forEach(item=>{
        item.defaultCheck&&this.checkedValues.push(item.value)
      });
      this.checkAll = this.checkedValues.length==this.propData.importOptionList.length;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      let that = this;
      this.confirmLoading = true;
      let urlObject = window.IDM.url.queryObject(),
      pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
      if(this.propData.modalClickFunction&&this.propData.modalClickFunction.length>0){
        var modalClickFunction = this.propData.modalClickFunction;
        modalClickFunction.forEach(item=>{
          window[item.name]&&window[item.name].call(this,{
            urlData:urlObject,
            pageId,
            customParam:item.param,
            _this:this,
            checkedValues:this.checkedValues,
            importOptionList:this.propData.importOptionList,
            UploadResultInfo:this.UploadResultInfo,
            done:function(){
              that.visible = false;
              that.confirmLoading = false;
              that.onClose();
            }
          });
        })
      }
      // setTimeout(() => {
      // }, 2000);
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
              var styleObject1={};
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
              
                window.IDM.setStyleToPageHead(this.moduleObject.id+" .online-upgrade-container .ant-upload-notice",styleObject1);
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);

      this.initStartCheck();
      this.visible = this.propData.modalShow;
    },
    // 上传
    uploadFile(file) {
      if(!this.propData.uploadUrl){
        return;
      }
      this.msgType = "";
      let that = this;
      let newObject = {
        uid: new Date().getTime()+window.IDM.uuid(),
        name: file.file.name,
        status: 'uploading',
        // url: IDM.url.getWebPath(resultData.filePath),
      }
      that.spinning = true;
      that.thisValue.push(newObject);
      window.IDM.http.upload(this.propData.uploadUrl,file.file,{"type":"console_uploadfile_ctrl",...IDM.setting.webRoot}).then(res=>{
        var resultData = res.data.data;
        /**
         * 返回结果：
         * {
         * fileName: "tab设置.png"
         * filePath: "/upload/idmfiles\f22081da-9410-40bc-afa0-6b3106c45c1c.png"
         * fileSize: "218KB"
         * }
         */
        // console.log("上传数据结果",resultData);
        that.UploadResultInfo = resultData;
        if(res.data.code=="200"){
          //判断类型
          if(resultData.upgradeType=="setting"){
            //弹出层
            that.visible = true;
          }
          that.alertMsg = resultData.msgText;
          that.msgType = "success";
          //发送消息通知
          if(that.propData.linkageReloadPageModule&&that.propData.linkageReloadPageModule.length>0){
            var moduleIdArray = [];
            that.propData.linkageReloadPageModule.forEach(item=>{moduleIdArray.push(item.moduleId)});
            that.sendBroadcastMessage({
              type:"linkageReload",
              message:resultData,
              rangeModule:moduleIdArray
            })
          }
        }else{
          that.alertMsg = res.data.message;
          that.msgType = "error";
        }
        // newObject.status = "done";
        // newObject.url = IDM.url.getWebPath(resultData.filePath);
        // newObject.ourl = resultData.filePath;
        that.spinning = false;
        // this.visible = !this.visible;
        // this.spinning = !this.spinning;

        // this.$message.success(`${file.file.name} 上传成功.`);
        //挨个提示已经成功实现在线升级导入
      }).catch(err=>{
      console.log("🚀 ~ file: IOnlineUpgrade.vue ~ line 257 ~ window.IDM.http.upload ~ err", err)
        // this.$message.error(`${file.file.name} 上传失败.`);
        // newObject.status = "error";
        that.msgType = "error";
        that.alertMsg = "请求错误，请查看后台日志";
        that.spinning = false;
      });
    },
    handleChange({ fileList }) {
      console.log("🚀 ~ file: IOnlineUpgrade.vue ~ line 265 ~ handleChange ~ fileList", fileList)
      // this.fileList = fileList;
    },
    onClose(){
      setTimeout(() => {
        this.msgType = "";
      }, 500);
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
    }
  }
}
</script>
<style lang="scss">
.online-upgrade-container{
  position: relative;
    .ant-upload-notice{
        text-align: left;
        color: #FF8200;
        padding:20px 100px;
    }
    .ouc-message{
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      z-index: 99;
    }
}
</style>