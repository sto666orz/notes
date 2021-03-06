<template>
  <div>
    <video-demo 
        :fullScreen.sync="fullScreen"
        title="第一节四五第一节九十第二节四五第二节九十第三节四五"
        sources="http://test001.pnlyy.com/mb/0orrjpxjfTvIibv3M7bnjH9h2bfeZUtJL1.mp4"
        thumb="http://test001.pnlyy.com/FbZ0e1kGNoylzTZ831bRA9P8aOIklL5dwaterMark.jpg"
        :timeline="timeline"
        @progress="viewQuestions"
        >
        <template #mask="{ portrait }">
            <interaction 
                :portrait="portrait"
                :questions="inclusion"
                @complete="resolveCallback"
                @abort="rejectCallback">
            </interaction>
        </template>
        <template #end>
            <popover-end
                @close="closeVideo()"
                @reset="resetVideo()"
                @next="nextVideo()">
            </popover-end>
        </template>
    </video-demo>
  </div>
</template>

<script>
import VideoDemo from './components/helloVideo.vue'
import Interaction from './components/interaction.vue'
import PopoverEnd from './components/popoverEnd.vue'

// import MkBridge from "mk-bridge"
import { compareVersion } from 'util/appBase'


export default {
    components: {
        VideoDemo,
        Interaction,
        PopoverEnd
    },
    data() {
        return {
            fullScreen: false,
            inclusion: [
                {
                    "id": "120",
                    "sno": "000120",
                    "title": "",
                    "question_type": 0,
                    "options_order": 0,
                    "question_stem": [{
                        "stem_type": 1,
                        "stem_content": "选出方框内节奏的正确组合方式"
                    }/* , {
                        "stem_type": 2,
                        "stem_content": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK21.png"
                    } */, {
                        "stem_type": 3,
                        "stem_content": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22.mp3"
                    }],
                    "question_analysis": [{
                        "analysis_type": 1,
                        "analysis_content": "在6/8拍中，是以八分音符为一拍，每小节有六拍，强弱规律的是强弱弱，次强弱弱，我们在音值组合的时候，将整个小节分为两组音群，将第1第2第3拍组合在一起，将第4第5第6拍组合在一起，按照这种组合方式，所以选择第一个选项"
                    }, {
                        "analysis_type": 3,
                        "analysis_content": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22.mp3"
                    }],
                    "question_option": [{
                        "is_answer": true,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK21-1.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK21-2.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK21-3.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK21-4.png"
                    }]
                },
                {
                    "id": "758789287407988736",
                    "sno": "927765",
                    "title": "第一节四五第一节九十第二节四五第二节九十第三节四五",
                    "question_type": 0,
                    "options_order": 1,
                    "question_stem": [{
                        "stem_type": 1,
                        "stem_content": "第一节四五六七八九十第二节四五六七八九十第三节四五六七八九十第四节四五六七八九十第五节四五六七八九十"
                    }, {
                        "stem_type": 2,
                        "stem_content": "FbZ0e1kGNoylzTZ831bRA9P8aOIklL5dwaterMark.jpg"
                    }],
                    "question_analysis": [{
                        "analysis_type": 1,
                        "analysis_content": "产生"
                    }],
                    "question_option": [{
                        "is_answer": true,
                        "option_img": "",
                        "option_text": "大提琴大提琴"
                    }, {
                        "is_answer": false,
                        "option_img": "",
                        "option_text": "大提琴a大提琴a333产生大提琴大提琴大提琴"
                    }, {
                        "is_answer": false,
                        "option_img": "",
                        "option_text": "333"
                    }, {
                        "is_answer": false,
                        "option_img": "",
                        "option_text": "444asdasd"
                    }]
                },
                {
                    "id": "121",
                    "sno": "000121",
                    "title": "",
                    "classification_id": "0",
                    "classification_pid": null,
                    "first_class": null,
                    "second_class": null,
                    "is_active": true,
                    "question_type": 0,
                    "options_order": 0,
                    "question_stem": [{
                        "stem_type": 1,
                        "stem_content": "从耳机图标处听音乐，选出方框内旋律片段的正确力度术语"
                    }, {
                        "stem_type": 2,
                        "stem_content": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22.png"
                    }, {
                        "stem_type": 3,
                        "stem_content": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22.mp3"
                    }],
                    "question_analysis": [{
                        "analysis_type": 1,
                        "analysis_content": "从音频中可以听出红框中的旋律是渐强，所以选crescendo"
                    }],
                    "question_option": [{
                        "is_answer": true,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22-1.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22-2.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22-3.png"
                    }, {
                        "is_answer": false,
                        "option_img": "mb/vXkbG9bt6VxLvQi0cAMPxmKR6JyhKDcK22-4.png"
                    }]
                }
            ],
            timeline: [10, 110]
            // currentResolve: () => {},
            // currentReject: () => {},

        }
    },
    methods: {
        resolveCallback() {
        },
        rejectCallback() {
        },
        viewQuestions(currentTime, resolve, reject) {
            //this.xxx().then(() => {})

            /* setTimeout(() => {
                resolve();
            }, 3000) */
            this.resolveCallback = resolve;
            this.rejectCallback = reject;
        },
        closeVideo() {
            this.fullScreen = false;
        },
        resetVideo() {
            this.fullScreen = false;
            this.$nextTick(() => {
                this.fullScreen = true;
            });
        },
        nextVideo() {
            //TODO:::: x
        }
    },
    created() {
        // console.log('MkBridge', MkBridge.container.version);


        console.log( '3.6.99', compareVersion('3.6.99') );
        console.log( '3.7.0', compareVersion('3.7.0') );
        console.log( '3.7.1', compareVersion('3.7.1') );
    }
}
</script>


