<template>
  <div class="container">
    <div class="header van-hairline--bottom">
      <van-form label-width="70px">
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
        <van-field class="item" v-model="headForm.cMemo" name="cMemo" label="备注" placeholder="备注" />
      </van-form>
    </div>
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
            <van-field
              type="text"
              name="cIPosName"
              label="调入货位"
              clearable
              ref="ele_cIPosName"
              v-model="form.cIPosName"
              autocomplete="off"
              placeholder="扫描或录入调入货位"
              id="ele_cIPosName"
              :readonly="!control.usePosIn"
              @keyup.enter="queryPosIn"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cIPosName')" />
              </template>
            </van-field>
            <van-field
              type="text"
              name="cOPosName"
              label="调出货位"
              clearable
              ref="ele_cOPosName"
              v-model="form.cOPosName"
              autocomplete="off"
              placeholder="扫描或录入调出货位"
              :readonly="!control.usePosOut"
              id="ele_cOPosName"
              @keyup.enter="queryPosOut"
            >
              <template #button>
                <van-icon name="photograph" color="#008577" size="25" @click="doScan('ele_cOPosName')" />
              </template>
            </van-field>

            <van-field
              type="text"
              name="cBarcode"
              label="条码"
              clearable
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
              v-show="showBatch"
              readonly
              placeholder="批号"
            ></van-field>
            <van-field
              name="iCommitQuantity"
              label="已扫数量"
              ref="ele_iCommitQuantity"
              v-model="form.iCommitQuantity"
              placeholder="已扫数量"
              readonly
            ></van-field>

            <van-field
              name="iStockQuantity"
              label="库存数量"
              ref="ele_iStockQuantity"
              placeholder="库存数量"
              readonly
              v-model="form.iStockQuantity"
            ></van-field>
            <van-field
              type="number"
              name="iQuantity"
              label="调拨数量"
              ref="ele_iQuantity"
              v-model="form.iQuantity"
              clickable
              autocomplete="off"
              id="ele_iQuantity"
              @focus="onFocus"
              @click="onFocus"
              @keyup.enter="inputQuantity"
            ></van-field>
          </div>
          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <van-button
              class="btn"
              size="small"
              color="#008577"
              type="info"
              @click="inputQuantity"
              :disabled="forbiddenSub"
              >确定</van-button
            >
          </div>
        </div>
      </van-tab>
      <van-tab title="记录页">
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
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>单位：{{ item.cComUnitName }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>调出货位：{{ item.cOPosName }}</div>
                <div>调入货位：{{ item.cIPosName }}</div>
              </li>
              <li style="padding: 2px">数量：{{ item.iQuantity }}</li>
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
    <warehouse ref="warehouse" :source="sources.warehouseList" @choose="pickWarehouse" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { saveTrans } from '@/api/trans'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getWarehouse, getPosition, getInventory } from '@/api/base'
import warehouse from '@/components/warehouse'
import dayjs from 'dayjs'
export default {
  name: `trans_form`,
  components: { warehouse },
  data() {
    return {
      active: 0,
      headForm: {
        cWhName: '',
        cWhCode: '',

        cMemo: ''
      },
      queryForm: {},
      loading: false,
      finished: false,
      submitLoading: false,
      sources: {
        warehouseList: []
      },
      control: {
        usePosIn: false,
        usePosOut: false,
        useBatch: false,
        useQuality: false,
        groupType: 1
      },
      cSign: newGuid(),
      form: {
        cIPosCode: '',
        cIPosName: '',

        cOPosCode: '',
        cOPosName: '',

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

        iCommitQuantity: '0', //完成量
        iStockQuantity: '0',
        iQuantity: '', //调拨量
        iChangRate: 0,
        iNum: 0
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        if (this.control.usePosIn && this.form.cIPosCode == '') {
          this.curEle = 'ele_cIPosName'
        } else if (this.control.usePosOut && this.form.cOPosCode == '') {
          this.curEle = 'ele_cOPosName'
        } else if (this.form.cBarcode == '') {
          this.curEle = 'ele_cBarcode'
        }
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
    doScan(e) {
      if (window.android) {
        this.curEle = e
        android.openScan(e)
      }
    },
    pickWarehouse({ cWhCode, cWhName, bWhPos }) {
      this.headForm.cWhName = cWhName
      this.headForm.cWhCode = cWhCode
      this.control.usePosIn = bWhPos
      this.control.usePosOut = bWhPos

      this.form.cIPosCode = ''
      this.form.cIPosName = ''
      this.$nextTick(() => {
        this.curEle = bWhPos ? 'ele_cIPosName' : this.control.usePosOut ? 'ele_cOPosName' : 'ele_cBarcode'
        this.setFocus()
      })
    },
    cancelPicker() {
      this.setFocus()
    },
    openWarehouse() {
      if (this.forbidden) {
        return this.$toast({ type: 'fail', message: '已经有扫描记录,禁止操作!' })
      }
      this.$refs.warehouse.open()
    },
    onSubmit() {
      if (this.checkStock()) {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '当前库存量不够!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      const position = this.cacheList.findIndex(f => {
        return (
          f.cInvCode == this.form.cInvCode &&
          f.cBatch == this.form.cBatch &&
          f.cOPosCode == this.form.cOPosCode &&
          f.cIPosCode == this.form.cIPosCode
        )
      })
      if (position > -1) {
        let r = this.cacheList[position]
        r.iQuantity = floatAdd(r.iQuantity, this.form.iQuantity)
        this.$set(this.cacheList, position, Object.assign({}, r))
      } else {
        this.cacheList.push(Object.assign({}, this.form))
      }

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
          const form = Object.assign({}, this.headForm, {
            cSign: this.cSign,
            cAcc_Id: accountId
          })
          saveTrans(
            Object.assign(
              {},
              [form].map(m => {
                return {
                  cSign: m.cSign,
                  cAcc_Id: m.cAcc_Id,
                  cWhCode: m.cWhCode,
                  cWhName: m.cWhName,
                  cMemo: m.cMemo
                }
              })[0],
              {
                Entry: this.cacheList.map(m => {
                  return {
                    cSourceBillID: '',
                    cSourceBillNo: '',
                    cSourceBillEntryID: '',

                    cIPosCode: m.cIPosCode,
                    cOPosCode: m.cOPosCode,

                    cInvCode: m.cInvCode,
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
                  this.active = 0
                  this.cSign = newGuid()
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
          const dom = this.$refs[this.curEle]
          if (dom != void 0) {
            dom.focus()
          }
          if (window.android) {
            if (this.curEle != 'ele_iQuantity' || flag) {
              android.HideSoftKeyboard()
            }
          }
          setTimeout(() => {
            if (window.android) {
              if (this.curEle != 'ele_iQuantity') {
                android.HideSoftKeyboard()
              }
            }
          }, 50)
        }, 10)
      }
    },
    queryPosIn() {
      if (this.control.usePosIn && this.form.cIPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cIPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.headForm.cWhCode, cPosCode: this.form.cIPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cIPosCode = this.form.cIPosName
            this.form.cIPosName = Data[0].cPosName
            this.curEle = this.control.usePosOut ? 'ele_cOPosName' : 'ele_cBarcode'
          } else {
            this.form.cIPosName = ''
            this.curEle = 'ele_cIPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cIPosName = ''
          this.curEle = 'ele_cIPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryPosOut() {
      if (this.control.usePosOut && this.form.cOPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cOPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.headForm.cWhCode, cPosCode: this.form.cOPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cOPosCode = this.form.cOPosName
            this.form.cOPosName = Data[0].cPosName
            this.curEle = 'ele_cBarcode'
          } else {
            this.form.cOPosName = ''
            this.curEle = 'ele_cOPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cOPosName = ''
          this.curEle = 'ele_cOPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryInv() {
      if (
        (this.control.usePosIn && this.form.cIPosCode == '') ||
        (this.control.usePosOut && this.form.cOPosCode == '')
      ) {
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
      if (this.form.cIPosCode == this.form.cOPosCode) {
        this.form.cBarcode = ''
        this.form.cOPosName = ''
        this.curEle = 'ele_cOPosName'
        return this.$toast({
          type: 'fail',
          message: '调入调出货位不可一致!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      getInventory({ cBarcode: this.form.cBarcode, cWhCode: this.headForm.cWhCode, cPosCode: this.form.cOPosCode })
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
              iStockQuantity,
              iGroupType,
              cErrMsg,
              iQuantity
            } = Data[0]
            if (cErrMsg != '' && cErrMsg != null) {
              this.$dialog
                .confirm({
                  title: '提示',
                  message: cErrMsg
                })
                .then(() => {
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

                  this.form.iChangRate = iChangRate

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

                  //todo 多计量计算
                  this.form.iNum = 0
                  const rows = this.cacheList.filter(f => {
                    return f.cInvCode == cInvCode
                  })
                  const total = rows
                    .map(f => f.iQuantity)
                    .reduce((sum, item) => {
                      return floatAdd(sum, item)
                    }, 0)

                  this.form.iCommitQuantity = total
                  this.form.iQuantity = ''

                  this.form.cBarcode = ''
                  this.curEle = 'ele_iQuantity'
                })
                .catch(() => {
                  this.form.cBarcode = ''
                  this.curEle = 'ele_cBarcode'
                  this.setFocus()
                })
            } else {
              this.control.useBatch = bInvBatch //是否批次管理
              this.control.useQuality = bInvQuality //是否保质期管理
              this.control.groupType = iGroupType //单位组类别 0 无换算、 1 固定换算、2 浮动换算

              this.form.cInvCode = cInvCode
              this.form.cInvName = cInvName
              this.form.cInvStd = cInvStd
              this.form.cComUnitCode = cComUnitCode
              this.form.cComUnitName = cComUnitName
              this.form.cBatch = cBatch
              this.form.iQuantity = iQuantity
              this.form.iStockQuantity = iStockQuantity

              this.form.iChangRate = iChangRate

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

              //todo 多计量计算
              this.form.iNum = 0
              const rows = this.cacheList.filter(f => {
                return f.cInvCode == cInvCode
              })
              const total = rows
                .map(f => f.iQuantity)
                .reduce((sum, item) => {
                  return floatAdd(sum, item)
                }, 0)

              this.form.iCommitQuantity = total

              this.form.cBarcode = ''
              this.curEle = 'ele_iQuantity'
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
      if (
        (this.control.usePosIn && this.form.cIPosCode == '') ||
        (this.control.usePosOut && this.form.cOPosCode == '')
      ) {
        return this.$toast({
          type: 'fail',
          message: '请按流程进行扫描!',
          onOpened: () => {
            this.curEle = 'ele_cPosName'
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
      if (this.control.usePosIn && this.form.cIPosCode == '') {
        this.curEle = 'ele_cIPosName'
      } else if (this.control.usePosOut && this.form.cOPosCode == '') {
        this.curEle = 'ele_cOPosName'
      } else if (this.form.cBarcode == '') {
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
    checkStock() {
      const l1 = this.cacheList
        .filter(f => {
          return (
            f.cInvCode == this.form.cInvCode &&
            f.cBatch == this.form.cBatch &&
            f.cWhCode == this.queryForm.cWhCode &&
            f.cOPosCode == this.form.cOPosCode
          )
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
    window.scanResult = result => {
      setTimeout(() => {
        if (this.curEle == 'ele_cBarcode') {
          this.form.cBarcode = result
          this.queryInv()
        } else if (this.curEle == 'ele_cIPosName') {
          this.form.cIPosName = result
          this.queryPosIn()
        } else if (this.curEle == 'ele_cOPosName') {
          this.form.cOPosName = result
          this.queryPosOut()
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
            this.control.usePosIn = bWhPos
            this.control.usePosOut = bWhPos
            this.$nextTick(() => {
              this.curEle = bWhPos ? 'ele_cIPosName' : 'ele_cBarcode'
              this.setFocus()
            })
          }
        })
        .catch(err => {})
    }, 50)
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
    height: calc(100vh - 150px);
    overflow: scroll;
  }

  .sourceList {
    height: calc(100vh - 50px);
    overflow: scroll;
  }

  .list1 {
    height: calc(100vh - 250px);
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
