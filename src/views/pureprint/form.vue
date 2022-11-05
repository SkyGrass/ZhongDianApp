<template>
  <div class="container">
    <div class="list0" id="list0">
      <div ref="postForm" class="postForm inputForm">
        <van-field
          type="text"
          name="cBarcode"
          label="补打条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          placeholder="扫描或录入补打条码"
          id="ele_cBarcode"
          clearable
          @keyup.enter="queryInv"
          ><template #button>
            <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" /> </template
        ></van-field>

        <van-field
          name="fbarCode"
          label="条码"
          ref="ele_fbarCode"
          v-model="form.FBarcode"
          readonly
          placeholder="条码"
        ></van-field>
        <van-field
          name="fvenName"
          label="供应商"
          ref="ele_fvenName"
          v-model="form.FVenName"
          readonly
          placeholder="供应商"
        ></van-field>
        <van-field
          name="finvCode"
          label="存货编码"
          ref="ele_finvCode"
          v-model="form.FInvCode"
          readonly
          placeholder="存货编码"
        ></van-field>
        <van-field
          name="finvName"
          label="存货名称"
          ref="ele_finvName"
          v-model="form.FInvName"
          readonly
          placeholder="存货名称"
        ></van-field>
        <van-field
          name="finvstd"
          label="规格型号"
          ref="ele_finvstd"
          v-model="form.FInvStd"
          readonly
          placeholder="规格型号"
        ></van-field>
        <van-field
          name="fcomUnitName"
          label="单位"
          ref="ele_fcomUnitName"
          v-model="form.FComUnitName"
          readonly
          placeholder="单位"
        ></van-field>
        <van-field
          name="fbatch"
          label="批号"
          ref="ele_fbatch"
          v-model="form.FBatch"
          readonly
          placeholder="批号"
        ></van-field>
        <van-field name="fqty" label="数量" ref="ele_fqty" v-model="form.FQty" readonly placeholder="数量"></van-field>
        <van-field
          name="fserialNo"
          label="流水号"
          ref="ele_fserialNo"
          v-model="form.FSerialNo"
          readonly
          placeholder="流水号"
        ></van-field>
      </div>
      <div class="btns">
        <van-button class="btn" size="small" @click="doClear">清空</van-button>
        <van-button class="btn submit" size="small" @click="onSave">补打</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getYCLBarcode, saveRepeatBarcode } from '@/api/puprint'
import { newGuid, floatAdd, floatSub } from '@/utils'

import dayjs from 'dayjs'
export default {
  name: `pureprint_form`,
  data() {
    return {
      loading: false,
      finished: false,
      submitLoading: false,
      cSign: newGuid(),
      form: {
        cBarcode: '',

        FBarcode: '',
        FSerialNo: '',
        FVenName: '',
        FInvCode: '',
        FInvName: '',
        FInvStd: '',
        FComUnitName: '',
        FQty: '',
        FBatch: ''
      },
      curEle: ''
    }
  },
  watch: {},
  methods: {
    doClear() {
      this.clearForm()
    },
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    onSave() {
      if (this.form.FBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先输入补打条码进行查询!'
        })
      }
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要补打记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const { accountId } = this.$store.getters
          const form = Object.assign(
            {},
            {
              cSign: this.cSign,
              cAcc_Id: accountId,
              cBarcode: this.form.FBarcode
            }
          )
          saveRepeatBarcode(Object.assign({}, form))
            .then(({ Data, Message }) => {
              this.$toast({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.$router.go(-1)
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    },
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
          if (window.android) {
            android.HideSoftKeyboard()
          }
          setTimeout(() => {
            if (window.android) {
              android.HideSoftKeyboard()
            }
          }, 50)
        }, 10)
      }
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
            this.setFocus()
          }
        })
      }
      getYCLBarcode({
        cBarcode: this.form.cBarcode
      })
        .then(({ Data, Message }) => {
          if (Data.length > 0) {
            const { FBarcode, FSerialNo, FVenName, FInvCode, FInvName, FInvStd, FComUnitName, FQty, FBatch } = Data[0]

            //this.sources.bucketStatusList = [{ FID: FStatusID, FName: FStatus }]

            this.form.FBarcode = FBarcode
            this.form.FSerialNo = FSerialNo
            this.form.FVenName = FVenName
            this.form.FInvCode = FInvCode
            this.form.FInvName = FInvName
            this.form.FInvStd = FInvStd
            this.form.FComUnitName = FComUnitName
            this.form.FQty = FQty
            this.form.FBatch = FBatch
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
          } else {
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
            return this.$toast({
              type: 'fail',
              message: Message,
              onOpened: () => {
                this.setFocus(true)
              }
            })
          }
        })
        .catch(err => {
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    clearForm() {
      for (const key in this.form) {
        // if (key != 'FStatus' && key != 'FStatusID') {}
        if (this.$store.getters.numProps.includes(key)) {
          this.form[key] = 0
        } else {
          this.form[key] = ''
        }
      }
      this.form.cBarcode = ''
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    onFocus(e) {
      var dom = document.activeElement.id
      if (dom != '') {
        this.curEle = dom
        const domTarget = document.querySelector('#' + dom)
        if (domTarget != void 0) {
          setTimeout(function () {
            domTarget.scrollIntoView(false)
          }, 300)
        }
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    window.scanResult = result => {
      setTimeout(() => {
        if (this.curEle == 'ele_cBarcode') {
          this.form.cBarcode = result
          this.queryInv()
        }
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
    height: calc(100vh - 10px);
    overflow: scroll;
  }

  .sourceList {
    height: calc(100vh - 10px);
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
