<template>
  <div class="container">
    <div class="list0" id="list0">
      <div class="postForm" ref="postForm">
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
          <template #button> <van-icon name="photograph" color="#008577" size="25" @click="doScan" /> </template>
        </van-field>
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
      <div style="font-size: 16px; margin-top: 10px; padding: 10px" v-if="list.length > 0">
        <ul>
          <li><strong>生命周期：</strong></li>
        </ul>
        <div v-for="(row, index) in list" :key="index">
          <ul>
            <li>{{ row.FDetail }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBucketRecord } from '@/api/query'
export default {
  name: `record`,
  data() {
    return {
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
      list: [],
      curEle: ''
    }
  },
  watch: {},
  methods: {
    doClear() {
      this.clearForm()
    },
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
        this.form[key] = ''
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
      const method = getBucketRecord
      method({ FSN: this.form.cBarcode })
        .then(({ Data }) => {
          this.clearForm()
          if (Data != null) {
            const { FClearNum, FCreateDate, FMaker, FName, FSN, FStatus, FStatusID, FType, FUseNum, Entry } = Data

            this.form.FSN = FSN
            this.form.FName = FName
            this.form.FType = FType
            this.form.FStatus = FStatus
            this.form.FStatusID = FStatusID
            this.form.FCreateDate = FCreateDate
            this.form.FMaker = FMaker
            this.form.FUseNum = FUseNum
            this.form.FClearNum = FClearNum

            this.list = Entry

            this.form.cBarcode = ''
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
      this.curEle = dom
      const domTarget = document.querySelector('#' + dom)
      if (domTarget != void 0) {
        setTimeout(function () {
          domTarget.scrollIntoView(false)
        }, 300)
      }
      window.localStorage.setItem('curEle', dom)
    },
    doScan() {
      if (window.android) {
        android.openScan('ele_cBarcode')
      }
    }
  },
  computed: {},
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
  },
  beforeRouteLeave(to, from, next) {
    delete window.keyboardChange
    delete window.scanResult
    next()
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
  