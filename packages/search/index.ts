import { VantComponent } from '../common/component';
import { canIUseModel } from '../common/version';

VantComponent({
  field: true,

  classes: ['field-class', 'input-class', 'cancel-class'],

  props: {
    label: String,
    focus: Boolean,
    error: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    inputAlign: String,
    showAction: Boolean,
    useActionSlot: Boolean,
    useLeftIconSlot: Boolean,
    useRightIconSlot: Boolean,
    leftIcon: {
      type: String,
      value: 'search',
    },
    rightIcon: String,
    placeholder: String,
    placeholderStyle: String,
    actionText: {
      type: String,
      value: '取消',
    },
    background: {
      type: String,
      value: '#ffffff',
    },
    maxlength: {
      type: Number,
      value: -1,
    },
    shape: {
      type: String,
      value: 'square',
    },
    clearable: {
      type: Boolean,
      value: true,
    },
  },

  methods: {
    onChange(event: WechatMiniprogram.CustomEvent) {
      if (canIUseModel()) {
        this.setData({ value: event.detail });
      }
      this.$emit('change', event.detail);
    },

    onCancel() {
      /**
       * 修复修改输入框值时，输入框失焦和赋值同时触发，赋值失效
       * https://github.com/youzan/@vant/weapp/issues/1768
       */
      setTimeout(() => {
        if (canIUseModel()) {
          this.setData({ value: '' });
        }
        this.$emit('cancel');
        this.$emit('change', '');
      }, 200);
    },

    onSearch(event: WechatMiniprogram.CustomEvent) {
      this.$emit('search', event.detail);
    },

    onFocus(event: WechatMiniprogram.CustomEvent) {
      this.$emit('focus', event.detail);
    },

    onBlur(event: WechatMiniprogram.CustomEvent) {
      this.$emit('blur', event.detail);
    },

    onClear(event: WechatMiniprogram.CustomEvent) {
      this.$emit('clear', event.detail);
    },

    onClickInput: function (event) {
      this.$emit('click-input', event.detail);
    },    
  },
});
