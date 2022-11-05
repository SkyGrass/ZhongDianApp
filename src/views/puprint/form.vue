<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="源单页">
        <div class="list">
          <ul style="padding: 5px; font-size: 14px">
            <li style="padding: 2px">日期：{{ queryForm.dDate }}</li>
            <li style="padding: 2px">单号：{{ queryForm.cCode }}</li>
            <li style="padding: 2px">供应商：{{ queryForm.cVenCode }}||{{ queryForm.cVenName }}</li>
          </ul>
          <van-divider>明细</van-divider>
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              v-for="(item, index) in sourceList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onChoose(item)"
            >
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div style="color: red; font-weight: bold">行号：{{ item.iVouchRowno }}</div>
              </li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>单位：{{ item.cComUnitName }}</div>
                <div>包装数量：{{ item.iPackQuantity }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>数量：{{ item.iQuantity }}</div>
              </li>
            </ul>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="提交页">
        <div class="list1">
          <van-empty class="custom-image" description="没有记录" v-if="cacheList.length <= 0" />
          <van-list>
            <ul
              v-for="(item, index) in cacheList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onDelete(index)"
            >
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div style="color: red; font-weight: bold">行号：{{ item.iVouchRowno }}</div>
              </li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>单位：{{ item.cComUnitName }}</div>
                <div>包装数量：{{ item.iPackQuantity }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>数量：{{ item.iQuantity }}</div>
              </li>
            </ul>
            <van-submit-bar
              style="background-color: #e6e6e6"
              button-color="#008577"
              :disabled="cacheList.length <= 0"
              button-text="提交"
              @submit="onSave"
              :loading="submitLoading"
            />
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show" close-on-popstate :close-on-click-overlay="false" class="form" safe-area-inset-bottom>
      <van-form>
        <h3 style="text-align: center"></h3>
        <van-field name="iPackQuantity" label="包装数量">
          <template #input>
            <van-stepper input-width="120px" v-model="form.iPackQuantity" integer />
          </template>
        </van-field>
        <van-field label="批号" name="cBatch" input-width="120px" v-model="form.cBatch" placeholder="批号"></van-field>
        <div style="margin: 5px; text-align: right">
          <van-button style="margin-right: 20px" @click="show = false">取消</van-button>
          <van-button color="#008577" type="info" @click="onSubmit">确定</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import { getPuArrival2, savePurArrPrint } from '@/api/puprint'
import { newGuid, floatAdd, floatSub } from '@/utils'
import dayjs from 'dayjs'
export default {
  name: `puprint_form`,
  data() {
    return {
      active: 0,
      show: false,
      queryForm: {},
      sourceList: [],
      loading: false,
      finished: false,
      submitLoading: false,
      cSign: newGuid(),
      form: {
        iVouchRowno: 0,
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitName: '',
        iPackQuantity: 0,
        cBatch: '',

        ID: '',
        Autoid: ''
      }
    }
  },
  watch: {},
  methods: {
    onLoad() {
      this.sourceList = []
      getPuArrival2({ cFilter: this.queryForm.ID, FROB: this.queryForm.bRob })
        .then(({ Data }) => {
          this.sourceList = Data
        })
        .catch(err => {})
      this.loading = false
      this.finished = true
    },
    onChoose(row) {
      this.form = Object.assign({}, row)
      this.show = true
    },
    onDelete(index) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要移除当前记录吗?'
        })
        .then(() => {
          this.cacheList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    onSubmit() {
      if (this.form.cBatch == '') {
        return this.$toast({
          type: 'fail',
          message: '批次号不可为空!'
        })
      }

      const r = this.cacheList.filter(f => f.ID == this.form.ID && f.Autoid == this.form.Autoid)
      if (r.length > 0) {
        return this.$toast({
          type: 'fail',
          message: '当前行已存在提交页,禁止重复操作!'
        })
      } else {
        this.cacheList.push(Object.assign({}, this.form))
        this.show = false
        this.$toast({
          type: 'success',
          position: 'bottom',
          message: '已保存'
        })
      }
    },
    onSave() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要提交记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const { accountId } = this.$store.getters
          const form = Object.assign(
            {},
            {
              cSign: this.cSign,
              cAcc_Id: accountId
            }
          )
          savePurArrPrint(
            Object.assign({}, form, {
              Entry: this.cacheList.map(m => {
                return {
                  cSourceBillID: m.ID,
                  cSourceBillEntryID: m.Autoid,
                  iPackQuantity: m.iPackQuantity,
                  cBatch: m.cBatch
                }
              })
            })
          )
            .then(({ Data, Message }) => {
              this.$toast({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.cacheList = []
                  this.$router.go(-1)
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    }
  },
  computed: {},
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  mounted() {
    this.onLoad()

    window.scanResult = result => {
      this.form.cBarcode = result
      setTimeout(() => {
        this.queryInv()
      }, 600)
    }

    this.$nextTick(() => {
      if (this.$refs.ele_cBarcode != void 0) {
        this.$refs.ele_cBarcode.focus()
        if (window.android) {
          android.HideSoftKeyboard()
        }
        setTimeout(() => {
          if (window.android) {
            android.HideSoftKeyboard()
          }
        }, 100)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;

  .list0 .btns {
    display: flex;
    margin-top: 3px;
    margin-bottom: 20px;
    justify-content: space-around;

    .btn {
      width: 40%;
    }

    .submit {
      color: white;
      background: rgb(0, 133, 119);
      border-color: rgb(0, 133, 119);
    }
  }

  .postForm {
    .van-cell {
      padding: 8px 10px;

      ::v-deep .van-cell__title {
        font-size: 15px;
        color: #333;
        width: 70px;
      }
    }
  }

  .list0,
  .list {
    height: calc(100vh - 40px);
    overflow: scroll;
  }

  .sourceList {
    height: calc(100vh - 40px);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh - 60px);
    overflow: scroll;
  }

  .form {
    width: 94vw;
  }

  .header {
    .item {
      padding: 8px 10px;
    }
  }
}
</style>
