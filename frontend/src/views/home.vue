<template>
    <div id="homeVue" style="height: 100%;">
        <div class="row q-mt-md q-mb-md" style="justify-content: center;">
            <template v-if="$store.state.couple.backgroundImageElement">
                <div class="q-mr-md" v-html="$store.state.couple.backgroundImageElement"></div>
            </template>
            <template v-else>
                <div class="q-mr-md shadow-2" style="width: 480px; height: 640px; position: relative;">
                    <div style="position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%, -50%);" class="fkR ft16 text-center">
                        커플 배경사진이 세팅되지 않았습니다.
                        <q-btn outline @click="goto_profile">
                            설정하러가기
                        </q-btn>
                    </div>
                </div>
            </template>
            <div class="shadow-4 q-pa-md">
                <div style="display: flex; justify-content: space-between; align-items: center;"
                    class="q-mb-sm">
                    <div class="text-h6 fkB text-primary">
                        일정
                    </div>
                    <div>
                        <q-btn icon="open_in_new" flat rounded @click="openTimeline">
                            <q-tooltip><span class="fkR ft16">타임라인</span></q-tooltip>
                        </q-btn>
                    </div>
                </div>
                
                <div style="min-width: 400px; max-width: 400px;">
                    <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"
                        style="height: 200px; max-width: 400px; padding: 12px; border: 1px solid gray;">
                        <div style="width: 100%; height: 100%;">
                            <template v-if="sche_list.length == 0" >
                                <div style="display: flex; width: 100%; height: 100%;
                                justify-content: center; align-items: center;" class="fkR ft18">
                                    등록된 일정이 없습니다.
                                </div>
                            </template>
                            <template  v-for="row, idx in sche_list" :key="idx">
                                <div style="display: flex; background-color: #eee; align-items: center;
                                    border-radius: 5px; border: 1px solid gray;" 
                                    class="q-mb-sm q-px-sm fkR ft16" >
                                    <div style="max-width: 150px; max-height: 24px; text-overflow: ellipsis; overflow: hidden;
                                        cursor: pointer;" @click="onClickSche(row)">
                                        {{ row.title }}
                                        <q-tooltip class="fkR ft16" v-if="row.body">
                                            {{ row.body }}
                                        </q-tooltip>
                                    </div>
                                    <q-space></q-space>
                                    <div v-if="row.location">
                                        <q-btn icon="place" flat dense @click="openMap(row)" />
                                    </div>
                                    <div class="q-mr-sm">
                                        <div :style="{backgroundColor: row.classificationColor}" 
                                            style="border-radius: 5px; font-size: 11px; border: 1px solid gray;"
                                            class="q-px-sm text-white text-bold">
                                            {{ row.classification }}
                                        </div>
                                    </div>
                                    <div>
                                        <q-badge v-if="row.Dday > 0" color="negative">
                                            D+{{ row.Dday }}
                                        </q-badge>
                                        <q-badge v-else color="positive">
                                            D{{ row.Dday }}
                                        </q-badge>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </q-scroll-area>
                    
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;"
                    class="q-mb-sm q-mt-md">
                    <div class="text-h6 fkB text-primary">
                        앨범
                    </div>
                    <div>
                        <q-btn icon="open_in_new" flat rounded @click="goto_album">
                            <q-tooltip><span class="fkR ft16">바로가기</span></q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <div>
                    <template v-if="albumList.length > 0">
                        <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle"
                            style="max-width: 400px; border: 1px solid gray; 
                                height: 250px; max-height: 250px;">
                            <div style="display: flex;">
                                <template v-for="item, idx in albumList" :key="idx">
                                    <q-card flat bordered class="q-ma-sm" style="width: 150px;">
                                        <q-img :src="$store.state.host + item.coverImageUrl" 
                                            style="width: 150px; height: 150px;"
                                            fit="cover" />
                                        <q-separator></q-separator>
                                        <q-card-section>
                                            <div class="text-subtitle2 fkR ft16">{{ item.title }}</div>
                                        </q-card-section>
                                    </q-card>
                                </template>
                            </div>
                        </q-scroll-area>
                    </template>
                    <template v-else>
                        <div class="shadow-2" style="height: 150px; position: relative;">
                            <div class="fkR ft18"
                                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                앨범이 존재하지 않습니다.
                            </div>
                            
                        </div>
                    </template>
                </div>
            </div>
        </div>
        
        <dialog_schedule_timeline ref="dialog_schedule_timeline" />
    </div>
</template>

<script>

import axios from "axios";
import dialog_schedule_timeline from "@/components/dialog_schedule_timeline.vue";

export default {
    name: 'homeVue',
    components: {
        dialog_schedule_timeline,
    },
    data() {
        return {
            map: null,
            marker: {
                x: 0,
                y: 0,
            },

            thumbStyle: {
                right: '4px',
                borderRadius: '5px',
                backgroundColor: '#027be3',
                width: '5px',
                opacity: 0.75
            },

            barStyle: {
                right: '2px',
                borderRadius: '9px',
                backgroundColor: '#027be3',
                width: '9px',
                opacity: 0.2
            },
            slide: 0,
            fullscreen: false, 

            albumList: [],

            sche_list: [],
            sche_columns: [
                { name: 'classification', label: '유형', align: 'left', field: 'classification', sortable: false },
                { name: 'title', label: '제목', align: 'left', field: 'title', sortable: false },
                // { name: 'dateRange', label: '날짜', align: 'left', field: 'dateRange', sortable: false },
                { name: 'Dday', label: 'D-day', align: 'left', field: 'Dday', sortable: false, },
                { name: 'details', label: '상세보기', align: 'left', field: 'details', sortable: false },
            ],
        }
    },
    methods: {
        goto_album() {
            let vm = this;
            vm.$root.$refs.layout.tab = 'album';
            vm.$root.$refs.layout.location_href('/album');
        },
        goto_profile() {
            let vm = this;
            vm.$root.$refs.layout.tab = 'profile';
            vm.$root.$refs.layout.location_href('/profile');
        },
        goto_detail(args) {
            let vm = this;
            vm.$root.$refs.layout.tab = 'calendar';
            vm.$router.push(`/calendar/${args.id}`);
        },  
        diffDay(date) {
            const masTime = new Date(date);
            const todayTime = new Date();
            const diff = todayTime - masTime;
            return Math.floor(diff / (1000*60*60*24));
        },

        openTimeline() {
            let vm = this;
            vm.$refs.dialog_schedule_timeline.open(vm.sche_list, function() {

            });
        },
        openMap(row) {
            let vm = this;        
            vm.$root.$refs.dialog_naver_map.open(row, function() {

            });
        },

        onClickSche(row) {
            let vm = this;
            row.isAllday = row.isAllday == 1 ? true : false;
            vm.$root.$refs.dialog_scheduled.open('edit', row, (schedule, type) => {
                vm.loadScheList();
            });
        },

        loadScheList() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            let classification_dict = vm.$store.state.classification_dict;
            axios.get(`/api/couple/${coupleInfoId}/schedules`, {

            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.sche_list;
                    row.map((x) => {
                        const Dday = vm.diffDay(x.start);
                        x["Dday"] = Dday;
                        x["startDateView"] = vm.$c.formatDate(new Date(x.start), "date");
                        if(Object.prototype.hasOwnProperty.call(classification_dict, x.classification)) {
                            x["classificationColor"] = classification_dict[x.classification].color;
                        }
                    });
                    vm.sche_list = row;
                }
            }).catch((err) => {
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        },
        loadAlbumList() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.get(`/api/couple/${coupleInfoId}/albums`, {

            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.album_list;
                    vm.albumList = row;
                }
            }).catch((err) => {
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        },
    },
    mounted: function() {
        let vm = this;
        vm.loadScheList();
        vm.loadAlbumList();

        
    },
    created() {
        let vm = this;

        // let marker = new naver.maps.Marker({
        //     position: new naver.maps.LatLng(35.2001115,129.0640855),
        //     map: map
        // });
        
        // naver.maps.Event.addListener(map, 'click', function(e) {
        //     marker.setPosition(e.latlng);
        //     vm.marker.x = e.latlng.x;
        //     vm.marker.y = e.latlng.y;
        // });
        // console.log(navigator.geolocation);
        // if (navigator.geolocation) { // GPS를 지원하면
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     vm.user_geolocation.x = position.coords.latitude;
        //     vm.user_geolocation.y = position.coords.longitude;
        //     console.log("user_geolocation:" ,vm.user_geolocation);
        //     vm.newmaker(position.coords.longitude, position.coords.latitude);
        // }, function(error) {
        //     console.error(error);
        // }, {
        //     enableHighAccuracy: false,
        //     maximumAge: 0,
        //     timeout: Infinity
        // });
        // } else {
        //     alert('GPS를 지원하지 않습니다');
        // }
    },
}
</script>