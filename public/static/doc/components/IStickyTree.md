# 悬浮树
组件描述
## 组件类ID（IStickyTree）
idm.component.console.istickytree
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
console@1.0.5
## 组件属性
### 唯一标识【ctrlId】

- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 展开层数【defaultExpendNumber】
设置默认展开的树结构层数
- 标识：`defaultExpendNumber`
- 默认值：`2`
#### 粘性布局【isOpenSticky】
是否开启粘性布局，开启后在设计器内失效，可在预览页面时效果正常
- 标识：`isOpenSticky`
- 默认值：`true`
- 选项：	 - 开启【true】	 - 关闭【false】
#### 叶子节点【isOnlyLeaf】
设置只能叶子节点选中
- 标识：`isOnlyLeaf`
- 默认值：`false`
- 选项：	 - 开启【true】	 - 关闭【false】
#### 点击取消【clickCancel】
设置选中后，是否可以取消
- 标识：`clickCancel`
- 默认值：`true`
- 选项：	 - 开始【true】	 - 关闭【false】
#### 搜索框【isShowSearch】
是否显示搜索框
- 标识：`isShowSearch`
- 默认值：`true`
- 选项：	 - 显示【true】	 - 隐藏【false】
#### 连接线【isShowLine】
是否显示连接线
- 标识：`isShowLine`
- 默认值：`false`
- 选项：	 - 显示【true】	 - 隐藏【false】
#### 字段替换【replaceFieldsStr】
替换 treeNode 中 title,key,children 字段为 treeData 中对应的字段
- 标识：`replaceFieldsStr`
- 默认值：`{ "children": "children", "title": "title", "key": "key" }`
### 样式设置
#### 滚动阈值【fixedValue】
设置滚动条滚动到阈值时，开始fixed定义
- 标识：`fixedValue`
- 默认值：`60`
#### 顶部距离【stickyTop】
fixed布局时的距离
- 标识：`stickyTop`
- 默认值：`0`
#### 显示层级【zIndex】
fixed定位时z-index的值
- 标识：`zIndex`
- 默认值：`10`
#### 搜索框宽【searchWidth】
搜索框容器宽度，含刷新icon
- 标识：`searchWidth`
- 默认值：空
#### 组件宽度【width】
填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`width`
- 默认值：`100%`
#### 组件高度【height】
填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等
- 标识：`height`
- 默认值：`auto`
#### 树最大高【treeMaxHeight】
设置树容器的最大高度，超出则滚动
- 标识：`treeMaxHeight`
- 默认值：`500px`
#### 内外边距【box】

- 标识：`box`
- 默认值：空
#### 背景色【bgColor】

- 标识：`bgColor`
- 默认值：```json{
    "hex": "#FFFFFF",
    "hex8": "#FFFFFFFF"
}```
#### 边框【border】

- 标识：`border`
- 默认值：空
#### 文字样式【font】

- 标识：`font`
- 默认值：空
#### 匹配文字样式【matchFont】

- 标识：`matchFont`
- 默认值：```json{
    "fontColors": {
        "hex": "#F50000",
        "hex8": "#F50000FF"
    }
}```
### 高级
#### 表单标识【formFiledKey】
如果为空则会提交表单时用唯一标识作为key
- 标识：`formFiledKey`
- 默认值：空
#### 刷新KEY【messageRefreshKey】
根据组件接收到消息的刷新KEY来刷新数据
- 标识：`messageRefreshKey`
- 默认值：空
#### 数据源【dataSource】
设置树的数据源，返回格式：[{"title": "0-0","key": "0-0","children": [{"title": "0-0-0","key": "0-0-0"}]
- 标识：`dataSource`
- 默认值：空
#### 联动组件【triggerComponents】
选择点击菜单需要联动的组件
- 标识：`triggerComponents`
- 默认值：空
#### 自定义点击函数【customClickFunction】
设置自定义点击函数后，默认点击事件取消，接受参数selectKeys
- 标识：`customClickFunction`
- 默认值：空
- 可设置函数数量：单个
#### 自定义默认选中函数【customSelectFunction】
自定义默认选中函数，返回selectKeys
- 标识：`customSelectFunction`
- 默认值：空
- 可设置函数数量：单个
#### 自定义参数函数【customParamFunction】
自定义参数函数，返回的对象则会被合并到数据源参数中
- 标识：`customParamFunction`
- 默认值：空
- 可设置函数数量：单个