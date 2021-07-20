import { VantComponent } from '../common/component';
import { isDef } from '../common/validator';
import { pickerProps } from '../picker/shared';

const currentYear = new Date().getFullYear();

function isValidDate(date: number) {
  return isDef(date) && !isNaN(new Date(date).getTime());
}

function range(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function padZero(val: string | number) {
  return `00${val}`.slice(-2);
}

function times(n: number, iteratee: (index: number) => string): string[] {
  let index = -1;
  const result = Array(n < 0 ? 0 : n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function getTrueValue(formattedValue: string) {
  if (formattedValue === undefined) {
    formattedValue = '1';
  }
  while (isNaN(parseInt(formattedValue, 10))) {
    formattedValue = formattedValue.slice(1);
  }
  return parseInt(formattedValue, 10);
}

function getMonthEndDay(year: number, month: number): number {
  return 32 - new Date(year, month - 1, 32).getDate();
}

const defaultFormatter = (
  type: 'year' | 'month' | 'day' | 'hour' | 'minute',
  value: string
) => value;

VantComponent({
  classes: ['active-class', 'toolbar-class', 'column-class'],

  props: {
    ...pickerProps,
    value: {
      type: null,
      observer: 'updateValueNotEmit',
    },
    filter: null,
    type: {
      type: String,
      value: 'datetime',
      observer: 'updateValue',
    },
    showToolbar: {
      type: Boolean,
      value: true,
    },
    formatter: {
      type: null,
      value: defaultFormatter,
    },
    minDate: {
      type: Number,
      value: new Date(currentYear - 10, 0, 1).getTime(),
      observer: 'updateValue',
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear + 10, 11, 31).getTime(),
      observer: 'updateValue',
    },
    minHour: {
      type: Number,
      value: 0,
      observer: 'updateValue',
    },
    maxHour: {
      type: Number,
      value: 23,
      observer: 'updateValue',
    },
    minMinute: {
      type: Number,
      value: 0,
      observer: 'updateValue',
    },
    maxMinute: {
      type: Number,
      value: 59,
      observer: 'updateValue',
    },
  },

  data: {
    innerValue: Date.now(),
    columns: [],
  },

  methods: {
    updateValue() {
      const { data } = this;
      const val = this.correctValue(data.value);
      const isEqual = val === data.innerValue;
      this.updateColumnValue(val).then(() => {
        if (!isEqual) {
          this.$emit('input', val);
        }
      });
    },
    
    updateValueNotEmit() {
      const { data } = this;
      const val = this.correctValue(data.value);
      const isEqual = val === data.innerValue;
      if (!isEqual) {
        this.updateColumnValue(val);
      } else {
        this.updateColumns();
      }
    },

    getPicker() {
      if (this.picker == null) {
        this.picker = this.selectComponent('.van-datetime-picker');

        const { picker } = this;
        const { setColumnValues } = picker;
        picker.setColumnValues = (...args: any) =>
          setColumnValues.apply(picker, [...args, false]);
      }

      return this.picker;
    },

    updateColumns() {
      const { formatter = defaultFormatter } = this.data;
      const results = this.getOriginColumns().map((column) => ({
        values: column.values.map((value) => formatter(column.type, value)),
      }));

      return this.set({ columns: results });
    },

    getOriginColumns() {
      const { filter } = this.data;
      const results = this.getRanges().map(({ type, range }) => {
        let values = times(range[1] - range[0] + 1, (index) => {
          const value = range[0] + index;
          return type === 'year' ? `${value}` : padZero(value);
        });

        if (filter) {
          values = filter(type, values);
        }

        return { type, values };
      });

      return results;
    },

    getRanges() {
      const { data } = this;
      if (data.type === 'time') {
        return [
          {
            type: 'hour',
            range: [data.minHour, data.maxHour],
          },
          {
            type: 'minute',
            range: [data.minMinute, data.maxMinute],
          },
        ];
      }

      const {
        maxYear,
        maxDate,
        maxMonth,
        maxHour,
        maxMinute,
      } = this.getBoundary('max', data.innerValue);
      const {
        minYear,
        minDate,
        minMonth,
        minHour,
        minMinute,
      } = this.getBoundary('min', data.innerValue);

      const result = [
        {
          type: 'year',
          range: [minYear, maxYear],
        },
        {
          type: 'month',
          range: [minMonth, maxMonth],
        },
        {
          type: 'day',
          range: [minDate, maxDate],
        },
        {
          type: 'hour',
          range: [minHour, maxHour],
        },
        {
          type: 'minute',
          range: [minMinute, maxMinute],
        },
      ];

      if (data.type === 'date') result.splice(3, 2);
      if (data.type === 'year-month') result.splice(2, 3);
      return result;
    },

    correctValue(value: any) {
      const { data } = this;
      // validate value
      const isDateType = data.type !== 'time';
      if (isDateType && !isValidDate(value)) {
        value = data.minDate;
      } else if (!isDateType && !value) {
        const { minHour } = data;
        value = `${padZero(minHour)}:00`;
      }

      // time type
      if (!isDateType) {
        let [hour, minute] = value.split(':');
        hour = padZero(range(hour, data.minHour, data.maxHour));
        minute = padZero(range(minute, data.minMinute, data.maxMinute));

        return `${hour}:${minute}`;
      }

      // date type
      value = Math.max(value, data.minDate);
      value = Math.min(value, data.maxDate);

      return value;
    },

    getBoundary(type: string, innerValue: number) {
      const value = new Date(innerValue);
      const boundary = new Date(this.data[`${type}Date`]);
      const year = boundary.getFullYear();
      let month = 1;
      let date = 1;
      let hour = 0;
      let minute = 0;

      if (type === 'max') {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }

      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();
          if (value.getDate() === date) {
            hour = boundary.getHours();
            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }
          }
        }
      }

      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
      };
    },

    onCancel() {
      this.$emit('cancel');
    },

    onConfirm() {
      this.$emit('confirm', this.data.innerValue);
    },

    onChange() {
      const { data } = this;
      let value;

      const picker = this.getPicker();
      const originColumns = this.getOriginColumns();

      if (data.type === 'time') {
        const indexes = picker.getIndexes();
        value = `${+originColumns[0].values[indexes[0]]}:${+originColumns[1]
          .values[indexes[1]]}`;
      } else {
        const indexes = picker.getIndexes();
        const values = indexes.map(
          (value, index) => originColumns[index].values[value]
        );
        const year = getTrueValue(values[0]);
        const month = getTrueValue(values[1]);
        const maxDate = getMonthEndDay(year, month);
        let date = getTrueValue(values[2]);
        if (data.type === 'year-month') {
          date = 1;
        }
        date = date > maxDate ? maxDate : date;
        let hour = 0;
        let minute = 0;
        if (data.type === 'datetime') {
          hour = getTrueValue(values[3]);
          minute = getTrueValue(values[4]);
        }
        value = new Date(year, month - 1, date, hour, minute);
      }
      value = this.correctValue(value);

      this.updateColumnValue(value).then(() => {
        this.$emit('input', value);
        this.$emit('change', picker);
      });
    },

    updateColumnValue(value) {
      let values: string[] = [];
      const { type } = this.data;
      const formatter = this.data.formatter || defaultFormatter;
      const picker = this.getPicker();

      if (type === 'time') {
        const pair = value.split(':');
        values = [formatter('hour', pair[0]), formatter('minute', pair[1])];
      } else {
        const date = new Date(value);
        values = [
          formatter('year', `${date.getFullYear()}`),
          formatter('month', padZero(date.getMonth() + 1)),
        ];
        if (type === 'date') {
          values.push(formatter('day', padZero(date.getDate())));
        }
        if (type === 'datetime') {
          values.push(
            formatter('day', padZero(date.getDate())),
            formatter('hour', padZero(date.getHours())),
            formatter('minute', padZero(date.getMinutes()))
          );
        }
      }

      return this.set({ innerValue: value })
        .then(() => this.updateColumns())
        .then(() => picker.setValues(values));
    },
  },

  created() {
    const innerValue = this.correctValue(this.data.value);
    this.updateColumnValue(innerValue).then(() => {
      this.$emit('input', innerValue);
    });
  },
});
