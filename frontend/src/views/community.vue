<template>
    <div id="communityVue" style="height: 100%;">
        <div style="width: 100%; display: flex; justify-content: center;">
            <div class="q-mr-md" style="width: 250px;">
                <div class="shadow-2 q-pa-md" style="min-height: 500px;">
                    <q-input label="검색할 유저 이름을 입력하세요." dense> 
                    </q-input>
                </div>
            </div>
            <div style="width: 600px; border: 1px solid #eee;" class="q-pa-md">
                <q-scroll-area style="max-width: 100%;"
                    :style="{height: $store.state.height - 180 + 'px'}">
                    <div>
                        안니엉?
                    </div>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'communityVue',
    components: {
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    mounted: function() {
        let vm = this;
    },
}
</script>