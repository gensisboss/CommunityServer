// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'market-7gck0fz3e1fe7679'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return event;
}