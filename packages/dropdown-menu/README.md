# DropdownMenu 下拉菜单

### 介绍

向下弹出的菜单列表。

### 引入

在`app.json`或`index.json`中引入组件，默认为`ES6`版本，`ES5`引入方式参见[快速上手](#/quickstart)。

```json
"usingComponents": {
  "van-dropdown-menu": "@vant/weapp/dropdown-menu/index",
  "van-dropdown-item": "@vant/weapp/dropdown-item/index"
}
```

## 代码演示

### 基础用法

```html
<van-dropdown-menu>
  <van-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <van-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</van-dropdown-menu>
```

```js
Page({
  data: {
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
  },
});
```

### 自定义菜单内容

```html
<van-dropdown-menu>
  <van-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <van-dropdown-item id="item" title="{{ itemTitle }}">
    <van-cell title="{{ switchTitle1 }}">
      <van-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch1 }}"
        active-color="#ee0a24"
        bind:change="onSwitch1Change"
      />
    </van-cell>
    <van-cell title="{{ switchTitle2 }}">
      <van-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch2 }}"
        active-color="#ee0a24"
        bind:change="onSwitch2Change"
      />
    </van-cell>
    <view style="padding: 5px 16px;">
      <van-button type="danger" block round bind:click="onConfirm">
        确认
      </van-button>
    </view>
  </van-dropdown-item>
</van-dropdown-menu>
```

```js
Page({
  data: {
    switchTitle1: '包邮',
    switchTitle2: '团购',
    itemTitle: '筛选',
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    value1: 0,
  },

  onConfirm() {
    this.selectComponent('#item').toggle();
  },

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
  },

  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
  },
});
```

### 自定义选中状态颜色

```html
<van-dropdown-menu active-color="#1989fa">
  <van-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <van-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</van-dropdown-menu>
```

### 向上展开

```html
<van-dropdown-menu direction="up">
  <van-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <van-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</van-dropdown-menu>
```

### 禁用菜单

```html
<van-dropdown-menu>
  <van-dropdown-item value="{{ value1 }}" disabled options="{{ option1 }}" />
  <van-dropdown-item value="{{ value2 }}" disabled options="{{ option2 }}" />
</van-dropdown-menu>
```

## API

### DropdownMenu Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active-color | 菜单标题和选项的选中态颜色 | _string_ | `#ee0a24` |
| menu-active-color | 菜单标题选中态颜色 | _string_ | `active-color` |
| z-index | 菜单栏 z-index 层级 | _number_ | `10` |
| duration | 动画时长，单位毫秒 | _number_ | `200` |
| direction | 菜单展开方向，可选值为 up | _string_ | `down` |
| overlay | 是否显示遮罩层 | _boolean_ | `true` |
| close-on-click-overlay | 是否在点击遮罩层后关闭菜单 | _boolean_ | `true` |
| close-on-click-outside | 是否在点击外部 menu 后关闭菜单 | _boolean_ | `true` |

### DropdownItem Props

| 参数        | 说明                   | 类型               | 默认值         |
| ----------- | ---------------------- | ------------------ | -------------- |
| value       | 当前选中项对应的 value | _number \| string_ | -              |
| title       | 菜单项标题             | _string_           | 当前选中项文字 |
| options     | 选项数组               | _Option[]_         | `[]`           |
| disabled    | 是否禁用菜单           | _boolean_          | `false`        |
| title-class | 标题额外类名           | _string_           | -              |
| popup-style | 自定义弹出层样式       | _string_           | -              |

### DropdownItem Events

| 事件名 | 说明                          | 回调参数 |
| ------ | ----------------------------- | -------- |
| change | 点击选项导致 value 变化时触发 | value    |
| open   | 打开菜单栏时触发              | -        |
| close  | 关闭菜单栏时触发              | -        |
| opened | 打开菜单栏且动画结束后触发    | -        |
| closed | 关闭菜单栏且动画结束后触发    | -        |

### DropdownItem 方法

通过 selectComponent(id) 可访问。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| toggle | 切换菜单展示状态，传`true`为显示，`false`为隐藏，不传参为取反 | show?: boolean | - |

### Option 数据结构

| 键名  | 说明                             | 类型               |
| ----- | -------------------------------- | ------------------ |
| text  | 文字                             | _string_           |
| value | 标识符                           | _number \| string_ |
| icon  | 左侧[图标名称](#/icon)或图片链接 | _string_           |
