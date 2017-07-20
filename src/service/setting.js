import db from '../database'

export async function getSettings () {
  return db.objectForPrimaryKey('Settings', 'settingId') || {}
}

export async function saveSettings (settings) {
  db.write(() => {
    db.create('Settings', settings, true)
  })
}
