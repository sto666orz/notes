<template>
    <div class="page-wrap">
        <div class="header"></div>
        <div class="content" ref="scroll">
            <ul v-if="errorType === 0" class="rank-list">
                <li class="rank-head">
                    <div class="left">&nbsp;</div>
                    <div class="right">&nbsp;</div>
                </li>
                <li class="rank-item" v-for="(item, index) in dataList" :key="index">
                    <div class="left">
                        <img class="avatar" :src="item.portrait" alt="">
                        <span class="name">{{item.nickname}}</span>
                    </div>
                    <div class="right">{{item.assist_time.replace('T',' ')}}</div>
                </li>
            </ul>
            <ul v-if="errorType === 0" class="rank-list fixed">
                <li class="rank-head">
                    <div class="left">昵称</div>
                    <div class="right">助力时间</div>
                </li>
            </ul>
            <div v-else-if="errorType === 1" class="view-aha empty">
                <p class="text">暂无助力哦～</p>
            </div>
            <div v-else-if="errorType === 2" class="view-aha error">
                <p class="text">网络异常～</p>
                <button class="button">重试</button>
            </div>
            <div v-else-if="errorType === 3" class="view-aha error">
                <p class="text">服务器出错啦～</p>
                <button class="button">重试</button>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import httpRequest from 'service/musicParty2020'
import { getUserToken } from './local/util'
import { hideWxShare } from './local/shareUtil'

export default {
    data() {
        return {
            scroll: null,
            dataList: [],
            errorType: 0, // 错误类型  0无错误  1空列表  2网络错误  3服务器错误
        }
    },
    methods: {
        fetchList() {
            this.$loading.open({ message: '加载中', magIcon: '' });
            httpRequest.assistRecord().then(res => {
                const { code, data, msg } = res;
                if (code == 200) {
                    if (!data || data.length === 0) {
                        this.errorType = 1;
                    } else {
                        this.errorType = 0;
                        this.dataList = data;
                        this.refreshScroll();
                    }
                } else {
                    this.errorType = 3;
                }
                this.$loading.close();
            }).catch(() => {
                this.errorType = 2;
                this.$loading.close();
            });
        },
        // 刷新滚动条
        refreshScroll() {
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs['scroll'], {});
                } else {
                    this.scroll.refresh();
                }
            });
        },
        showToast(msg) {
            this.$toast({
                message: msg,
                align: 'center',
                duration: 2000 //消失时间
            });
        }
    },
    created() {
        hideWxShare();
    },
    mounted() {
        this.fetchList();
    },
    beforeRouteEnter(to, from, next) {
        const userToken = getUserToken();
        if (!userToken) {
            next({
                path: '/musicParty/lottery',
                query: to.query
            });
        } else {
            next();
        }
    }
}
</script>


<style src="./public/screen.css">
</style>

<style lang="less" scoped>

.page-wrap {
    position: relative;
    height: 100%;
    background: #F14727 url("~@/assets/images/musicParty2020/other/other_bg@2x.png") center 0 no-repeat;
    background-size: cover;
    .header {
        position: absolute;
        top: 1.373333rem /* 103/75 */;
        left: 50%;
        transform: translateX(-50%);
        width: 4.466667rem /* 335/75 */;
        height: .986667rem /* 74/75 */;
        background: url("~@/assets/images/musicParty2020/other/title_rank@2x.png") center center no-repeat;
        background-size: 100%;
    }
    .content {
        overflow: hidden;
        position: absolute;
        top: 2.733333rem /* 205/75 */;
        left: .4rem /* 30/75 */;
        right: .4rem /* 30/75 */;
        bottom: 2.56rem /* 192/75 */;
        border-radius: .2rem /* 15/75 */;
        background-color: #FFFFFF;
    }
    .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4.226667rem /* 317/75 */;
        background: url("~@/assets/images/musicParty2020/lottery/qianjing@2x.png") center center no-repeat;
        background-size: 100%;
    }
}

.rank-list {
    position: relative;
    text-align: center;
    padding: 0 .706667rem /* 53/75 */;
    .rank-item, .rank-head {
        display: flex;
        .left {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 4rem /* 300/75 */;
            padding-right: .533333rem /* 40/75 */;
        }
        .right {
            flex: 1;
        }
    }
    .rank-head {
        line-height: 1.333333rem /* 100/75 */;
        font-size: .373333rem /* 28/75 */;
        color: #9E9E9E;
    }
    .rank-item {
        line-height: 1.533333rem /* 115/75 */;
        color: #4A4A4A;
        .left {
            text-align: left;
            position: relative;
            font-size: .346667rem /* 26/75 */;
            font-weight: 600;
            .avatar {
                position: absolute;
                top: 50%;
                left: .48rem /* 36/75 */;
                transform: translateY(-50%);
                width: .8rem /* 60/75 */;
                height: .8rem /* 60/75 */;
                border-radius: 100%;
            }
            .name {
                margin-left: 1.573333rem /* 118/75 */;
            }
        }
        .right {
            font-size: .333333rem /* 25/75 */;
            font-weight: 500;
        }
        & + .rank-item {
            border-top: #F2F2F2 solid 1px;
        }
    }

    &.fixed {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #FFFFFF;
        .rank-head {
            border-bottom: #F2F2F2 solid 1px;
        }
    }
}

.view-aha {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3.626667rem /* 272/75 */;
    margin: 0 auto;
    .text {
        margin-bottom: .56rem /* 42/75 */;
        padding-top: 3.986667rem /* 299/75 */;
        line-height: .346667rem /* 26/75 */;
        font-size: .4rem /* 30/75 */;
        color: #9E9E9E;
    }
    .button {
        width: 3.146667rem /* 236/75 */;
        height: 1.36rem /* 102/75 */;
        border-radius: .72rem /* 54/75 */;
        font-size: .426667rem /* 32/75 */;
        font-weight: 500;
        color: #FFFFFF;
        background-color: #FD5E02;
    }

    &.empty {
        background: url("~@/assets/images/musicParty2020/other/ico_aha_oh@2x.png") center 0 no-repeat;
        background-size: 3.626667rem /* 272/75 */;
    }
    &.error {
        background: url("~@/assets/images/musicParty2020/other/ico_aha_sleep@2x.png") center 0 no-repeat;
        background-size: 3.626667rem /* 272/75 */;
    }
}

</style>