
const isNullOrUndefined = v => v === undefined || v === null;
const compare = (v, expression) => !isNullOrUndefined(v) && expression(v);

const valid = (value, { require, max, min, message }, rules) => {
  if (Object.prototype.toString.call(rules) === '[object Array]') {
    rules.forEach((rule) => {
      if (rule.reg && rule.reg.test && rule.reg.test(value)) {
        return rule.msg;
      }
    });
  }
  console.log('value', value, isNullOrUndefined(value));
  if (isNullOrUndefined(value)) {
    if (require) {
      return message;
    }
  } else {
    console.log('sss', compare(max, v => value > v));
    if (compare(max, v => value > v)) {
      return message;
    }
    if (compare(min, v => value < v)) {
      return message;
    }
  }
  return undefined;
};
