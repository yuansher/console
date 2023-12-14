// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/dropdown/style/css';
import 'ant-design-vue/lib/menu/style/css';
import 'ant-design-vue/lib/icon/style/css';
import 'ant-design-vue/lib/avatar/style/css';
import 'ant-design-vue/lib/date-picker/style/css';
import 'ant-design-vue/lib/radio/style/css';
import 'ant-design-vue/lib/table/style/css';
import 'ant-design-vue/lib/tag/style/css';
import 'ant-design-vue/lib/upload/style/css';
import 'ant-design-vue/lib/alert/style/css';
import 'ant-design-vue/lib/tabs/style/css';
import 'ant-design-vue/lib/list/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/pagination/style/css';
import 'ant-design-vue/lib/modal/style/css';
import 'ant-design-vue/lib/empty/style/css';
import 'ant-design-vue/lib/spin/style/css';
import 'ant-design-vue/lib/checkbox/style/css';
import 'ant-design-vue/lib/tree/style/css';
import 'ant-design-vue/lib/collapse/style/css';
import 'ant-design-vue/lib/switch/style/css';
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Avatar,
  DatePicker,
  Radio,
  Table,
  Tag,
  Upload,
  Alert,
  Tabs,
  List,
  Input,
  Pagination,
  ConfigProvider,
  Modal,
  Empty,
  Spin,
  Checkbox,
  Tree,
  Collapse,
  Switch
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
Vue.use(Button);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Avatar);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Upload);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(List);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(ConfigProvider);
Vue.use(Modal);
Vue.use(Empty);
Vue.use(Spin);
Vue.use(Checkbox);
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(Switch);
Vue.prototype.$confirm = Modal.confirm;
