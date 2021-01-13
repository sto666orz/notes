<template>
  <div class="popup-wrap" v-show="showAddress">
    <div class="mask" @click="showAddress = false"></div>
    <div class="popup-container">
      <div class="up">
        <!-- <div class="close-btn" @click="showAddress = false"></div> -->
        <h5>收货信息</h5>
      </div>
      <!-- <p class="tips">活动结束30天后安排配送</p> -->
      <div class="down">
        <ul class="edit-ads-info">
          <li class="edit-left">姓名</li>
          <li class="edit-right">
            <input @blur="blurfns" maxlength="15" v-model="user.userName" type="text" placeholder="收货人姓名" :class="{'err':user.userNameFlag}">
          </li>
        </ul>
        <ul class="edit-ads-info">
          <li class="edit-left">电话</li>
          <li class="edit-right">
            <input @blur="blurfns" v-model="user.userPhone" maxlength="11" type="text" placeholder="收货人手机号" :class="{'err':user.userPhoneFlag}">
          </li>
        </ul>
        <ul class="edit-ads-info">
          <li class="edit-left">地址</li>
          <li class="edit-right">
            <span class="prov">
              <select @blur="blurfns" v-model="prov" :class="{'none':!prov,'err':!prov&&user.cityFlag}">
                <option class="none" value="">省（直辖市）</option>
                <option v-for="(option,index) in addressList" :value="option.value" :key="index">
                  {{ option.value }}
                </option>
              </select>
            </span>
          </li>
        </ul>
        <ul class="edit-ads-info">
          <li class="edit-left"></li>
          <li class="edit-right">
            <span class="span-sel mleft" :class="{'err':!city&&user.cityFlag}">
              <select @blur="blurfns" v-model="city" :class="{'none':!city}">
                <option class="none" value="">城市</option>
                <option v-for="(option,index) in cityArr" :value="option.value" :key="index">
                  {{ option.value }}
                </option>
              </select>
            </span>
            <span class="span-sel mright" :class="{'err':!district&&user.cityFlag}">
              <select @blur="blurfns" v-model="district" :class="{'none':!district}">
                <option class="none" value="">区（县）</option>
                <option v-for="(option,index) in districtArr" :value="option.value" :key="index">
                  {{ option.value }}
                </option>
              </select>
            </span>
          </li>
        </ul>
        <ul class="edit-ads-info">
          <li class="edit-left"></li>
          <li class="edit-right">
            <textarea @blur="blurfns" maxlength="100" :class="{'err':user.userDecFlag&&!user.userDec}" v-model="user.userDec" placeholder="详细街道地址"></textarea>
          </li>
        </ul>
        <ul class="edit-ads-info dec-li">
          <li class="edit-left"></li>
          <li class="edit-right dec-color">
            <i>请填写正确的收货地址，如地址无效或错误，将视为自动放弃领奖资格</i>
          </li>
        </ul>
        <button class="next-btn" @click="savePost" v-if="isSubmit">保存</button>
        <button class="next-btn" @click="savePost" v-else>保存收货地址</button>
      </div>

    </div>
  </div>
</template>
<script>

  import addressList from "service/local/address";
  import commonService from 'service/commonService';
  import { getUserId } from '../local/util'

  export default {
    props: {
      update: {
        type: Function,
        default: function() {

        }
      }
    },
    data() {
      return {
        isSubmit: false,
        showAddress: false,
        addressList,
        cityArr: [],              //市区下拉数据
        districtArr: [],          //区下拉选择数据
        prov: '',
        city: '',
        district: '',
        cityArr: [],
        districtArr: [],
        userFlag: false,
        user: {
          userName: '',
          userNameFlag: false,
          userPhone: '',
          userPhoneFlag: false,
          userDec: '',
          userDecFlag: false,
          cityFlag: false
        },
        prize_number: ''
      }
    },
    watch: {
      // 监听选择省市区、更新相应地区信息
      prov: function () {
        this.updateCity();
        this.updateDistrict();
      },
      city: function () {
        this.updateDistrict();
      }
    },
    created() {
      //获取默认地址
      // this.getAddress();
    },
    methods: {
      // toast
      Toast(msg) {
        this.$toast({
          message: msg,
          align: 'center',
          duration: 3000 //消失时间
        });
      },
      blurfns() {
        const _this = this
        setTimeout(function () {
          document.body.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        }, 200)
      },
      show(item) {
        this.showAddress = true;
        this.prize_number = item.prize_number;
        this.activeTag = item.active_tag;
        this.getAddress();
      },
      //获取默认地址
      getAddress() {
        const uid = getUserId();
        if (!uid) return;

        this.$loading.open({ message: '数据处理中...' });
        commonService.fetchAddress({ 
          uid: uid, 
          activeTag: this.activeTag, 
          params: { prize_number: this.prize_number } 
        }).then(res => {
            let adressData = res.data;
            if (adressData) {
              this.isSubmit = true;
              this.prov = adressData.province || "";
              this.$set(this.user, 'userDec', adressData.detail);
              this.$set(this.user, 'userName', adressData.name);
              this.$set(this.user, 'userPhone', adressData.phone);
              if (this.prov) {
                this.updateCity();
                this.$nextTick(() => {
                  this.city = adressData.city || "";
                  this.$nextTick(() => {
                    this.district = adressData.district || "";
                  })
                })
              }
            } else {
              this.isSubmit = false;
              this.prov = '';
              this.city = '';
              this.district = '';
              this.user = {
                userName: '',
                userNameFlag: false,
                userPhone: '',
                userPhoneFlag: false,
                userDec: '',
                userDecFlag: false,
                cityFlag: false
              }
            }
            this.$loading.close();
          }).catch(error => {
            this.$loading.close();
          });
      },
      //点击提交按钮，进行校验
      savePost() {
        this.userFlag = true
        if(!this.user.userName || !this.user.userPhone || !this.prov || !this.city || !this.district || !this.user.userDec) {
          this.Toast('请填写完整内容');
          return;
        }
        // if (!this.user.userName) {
        //   this.user.userNameFlag = true
        //   return false
        // }
        // if (!this.user.userPhone) {
        //   this.user.userPhoneFlag = true
        //   this.user.userNameFlag = false
        //   return false
        // }
        if (!(/^1[3456789]\d{9}$/.test(this.user.userPhone))) {
          this.Toast('手机号码格式不正确');
          return false;
        }
        // if (!this.prov || !this.city || (!this.district && this.districtArr.length >= 1)) {
        //   this.user.cityFlag = true
        //   this.user.userPhoneFlag = false
        //   this.user.userNameFlag = false
        //   return false
        // }
        if (!this.user.userDec) {
          this.user.userDecFlag = true
          this.user.cityFlag = false
          return false
        }
        this.userFlag = false
        this.user.userDecFlag = false
        this.user.userNameFlag = false
        this.setAddresInfo()
      },
      back() {
        this.showAddress = false;
      },
      //提交用户地址
      setAddresInfo() {
        this.$loading.open({
          message: '数据处理中...'
        });
        let params = {
          name: this.user.userName,
          phone: this.user.userPhone,
          province: this.prov,
          city: this.city,
          district: this.district,
          detail: this.user.userDec,
          active_tag: this.activeTag,
          prize_number: this.prize_number
        }
        const uid = getUserId();
        commonService.fetchReceive(params, uid).then(res => {
          const { data, code, msg } = res;
          if (code === 200) {
            //  领取成功
            this.isSubmit = true;
            this.Toast('提交成功');
            this.showAddress = false;
            this.update()
          } else {
            this.Toast(msg)
          }
          this.$loading.close();
        }).catch(error => {
          console.log(error);
          this.$loading.close();
        })
      },
      // 更新选择城市
      updateCity() {
        for (let i in this.addressList) {
          let obj = this.addressList[i];
          if (obj.value == this.prov) {
            this.cityArr = obj.children;
            break;
          }
        }
        if (!this.prov) {
          this.cityArr = [];
        }
        this.city = ''
      },
      // 更新市区县选择
      updateDistrict() {
        for (let i in this.cityArr) {
          let obj = this.cityArr[i];
          if (obj.value == this.city) {
            this.districtArr = obj.children;
            break;
          }
        }
        if (!this.city) {
          this.districtArr = [];
        }
        this.district = ''
      }
    }
  }
</script>
<style lang="less" scoped>
  @import url("../../../assets/css/mixin");
  .popup-wrap {
    .wh();
    .fixed;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;
      .wh();
      background-color: rgba(1, 1, 1, 0.7);
    }
    .popup-container {
      .position-abs-lt(50%,50%,-50%,-50%);
      width: 8.667rem;
      background-color: #ffffff;
      border-radius: 0.667rem;
      z-index: 10;
      h5 {
        position: relative;
        padding-left: .933333rem /* 70/75 */;
        font-size: .533333rem /* 40/75 */;
        font-weight: bold;
        color: #333333;
        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: .533333rem /* 40/75 */;
            transform: translateY(-50%);
            width: .133333rem /* 10/75 */;
            height: .4rem /* 30/75 */;
            border-radius: .066667rem /* 5/75 */;
            background-color: #F13922;
        }
      }
      .up {
        padding-top: .533333rem /* 40/75 */;
      }
      .down {
        padding: 0 0.493rem .466667rem /* 35/75 */ .533333rem /* 40/75 */;
        background-color: #ffffff;
        border-radius: 0 0 0.667rem 0.667rem;
      }
    }
  }
  .edit-ads-info {
    position: relative;
    margin-top: .48rem /* 36/75 */;
    padding-left: 0.12rem;
    .fj(space-between);
    border-radius: 0.133rem;
    .font-scw(0.373rem, rgba(0, 0, 0, 0.8), 1.04rem);
    font-weight: bold;
  }
  .edit-left {
    width: 16.9%;
    font-size: 0.427rem;
    color: #333333;
    font-weight: normal;
  }
  .edit-right {
    position: relative;
    .wh(83.1%, auto);
    line-height: 1.04rem;
    & > span {
      position: relative;
    }
    // & > span:after {
    //   content: "";
    //   background: url("../../../assets/images/ic_down@2x.png") no-repeat center;
    //   background-size: contain;
    //   position: absolute;
    //   width: 14px;
    //   height: 100%;
    //   z-index: 0;
    //   right: 0.29rem;
    //   top: 0;
    // }
    input,
    select,
    textarea {
      border-radius: 0.107rem;
      .wh(100%, 1.067rem);
      .font-scw(0.373rem, #2b2921, 400,1.04rem);
      line-height: 1.04rem;
      padding-left: 0.373rem;
      background: transparent;
      border: 1px solid #303133;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      &::placeholder {
        font-size: 0.427rem;
        color: #c3c3c3;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    textarea {
      height: 2.133rem;
      padding-top: 0.13rem;
    }
    span.mleft {
      float: left;
    }
    span.mright {
      float: right;
    }
    span.span-sel {
      width: 47%;
      display: inline-block;
      border-radius: 0.106rem;
      border: 1px solid #303133;
      select {
        width: 200/75rem;
        border: 0;
        background: url("../../../assets/images/ic_down@2x.png") no-repeat;
        background-position: center right;
        background-size: 28/75rem;
      }
    }
    span.prov {
      display: block;
      height: 100%;
      border-radius: 0.106rem;
      border: 1px solid #303133;
      select {
        width: 448/75rem;
        border: 0;
        background: url("../../../assets/images/ic_down@2x.png") no-repeat;
        background-position: center right;
        background-size: 28/75rem;
      }
    }
    select {
      position: relative;
      //清除select的边框样式
      //border: none;
      //清除select聚焦时候的边框颜色
      outline: none;
      //隐藏select的下拉图标
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      //通过padding-left的值让文字居中
      background: transparent;
      color: #555555;
    }
    select.none {
      color: #c3c3c3;
    }
    select.err,
    input.err,
    textarea.err,
    span.err {
      border: 1px solid rgba(255, 60, 31, 1);
    }
  }
  .dec-li {
    margin-top: 0;
    margin-bottom: .426667rem /* 32/75 */;
  }
  .dec-color {
    font-size: 0.293rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8582a1;
    line-height: 0.373rem;
    text-align: left;
  }
  .next-btn {
    display: block;
    width: 7.653333rem /* 574/75 */;
    height: 1.293333rem /* 97/75 */;
    border-radius: .653333rem /* 49/75 */;
    font-size: .453333rem /* 34/75 */;
    font-weight: 600;
    color: #5B2D00;
    background: linear-gradient(180deg, #FFEA00 0%, #FFB600 100%);
    /* span {
      display: inline-block;
      height: 100%;
      line-height: 1.133rem;
    } */
  }

</style>
