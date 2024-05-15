<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
  >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <div class="idm-console-cleanspace-env" v-if="currentStep == 1&&backEnvObject.ideaDebug">
      <span>检测到当前环境运行模式为：IntelliJ IDEA的Debug模式，源码程序地址：{{backEnvObject._SRCROOTPATH}}</span>
      <br/><br/>
      请选择是否进行源码程序扫描并清理：
      <a-switch v-model="cleanSrc" />
    </div>
    <div v-if="currentStep == 1" class="idm-console-cleanspace-step-01">
      <div>
        <div class="cleanspace-title-01">畅快清理，清爽一下</div>
        <div class="cleanspace-title-05">
          定期清理，让你的服务器保持在最佳的运行状态
        </div>
        <a-checkbox-group v-model="scanCleanList" name="checkboxgroup">
          <a-checkbox
            v-for="item in scanCleanOptions"
            :class="item.warning ? 'checkbox-label-warning' : ''"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-checkbox>
        </a-checkbox-group>
        <a-alert
          message="橙色选项请谨慎勾选并清理，为避免影响正常使用请手动备份数据库和IDM相关文件夹!!!"
          type="warning"
        />
        <a-button
          type="primary"
          @click="scanButtonClick"
          size="large"
          style="width: 130px; font-size: 18px"
        >
          一键扫描
        </a-button>
      </div>
      <div>
        <img
          :src="
            IDM.url.getModuleAssetsWebPath(
              require('../assets/cleanspaceimg.svg'),
              moduleObject
            )
          "
        />
      </div>
    </div>
    <div v-else class="idm-console-cleanspace-step-02">
      <div class="cleanspace-top-loading-box">
        <div>
          <img
            :src="
              IDM.url.getModuleAssetsWebPath(
                require('../assets/cleanspaceimg.svg'),
                moduleObject
              )
            "
          />
        </div>
        <div class="cleanspace-top-loading-box-center">
          <div
            v-if="currentStep == 2"
            :class="`cleanspace-top-loading-box-title cleanspace-title-02`"
          >
            已发现
            <span>{{ bytesToSize(scanTotalFileSize) }}</span>
            可清理文件，<span>{{ scanTotalDataSize }}</span> 条可清理数据
          </div>
          <div
            v-else-if="currentStep == 3"
            :class="`cleanspace-top-loading-box-title cleanspace-title-02`"
          >
            已选中 <span>{{ computeAllCheckedSize }}</span> 可清理文件，<span>{{
              computeAllCheckedData
            }}</span>
            条可清理数据
          </div>
          <div
            v-if="currentStep == 2"
            class="cleanspace-top-loading-box-remark cleanspace-title-05"
          >
            已经进行 {{ scanLoadTime }} 秒
          </div>
          <div
            v-else
            class="cleanspace-top-loading-box-subtitle cleanspace-title-05"
          >
            共发现 {{ bytesToSize(scanTotalFileSize) }} 可清理文件，{{
              scanTotalDataSize
            }}
            条可清理数据
          </div>
          <a-progress
            v-if="currentStep == 2"
            :percent="
              parseInt(
                ((scanLoadedTypeCopy.length - 1) / scanCleanList.length) * 100
              )
            "
            status="active"
            style="margin-top: 15px"
          />
        </div>
        <div v-if="currentStep == 3">
          <a-button
            size="large"
            @click="cancelScanButtonClick"
            style="width: 130px; font-size: 18px"
          >
            暂不清理
          </a-button>
          <a-button
            type="primary"
            :disabled="computeAllCheckedSize == '0B' && !computeAllCheckedData"
            v-if="currentStep == 3"
            size="large"
            :style="
              computeAllCheckedSize == '0B' && !computeAllCheckedData
                ? 'box-shadow:none'
                : ''
            "
            style="width: 130px; font-size: 18px; margin-left: 20px"
            @click="cleanSpaceShowConfirm"
          >
            立即清理
          </a-button>
        </div>
        <div v-else-if="currentStep == 2">
          <a-button
            size="large"
            @click="cancelScanButtonClick"
            style="width: 130px; font-size: 18px"
          >
            取消扫描
          </a-button>
        </div>
      </div>
      <div class="cleanspace-content-box">
        <a-collapse
          v-model="scanLoadedType"
          :bordered="false"
          :expandIconPosition="'right'"
        >
          <template v-for="item in scanResultList">
            <a-collapse-panel
              :key="item.scanType"
              v-if="scanCleanList.includes(item.scanType)"
              :style="customStyle"
            >
              <div class="cleanspace-content-subbox">
                <!--内容item-->
                <div
                  class="cleanspace-content-subbox-item"
                  v-for="sitem in item.children"
                  :key="sitem"
                >
                  <a-checkbox
                    v-model="sitem.checked"
                    v-if="currentStep == 3"
                    @change="onCheckChange($event, item, sitem)"
                  >
                    {{ sitem.title
                    }}<span class="sub-title">{{ sitem.desc }}</span>
                  </a-checkbox>
                  <span v-else>
                    {{ sitem.title
                    }}<span class="sub-title">{{ sitem.desc }}</span>
                  </span>
                  <!--内容右侧-->
                  <div>
                    <a v-if="sitem.allPathList||sitem.data" href="javascript:;" @click="lookProjectDetail(sitem)">查看详细</a
                    ><span class="ccsi-number">{{
                      sitem.sizeType == "file"
                        ? bytesToSize(sitem.size)
                        : sitem.size + "条"
                    }}</span>
                  </div>
                </div>
                <a-empty v-if="!item.children||!(item.children&&item.children.length)" :description="false" />
              </div>
              <!--标题-->
              <span
                v-if="currentStep == 3"
                class="cleanspace-content-itemtitle"
                @click.stop=""
                slot="header"
              >
                <a-checkbox
                  :indeterminate="item.indeterminate"
                  :checked="item.checkAll"
                  @change="onCheckAllChange($event, item)"
                >
                  {{ item.title }}<span class="sub-title">{{ item.desc }}</span>
                </a-checkbox>
              </span>
              <span v-else class="cleanspace-content-itemtitle" slot="header">
                <a-spin v-if="currentLoadingType == item.scanType" />
                <a-icon
                  v-else
                  :style="
                    scanLoadedTypeCopy.includes(item.scanType)
                      ? 'color:#1890FF'
                      : 'color:#666666'
                  "
                  type="project"
                />
                <span>
                  {{ item.title }}<span class="sub-title">{{ item.desc }}</span>
                </span>
              </span>
              <!--标题右侧-->
              <div
                slot="extra"
                v-if="currentStep == 2"
                class="cleanspace-title-05"
              >
                {{
                  currentLoadingType == item.scanType
                    ? "正在扫描"
                    : scanLoadedTypeCopy.includes(item.scanType)
                    ? "已发现"
                    : "等待扫描"
                }}
                <span v-if="scanLoadedTypeCopy.includes(item.scanType)">{{
                  computeGroupSizeAndData(item)
                }}</span>
              </div>
              <div
                slot="extra"
                v-else-if="currentStep == 3"
                class="cleanspace-title-05"
              >
                <template v-if="computeGroupSizeAndData(item, true)">
                  已选 <span>{{ computeGroupSizeAndData(item, true) }}</span>
                </template>
                <template v-else>
                  可选 {{ computeGroupSizeAndData(item) }}
                </template>
              </div>
            </a-collapse-panel>
          </template>
        </a-collapse>
      </div>
    </div>
    <a-modal
      :visible="visible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      @cancel="handleCancel"
      :bodyStyle="{ padding: '50px' }"
      width="880px"
    >
      <div
        class="cleanspace-top-loading-box-title cleanspace-title-02"
        style="text-align: center"
      >
        <template v-if="cleanEndProjectList.length != cleanProjectList.length">
          正在清理 <span>{{ computeAllCheckedSize }}</span> 垃圾文件，<span>{{
            computeAllCheckedData
          }}</span>
          条垃圾数据
        </template>
        <template v-else>
          清理完成，共清理
          <span>{{ computeAllCheckedSize }}</span> 垃圾文件，<span>{{
            computeAllCheckedData
          }}</span>
          条垃圾数据
        </template>
      </div>
      <div
        class="cleanspace-top-loading-box-subtitle cleanspace-title-05"
        style="text-align: center"
      >
        <template v-if="cleanEndProjectList.length != cleanProjectList.length">
          正在清理 {{ cleanEndProjectList.length }}/{{
            cleanProjectList.length
          }}
          项 | 耗时 {{ cleanTimeTotal }}秒
        </template>
        <template v-else>
          本次清理文件和数据共 {{ cleanProjectList.length }} 项 | 耗时
          {{ cleanTimeTotal }}秒
        </template>
      </div>
      <a-progress
        :percent="
          parseInt((cleanEndProjectList.length / cleanProjectList.length) * 100)
        "
        status="active"
        style="margin-top: 25px"
      />
      <div style="text-align: center; margin-top: 30px">
        <a-button
          size="large"
          @click="stopCleanButtonClick"
          v-if="cleanEndProjectList.length != cleanProjectList.length"
          style="width: 130px; font-size: 18px"
        >
          取消清理
        </a-button>
        <a-button
          size="large"
          @click="okCleanButtonClick"
          v-else
          type="primary"
          style="width: 130px; font-size: 18px"
        >
          好的
        </a-button>
      </div>
    </a-modal>
    <a-modal
      :title="showModalDataObject.title"
      :visible="detailVisible"
      :footer="null"
      @cancel="detailHandleCancel"
      :bodyStyle="{ padding: '0px' }"
      :destroyOnClose="true"
      width="1200px"
    >
      <div style="max-height:70vh;overflow: auto;padding:15px">
          <div v-if="showModalDataObject.allPathList&&showModalDataObject.allPathList.length" style="font-size:18px;font-weight:blod;margin:0px 0 10px 0">【{{showModalDataObject.allPathList&&showModalDataObject.allPathList.length}}条】</div>
        <a-list v-if="showModalDataObject.allPathList" bordered>
          <a-list-item v-for="item in showModalDataObject.allPathList" style="word-break: break-all;" :key="item">
            {{item}} <a :href="IDM.url.getWebPath(item.replace(/\\\\/g,'/').replace(/\\/g,'/').replace(currentRootPath.replace(/\\\\/g,'/').replace(/\\/g,'/'),''))" target="_blank">查看</a>
          </a-list-item>
        </a-list>
        <template v-else-if="IDM.type(showModalDataObject.data)=='array'">
          <div v-if="showModalDataObject.data&&showModalDataObject.data.length" style="font-size:18px;font-weight:blod;margin:0px 0 10px 0">【{{showModalDataObject.data&&showModalDataObject.data.length}}条】</div>
          <a-list bordered>
            <a-list-item v-for="(item,index) in showModalDataObject.data" style="word-break: break-all;" :key="index">
              {{item}} <a v-if="IDM.type(item)=='string'" :href="IDM.url.getWebPath(item.replace(/\\\\/g,'/').replace(/\\/g,'/').replace(currentRootPath.replace(/\\\\/g,'/').replace(/\\/g,'/'),''))" target="_blank">查看</a>
            </a-list-item>
          </a-list>
        </template>
        <template v-else-if="IDM.type(showModalDataObject.data)=='object'">
          <div v-for="(fitem,findex) in Object.keys(showModalDataObject.data)" :key="fitem">
            <div style="font-size:18px;font-weight:blod;margin:20px 0 10px 0" :style="findex==0?'margin:0px 0 10px 0':''">{{fitem}}【{{showModalDataObject.data[fitem].length}}条】</div>
            <a-list bordered>
              <a-list-item v-for="(item,index) in showModalDataObject.data[fitem]" style="word-break: break-all;" :key="index">
                {{item}}
              </a-list-item>
            </a-list>
          </div>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script>
const scanResultListConstant = [
  {
    scanType: "1",
    title: "磁盘垃圾文件",
    desc: "包含在线升级、导入、导出文件等占用磁盘空间的文件",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "2",
    title: "磁盘无用文件",
    desc: "包含map后缀、不存在版本数据的组件包与页面配置占用磁盘空间的文件",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "3",
    title: "逻辑删除数据",
    desc: "包含组件、页面、数据源、建模、CODE等逻辑删除的垃圾数据",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "4",
    title: "操作日志数据",
    desc: "包含控制台、页面设计器操作的日志数据库数据",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "5",
    title: "图片文件垃圾",
    desc: "在使用IDM过程中上传文件后又重新上传或数据被删除而文件存在的垃圾文件",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "6",
    title: "个性定制数据",
    desc: "普通用户在渲染的页面进行个性化定制所产生的数据但用户或组件又不存在的垃圾数据",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "7",
    title: "页面历史版本",
    desc: "不再使用且时间比较久远的页面历史版本数据及文件",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
  {
    scanType: "8",
    title: "组件历史版本",
    desc: "不再使用且时间比较久远的组件历史版本数据及文件",
    indeterminate: false,
    checkAll: false,
    children: [],
  },
];
export default {
  name: "ICleanSpace",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      currentStep: 1,
      scanCleanList: ["1", "2", "3", "4", "5"],
      scanCleanOptions: [
        { label: "在线升级/导入/导出文件等磁盘垃圾文件", value: "1" },
        {
          label: "map/不存在版本数据的组件包与页面配置等无用的磁盘文件",
          value: "2",
        },
        { label: "组件/页面/数据源/建模/CODE等逻辑删除的垃圾数据", value: "3" },
        { label: "控制台/页面设计器等操作日志的垃圾数据", value: "4" },
        { label: "上传后不再使用的图片等磁盘文件", value: "5" },
        { label: "用户/组件不存在的个性化定制数据", value: "6", warning: true },
        {
          label: "不再使用且时间比较久远的页面历史版本数据及文件",
          value: "7",
          warning: true,
        },
        {
          label: "不再使用且时间比较久远的组件历史版本数据及文件",
          value: "8",
          warning: true,
        },
      ],
      scanLoadedType: ["1"],
      scanLoadedTypeCopy: ["1"],
      currentLoadingType: "1",
      scanLoadTime: 0,
      scanResultList: [],
      customStyle:
        "background: #ffffff;border-radius: 4px;margin-bottom: 0px;border: 0;overflow: hidden",
      //扫描出来的总共数据大小
      scanTotalDataSize: 0,
      //扫描出来的文件大小 b
      scanTotalFileSize: 0,
      visible: false,
      //要清理的项目
      cleanProjectList: [],
      //清理时间 秒
      cleanTimeTotal: 0,
      //已经清理结束的项目
      cleanEndProjectList: [],
      detailVisible:false,
      //当前显示的对象
      showModalDataObject:{},
      //程序根目录地址
      currentRootPath:"",
      //当前运行环境
      backEnvObject:{},
      //清理源程序
      cleanSrc:false
    };
  },
  props: {},
  created() {
    this.scanResultList = _.cloneDeep(scanResultListConstant);
    this.moduleObject = this.$root.moduleObject;
    // console.log(this.moduleObject)
    this.convertAttrToStyleObject();
  },
  mounted() {
    const that = this;
    //检查环境
    IDM.http.get("/ctrl/idm/api/checkRunInIDEA",{projectNo:IDM.setting.webRoot.projectNo}).then(res=>{
      let result =res.data?.data||{};
      that.backEnvObject = result;
      console.log("🚀 ~ file: ICleanSpace.vue:505 ~ IDM.http.get ~ that.backEnvObject:", that.backEnvObject)
    })
  },
  computed: {
    computeAllCheckedSize() {
      let totalSize = 0;
      this.scanResultList.forEach((item) => {
        item.children?.forEach((sitem) => {
          if (sitem.sizeType == "file" && sitem.checked) {
            totalSize += sitem.size;
          }
        });
      });
      return this.bytesToSize(totalSize);
    },
    computeAllCheckedData() {
      let totalSize = 0;
      this.scanResultList.forEach((item) => {
        item.children?.forEach((sitem) => {
          if (sitem.sizeType == "data" && sitem.checked) {
            totalSize += sitem.size;
          }
        });
      });
      return totalSize;
    },
  },
  destroyed() {},
  methods: {
    lookProjectDetail(item){
      this.showModalDataObject = item;
      this.detailVisible = true;
    },
    detailHandleCancel(){
      this.detailVisible = false;
    },
    //终止清理
    stopCleanButtonClick() {
      this.cleanSource?.close();
      this.handleCancel();
      this.cancelScanButtonClick();
    },
    okCleanButtonClick() {
      this.handleCancel();
      this.cancelScanButtonClick();
    },
    handleCancel() {
      this.visible = false;
    },
    cleanSpaceShowConfirm() {
      const that = this;
      this.$confirm({
        title: '清理后数据将无法恢复，请再次确认是否需要执行清理?',
        content: h => <div style="color:red;">强烈建议手动备份IDM的磁盘文件夹和数据库，以免造成数据丢失的重大事故！！！</div>,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.cleanSpaceButtonClick();
        },
        onCancel() {
          // console.log('Cancel');
        },
        class: 'test',
      });
    },
    /**
     * 确认执行清理
     */
    cleanSpaceButtonClick() {
      const that = this;
      this.visible = true;
      let cleanList = [],
        scanlist = [];
      this.scanResultList.forEach((item) => {
        let checkNum = 0;
        item.children?.forEach((sitem) => {
          if (sitem.checked) {
            cleanList.push(sitem.project);
            checkNum++;
          }
        });
        if (checkNum) {
          scanlist.push(item.scanType);
        }
      });
      this.cleanProjectList = cleanList;
      this.cleanEndProjectList = [];
      this.cleanTimeTotal = 0;

      let setInval = setInterval(() => {
        that.cleanTimeTotal++;
      }, 1000);
      this.cleanSource = new EventSource(
        IDM.url.getWebPath(
          "/ctrl/idm/clean/scanHandle?scanlist=" + scanlist.join(",") +"&cleanList="+cleanList.join(",")+"&cleanSrc="+(this.cleanSrc?"1":"")
        )
      );
      let receiveNum = 0;
      this.cleanSource.onmessage = function (event) {
        const resData = JSON.parse(event.data);
        that.scanResultList.forEach((item) => {
          if (resData.scanType == item.scanType) {
            item.children?.forEach((sitem) => {
              if (sitem.checked) {
                that.cleanEndProjectList.push(sitem.project);
              }
            });
          }
        });
        receiveNum++;
        if (receiveNum >= scanlist.length) {
          that.cleanSource.close();
          clearInterval(setInval);
        }
      };

      this.cleanSource.addEventListener("error", function (event) {
        console.log("错误：" + event);
      });
      this.cleanSource.addEventListener("open", function (event) {
        console.log("建立连接：" + event);
      });
    },
    onCheckChange(e, item, sitem) {
      //循环所有选项，比对是否已全部选中
      let checkall = true,
        hasChecked = false;
      item?.children?.forEach((ssitem) => {
        if (!ssitem.checked) {
          checkall = false;
        } else {
          hasChecked = true;
        }
      });
      item.indeterminate = hasChecked && !checkall;
      item.checkAll = checkall;
    },
    onCheckAllChange(e, item) {
      item.indeterminate = false;
      item.checkAll = e.target.checked;
      item?.children?.forEach((sitem) => {
        sitem.checked = e.target.checked;
      });
    },
    computeGroupSizeAndData(item, ischeck) {
      let totalData = 0,
        totalSize = 0;
      item?.children?.forEach((sitem) => {
        if (ischeck === true) {
          if (!sitem.checked) {
            return;
          }
        }
        if (sitem.sizeType == "file") {
          totalSize += sitem.size;
        } else if (sitem.sizeType == "data") {
          totalData += sitem.size;
        }
      });
      let resultStr = "";
      if (totalSize) {
        resultStr += this.bytesToSize(totalSize);
      }
      if (totalData) {
        if (resultStr) {
          resultStr += ",";
        }
        resultStr += `${totalData}条`;
      }
      if (!resultStr) {
        resultStr = "未发现";
        if (ischeck === true) {
          resultStr = "";
        }
      }
      return resultStr;
    },
    bytesToSize(size) {
      const ratioNum = 1;
      if (size < ratioNum * 1024) {
        //小于1KB，则转化成B
        size = size.toFixed(2) + "B";
      } else if (size < ratioNum * 1024 * 1024) {
        // 小于1MB，则转化成KB
        size = (size / 1024).toFixed(2) + "KB";
      } else if (size < ratioNum * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      // 转成字符串
      let sizeStr = size + "",
        // 获取小数点处的索引
        index = sizeStr.indexOf("."),
        // 获取小数点后两位的值
        dou = sizeStr.substr(index + 1, 2);

      // 判断后两位是否为00，如果是则删除00
      if (dou == "00")
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);

      return size;
    },
    cancelScanButtonClick() {
      if (this.source) {
        this.source.close();
      }
      this.currentStep = 1;
      this.scanResultList = _.cloneDeep(scanResultListConstant);
      this.scanLoadedType = ["1"];
      this.scanLoadedTypeCopy = ["1"];
      this.currentLoadingType = "1";
      this.scanTotalDataSize = 0;
      this.scanTotalFileSize = 0;
    },
    scanLoadedHandle() {
      this.currentStep = 3;
    },
    scanButtonClick() {
      const that = this;
      if (!this.scanCleanList.length) {
        return IDM.message.error("请至少选择一项进行扫描");
      }
      let newScanCleanList = _.sortBy(this.scanCleanList, function(o) { return o; })
      if (typeof EventSource != "undefined") {
        let receiveNum = 0;
        that.scanLoadTime = 0;
        let setInval = setInterval(() => {
          that.scanLoadTime++;
        }, 1000);
        that.currentLoadingType = newScanCleanList[0];
        this.scanTotalDataSize = 0;
        this.scanTotalFileSize = 0;
        this.source = new EventSource(
          IDM.url.getWebPath(
            "/ctrl/idm/clean/scanHandle?scanlist=" +
            newScanCleanList.join(",")+"&cleanSrc="+(this.cleanSrc?"1":"")
          )
        );
        this.source.onmessage = function (event) {
          // console.log(event.data);
          const resData = JSON.parse(event.data);
          that.currentRootPath = resData.rootPath;
          that.scanResultList.forEach((item) => {
            if (item.scanType == resData.scanType) {
              item.indeterminate = false;
              item.checkAll = true;
              resData.data?.forEach((item) => {
                item.checked = true;
                if (item.sizeType == "file") {
                  that.scanTotalFileSize += item.size;
                } else if (item.sizeType == "data") {
                  that.scanTotalDataSize += item.size;
                }
              });
              item.children = resData.data;
            }
          });
          that.scanLoadedType.push(resData.scanType);
          that.scanLoadedTypeCopy = _.cloneDeep(that.scanLoadedType);
          console.log(that.scanResultList);
          /**
               * {
                    "data":[
                        {
                            "size":1484180,
                            "allPathList":[
                                "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\p1000\\idm\\upload\\idmconsole\\318fc148-23fb-4bf4-afaa-d777ebdfca79.zip",
                                ...
                            ],
                            "project":"p1000"
                        },
                        ...
                    ],
                    "scanType":"1"
                },
                {
                    "data":[
                        {
                            "size":258144394,
                            "allPathList":[
                                "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\p1000\\idm\\upload\\idmconsole\\318fc148-23fb-4bf4-afaa-d777ebdfca79.map",
                                ...
                            ],
                            "project":"map"
                        },
                        {
                            "size":5517893,
                            "allPathList":[
                                "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\p1000\\idm\\upload\\idmconsole\\318fc148-23fb-4bf4-afaa-d777ebdfca79.html",
                                ...
                            ],
                            "project":"residue"
                        }
                    ],
                    "scanType":"2"
                },
                {
                  "data": [
                      {
                          "size": 9,
                          "data": {
                              "moduleVersionList": [],
                              "moduleMarketList": [
                                  {
                                      idm_module_market表字段
                                  }
                              ],
                              "moduleList": [],
                              "moduleAttrList": [
                                  {
                                      idm_module_attr表字段
                                  }
                              ],
                              "moduleCustomList": [
                                  {
                                      idm_module_custom表字段
                                  }
                              ]
                          },
                          "project": "module_data"
                      },
                      {
                          "size": 138,
                          "data": {
                              "idmVersionList": [
                                  {
                                      idm_version表字段
                                  }
                              ],
                              "idmList": [
                                  {
                                      idm表字段
                                  }
                              ]
                          },
                          "project": "page_data"
                      },
                      {
                          "size": 7,
                          "data": {
                              "idmDataSourceList": [
                                  {
                                      idm_datasource表字段
                                  }
                              ]
                          },
                          "project": "datasource"
                      },
                      {
                          "size": 0,
                          "data": {
                              "idmDataModelList": [{
                                idm_datamodel表字段
                              }]
                          },
                          "project": "datamodel"
                      },
                      {
                          "size": 0,
                          "data": {
                              "idmCodeList": [
                                {
                                  idm_code表字段
                                }
                              ]
                          },
                          "project": "code"
                      }
                  ],
                  "scanType": "3"
              },
              {
                  "data": [
                      {
                          "size": 23822,
                          "project": "trace"
                      },
                      {
                          "size": 3538,
                          "project": "log"
                      }
                  ],
                  "scanType": "4"
              },
              {
                  "data": [
                      {
                          "size": 5799299,
                          "data": [
                              "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\p1000\\idm\\upload\\idmfiles\\00899bd8-e844-4c83-ae69-239ea4c39698.png",
                              ],
                          "project": "no_exists_file"
                      }
                  ],
                  "scanType": "5"
              },
              {
                  "data": [
                      {
                          "size": 0,
                          "data": [],
                          "project": "attrdata"
                      },
                      {
                          "size": 5,
                          "data": [
                              {
                                idm_module_attr_data表字段
                              }
                          ],
                          "project": "customization"
                      }
                  ],
                  "scanType": "6"
              },
              {
                  "data": [
                      {
                          "size": 317,
                          "data": [
                              {
                                  "CREATE_USERID": "1",
                                  "AUTHOR": "龚申展",
                                  "LASTUPDATE_TIME": "2021-09-24 16:46:37.0",
                                  "ROWSTATE": "1",
                                  "VERSION_TEXT": "1.0.0",
                                  "CREATE_UNAME": "超级管理员",
                                  "PROJECT_NO": "p1000",
                                  "SCHEMA_PATH": "/p1000/idm/protal_pageschema/forms_addcompage_99999/1.0.0.json",
                                  "ID": "210922181648HfS9Nq3Z6MGietipRB9",
                                  "CREATE_TIME": "2021-09-22 18:16:49.0",
                                  "IDM_ID": "forms_addcompage_99999",
                                  "REMARK": "111",
                                  "PROJECT_ID": "p1001"
                              }
                          ],
                          "project": "page_history_data"
                      },
                      {
                          "size": 9396485,
                          "data": [
                              "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\\\p1000\\idm\\idm_pageschema\\idm_console_homepage_01\\1.0.0.json",
                              ],
                          "project": "page_history_file"
                      }
                  ],
                  "scanType": "7"
              },
              {
                  "data": [
                      {
                          "size": 44,
                          "data": {
                              "moduleVersionList": [
                                  {
                                    idm_module_version表字段
                                  }
                              ],
                              "codepackageVersionList": [
                                  {
                                      "PROJECT_NO": "p1000",
                                      "VERSION": "1.0.5",
                                      "CONFIG_TEXT": "",
                                      "CODE_PATH": "mobileWechat/1.0.5/",
                                      "CURRENT_VERSION": "1.1.1",
                                      "ID": "220511173047Le6By08lBnLETBR6RMG",
                                      "CLASSNAME": "mobileWechat"
                                  }
                              ]
                          },
                          "project": "module_history_data"
                      },
                      {
                          "size": 3285742,
                          "data": [
                              "D:\\java\\workspace\\oa\\dreamit-boot-beta\\dreamit-boot-web\\p1000\\idm\\idm_modules\\oaChart\\1.0.2\\favicon.ico",
                              ],
                          "project": "module_history_file"
                      }
                  ],
                  "scanType": "8"
              }
              */

          receiveNum++;
          that.currentLoadingType = newScanCleanList[receiveNum];
          if (receiveNum >= that.scanCleanList.length) {
            that.source.close();
            clearInterval(setInval);
            that.scanLoadedHandle();
          }
        };
        that.source.addEventListener("error", function (event) {
          console.log("错误：" + event);
        });
        that.source.addEventListener("open", function (event) {
          console.log("建立连接：" + event);
        });
        this.currentStep = 2;
      } else {
        return IDM.message.error("抱歉，你的浏览器不支持 server-sent 事件...");
      }
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      console.log("组件内属性发生变化，变化后====》", this.propData);
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};

      const keyList = [
        "width",
        "height",
        "border",
        "box",
        "font",
        "boxShadow",
        "bgColor",
      ];
      for (const iKey in keyList) {
        const key = keyList[iKey];
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
            case "boxShadow":
              styleObject["box-shadow"] = element;
              break;
            case "box":
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case "border":
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] =
                  IDM.hex8ToRgbaString(element.hex8) + "  !important";
              }
              break;
            case "font":
              IDM.style.setFontStyle(styleObject, element);
              break;
          }
        }
      }
      if (Object.keys(this.propData.bgList?.style||{}).length) {
        Object.assign(styleObject, this.propData.bgList.style);
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
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
      console.log("组件收到消息", object);
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
  },
};
</script>
<style lang="scss">
.idm-console-cleanspace-env{
  border: 1px solid #FF0000FF;
  background-color: #FFDFDFFF;
  border-radius: 5px;
  padding: 20px;
  >span{
    color: #FF0000FF;
    font-weight: bold;
  }
}
.idm-console-cleanspace-step-01 {
  width: 100%;
  display: flex;
  align-items: center;
  > * {
    width: 40%;
    min-width: 0;
    &:last-child {
      text-align: center;
      width: 60%;
    }
    img {
      max-width: 100%;
    }
    .ant-checkbox-group {
      margin-top: 20px;
      .ant-checkbox-wrapper {
        display: block;
        margin: 20px 0;
      }
      .checkbox-label-warning {
        color: #ffad00;
      }
    }
    .cleanspace-title-05 {
      margin-top: 20px;
      color: #a6a6a6;
    }
    .ant-btn {
      box-shadow: 0 0 10px rgba(24, 144, 255, 0.64);
      margin-top: 20px;
      display: block;
    }
  }
}
.cleanspace-top-loading-box-title {
  color: #333333;
  margin-bottom: 15px;
  span {
    color: #ffad00;
  }
}
.idm-console-cleanspace-step-02 {
  width: 100%;
  .ant-checkbox + span {
    padding-left: 2px;
  }
  .cleanspace-top-loading-box {
    width: 100%;
    display: flex;
    white-space: nowrap;
    align-items: center;
    img {
      max-height: 160px;
    }
    .ant-btn {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    }
    .ant-btn.ant-btn-primary {
      box-shadow: 0 0 10px rgba(24, 144, 255, 0.64);
    }
    > * {
      min-width: 0;
    }
    .cleanspace-top-loading-box-center {
      flex-grow: 2;
      padding-left: 15px;
      padding-right: 20px;
    }
    .cleanspace-top-loading-box-remark {
      color: #a6a6a6;
    }
  }
  .cleanspace-content-box {
    .cleanspace-content-subbox {
      background-color: #f6f6f6;
      padding: 20px;
      width: 100%;
      .cleanspace-content-subbox-item {
        display: flex;
        width: 100%;
        justify-content: space-between;
        & + .cleanspace-content-subbox-item {
          margin-top: 10px;
        }
        .ccsi-number {
          color: #ffad00;
        }
        a {
          margin-right: 20px;
          opacity: 0;
          transition: all linear 0.2s;
        }
        &:hover a {
          opacity: 1;
        }
        .sub-title {
          color: #a6a6a6;
          font-size: 14px;
          margin-left: 10px;
        }
      }
    }
    .cleanspace-content-itemtitle {
      font-size: 16px;
      .ant-checkbox-wrapper {
        font-size: 16px;
      }
      .sub-title {
        color: #a6a6a6;
        font-size: 14px;
        margin-left: 20px;
      }
    }
    .cleanspace-title-05 {
      span {
        color: #ffad00;
      }
    }
    .ant-collapse-header {
      padding-left: 0;
    }
    .ant-collapse-content-box {
      padding: 10px 0;
    }
  }
}
.cleanspace-title-01 {
  font-size: 30px;
}
.cleanspace-title-02 {
  font-size: 25px;
}
.cleanspace-title-05 {
  font-size: 16px;
}
</style>