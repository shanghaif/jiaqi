<template>
  <div class="loan-management">
    <div style="text-align: right; margin:25px 20px 0 0;">
      <el-button type="warning" plain  @click="handleCancel('reimburse')">取消</el-button>
    </div>
    <el-divider content-position="left" class='title-margin'>报销信息</el-divider>
    <el-row class="row-content">
      <el-col :span="24">
        <el-tabs v-model="tabShowWhich" @tab-click="handleClick">
          <el-tab-pane v-for="tabItem in keepBackContent" :key="tabItem.id" :label="'报销 - '+String(tabItem.id)" :name="String(tabItem.id)">
            <el-row class="item-content">
              <el-tag type="warning" v-if="tabItem.checkType=='0'" class="distributor-status">审批中</el-tag>
              <el-tag type="danger" v-if="tabItem.checkType=='2'" class="distributor-status">驳回</el-tag>
              <el-tag type="success" v-if="tabItem.checkType=='1'" class="distributor-status">通过</el-tag>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.id }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.createUser }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
                <el-col :span="15"><div class="grid-del">{{ tabItem.createTime | formatDateCreateAn }}</div></el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">团期计划:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.groupCode }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">产品名称:</div></el-col>
                <el-col :span="17"><div class="grid-del ">{{ tabItem.productName }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">摘要:</div></el-col>
                <el-col :span="15"><div class="grid-del ">{{ tabItem.mark }}</div></el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="14">
                <el-col :span="6"><div class="grid-del label-color print-hidden">附件:</div></el-col>
                <el-col :span="18">
                  <el-upload
                    class="upload-demo"
                    name="files"
                    :file-list="tabItem.files"
                    :show-file-list=true
                    action="test"
                    :disabled=true
                    :on-preview="handlePreview"
                  >
                  </el-upload>
                </el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg reimbursement-mt" justify="space-between">
              <el-table :data="tabItem.payments" border :header-cell-style="getRowClass" v-loading="listLoading">
                <el-table-column prop="paymentID" label="无收入借款或预付款ID" align="center"></el-table-column>
                <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                <el-table-column prop="paymentPrice" label="借款金额" align="center"></el-table-column>
                <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="人数" align="center"></el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-row type="flex" class="row-bg row-content" justify="space-between">
      <el-table :data="examineData" border :header-cell-style="getRowClass" v-loading="listLoading">
        <el-table-column prop="createTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
        <el-table-column prop="name" label="审批人" align="center"></el-table-column>
        <el-table-column prop="typeStr" label="审批结果" align="center"></el-table-column>
        <el-table-column prop="opinions" label="审批意见" align="center"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import common from './common'

  export default {
    name: "reimbursementDetails",
    data(){
      return {
        listLoading: false,
        tabShowWhich: null,
        examineData: [],
        getApproveListGuid: null,
        keepBackContent: null,
        keepComponentName: null,
      }
    },
    mixins:[common],
    created(){
      this.tabShowWhich = String(this.$route.query.queryApproveExpenseID)
      this.getApproveListGuid = this.$route.query.approveDetailGuid
      this.keepComponentName = this.$route.query.componentName
      this.getApproveDetail(this.getApproveListGuid)
      this.auditResult(this.getApproveListGuid)
    },
    methods: {
      handlePreview(file) {
        window.open(file.url);
      },
      auditResult(paramsGuid) {
        this.listLoading = true
        var that =this
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetOpinions', {
          jQ_ID: paramsGuid,
          jQ_Type: 3,
        }).then(obj => {
          that.examineData = []
          that.examineData = obj.data;
          this.listLoading = false
        }).catch(obj => {})
      },
      getApproveDetail(guidParams){
        this.listLoading = true
        this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/list',{
          "object": {
            guid: guidParams
          }
        })
          .then(obj => {
            let keepData = obj.data.objects
            this.keepBackContent = keepData
            this.listLoading = false
          }).catch(err => {
          console.log(err)
        })
      },
      handleClick(){

      }
    }
  }
</script>


<style scoped lang="scss">
  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
    height: auto;
    border: 1px solid #e6e6e6;
    .row-content{
      width: 95%;
      margin: 0 auto;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .reimbursement-mt{
      margin: 20px 0;
    }
    .item-content{
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 2%;
    }
    .row-bg {
      padding: 13px 0;
      .grid-del{
        text-align: left;
        font-size: 14px;
      }
      .label-color{
        color: #909399;
      }
      .doc-mt-3{
        margin-top: 3px;
      }
    }
  }
</style>
