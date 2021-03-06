// 获取供应商原型
export const getSupplierDTO= function(){
  return {
    id: 0,
    createTime: null,	// integer($int64)
    // code
    name: null,
    types: null,
    productDirection: null,
    isMonthly: null,
    productArea: null,
    leader: null,
    phone: null,
    legalPerson: null,
    handPerson: null,
    handPhone: null,
    billName:	null,
    taxNumber: null,
    expireTime: null,	// string($date-time)
    memo: null,
    banks: [],
    files: [],
    createUser: null,
    supplierCode: null,
    alias: [],
    
    // 暂设常量
    orgs: [], 
    companyArea: 1,
    isDeleted: 0,
    isAgree: 2,
    userState: 1, // 角色的数据状态 0等待审核 1正常 2停用
    manageType: 1
  }
}

// 状态options
export const ConditionTypeOptions= [
  { value: 1, label: "正常" },
  {value: 2, label: "停用"},
  {value: 0, label: "待审核"}
]

export const CompanyAreaOptions= [
  { value: 1, label: "集团专享" },
  { value: 2, label: "沈阳专享" },
  { value: 3, label: "吉林专享" },
  { value: 4, label: "大连专享" },
  { value: 5, label: "哈尔滨专享" }
]

export class TreeNamer {
  constructor(tree){
    this._tree= tree;
    this._cache= {};
  }

  /**
   * @description: 根据几联选择器的数据还原它在树中的家族
   */
  family(arr){
    let point= 0;
    let result= [];
    let source= this._tree;
    let hit;
    let cacheKey= arr.join('-');
    if(this._cache[cacheKey]) return this._cache[cacheKey];
    do{
      hit= source.find(el => el.id=== arr[point]);
      if(hit){
        result.push(hit);
        point++;
        source= hit.children;
      }
    } while ( point< arr.length && source.length && hit );
    this._cache[cacheKey]= this.formate(result);
    return this._cache[cacheKey];
  }

  formate(orgList){
    let newArr= [...orgList];
    let parent;
    // JSON.stringify保持和数据库传来的根式一致
    parent= JSON.stringify(newArr.map(el => {
      let { id, orgName }= el;
      return { id, name: orgName };
    }));
    // 最后一个节点是叶子节点
    let { id: orgID, orgName }= newArr.pop();
    return { orgID, orgName, parent };
  }

  // 获取几联选择器的绑定值
  getData(orgs){
    if(!orgs) return [];
    return orgs.map(org => {
      let path= JSON.parse(org.parent || []);
      return path.map(item => item.id);
    })
  }

  diff(oval, nval){
    let result= [];
    let old= oval.splice(0);
    // 先排除掉nval中不存在的
    oval.push(...old.filter(el => !!nval.find(item => item.orgID=== el.orgID)));
    nval.forEach(el => {
      let hit= oval.find(item => item.orgID=== el.orgID);
      if(hit) return;
      result.push(el);
    });
    oval.push(...result);
  }
}