/*
 * @Author: manweill
 * @Date: 2017-04-01 16:33:47
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-01 16:52:37
 */
import DiscoverModel from '../model/DiscoverModel'
import {action} from 'mobx'

class PersonStore {
  discover=new DiscoverModel()

  @action
  async init () {

  }
}

const personStore = new PersonStore()

export default personStore
