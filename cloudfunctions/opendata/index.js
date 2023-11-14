// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-1gsj1u740c14577b'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return event;
}