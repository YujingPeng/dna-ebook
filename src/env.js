import booktxt from './rules/booktxt'
import xxbiquge from './rules/xxbiquge'
import xinshubao from './rules/xinshubao'

export const color = '#2F589C'

// #802A2A

export const theme = {
  night: {
    backgroundColor: '#161418',
    color: '#696969'
  },
  light: {
    backgroundColor: '#f5deb3',
    color: '#161418'
  }
}

export const rules = {
  'booktxt.net': booktxt,
  'xxbiquge.com': xxbiquge,
  'xinshubao.com': xinshubao
}
