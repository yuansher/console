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
    <div class="codepackage-list-container">
        <div class="clc-header-box">
            <div>
                当前总共 {{allCount}} 个代码包
            </div>
            <div>
                <a-input-search v-model="serachText" placeholder="搜索代码包..." style="width: 200px" @search="reload()" />
            </div>
        </div>
        <div class="clc-list-box">
          <div class="clc-list-item" v-for="(citem,cindex) in listData" :key="cindex">
            <div class="clc-list-item-header">
              <div>
                <label>{{citem.CLASSNAME}}</label>
                <a-tag color="blue">
                  new version：{{citem.VERSION}}
                </a-tag>
                <a-tag color="blue">
                  {{citem.CODE_LANGUAGE}}
                </a-tag>
              </div>
              <div>
                {{citem.AUTHOR}} · {{citem.LASTTIME}}
              </div>
            </div>
            <div class="clc-list-item-desc" :class="`${!citem.REMARK?'no-content-font':''}`">
              {{citem.REMARK||'该代码包没有任何描述'}}
            </div>
            <div class="clc-list-item-footer">
              <div>
                于 {{formartTime(citem.LASTUPTIME)}} 上传 · <a>下载代码包</a>
              </div>
              <div class="clc-list-item-footer-tjbtn" @click="toggleSubitem(citem)">
               共 <a>{{citem.CONFIG_TEXT&&citem.CONFIG_TEXT.module&&citem.CONFIG_TEXT.module.length||0}}</a> 个组件，<a>{{citem.VERSION_COUNT}}</a> 个版本 <a-icon type="right" v-if="!citem.isOpenSub" /><a-icon type="down" v-if="citem.isOpenSub" />
              </div>
            </div>
            <div class="clc-list-subitem-box" v-if="citem.isOpenSub">
              <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="组件列表">
                  <a-list
                      class="clc-loadmore-list"
                      item-layout="horizontal"
                      :data-source="citem.CONFIG_TEXT&&citem.CONFIG_TEXT.module&&citem.CONFIG_TEXT.module"
                    >
                      <a-list-item slot="renderItem" slot-scope="item">
                        <a slot="actions">预览</a>
                        <a slot="actions">查看属性</a>
                        <a-list-item-meta
                          :description="item.classId"
                        >
                          <a slot="title">{{ item.className }}（{{ item.comName }}）</a>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                </a-tab-pane>
                <a-tab-pane key="2" tab="历史版本">
                  
                  <a-list
                      class="clc-loadmore-list"
                      :loading="citem.versionObject.loading"
                      item-layout="horizontal"
                      :data-source="citem.versionObject.data"
                    >
                      <div
                        v-if="citem.versionObject.showLoadingMore"
                        slot="loadMore"
                        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                      >
                        <a-spin v-if="citem.versionObject.loadingMore" />
                        <a-button v-else @click="getSubList(citem)">
                          加载更多
                        </a-button>
                      </div>
                      <a-list-item slot="renderItem" slot-scope="item">
                        <a slot="actions">下载代码包</a>
                        <a slot="actions">查看详细</a>
                        <a-list-item-meta
                          :description="'共'+(item.CONFIG_TEXT&&item.CONFIG_TEXT.module&&item.CONFIG_TEXT.module.length||0)+'个组件'"
                        >
                          <a slot="title">{{ item.VERSION }}</a>
                        </a-list-item-meta>
                        <div>于 {{formartTime(item.LASTUPTIME,'Y年m月d日 H时i分')}} 上传</div>
                      </a-list-item>
                    </a-list>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
        <div class="clc-load-more-box">
          <a-button v-if="!loaded" @click="getList()">
            加载更多
          </a-button>
          <span v-else>
            没有更多了...
          </span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ICodePackageList',
  data(){
    return {
      pageIndex:1,
      pageNumber:10,
      subPageNumber:10,
      loaded:false,
      listData:[

      ],
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{},
      serachText:"",
      allCount:0
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
    this.reload();
  },
  mounted() {
  },
  destroyed() {},
  methods:{
    formartTime(time){
      return window.IDM.dateFormat(time,'Y年m月d日 H时i分')
    },
    toggleSubitem(item){
      if(item.isOpenSub===undefined){
        item.isOpenSub = true;
      }else{
        item.isOpenSub = !item.isOpenSub;
      }
      if(item.isOpenSub&&!item.versionObject.loading){
        //判断是否有数据了，有的话不用去查了
        item.versionObject.loading = true;
        this.getSubList(item);
      }
    },
    getSubList(item){
      item.versionObject.loadingMore = true;
      window.IDM.http.get("/ctrl/idm/console/fetchCodePackageVersionList",{
        className:item.CLASSNAME,
        startIndex:(item.versionObject.pageIndex-1)*this.subPageNumber,
        pageNumber:this.subPageNumber
        })
        .then((res) => {
          if (res.data.code == 200) {
            item.versionObject.pageIndex=item.versionObject.pageIndex+1;

            item.versionObject.data = item.versionObject.data.concat(res.data.data);
            if(res.data.data.length<this.subPageNumber){
              item.versionObject.showLoadingMore = false;
            }
          }else{
            //获取失败
          }
          item.versionObject.loading = false;
          item.versionObject.loadingMore = false;
        })
        .catch(function (error) {
            //获取失败
          item.versionObject.loadingMore = false;
          item.versionObject.loading = false;
        });
    },
    /**
     * 重新加载
     */
    reload(){
      this.pageIndex = 1;
      this.loaded = false;
      this.listData=[];
      this.getList();
    },
    getList(){
      window.IDM.http.get("/ctrl/idm/console/fetchCodePackageList",{serachText:this.serachText,startIndex:(this.pageIndex-1)*this.pageNumber,pageNumber:this.pageNumber})
        .then((res) => {
          if (res.data.code == 200) {
            this.pageIndex=this.pageIndex+1;
            res.data.data.list.forEach(item=>{
              item.isOpenSub = false;
              item.versionObject={
                pageIndex:1,
                loading: false,
                loadingMore: false,
                showLoadingMore: true,
                data:[]
              }
            })
            this.listData = this.listData.concat(res.data.data.list);
            if(res.data.data.list.length<this.pageNumber){
              this.loaded = true;
            }
            if(this.pageIndex==2){
              this.allCount = res.data.data.count;
            }
          }else{
            //获取失败
          }
        })
        .catch(function (error) {
            //获取失败
        });
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
      if(object.type&&object.type=="linkageReload"){
        this.reload();
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
    }
  }
}
</script>
<style lang="scss">
.codepackage-list-container{
    .clc-header-box{
        display: flex;
        justify-content: space-between;
    }
    .clc-list-box{
      .clc-list-item{
        padding: 20px 0px;
        border-bottom: 1px solid #E8E8E8;
        .clc-list-item-header{
          display: flex;
          justify-content: space-between;
          label{
            font-size: 18px;
            font-weight: bold;
            margin-right: 10px;
          }
          font-size: 16px;
        }
        .clc-list-item-desc{
          padding: 15px 0px;
          &.no-content-font{
            color: #ccc;
          }
        }
        .clc-list-item-footer{
          color: #999;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          user-select: none;
          .clc-list-item-footer-tjbtn{
            cursor: pointer;
          }
        }
        .clc-list-subitem-box{
          padding:0px 20px 20px;
          margin-top: 20px;
          background-color: rgba(0,0,0,0.03);
          .ant-tabs-bar{
            margin: 0 0 0px 0;
          }
          .clc-loadmore-list{
            max-height: 400px;
            overflow: auto;
          }
        }
      }
    }
    .clc-load-more-box{
      text-align: center;
      margin-top: 20px;
      color: #aaaaaa;
    }
}
</style>