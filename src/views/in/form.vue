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
          label="入库方式"
          placeholder="请选择入库方式"
          is-link
          v-if="false"
          @click="openRd"
        />
        <van-field
          class="item"
          v-model="headForm.cDepName"
          readonly
          name="cDepName"
          label="部门"
          placeholder="请选择部门"
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
              clearable
              type="text"
              name="cPosName"
              label="货位"
              ref="ele_cPosName"
              v-model="form.cPosName"
              autocomplete="off"
              placeholder="扫描或录入货位"
              v-show="control.usePos"
              id="ele_cPosName"
              @keyup.enter="queryPos"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cPosName')" />
              </template>
            </van-field>

            <van-field
              clearable
              type="text"
              name="cBarcode"
              label="条码"
              ref="ele_cBarcode"
              v-model="form.cBarcode"
              autocomplete="off"
              placeholder="扫描或录入存货条码"
              id="ele_cBarcode"
              @keyup.enter="queryInv"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cBarcode')" />
              </template>
            </van-field>
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
              name="cComUnitName"
              label="单位"
              ref="ele_cComUnitName"
              v-model="form.cComUnitName"
              readonly
              placeholder="单位"
            ></van-field>
            <van-field
              name="cBatch"
              label="批号"
              ref="ele_cBatch"
              v-model="form.cBatch"
              readonly
              v-if="false"
              placeholder="批号"
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
            <van-field
              name="iStockQuantity"
              label="库存数量"
              ref="ele_iStockQuantity"
              v-model="form.iStockQuantity"
              placeholder="库存数量"
              v-show="showStock"
            ></van-field>
            <van-field
              name="iPlanQuantity"
              label="订单数量"
              ref="ele_iPlanQuantity"
              v-model="form.iPlanQuantity"
              placeholder="订单数量"
              readonly
            >
            </van-field>
            <van-field
              name="iCommitQuantity"
              label="已扫数量"
              ref="ele_iCommitQuantity"
              v-model="form.iCommitQuantity"
              placeholder="已扫数量"
              readonly
            ></van-field>
            <van-field
              type="number"
              name="iQuantity"
              label="数量"
              ref="ele_iQuantity"
              v-model="form.iQuantity"
              clickable
              autocomplete="off"
              id="ele_iQuantity"
              readonly
              @keyup.enter="inputQuantity"
            ></van-field>
          </div>
          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <van-button class="btn submit" size="small" @click="inputQuantity">保存</van-button>
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
              @click="onDelete(index)"
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
            <li style="padding: 2px">供应商：{{ queryForm.cVenName }}</li>
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
              <!-- <li style="padding: 2px">单位：{{ item.cComUnitName }}</li> -->
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>单位：{{ item.cComUnitName }}</div>
                <div>数量：{{ item.iQuantity2 }}</div>
              </li>
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
  </div>
</template>
<script>
import { savePurStockIn, getPuArrival } from '@/api/in'
import { newGuid, floatAdd, floatSub } from '@/utils'
import warehouse from '@/components/warehouse'
import deptpartment from '@/components/deptpartment'
import { getWarehouse, getDepartment, getPosition, getInventory } from '@/api/base'
import dayjs from 'dayjs'
export default {
  name: `in_form`,
  components: { warehouse, deptpartment },
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
        cSource: '',
        FROB: '1'
      },
      sourceList: [],
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
        iPlanQuantity: '0',
        iCommitQuantity: '0',
        iChangRate: 0,
        iNum: 0,
        cSourceBillID: '',
        cSourceBillNo: '',
        cSourceBillEntryID: '',

        barcode: '' //记录条码
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.setFocus()
      }
    }
  },
  methods: {
    onLoad() {
      this.sourceList = []
      getPuArrival({ cFilter: this.queryForm.ID, FROB: this.queryForm.bRob })
        .then(({ Data }) => {
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
      // 红字检查库存
      if (this.queryForm.bRob == '0') {
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
      }

      var exist = this.cacheList.filter(f => f.barcode == this.form.barcode)
      if (exist.length > 0) {
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '当前条码已扫描,请核实!',
          onOpened: () => {
            this.form.cBarcode = ''
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
      const position = this.cacheList.findIndex(f => {
        return (
          f.cSourceBillID == this.form.cSourceBillID &&
          f.cSourceBillEntryID == this.form.cSourceBillEntryID &&
          f.cInvCode == this.form.cInvCode &&
          f.cBatch == this.form.cBatch
        )
      })
      if (position > -1) {
        let r = this.cacheList[position]
        r.iQuantity = floatAdd(r.iQuantity, this.form.iQuantity)
        this.$set(this.cacheList, position, Object.assign({}, r))
      } else {
        this.cacheList.push(Object.assign({}, this.form))
      }

      this.clearForm(true)
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
          const form = Object.assign({}, this.headForm, {
            cSign: this.cSign,
            FROB: this.queryForm.redblue == '1' ? '1' : '-1',
            cVenCode: this.queryForm.cVenCode,
            cAcc_Id: accountId
          })
          savePurStockIn(
            Object.assign(
              {},
              [form].map(m => {
                return {
                  cSign: m.cSign,
                  FROB: m.FROB,
                  cAcc_Id: m.cAcc_Id,
                  cVenCode: m.cVenCode,
                  cWhCode: m.cWhCode,
                  cRdCode: m.cRdCode,
                  cDepCode: m.cDepCode,
                  cMemo: m.cMemo,
                  cSource: m.cSource
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
                    iNum: m.iNum
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
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
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
          message: '请先选择部门',
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

      getInventory({ cBarcode: this.form.cBarcode, cWhCode: this.cWhCode, cPosCode: this.form.cPosCode })
        .then(({ Data }) => {
          if (Data.length > 0) {
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
              iQuantity,
              iStockQuantity,
              iGroupType
            } = Data[0]
            this.form.barcode = this.form.cBarcode
            const rows = this.sourceList.filter(f => {
              return f.cInvCode == cInvCode
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
              this.form.iStockQuantity = iStockQuantity
              this.form.iPlanQuantity = row.iQuantity2
              this.form.iQuantity = iQuantity

              const cacheRows = this.cacheList.filter(f => {
                return f.cInvCode == cInvCode
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

              this.onSubmit(true)
            } else {
              this.form.cBarcode = ''
              this.curEle = 'ele_cBarcode'
              return this.$toast({
                type: 'fail',
                message: '当前存货不在源单内!',
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
      if (this.form.iQuantity == '') {
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
    clearForm(flag) {
      for (const key in this.form) {
        if (key == 'cBarcode') {
          if (this.$store.getters.numProps.includes(key)) {
            this.form[key] = 0
          } else {
            this.form[key] = ''
          }
        }
      }
      this.control.useBatch = false
      this.control.useQuality = false
      this.control.groupType = 1
      if (this.control.usePos) {
        this.curEle = flag ? 'ele_cBarcode' : 'ele_cPosName'
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
          return f.cInvCode == this.form.cInvCode && f.cBatch == this.form.cBatch
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
      return this.queryForm.bRob == '0'
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
    }
  }

  .list0,
  .list {
    height: calc(100vh - 160px);
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
