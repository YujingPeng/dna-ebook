import {Toast} from 'antd-mobile'
const loading = () => {
  return new Promise((resolve, reject) => {
    Toast.loading('正在加载...', 0)
    return resolve(true)
  })
}

export default loading
