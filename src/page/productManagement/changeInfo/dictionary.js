/**
 * @description: 默认交通方式
 */
export const DEFALUT_TRAFFIC_MODE= 1

/**
 * @description: 交通方式options
 */
export const TRAFFIC_MODE_OPTIONS= [{
  value: 1,
  label: '飞机'
}, {
  value: 2,
  label: '火车',
}, {
  value: 3,
  label: '汽车',
}, {
  value: 4,
  label: '轮船',
}]

/**
 * @description: 到达时间options
 */
export const ARRIVE_DAY_OPTIONS= [{
  value: -2,
  label: '前天'
},{
  value: -1,
  label: '昨天',
}, {
  value: 0,
  label: '当日',
},{
  value: 1,
  label: '明天',
}, {
  value: 2,
  label: '后天',
}, {
  value: 3,
  label: '第三天',
}, {
  value: 4,
  label: '第四天',
}, {
  value: 5,
  label: '第五天',
}, {
  value: 6,
  label: '第六天',
}, ]

/**
 * @description: 去程返程 center中转
 */
// 标记
export const GO_OR_BACK_SIGN= {
  GO: 1,
  BACK: 2,
  CENTER: 0
}
// TeamTrafficDTO
const TEAM_TRAFFIC_DTO= {
  // id
  // packageID
  trafficMode: DEFALUT_TRAFFIC_MODE,
  day: 1,
  arriveDay: "",
  arriveCity: "",
  arrivePlace: "",
  arriveTime: "",
  company: "",
  ext_Stopover: "[]",
  pod: "",
  podCity: "",
  podPlace: "",
  podTime: "",
  theNumber: "",
}
export const TEAM_TRAFFIC_DTO_GO= Object.assign({
  goOrBack: GO_OR_BACK_SIGN.GO
}, TEAM_TRAFFIC_DTO)
export const TEAM_TRAFFIC_DTO_BACK= Object.assign({
  goOrBack: GO_OR_BACK_SIGN.BACK
}, TEAM_TRAFFIC_DTO)