<template>
  <div class="container">
    <div class="header van-hairline--bottom">
      <van-form class="postForm">
        <van-field
          class="item"
          v-model="headForm.cWhName"
          readonly
          name="cWhName"
          label="仓库"
          placeholder="请选择仓库"
          is-link
          @click="openWarehouse"
        />
        <van-field
          class="item"
          v-model="headForm.cRdName"
          readonly
          name="cRdName"
          label="出库方式"
          placeholder="请选择出库方式"
          is-link
          @click="openRd"
        />
        <van-field
          class="item"
          v-model="headForm.cDepName"
          readonly
          name="cDepName"
          label="生产车间"
          placeholder="请选择生产车间"
          is-link
          @click="openDeptpartment"
        />
        <van-field class="item" v-model="headForm.cMemo" name="cMemo" label="备注" placeholder="备注" />
      </van-form>
    </div>
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
            <van-field
              type="text"
              name="cPosName"
              label="货位"
              ref="ele_cPosName"
              v-model="form.cPosName"
              autocomplete="off"
              placeholder="扫描或录入货位"
              v-show="control.usePos"
              clearable
              id="ele_cPosName"
              @keyup.enter="queryPos"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cPosName')" /> </template
            ></van-field>

            <van-field
              type="text"
              name="cBarcode"
              label="条码"
              ref="ele_cBarcode"
              v-model="form.cBarcode"
              autocomplete="off"
              placeholder="扫描或录入存货条码"
              clearable
              id="ele_cBarcode"
              @keyup.enter="queryInv"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" /> </template
            ></van-field>
            <van-field
              name="cInvCode"
              label="存货编码"
              ref="ele_cInvCode"
              v-model="form.cInvCode"
              readonly
              placeholder="存货编码"
            ></van-field>
            <van-field
              name="cInvName"
              label="存货名称"
              ref="ele_cInvName"
              v-model="form.cInvName"
              readonly
              placeholder="存货名称"
            ></van-field>
            <van-field
              name="cInvStd"
              label="规格型号"
              ref="ele_cInvStd"
              v-model="form.cInvStd"
              readonly
              placeholder="规格型号"
            >
            </van-field>
            <van-field
              name="cBatch"
              label="批号"
              ref="ele_cBatch"
              v-model="form.cBatch"
              :readonly="isReadOnly"
              placeholder="批号"
              @focus="onFocus"
              @click="onFocus"
              v-show="showBatch"
            ></van-field>
            <van-field
              name="dMdate"
              label="生产日期"
              ref="ele_dMdate"
              v-model="form.dMdate"
              v-show="showQuality"
              placeholder="生产日期"
              readonly
            ></van-field>
            <van-field
              name="dVdate"
              label="到期日期"
              ref="ele_dVdate"
              v-model="form.dVdate"
              v-show="showQuality"
              placeholder="到期日期"
              readonly
            ></van-field>
            <van-row>
              <van-col span="12">
                <van-field
                  name="cComUnitName"
                  label="单位"
                  ref="ele_cComUnitName"
                  v-model="form.cComUnitName"
                  readonly
                  placeholder="单位"
                ></van-field>
              </van-col>
              <van-col span="12">
                <van-field
                  name="iStockQuantity"
                  label="库存数量"
                  ref="ele_iStockQuantity"
                  v-model="form.iStockQuantity"
                  placeholder="库存数量"
                  readonly
                  v-show="showStock"
                ></van-field></van-col
            ></van-row>
            <van-row>
              <van-col span="12">
                <van-field
                  name="iPlanQuantity"
                  label="计划数量"
                  ref="ele_iPlanQuantity"
                  v-model="form.iPlanQuantity"
                  placeholder="计划数量"
                  readonly
                >
                </van-field
              ></van-col>
              <van-col span="12"
                ><van-field
                  name="iCommitQuantity"
                  label="已扫数量"
                  ref="ele_iCommitQuantity"
                  v-model="form.iCommitQuantity"
                  placeholder="已扫数量"
                  readonly
                ></van-field
              ></van-col>
            </van-row>
            <van-row>
              <van-col span="12" v-if="isReadOnly"
                ><van-field
                  name="iCommitQuantity"
                  label="标签数量"
                  ref="ele_iCommitQuantity"
                  v-model="form.iLabelQuantity"
                  placeholder="标签数量"
                  readonly
                ></van-field
              ></van-col>
              <van-col span="12">
                <van-field
                  type="number"
                  name="iQuantity"
                  label="出库数量"
                  ref="ele_iQuantity"
                  label-class="labelCls"
                  v-model="form.iQuantity"
                  clickable
                  autocomplete="off"
                  id="ele_iQuantity"
                  @focus="onFocus"
                  @click="onFocus"
                  @keyup.enter="inputQuantity"
                ></van-field>
              </van-col>
            </van-row>
            <van-row>
              <van-field
                v-if="isReadOnly"
                type="number"
                name="iOddQuantity"
                label="拆包数量"
                ref="ele_iOddQuantity"
                v-model="form.iOddQuantity"
                clickable
                autocomplete="off"
                id="ele_iOddQuantity"
                readonly
                @keyup.enter="inputQuantity"
              ></van-field>
              <van-field
                v-if="isReadOnly"
                type="text"
                name="cOddPosCode"
                label="余料货位"
                ref="ele_cOddPosCode"
                v-model="form.cOddPosCode"
                autocomplete="off"
                placeholder="扫描或录入余料货位"
                id="ele_cOddPosName"
                @focus="onFocus"
                @click="onFocus"
                @keyup.enter="queryPos"
              ></van-field>
            </van-row>
            <input style="width: 0px; heigh: 0px; border: none" ref="ele_hideInput" @keyup.enter="onSubmit" />
          </div>
          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <van-button ref="ele_submit" class="btn submit" size="small" @click="inputQuantity">保存</van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="列表页">
        <div class="list1">
          <van-empty class="custom-image" description="没有记录" v-if="cacheList.length <= 0" />
          <van-list>
            <ul
              v-for="(item, index) in cacheList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onDelete(index, item)"
            >
              <li style="padding: 2px">行号：{{ item.iVouchRowno }}</li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>单位：{{ item.cComUnitName }}</div>
                <div>数量：{{ item.iQuantity }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>货位：{{ item.cPosName }}</div>
                <div>批号：{{ item.cBatch }}</div>
              </li>
              <li
                v-if="item.haveOdd"
                style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between"
              >
                <div>余料数量：{{ item.iOddQuantity }}</div>
                <div>余料货位：{{ item.cOddPosCode }}</div>
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
            <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
              <div>单号：{{ queryForm.cCode }}</div>
              <div>行号：{{ queryForm.iVouchRowno }}</div>
            </li>
            <li style="padding: 2px">生产部门：{{ queryForm.cDepName }}</li>
            <li style="padding: 2px">日期：{{ queryForm.dDate }}</li>
            <li style="padding: 2px">产品编码：{{ queryForm.cInvCode }}</li>
            <li style="padding: 2px">产品名称：{{ queryForm.cInvName }}</li>
            <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
              <div>批号：{{ queryForm.cBatch }}</div>
              <div>数量：{{ queryForm.iQuantity }}</div>
            </li>
          </ul>
          <van-divider>明细</van-divider>
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              v-for="(item, index) in sourceList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
            >
              <li style="padding: 2px">行号：{{ item.iVouchRowno }}</li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>单位：{{ item.cComUnitName }}</div>
                <div>数量：{{ item.iQuantity2 }}</div>
              </li>
              <div>
                <table style="width: 100%; text-align: center" border="1">
                  <tr style="width: 100%">
                    <td style="width: 25%">货位</td>
                    <td style="width: 25%">批号</td>
                    <td style="width: 25%">应发量</td>
                    <td style="width: 25%">已发量</td>
                  </tr>
                  <tr
                    v-for="(row, ri) in item.inVStockList"
                    v-bind:key="ri"
                    :style="[
                      { 'background-color': floatSub(row.iCompleteQuantity, row.iQuantity) != 0 ? '' : 'green' },
                      { color: floatSub(row.iCompleteQuantity, row.iQuantity) == 0 ? '#fff' : '#333' }
                    ]"
                  >
                    <td style="width: 25%">{{ row.cPosCode }}</td>
                    <td style="width: 25%">{{ row.cBatch }}</td>
                    <td style="width: 25%">{{ row.iQuantity }}</td>
                    <td style="width: 25%">
                      {{ row.iCompleteQuantity }}
                    </td>
                  </tr>
                </table>
              </div>
            </ul>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <warehouse ref="warehouse" :source="sources.warehouseList" @choose="pickWarehouse" @cancel="cancelPicker" />
    <deptpartment
      ref="deptpartment"
      :source="sources.departmentList"
      @choose="pickDeptpartment"
      @cancel="cancelPicker"
    />
    <rd ref="rd" :source="sources.rdList" @choose="pickRd" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { saveMaterialOut, saveOddBarcode, getMo, getStockOutDetail } from '@/api/out'
import { newGuid, floatAdd, floatSub } from '@/utils'
import warehouse from '@/components/warehouse'
import deptpartment from '@/components/deptpartment'
import rd from '@/components/rd'
import { getWarehouse, getDepartment, getRdStyle, getPosition, getInventory } from '@/api/base'
import dayjs from 'dayjs'
export default {
  name: `out_form`,
  components: { warehouse, deptpartment, rd },
  data() {
    return {
      active: 0,
      queryForm: {},
      headForm: {
        cWhCode: '',
        cWhName: '',

        cRdCode: '',
        cRdName: '',

        cDepCode: '',
        cDepName: '',
        cMemo: '',
        FROB: '1'
      },
      sourceList: [],
      curStockList: [],
      loading: false,
      finished: false,
      submitLoading: false,
      sources: {
        warehouseList: [],
        departmentList: [],
        rdList: []
      },
      control: {
        usePos: false,
        useBatch: false,
        useQuality: false,
        groupType: 1
      },
      cSign: newGuid(),
      form: {
        iVouchRowno: '',

        cPosCode: '',
        cPosName: '',

        cOddPosCode: '',
        cOddPosName: '',

        barcode: '',
        cBarcode: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitCode: '',
        cComUnitName: '',
        cBatch: '',
        iMassDate: '', //质保期时长
        cMassUnit: '', //质保期时长单位 1 年 、2 月、 3 日
        dMdate: '', //生产日期
        dVdate: '', //到期日期
        iQuantity: '',
        iOddQuantity: '0',
        iPlanQuantity: '0',
        iCommitQuantity: '0',
        iLabelQuantity: 0,
        iChangRate: 0,
        iNum: 0,
        cSourceBillID: '',
        cSourceBillNo: '',
        cSourceBillEntryID: '',

        haveOdd: false
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.setFocus()
      }
    },
    'form.iQuantity': {
      handler(newV, oldV) {
        this.form.iOddQuantity = floatSub(this.form.iLabelQuantity, newV)
      }
    },
    'headForm.cWhCode': {
      handler(newV, oldV) {
        if (newV != oldV && oldV != '') {
          console.log(newV, this.queryForm.ID, this.sourceList)
          getStockOutDetail({ cWhCode: newV, cSourceBillID: this.queryForm.ID }).then(({ Data }) => {
            this.curStockList = Data
          })
        }
      }
    },
    curStockList(newV, oldV) {
      if (newV) {
        this.sourceList = this.sourceList.map(f => {
          const rows = newV.filter(ff => ff.cInvCode == f.cInvCode)
          if (f.cBatch == void 0) {
            f.cBatch = ''
          }
          f.inVStockList = rows.map(fff => {
            fff.iCompleteQuantity = 0
            return fff
          })
          return f
        })
      }
    }
  },
  methods: {
    floatSub,
    onLoad() {
      this.sourceList = []
      getMo({ cFilter: this.queryForm.ID, FROB: this.queryForm.bRob })
        .then(({ Data }) => {
          setTimeout(() => {
            getStockOutDetail({ cWhCode: this.headForm.cWhCode, cSourceBillID: this.queryForm.ID }).then(
              ({ Data: Data1 }) => {
                this.curStockList = Data1
              }
            )
          }, 200)

          this.sourceList = Data.map(f => {
            if (f.cBatch == void 0) {
              f.cBatch = ''
            }
            return f
          })
        })
        .catch(err => {})
      this.loading = false
      this.finished = true
    },
    onDelete(index, row) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要移除当前记录吗?'
        })
        .then(() => {
          this.cacheList.splice(index, 1)
          const { cPosCode, cInvCode, cBatch } = row
          const position = this.sourceList.findIndex(f => f.cInvCode == cInvCode)
          if (position > -1) {
            const aRecord = this.sourceList[position].inVStockList
            const position1 = aRecord.findIndex(
              f => f.cInvCode == cInvCode && f.cBatch == cBatch && f.cPosCode == cPosCode
            )
            if (position1 > -1) {
              this.sourceList[position].inVStockList[position1].iCompleteQuantity = 0
            }
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    doClear() {
      this.clearForm()
    },
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    onSubmit() {
      if (this.checkStock()) {
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '当前库存量不够!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      if (this.checkPlan()) {
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '数量超过源单!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }

      this.onUpload(res => {
        if (!res) {
          this.form.cOddPosCode = ''
          this.form.cOddPosName = ''
        }
        // const position = this.cacheList.findIndex(f => {
        //   return (
        //     f.cSourceBillID == this.form.cSourceBillID &&
        //     f.cSourceBillEntryID == this.form.cSourceBillEntryID &&
        //     f.cInvCode == this.form.cInvCode &&
        //     f.cBatch == this.form.cBatch
        //   )
        // })

        // if (position > -1) {
        //   let r = this.cacheList[position]
        //   r.iQuantity = floatAdd(r.iQuantity, this.form.iQuantity)
        //   this.$set(this.cacheList, position, Object.assign({}, r))
        // } else {
        this.cacheList.push(Object.assign({}, this.form))
        // }

        const position1 = this.sourceList.findIndex(f => {
          return (
            f.ID == this.form.cSourceBillID &&
            f.Autoid == this.form.cSourceBillEntryID &&
            f.cInvCode == this.form.cInvCode
          )
        })

        if (position1 > -1) {
          let r1 = this.sourceList[position1].inVStockList
          let aposition = r1.findIndex(
            f => f.cInvCode == this.form.cInvCode && f.cBatch == this.form.cBatch && f.cPosCode == this.form.cPosCode
          )
          if (aposition > -1) {
            let arecord = this.sourceList[position1].inVStockList[aposition]
            arecord.iCompleteQuantity = floatAdd(arecord.iCompleteQuantity, this.form.iQuantity)

            //this.$set(this.sourceList, position1, Object.assign({}, r))
          }
        }
        this.clearForm()
      })
    },
    onSave() {
      if (this.headForm.cDepName == '') {
        return this.$toast({ type: 'fail', message: '请先选择部门!' })
      }
      if (
        this.curStockList.some(f => {
          return floatSub(f.iCompleteQuantity, f.iQuantity) > 0
        })
      ) {
        return this.$toast({ type: 'fail', message: '发现超出源单库存的发料记录!' })
      }
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要提交记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const { accountId } = this.$store.getters
          const form = Object.assign({}, this.headForm, {
            cSign: this.cSign,
            FROB: this.queryForm.redblue == '1' ? '1' : '-1',
            cAcc_Id: accountId
          })
          saveMaterialOut(
            Object.assign(
              {},
              [form].map(m => {
                return {
                  cSign: m.cSign,
                  FROB: m.FROB,
                  cAcc_Id: m.cAcc_Id,
                  cWhCode: m.cWhCode,
                  cRdCode: m.cRdCode,
                  cDepCode: m.cDepCode,
                  cMemo: m.cMemo
                }
              })[0],
              {
                Entry: this.cacheList.map(m => {
                  return {
                    cSourceBillID: m.cSourceBillID,
                    cSourceBillNo: m.cSourceBillNo,
                    cSourceBillEntryID: m.cSourceBillEntryID,
                    cInvCode: m.cInvCode,
                    cPosCode: m.cPosCode,
                    cBatch: m.cBatch,
                    iMassDate: m.iMassDate,
                    cMassUnit: m.cMassUnit,
                    dMdate: m.dMdate,
                    dVdate: m.dVdate,
                    iQuantity: m.iQuantity,
                    iChangRate: m.iChangRate,
                    iNum: m.iNum,
                    iOddQuantity: m.iOddQuantity,
                    cOddPosCode: m.cOddPosCode,
                    cBarcode: m.barcode
                  }
                })
              }
            )
          )
            .then(({ Data, Message }) => {
              this.$toast({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.cacheList = []
                  this.$router.go(-1) //回退1个
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    },
    onUpload(callback) {
      if (this.form.iOddQuantity != '' && floatAdd(this.form.iOddQuantity, 0) > 0) {
        if (this.form.cOddPosCode == '') {
          this.curEle = 'ele_cOddPosName'
          return this.$toast({
            type: 'fail',
            message: '余料货位不可为空!',
            onOpened: () => {
              this.setFocus(true)
            }
          })
        }
        this.form.haveOdd = true

        saveOddBarcode({
          cSourceBillID: this.form.cSourceBillID,
          cSourceBillEntryID: this.form.cSourceBillEntryID,
          iQuantity: this.form.iQuantity,
          iOddQuantity: this.form.iOddQuantity,
          cOddPosCode: this.form.cOddPosCode,
          cBarcode: this.form.barcode,
          cSign: this.cSign
        })
          .then(({ Data, Message }) => {
            this.$toast({
              type: 'success',
              message: '拆包已提交!',
              onClose: () => {
                callback && callback(true)
              }
            })
          })
          .catch(({ Message }) => {
            this.submitLoading = false
          })
      } else {
        if (floatAdd(this.form.iOddQuantity, 0) < 0) {
          return this.$toast({
            type: 'fail',
            message: '出库量不能超过标签数量!',
            onOpened: () => {
              this.setFocus(true)
            }
          })
        } else {
          this.form.haveOdd = false
          callback && callback(false)
        }
      }
    },
    openWarehouse() {
      if (this.forbidden) {
        return this.$toast({ type: 'fail', message: '已经有扫描记录,禁止操作!' })
      }
      this.$refs.warehouse.open()
    },
    openDeptpartment() {
      this.$refs.deptpartment.open()
    },
    openRd() {
      this.$refs.rd.open(0)
    },
    pickWarehouse({ cWhCode, cWhName, bWhPos }) {
      this.headForm.cWhName = cWhName
      this.headForm.cWhCode = cWhCode
      this.control.usePos = bWhPos
      this.$nextTick(() => {
        this.curEle = bWhPos ? 'ele_cPosName' : 'ele_cBarcode'
        this.setFocus()
      })
    },
    pickDeptpartment({ cDepCode, cDepName }) {
      this.headForm.cDepName = cDepName
      this.headForm.cDepCode = cDepCode
    },
    pickRd({ cRdCode, cRdName }) {
      this.headForm.cRdCode = cRdCode
      this.headForm.cRdName = cRdName
    },
    cancelPicker() {
      this.setFocus()
    },
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
          if (window.android) {
            if (this.curEle != 'ele_iQuantity' || flag) {
              android.HideSoftKeyboard()
            }
          }
          setTimeout(() => {
            if (window.android) {
              if (this.curEle != 'ele_iQuantity' || flag) {
                android.HideSoftKeyboard()
              }
            }
          }, 50)
        }, 10)
      }
    },
    queryPos() {
      if (this.control.usePos && this.form.cPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.cWhCode, cPosCode: this.form.cPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cPosCode = this.form.cPosName
            this.form.cPosName = Data[0].cPosName

            this.form.cOddPosCode = this.form.cPosName
            this.form.cOddPosName = Data[0].cPosName

            this.curEle = 'ele_cBarcode'
          } else {
            this.form.cPosName = ''
            this.curEle = 'ele_cPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cPosName = ''
          this.curEle = 'ele_cPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryOddPos() {
      if (this.control.usePos && this.form.cOddPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描余料货位',
          onOpened: () => {
            this.form.cPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.cWhCode, cPosCode: this.form.cOddPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cOddPosCode = this.form.cPosName
            this.form.cOddPosName = Data[0].cPosName

            this.curEle = 'ele_hideInput'
          } else {
            this.form.cPosName = ''
            this.curEle = 'ele_cOddPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cPosName = ''
          this.curEle = 'ele_cOddPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryInv() {
      if (this.headForm.cWhCode == '' || this.headForm.cWhName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先选择仓库',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      if (this.headForm.cDepCode == '' || this.headForm.cDepName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先选择生产车间',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      if (this.control.usePos && this.form.cPosCode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描存货条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }

      getInventory({
        cBarcode: this.form.cBarcode,
        cWhCode: this.cWhCode,
        cPosCode: this.form.cPosCode,
        cSourceBillID: this.cacheList.length <= 0 ? this.queryForm.ID : void 0,
        bFirst: this.cacheList.length <= 0
      })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.barcode = this.form.cBarcode

            const {
              bInvBatch,
              bInvQuality,
              cInvCode,
              cInvName,
              cInvStd,
              cComUnitCode,
              cComUnitName,
              cBatch,
              iMassDate,
              cMassUnit,
              iChangRate,
              dMdate,
              iStockQuantity,
              iGroupType,
              iQuantity
            } = Data[0]
            const rows = this.sourceList.filter(f => {
              const rr = f.inVStockList.filter(
                ff => ff.cInvCode == f.cInvCode && ff.cPosCode == this.form.cPosCode && ff.cBatch == cBatch
              )
              f.iStockQuantity = rr.length > 0 ? rr[0].iQuantity : 0
              return f.cInvCode == cInvCode && rr.length > 0
            })
            if (rows.length > 0) {
              const row = rows[0]
              this.control.useBatch = bInvBatch //是否批次管理
              this.control.useQuality = bInvQuality //是否保质期管理
              this.control.groupType = iGroupType //单位组类别 0 无换算、 1 固定换算、2 浮动换算

              this.form.cInvCode = cInvCode
              this.form.cInvName = cInvName
              this.form.cInvStd = cInvStd
              this.form.cComUnitCode = cComUnitCode
              this.form.cComUnitName = cComUnitName
              this.form.cBatch = cBatch
              this.form.iStockQuantity = row.iStockQuantity
              this.form.iPlanQuantity = row.iQuantity2
              // this.form.iQuantity = iQuantity
              this.form.iQuantity = ''
              this.form.iLabelQuantity = iQuantity
              const cacheRows = this.cacheList.filter(f => {
                return f.cInvCode == cInvCode && f.cBatch == cBatch && f.cPosCode == this.form.cPosCode
              })
              const total = cacheRows
                .map(f => f.iQuantity)
                .reduce((sum, item) => {
                  return floatAdd(sum, item)
                }, 0)
              this.form.iCommitQuantity = total

              //计算保质期
              if (bInvQuality) {
                this.form.iMassDate = iMassDate
                this.form.cMassUnit = cMassUnit

                this.form.dMdate = dMdate
                if (cMassUnit == '1') {
                  this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'year').format('YYYY-MM-DD')
                } else if (cMassUnit == '2') {
                  this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'month').format('YYYY-MM-DD')
                } else if (cMassUnit == '3') {
                  this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'day').format('YYYY-MM-DD')
                }
              }

              this.form.iChangRate = iChangRate
              //todo 多计量计算

              this.form.iVouchRowno = row.iVouchRowno //源单行号

              this.form.cSourceBillID = row.ID //源单ID
              this.form.cSourceBillNo = row.cCode //源单单号
              this.form.cSourceBillEntryID = row.Autoid //源单表体ID

              this.form.cBarcode = ''

              this.curEle = 'ele_iQuantity'
            } else {
              this.form.cBarcode = ''
              this.curEle = 'ele_cBarcode'
              return this.$toast({
                type: 'fail',
                message: '当前货位或者存货不在源单内!',
                onOpened: () => {
                  this.setFocus(true)
                }
              })
            }
          } else {
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
            return this.$toast({
              type: 'fail',
              message: '未能查询到存货信息!',
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
    inputQuantity() {
      if (this.form.iQuantity == '' || this.form.iQuantity == '0') {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '请先录入数量',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      if (this.form.iVouchRowno == '') {
        this.form.iQuantity = ''
        if (this.form.cPosCode == '') {
          this.curEle = 'ele_cPosName'
        } else if (this.form.cBarcode == '') {
          this.curEle = 'ele_cBarcode'
        }
        return this.$toast({
          type: 'fail',
          message: '请按流程进行扫描!',
          onOpened: () => {
            this.setFocus()
          }
        })
      }

      this.onSubmit()
    },
    clearForm() {
      for (const key in this.form) {
        if (this.$store.getters.numProps.includes(key)) {
          this.form[key] = 0
        } else {
          this.form[key] = ''
        }
      }
      this.control.useBatch = false
      this.control.useQuality = false
      this.control.groupType = 1
      if (this.control.usePos) {
        this.curEle = 'ele_cPosName'
      } else {
        this.curEle = 'ele_cBarcode'
      }
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
    },
    checkPlan() {
      const l1 = this.cacheList
        .filter(f => {
          return f.cInvCode == this.form.cInvCode
        })
        .map(m => m.iQuantity)

      const total = floatAdd(
        l1.reduce((sum, item) => {
          return floatAdd(sum, item)
        }, 0),
        this.form.iQuantity
      )

      const source = this.sourceList
        .filter(f => {
          return f.cInvCode == this.form.cInvCode
        })
        .map(m => m.iQuantity2)
      const source_total = floatAdd(
        source.reduce((sum, item) => {
          return floatAdd(sum, item)
        }, 0),
        0
      )

      return floatSub(source_total, total) < 0
    },
    checkStock() {
      const l1 = this.cacheList
        .filter(f => {
          return f.cInvCode == this.form.cInvCode && f.cBatch == this.form.cBatch && f.cPosCode == this.form.cPosCode
        })
        .map(m => m.iQuantity)

      const total = floatAdd(
        l1.reduce((sum, item) => {
          return floatAdd(sum, item)
        }, 0),
        this.form.iQuantity
      )

      return floatSub(this.form.iStockQuantity, total) < 0
    }
  },
  computed: {
    cWhCode() {
      return this.headForm.cWhCode
    },
    showStock() {
      return true
    },
    showBatch() {
      return this.control.useBatch
    },
    showQuality() {
      return this.control.useQuality
    },
    showGroup() {
      return this.control.groupType != 0
    },
    forbidden() {
      return this.cacheList.length > 0
    },
    forbiddenSub() {
      return this.form.cSourceBillID == '' || this.form.iQuantity == '' || this.form.iQuantity == 0
    },
    defWhCode() {
      return this.$store.getters.defWhCode || ''
    },
    isReadOnly() {
      return this.$route.query.bRob == '1' //blue
    }
  },
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  mounted() {
    this.onLoad()

    window.scanResult = result => {
      setTimeout(() => {
        if (this.curEle == 'ele_cBarcode') {
          this.form.cBarcode = result
          this.queryInv()
        } else if (this.curEle == 'ele_cPosName') {
          this.form.cPosName = result
          this.queryPos()
        } else if (this.curEle == 'ele_cOddPosName') {
          this.form.cOddPosName = result
          this.queryOddPos()
        }
      }, 600)
    }

    setTimeout(() => {
      getWarehouse({})
        .then(({ Data }) => {
          this.sources.warehouseList = Data
          if (Data.length > 0) {
            const f = Data.filter(f => {
              return f.cWhCode == this.defWhCode
            })
            const { cWhCode, cWhName, bWhPos } = f.length > 0 ? f[0] : { cWhCode: '', cWhName: '', bWhPos: false }
            this.headForm.cWhCode = cWhCode
            this.headForm.cWhName = cWhName

            this.control.usePos = bWhPos
            this.$nextTick(() => {
              this.curEle = bWhPos ? 'ele_cPosName' : 'ele_cBarcode'
              this.setFocus()
            })
          }
        })
        .catch(err => {})
    }, 50)

    setTimeout(() => {
      getDepartment({})
        .then(({ Data }) => {
          this.sources.departmentList = Data
          if (Data.length > 0) {
            const { cDepCode, cDepName } = Data.filter(f => {
              return f.cDepCode == this.queryForm.cDepCode
            })[0]
            this.headForm.cDepCode = cDepCode
            this.headForm.cDepName = cDepName
          }
        })
        .catch(err => {})
    }, 100)

    setTimeout(() => {
      getRdStyle({ cFilter: 'bRdFlag=0' })
        .then(({ Data }) => {
          this.sources.rdList = Data
          if (Data.length > 0) {
            const { cRdCode, cRdName } = Data.filter(f => {
              return f.cRdCode == (this.queryForm.cRdCode || '202')
            })[0]

            this.headForm.cRdCode = cRdCode
            this.headForm.cRdName = cRdName
          }
        })
        .catch(err => {})
    }, 200)
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
      width: 45%;
      border-radius: 3px;
    }
    .submit {
      color: #fff;
      background-color: rgb(0, 133, 119);
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

      ::v-deep .labelCls {
        //background-color: rgb(0, 133, 119);
        color: rgb(0, 133, 119);
        font-weight: bolder;
      }
    }
  }

  .list0,
  .list {
    height: calc(100vh - 210px);
    overflow: scroll;
  }

  .sourceList {
    height: calc(100vh - 180px);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh - 260px);
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
