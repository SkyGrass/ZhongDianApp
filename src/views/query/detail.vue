<template>
  <div class="container">
    <div class="list0" id="list0">
      <div class="postForm" ref="postForm">
        <van-field
          v-model="curQueryType"
          readonly
          label="查询类型"
          placeholder="请选择查询类型"
          is-link
          @click="openSource"
        />
        <van-row>
          <van-col span="12">
            <van-field
              label-width="40px"
              label="开始"
              name="dBeginDate"
              is-link
              placeholder="开始时间"
              :value="startDateStr"
              input-align="right"
              @click="show1 = true"
              readonly
            />
          </van-col>
          <van-col span="12">
            <van-field
              label-width="40px"
              label="结束"
              name="dEndDate"
              is-link
              placeholder="结束时间"
              :value="endDateStr"
              input-align="right"
              @click="show2 = true"
              readonly
            />
          </van-col>
        </van-row>
        <van-field
          class="item"
          type="text"
          name="cBarcode"
          label="条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          placeholder="扫描或录入条码"
          id="ele_cBarcode"
          clearable
          @keyup.enter="queryInv"
        >
          <template #button>
            <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" />
          </template>
        </van-field>
      </div>
      <van-empty class="custom-image" description="没有记录" v-if="list.length <= 0" />

      <van-list>
        <ul v-for="(item, index) in list" :key="index" style="padding: 5px; font-size: 14px">
          <li v-if="curQueryTypeId == 1" style="padding: 2px">仓位：{{ barcode }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">存货名称：{{ item.cInvName }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
          <li v-if="curQueryTypeId != 3" style="padding: 2px">计量单位：{{ item.cComUnitName }}</li>

          <ul v-for="(item1, index1) in item.Entry" :key="index1" style="padding: 5px; font-size: 14px">
            <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
              <div style="font-weight: bold">仓库：{{ item1.cWhName }}</div>
              <div style="font-weight: bold">数量：{{ item1.iQuantity }}</div>
            </li>
            <ul>
              <li v-for="(item2, index2) in item1.Detail" :key="index2" style="padding: 3px; font-size: 14px">
                {{ item2.cDetail }}
              </li>
            </ul>
          </ul>
          <van-divider />
        </ul>
      </van-list>
    </div>

    <van-popup v-model="show1" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="form.dBeginDate"
        type="date"
        title="选择年月日"
        @confirm="onConfirm1"
        @cancel="show1 = false"
      />
    </van-popup>
    <van-popup v-model="show2" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="form.dEndDate"
        type="date"
        title="选择年月日"
        @confirm="onConfirm2"
        @cancel="show2 = false"
      />
    </van-popup>
    <sourcerow ref="sourcerow" :source="sourceList" @choose="pickSource" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { getCurrentStockDetail } from '@/api/query'
import sourcerow from '@/components/sourcerow'
import dayjs from 'dayjs'
export default {
  name: `detail`,
  components: { sourcerow },
  data() {
    this.barcode = ''
    return {
      sourceList: [
        { label: '货位', value: '1' },
        { label: '存货', value: '2' }
      ],
      curQueryType: '货位',
      curQueryTypeId: '1',

      show1: false,
      show2: false,
      form: {
        cBarcode: '',

        dBeginDate: dayjs().add(-7, 'day').toDate(),
        dEndDate: new Date(),

        cPosCode: '',
        cPosName: '',
        cBatch: '',

        cComUnitCode: '',
        cComUnitName: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        barcode: ''
      },
      list: [],
      curEle: ''
    }
  },
  watch: {
    show1(newV, oldV) {
      if (newV) {
        if (this.form.dBeginDate == '' || this.form.dBeginDate == null) {
          this.form.dBeginDate = new dayjs().toDate()
        }
      }
    },
    show2(newV, oldV) {
      if (newV) {
        if (this.form.dEndDate == '' || this.form.dEndDate == null) {
          this.form.dEndDate = new dayjs().toDate()
        }
      }
    }
  },
  methods: {
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
        }, 10)
        setTimeout(() => {
          if (window.android) {
            android.HideSoftKeyboard()
          }
        }, 50)
      }
    },
    clearForm() {
      for (const key in this.form) {
        if (key != 'dBeginDate' && key != 'dEndDate') {
          this.form[key] = ''
        }
      }
      this.list = []
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描包装桶条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      this.list = []
      getCurrentStockDetail({
        cType: this.curQueryTypeId,
        cBarcode: this.form.cBarcode,
        dBeginDate: this.startDateStr,
        dEndDate: this.endDateStr
      })
        .then(({ Data }) => {
          this.barcode = this.form.cBarcode
          this.clearForm()
          if (Data != null) {
            try {
              Data = JSON.parse(Data)
            } catch (e) {
              Data = []
            }
            if (Data.length > 0) {
              this.list = Data
              if (this.curQueryTypeId == 1) {
                this.form.cPosCode = Data[0]['cPosCode']
                this.form.cPosName = Data[0]['cPosName']
              } else if (this.curQueryTypeId == 2) {
                this.form.cBatch = Data[0]['cBatch']
              } else {
                const { cComUnitCode, cComUnitName, cInvCode, cInvName, cInvStd } = Data[0]
                this.form.cComUnitCode = cComUnitCode
                this.form.cComUnitName = cComUnitName
                this.form.cInvCode = cInvCode
                this.form.cInvName = cInvName
                this.form.cInvStd = cInvStd

                this.list = Data.map(f => {
                  return {
                    cWhCode: f.cWhCode,
                    cWhName: f.cWhName,
                    cPosCode: f.cPosCode,
                    cPosName: f.cPosName,
                    cBatch: f.cBatch,
                    iQuantity: f.iQuantity
                  }
                })
              }
            }
            this.curEle = 'ele_cBarcode'
          } else {
            this.clearForm()
          }
        })
        .catch(err => {
          this.clearForm()
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
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
    },
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    openSource() {
      this.$refs.sourcerow.open()
    },
    pickSource({ label, value }) {
      this.curQueryType = label
      this.curQueryTypeId = value
      this.$nextTick(() => {
        this.curEle = 'ele_cBarcode'
        this.list = []
        this.clearForm()
        this.setFocus()
      })
    },
    cancelPicker() {
      this.setFocus()
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    onConfirm1(date) {
      this.show1 = false
      this.onLoad()
    },
    onConfirm2(date) {
      this.show2 = false
      this.onLoad()
    }
  },
  computed: {
    startDateStr() {
      if (this.form.dBeginDate == '' || this.form.dBeginDate == null) return ''
      return this.formatDate(this.form.dBeginDate)
    },
    endDateStr() {
      if (this.form.dEndDate == '' || this.form.dEndDate == null) return ''
      return this.formatDate(this.form.dEndDate)
    }
  },
  created() {},
  mounted() {
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
      width: 30%;
    }
  }

  .list0,
  .list {
    height: calc(100vh);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh);
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
  .item:after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0.42667rem;
    bottom: 0;
    left: 0.42667rem;
    border-bottom: 0.02667rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  table {
    border: 1px solid #333;
  }

  table td {
    border-top: 0;
    border-bottom: 1px solid #333;
    border-right: 1px solid #333;
    border-left: 0;
  }

  table tr.lastRow td {
    border-bottom: 0;
  }

  table tr td.lastCol {
    border-right: 0;
  }
}
</style>
  