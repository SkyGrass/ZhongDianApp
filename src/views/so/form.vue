<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
            <van-field
              class="item"
              v-model="cacheForm.Row"
              readonly
              name="cWhName"
              label="源单行"
              placeholder="请选择源单行"
              is-link
              @click="openSource"
            />

            <van-field
              type="text"
              name="cBarcode"
              label="条码"
              ref="ele_cBarcode"
              v-model="form.cBarcode"
              autocomplete="off"
              placeholder="扫描或录入包装桶条码"
              id="ele_cBarcode"
              @keyup.enter="queryInv"
            >
              <template #button> <van-icon name="photograph" color="#008577" size="25" @click="doScan" /> </template
            ></van-field>

            <van-field name="fsn" label="编码" ref="ele_fsn" v-model="form.FSN" readonly placeholder="编码"></van-field>
            <van-field
              name="fname"
              label="名称"
              ref="ele_fname"
              v-model="form.FName"
              readonly
              placeholder="名称"
            ></van-field>
            <van-field name="type" label="类别" ref="ele_ftype" v-model="form.FType" readonly placeholder="类别">
            </van-field>
            <van-field
              name="fsatus"
              label="状态"
              ref="ele_fsatus"
              v-model="form.FStatus"
              readonly
              placeholder="状态"
            ></van-field>
            <van-field
              name="fcreatedate"
              label="建档日期"
              ref="ele_fcreatedate"
              v-model="form.FCreateDate"
              readonly
              placeholder="批号"
            ></van-field>
            <van-field
              name="fmaker"
              label="建档人"
              ref="ele_fmaker"
              v-model="form.FMaker"
              placeholder="建档人"
              readonly
            ></van-field>
            <van-field
              name="fusenum"
              label="累计周期次数"
              ref="ele_fusenum"
              v-model="form.FUseNum"
              placeholder="累计周期次数"
              readonly
            ></van-field>
            <van-field
              name="fclearnum"
              label="累计清洗次数"
              ref="ele_fclearnum"
              v-model="form.FClearNum"
              placeholder="累计清洗次数"
              readonly
            ></van-field>
          </div>
          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <!-- <van-button class="btn submit" size="small" @click="onSubmit">保存</van-button> -->
          </div>
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
              <li style="padding: 2px; color: red; font-weight: bold">行号：{{ item.iRowno }}</li>
              <li style="padding: 2px">编码：{{ item.FSN }}</li>
              <li style="padding: 2px">名称：{{ item.FName }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>类别：{{ item.FType }}</div>
                <div>状态：{{ item.FStatus }}</div>
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
      <van-tab title="源单页">
        <div class="list">
          <ul style="padding: 5px; font-size: 14px">
            <li style="padding: 2px">日期：{{ queryForm.dDate }}</li>
            <li style="padding: 2px">单号：{{ queryForm.cCode }}</li>
            <li style="padding: 2px">客户：{{ queryForm.cCusCode }}||{{ queryForm.cCusName }}</li>
          </ul>
          <van-divider>明细</van-divider>
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              v-for="(item, index) in sourceList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
            >
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div style="color: red; font-weight: bold">行号：{{ item.iRowno }}</div>
                <div>
                  <strong :style="{ color: item.iNum > item.iNum2 ? 'red' : item.iNum < item.iNum2 ? '#333' : 'green' }"
                    >已扫：{{ item.iNum }} / {{ item.iNum2 }}</strong
                  >
                </div>
              </li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px">单位：{{ item.cComUnitName }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>数量：{{ item.iQuantity }}</div>
                <div>件数：{{ item.iNum2 }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>是否回收：{{ item.FIsRecovery }}</div>
                <div>桶类型：{{ item.FPermitBucketType }}</div>
              </li>
            </ul>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <sourcerow ref="sourcerow" :source="sourceList" @choose="pickSource" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { getDispatch, savebucket } from '@/api/so'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getInventory } from '@/api/base'
import sourcerow from '@/components/sourcerow'
import dayjs from 'dayjs'
export default {
  name: `so_form`,
  components: { sourcerow },
  data() {
    this.confirm = 0
    this.BUSTYPE = 1
    return {
      active: 0,
      queryForm: {},
      cacheForm: {
        Row: '',
        iRowno: 0,
        Autoid: 0,
        FIsControlBucketNum: false,
        iNum2: 0
      },
      sourceList: [],
      loading: false,
      finished: false,
      curRow: {},
      cacheList: [],
      submitLoading: false,
      cSign: newGuid(),
      form: {
        cBarcode: '',

        FClearNum: 0,
        FCreateDate: '',
        FMaker: '',
        FName: '',
        FSN: '',
        FStatus: '',
        FStatusID: '',
        FType: '',
        FUseNum: 0
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.curEle = 'ele_cBarcode'
        this.setFocus()
      } else if (newV == 2) {
        this.reCalc()
      }
    }
  },
  methods: {
    onLoad() {
      this.sourceList = []
      getDispatch({ cFilter: this.queryForm.ID, FROB: this.queryForm.bRob })
        .then(({ Data }) => {
          this.sourceList = Data.map(f => {
            f.FIsRecovery = f.FIsRecovery ? '是' : '否'
            f.Row = `行：${f.iRowno}||${f.cInvName}`
            return f
          })

          if (this.sourceList.length > 0) {
            this.cacheForm.iRowno = this.sourceList[0].iRowno
            this.cacheForm.Row = this.sourceList[0].Row
            this.cacheForm.Autoid = this.sourceList[0].Autoid
            this.cacheForm.FIsControlBucketNum = this.sourceList[0].FIsControlBucketNum
            this.cacheForm.iNum2 = this.sourceList[0].iNum2
          }
        })
        .catch(err => {})
      this.loading = false
      this.finished = true
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
    doClear() {
      this.clearForm()
    },
    onSubmit() {
      if (this.checkPlan(1)) {
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '件数超过源单!'
        })
      }

      this.cacheList.push(Object.assign({}, this.form, this.cacheForm))

      this.clearForm()
      this.$toast({
        type: 'success',
        position: 'bottom',
        message: '已保存'
      })
    },
    onSave() {
      if (this.checkPlan1(0)) {
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '扫描的桶数超过或不足源单要求,请核实!'
        })
      }

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
              FType: this.BUSTYPE,
              cCusCode: '',
              cAcc_Id: accountId
            }
          )
          savebucket(
            Object.assign({}, form, {
              Entry: this.cacheList.map(m => {
                return {
                  cSourceBillID: this.queryForm.ID,
                  cSourceBillEntryID: m.Autoid,
                  FSN: m.FSN,
                  FType: m.FType,
                  FStatusID: m.FStatusID
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
      const exist = this.cacheList.filter(f => {
        return f.FSN == this.form.cBarcode
      })
      if (exist.length > 0) {
        return this.$toast({
          type: 'fail',
          message: '当前条码已扫描!',
          onOpened: () => {
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
            this.setFocus()
          }
        })
      }

      getInventory({
        FSN: this.form.cBarcode,
        FType: this.BUSTYPE,
        Autoid: this.cacheForm.Autoid
      })
        .then(({ Data, Message }) => {
          if (Data.length > 0) {
            const { FClearNum, FCreateDate, FMaker, FName, FSN, FStatus, FStatusID, FType, FUseNum } = Data[0]

            this.form.FSN = FSN
            this.form.FName = FName
            this.form.FType = FType
            this.form.FStatus = FStatus
            this.form.FStatusID = FStatusID
            this.form.FCreateDate = FCreateDate
            this.form.FMaker = FMaker
            this.form.FUseNum = FUseNum
            this.form.FClearNum = FClearNum

            this.onSubmit()
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
      // for (const key in this.form) {
      //   if (this.$store.getters.numProps.includes(key)) {
      //     this.form[key] = 0
      //   } else {
      //     this.form[key] = ''
      //   }
      // }
      this.form.cBarcode = ''
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    onFocus(e) {
      var dom = document.activeElement.id
      this.curEle = dom
      const domTarget = document.querySelector('#' + dom)
      if (domTarget != void 0) {
        setTimeout(function () {
          domTarget.scrollIntoView(false)
        }, 300)
      }
      window.localStorage.setItem('curEle', dom)
    },
    checkPlan() {
      var a1 = this.sourceList
        .filter(f => f.Autoid == this.cacheForm.Autoid)
        .map(f => {
          var a2 = this.cacheList.filter(ff => {
            return ff.Autoid == f.Autoid
          })
          return {
            Autoid: f.Autoid,
            FIsControlBucketNum: f.FIsControlBucketNum,
            iNum2: f.iNum2,
            iNumR: a2.length
          }
        })

      return a1.some(f => {
        return f.FIsControlBucketNum == true && floatSub(f.iNum2, f.iNumR) < 1
      })
    },
    checkPlan1() {
      var a1 = this.sourceList.map(f => {
        var a2 = this.cacheList.filter(ff => {
          return ff.Autoid == f.Autoid
        })
        return {
          Autoid: f.Autoid,
          FIsControlBucketNum: f.FIsControlBucketNum,
          iNum2: f.iNum2,
          iNumR: a2.length
        }
      })

      return a1.some(f => {
        return f.FIsControlBucketNum == true && floatSub(f.iNum2, f.iNumR) != 0
      })
    },
    reCalc() {
      this.sourceList.forEach((row, index) => {
        const { Autoid } = row
        var a2 = this.cacheList.filter(ff => {
          return ff.Autoid == Autoid
        })
        row.iNum = a2.length
        this.$set(this.sourceList, index, row)
      })
    },
    openSource() {
      this.$refs.sourcerow.open()
    },
    pickSource({ Autoid, FIsControlBucketNum, cInvName, iNum2, iRowno }) {
      this.cacheForm.iRowno = iRowno
      this.cacheForm.Row = `行：${iRowno}||${cInvName}`
      this.cacheForm.Autoid = Autoid
      this.cacheForm.FIsControlBucketNum = FIsControlBucketNum
      this.cacheForm.iNum2 = iNum2
      this.$nextTick(() => {
        this.curEle = 'ele_cBarcode'
        this.setFocus()
      })
    },
    cancelPicker() {
      this.setFocus()
    },
    doScan() {
      if (window.android) {
        android.openScan('ele_cBarcode')
      }
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
  },
  beforeRouteLeave(to, from, next) {
    if (this.confirm != 0) {
      delete window.keyboardChange
      delete window.scanResult
      next(false)
    }
    if (this.cacheList.length <= 0) {
      delete window.keyboardChange
      delete window.scanResult
      next()
    } else {
      setTimeout(() => {
        this.confirm = this.$dialog
          .confirm({
            title: '提示',
            message: '您确定要退出当前功能吗?'
          })
          .then(() => {
            delete window.keyboardChange
            delete window.scanResult
            next()
          })
          .catch(() => {
            delete window.keyboardChange
            delete window.scanResult
            next(false)
          })
      }, 200)
    }
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
