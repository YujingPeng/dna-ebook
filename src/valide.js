import validate from 'mobx-form-validate'

function test (target, rules) {
  for (let rule of rules) {
    const { message, ...other } = rule
    for (let reg in other) {
      if (regRules[reg](target, rule[reg])) {
        return message || tips[reg]
      }
    }
  }
};

export function validation (reg, msg) {
  const rules = Object.prototype.toString.call(reg) === '[object Array]' ? reg : [reg]
  return validate((value) => test(value, rules))
}

const tips = {
  require: value => '必填'
}

const regRules = {
  require: (target, value) => value,
  max: (target, value) => target > value,
  min: (target, value) => target < value,
  pattern: (target, value) => value && value.test && !value.test(target)
}
