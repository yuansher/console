## 组件类 ID（classId）

idm.componet.console.ipoagelistitem

## 组件开发语言（comLangue）

vue

## 组件类型（comType）

common

## 所在代码包版本

oacommon@1.0.1

## 组件属性

### 唯一标识【ctrlId】

-   标识：`ctrlId`
-   默认值：@[packageid]

### 基本属性

### 高级

#### 数据源

##### 点击事件

```js
handleTreeSelect(selectedKeys, e) {
    if (this.propData?.customClickFunction?.length > 0) {
      const funcName = this.propData.customClickFunction[0].name
      window?.[funcName].call(this, selectKeys)
      return
    }
    if (!this.propData?.triggerComponents?.length > 0) {
      return IDM.message.warning('请配置菜单的联动组件')
    }
    this.sendBroadcastMessage({
      type: 'stickyTreeKeysChange',
      rangeModule: this.propData.triggerComponents.map(el => el.moduleId),
      message: selectedKeys
    })
}

```

##### 接口返回数据格式

```js
{
    code: 200,
    data: [
        {
            "title": "0-0",
            "key": "0-0",
            "scopedSlots": {
            "title": "title"
            },
            "children": [
            {
                "title": "0-0-0",
                "key": "0-0-0",
                "scopedSlots": {
                "title": "title"
                },
                "children": [
                {
                    "title": "0-0-0-0",
                    "key": "0-0-0-0",
                    "scopedSlots": {
                    "title": "title"
                    }
                },
                {
                    "title": "0-0-0-1",
                    "key": "0-0-0-1",
                    "scopedSlots": {
                    "title": "title"
                    }
                },
                {
                    "title": "0-0-0-2",
                    "key": "0-0-0-2",
                    "scopedSlots": {
                    "title": "title"
                    }
                }
                ]
            },
            {
                "title": "0-0-1",
                "key": "0-0-1",
                "scopedSlots": {
                "title": "title"
                },
                "children": [
                {
                    "title": "0-0-1-0",
                    "key": "0-0-1-0",
                    "scopedSlots": {
                    "title": "title"
                    }
                },
                {
                    "title": "0-0-1-1",
                    "key": "0-0-1-1",
                    "scopedSlots": {
                    "title": "title"
                    }
                },
                {
                    "title": "0-0-1-2",
                    "key": "0-0-1-2",
                    "scopedSlots": {
                    "title": "title"
                    }
                }
                ]
            },
            {
                "title": "0-0-2",
                "key": "0-0-2",
                "scopedSlots": {
                "title": "title"
                }
            }
            ]
        }
        ],
    message: 'success'
}
```
