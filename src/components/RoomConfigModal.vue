<!-- RoomConfigModal.vue -->
<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal">
            <div class="modal-header">
                <button class="close-button" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="config-option" @click="selectConfig({ cols: 8, rows: 8, mines: 10, n_player: n_player })">
                    8 × 8
                    <div>10 雷</div>
                </div>
                <div class="config-option" @click="selectConfig({ cols: 16, rows: 16, mines: 40, n_player: n_player })">
                    16 × 16
                    <div>40 雷</div>
                </div>
                <div class="config-option" @click="selectConfig({ cols: 30, rows: 16, mines: 99, n_player: n_player })">
                    30 × 16
                    <div>99 雷</div>
                </div>
                <div class="config-option" @click="selectCustomConfig">
                    ?
                    <div>自定义</div>
                </div>
            </div>
            <div class="modal-footer">
                <label for="n_player">玩家人数: {{ n_player }}</label>
                <input type="range" id="n_player" v-model.number="n_player" min=1 max=10 class="slider">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            n_player: 3,
        };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        selectConfig(config) {
            this.$emit('select', config);
        },
        selectCustomConfig() {
            // Trigger some custom config logic, maybe another prompt or a form
            this.$emit('custom');
        }
    }
};
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    width: 50%;
}

.modal-header {
    display: flex;
    justify-content: flex-end;
}

.close-button {
    background: none;
    border: none;
    font-size: 25px;
    cursor: pointer;
    transition: color 0.2s;
}

.close-button:hover {
    color: #555;
}

.config-option {
    padding: 20px;
    margin: 10px 0;
    border: 1px solid #ddd;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.config-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.modal-footer {
    margin-top: 20px;
}

.slider {
    appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: #ddd;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    box-shadow: 0 0 4px #000;
}

.slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    box-shadow: 0 0 4px #000;
}
</style>