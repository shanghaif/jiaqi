<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="绑定" :visible="dialogFormVisible" width=50%  @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div style="height: 300px;">
          <el-form-item label="团期计划" prop="tour" label-width="120px" style="float:left;">
            <!-- <el-input v-model="ruleForm.tour" @blur="tour_check" class="inputWidth" placeholder="请输入或者选择团期计划"></el-input> -->
            <el-autocomplete class="el-input" v-model="ruleForm.tour" :fetch-suggestions="querySearchT" placeholder="请输入关联团期" @select="handleSelectT" @blur="tour_check">
            </el-autocomplete>
            <el-input v-model="ruleForm.title" :disabled="true" class="inputWidth" style="margin-top: 5px" placeholder="自动显示产品名称"></el-input>
          </el-form-item>
          <div class="footer">
            <el-button class="el-button" type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.title == '' || ruleForm.title == undefined">确 定</el-button>
            <el-button class="el-button" type="danger" @click="closeAdd">取 消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "relation",
  components: {},
  props: {
    dialogFormVisible: false,
    planList: '',
  },
  data() {
    return {
      ruleForm: {
        tour: '',
        title: ''
      },
      rules: {
        tour: [{ required: true, message: '团期计划不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '产品名称不存在，请确认团期计划准确', trigger: 'blur' }]
      },
      product: ''
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    closeAdd() {
      this.ruleForm.tour = '';
      this.ruleForm.title = '';
      this.$emit('close', false);
    },
    // 关联团期选择
    querySearchT(queryString, cb){
      let planList = this.planList;
      let results = queryString ? planList.filter(this.createFilter1(queryString)) : planList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter1(queryString) {
      return (planList) => {
        return (planList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelectT(item){
      this.ruleForm.tour = item.value;
      this.tour_check();
    },
    tour_check() {
      console.log('执行！');
      const that = this;
      if (this.ruleForm.tour != '') {
        this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/groupplan/group-plan/getproname', {
          "tour_no": this.ruleForm.tour
        }).then(res => {
            console.log(res);
          if (res.data.code == 200) {
            if(res.data.data){
              that.ruleForm.title = res.data.data;
            }else{
              that.ruleForm.title = '';
            }
          }else{
            that.ruleForm.title = '';
          }
        }).catch(err => {
          console.log(err)
        })
      }else{
        this.ruleForm.title = '';
      }
    },
    submitForm() {
      if(this.ruleForm.title == '' || this.ruleForm.title == undefined){
        this.$message({
          type: 'warning',
          message: '产品名称不存在，请确认团期计划准确!'
        });
        return;
      }
//      console.log(this.$parent.multipleSelection);
      let order_sn = '';
      this.$parent.multipleSelection.forEach(function (item, index, arr) {
        order_sn += item.order_sn + ','
      });
      order_sn = order_sn.substr(0,order_sn.length-1);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/order/external-order/bindpro', {
        "order_sn": order_sn,
        "tour_no": this.ruleForm.tour,
        "product_name": this.ruleForm.title,
        "create_uid": sessionStorage.getItem('id'),
        "org_id": sessionStorage.getItem('orgID')
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
//          alert(JSON.stringify(res.data));
          that.$message({
            type: 'success',
            message: '提交成功!'
          });
          that.closeAdd();
        }else{
          if(res.data.message){
            this.$message({
              type: 'warning',
              message: res.data.message
            });
          }else{
            this.$message({
              type: 'warning',
              message: '提交失败'
            });
          }


        }
      }).catch(err => {
        console.log(err)
      })

    },
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: 100px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

</style>
