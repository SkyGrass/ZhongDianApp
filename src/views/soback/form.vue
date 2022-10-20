<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
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
            <van-field
              name="type"
              label="类别"
              ref="ele_ftype"
              v-model="form.FType"
              readonly
              placeholder="类别"
              @click="openBucketType"
            >
            </van-field>

            <van-field
              name="fsatus"
              label="状态"
              ref="ele_fsatus"
              v-model="form.FStatus"
              readonly
              placeholder="状态"
              @click="openBucketStatus"
            ></van-field>
            <van-field
              name="fcustname"
              label="客户"
              ref="ele_fcustname"
              v-model="form.FCustName"
              readonly
              placeholder="客户"
            ></van-field>
            <van-field
              name="fcreatedate"
              label="建档日期"
              ref="ele_fcreatedate"
              v-model="form.FCreateDate"
              readonly
              placeholder="建档日期"
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
            <van-button class="btn submit" size="small" @click="onSubmit">保存</van-button>
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
    </van-tabs>
    <bucketstatus
      ref="bucketstatus"
      :source="sources.bucketStatusList"
      @choose="pickBucketStatus"
      @cancel="cancelPicker"
    />
    <buckettype ref="buckettype" :source="sources.bucketTypeList" @choose="pickBucketType" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { savebucket } from '@/api/so'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getInventory, getBucketType, getBucketStatus } from '@/api/base'
import bucketstatus from '@/components/buckestatus'
import buckettype from '@/components/bucketype'
import dayjs from 'dayjs'
export default {
  name: `so_back`,
  components: { bucketstatus, buckettype },
  data() {
    this.confirm = 0
    this.BUSTYPE = 2
    return {
      active: 0,
      queryForm: {},

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
        FUseNum: 0,
        FCustName: ''
      },
      sources: {
        bucketTypeList: [],
        bucketStatusList: []
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.curEle = 'ele_cBarcode'
        this.setFocus()
      }
    }
  },
  methods: {
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
      if (this.form.FStatus == '') {
        return this.$toast({
          type: 'fail',
          message: '请先选择状态'
        })
      }
      this.cacheList.push(Object.assign({}, this.form, this.cacheForm))
      this.clearForm()
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
        FType: this.BUSTYPE
      })
        .then(({ Data, Message }) => {
          if (Data.length > 0) {
            const { FClearNum, FCreateDate, FMaker, FName, FSN, FStatus, FStatusID, FType, FUseNum, FCustName } =
              Data[0]

            //this.sources.bucketStatusList = [{ FID: FStatusID, FName: FStatus }]

            this.form.FSN = FSN
            this.form.FName = FName
            this.form.FType = FType
            this.form.FStatus = FStatus
            this.form.FStatusID = FStatusID
            this.form.FCreateDate = FCreateDate
            this.form.FMaker = FMaker
            this.form.FUseNum = FUseNum
            this.form.FClearNum = FClearNum
            this.form.FCustName = FCustName
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
      this.curEle = dom
      const domTarget = document.querySelector('#' + dom)
      if (domTarget != void 0) {
        setTimeout(function () {
          domTarget.scrollIntoView(false)
        }, 300)
      }
      window.localStorage.setItem('curEle', dom)
    },
    openBucketStatus() {
      //this.$refs.bucketstatus.open()
    },
    openBucketType() {
      //this.$refs.buckettype.open()
    },
    pickBucketStatus({ FID, FName }) {
      this.form.FStatus = FName
      this.form.FStatusID = FID
    },
    pickBucketType({ FName }) {
      this.form.FType = FName
    },
    cancelPicker() {
      this.setFocus()
    }
  },
  computed: {},
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  mounted() {
    setTimeout(() => {
      getBucketType({ FType: this.BUSTYPE })
        .then(({ Data }) => {
          this.sources.bucketTypeList = Data
        })
        .catch(err => {})
    }, 50)

    // setTimeout(() => {
    //   getBucketStatus({ FType: this.BUSTYPE })
    //     .then(({ Data }) => {
    //       this.sources.bucketStatusList = Data
    //     })
    //     .catch(err => {})
    // }, 100)

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
      next(false)
    }
    if (this.cacheList.length <= 0) {
      delete window.keyboardChange
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
            next()
          })
          .catch(() => {
            delete window.keyboardChange
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
