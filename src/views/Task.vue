<template>
    <div class="row">
        <div class="col s12">
            <h1 class="title-1 center">Задача</h1>
            
            <div class="card card-task" :class="task.cardState">
                <div class="card-content">
                    <div class="card-wrapper">
                        <div class="card-fields">
                            <div :class="(inactive) ? 'inactive-field' : 'is-editing'">
                                <h2 class="card-title content-hidden">{{title}}</h2>
                                <div class="input-field">
                                    <input 
                                        id="title" 
                                        type="text" 
                                        class="validate" 
                                        v-model.trim="title"
                                        :disabled="inactive"
                                        :class="{invalid: $v.title.$dirty && !$v.title.required}"
                                    />
                                    <label for="title">Имя</label>
                                    <span 
                                        class="helper-text" 
                                        data-error="Введите имя"
                                        v-if="$v.title.$dirty && !$v.title.required"
                                    >Введите имя</span>
                                </div>
                            </div>
                            <div :class="(inactive) ? 'inactive-field' : 'is-editing'">
                                <p class="content-hidden">{{description}}</p>
                                <div class="input-field">
                                    <textarea 
                                        id="description" 
                                        class="materialize-textarea" 
                                        data-length="2048" 
                                        v-model.trim="description"
                                        :disabled="inactive"
                                        :class="{invalid: ($v.description.$dirty && !$v.description.required) || ($v.description.$dirty && !$v.description.maxLength)}"
                                    ></textarea>
                                    <label for="description">Описание</label>
                                    <span class="character-counter counter-hidden" style="float: right; font-size: 12px;">{{description.length}}/{{$v.description.$params.maxLength.max}}</span>
                                    <span 
                                        class="helper-text" 
                                        data-error="Введите краткое описание задачи"
                                        v-if="$v.description.$dirty && !$v.description.required"
                                    >Введите краткое описание задачи</span>
                                    <span 
                                        class="helper-text" 
                                        data-error="Длина описания не должна превышать 2048 символов"
                                        v-else-if="$v.description.$dirty && !$v.description.maxLength"
                                    >Длина описания не должна превышать {{$v.description.$params.maxLength.max}} символов</span>
                                </div>
                            </div>
                            <div :class="(inactive) ? 'inactive-field' : 'is-editing'">
                                <input type="text" class="datepicker" ref="datepicker">
                            </div>
                        </div>
                        <div class="card-buttons-edit" :class="(inactive) ? 'inactive-field' : 'is-editing'">
                            <button class="waves-effect waves-light btn-small" v-tooltip="'Сохранить'" @click="saveUpdatedTask">
                                <i class="material-icons right button-icon-m-0">save</i>
                            </button>
                            <button class="waves-effect waves-light btn-small" v-tooltip="'Отмена'" @click="cancelUpdate">
                                <i class="material-icons right button-icon-m-0">close</i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-action card-action-wrapper">
                    <div class="card-action-buttons">
                        <button @click="updateTask" class="button-action waves-effect waves-light btn-small indigo darken-2" v-tooltip="'Редактировать'" :class="{hide: task.status === 'complete'}"><i class="material-icons left button-icon-m-0">edit</i></button>
                        <a @click="openModal" href="#delete-modal" class="button-action waves-effect waves-light btn-small indigo darken-2" v-tooltip="'Удалить'"><i class="material-icons left button-icon-m-0">delete</i></a>
                        <button class="button-action waves-effect waves-light btn-small indigo darken-2" v-tooltip="'Завершить'" :class="{hide: task.status === 'complete' || inactive}" @click="completeTask"><i class="material-icons left button-icon-m-0">check</i></button>
                    </div>
                    <div>Дата завершения задачи: <strong>{{task.date | dateFilter}}</strong></div>
                </div>
            </div>

            <div id="delete-modal" class="modal modal-window" ref="deleteModal">
                <div class="modal-content modal-window-content">
                    <h4 class="modal-heading-4 center">Удалить</h4>
                    <p>Вы действительно хотите удалить задачу?</p>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat" @click.prevent="deleteTask">Да</a>
                    <a href="#!" class="modal-close waves-effect waves-red btn-flat">Нет</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators"

export default {
    name: 'task',
    data: () => ({
        modal: null,
        date: null,
        title: '',
        description: '',
        currentTask: {},
        inactive: true
    }),
    validations: {
        title: {required},
        description: {required, maxLength: maxLength(2048)}
    },
    methods: {
        completeTask() {
            this.$store.dispatch('completeTask', this.$route.params.id)

            this.$message('Задача завершена')
            this.$router.push('/list')
        },
        updateTask() {
            this.inactive = false
        },
        saveUpdatedTask() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }

            this.task.title = this.title
            this.task.description = this.description
            this.task.date = this.date.date

            this.$store.dispatch('updateTask', this.task)
            this.$message('Задача успешно обновлена')
            this.inactive = true
        },
        cancelUpdate() {
            this.inactive = true

            this.task.title = this.currentTask.title
            this.task.description = this.currentTask.description
            this.task.date = new Date(this.currentTask.date)
            this.date = M.Datepicker.init(this.$refs.datepicker, {
                format: 'dd.mm.yyyy',
                defaultDate: new Date(this.task.date),
                setDefaultDate: true
            });
        },
        deleteTask () {
            this.$store.dispatch('removeTask', this.$route.params.id)
            this.$message('Задача успешно удалена')
            this.$router.push('/list')
        },
        openModal() {
            this.modal.open()
        },
    },
    mounted() {
        this.title = this.task.title
        this.description = this.task.description
        this.modal = M.Modal.init(this.$refs.deleteModal)
        this.date = M.Datepicker.init(this.$refs.datepicker, {
            format: 'dd.mm.yyyy',
            defaultDate: new Date(this.task.date),
            setDefaultDate: true
        })
        setTimeout(() => M.updateTextFields(), 0)
    },
    computed: {
        task() {
            this.currentTask = this.$store.getters.taskById(this.$route.params.id)
            return Object.assign({}, {...this.currentTask, cardState: this.currentTask.status === 'active' ? 'state-active' : this.currentTask.status === 'complete' ? 'state-complete' : 'state-outdated'})
        },
    },
    destroyed() {
        if (this.modal && this.modal.destroy) {
            this.modal.destroy()
        }

        if (this.date && this.date.destroy) {
            this.date.destroy()
        }
    }
}
</script>

<style lang="scss" scoped>
    .card-task {
        border-left: 5px solid #283593;
    }

    .button-action:not(:last-child) {
        margin-right: 20px;
    }

    .state-active {
        border-left: 5px solid #4caf50;
    }

    .state-complete {
        border-left: 5px solid #616161;
    }

    .state-outdated {
        border-left: 5px solid #f44336;
    }

    .modal-window {
        width: 30%;
    }

    .modal-heading-4 {
        margin-bottom: 20px;
    }

    .mod-card-title {
        background-color: transparent;
        border-radius: 3px;
        box-shadow: none;
        border: none;
        font-size: 24px;
        font-weight: 300;
        line-height: 1.5;
        min-height: 24px;
        padding: 4px 0;
        color: rgba(0,0,0,0.87);
        outline: none;
        resize: none;
    }

    .card-action-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .inactive-field {

        textarea.materialize-textarea:disabled {
            border: none;
            color: rgba(0,0,0,0.87);
        }

        input[type=text]:not(.browser-default):disabled {
            border: none;
            font-size: 24px;
            font-weight: 300;
            color: rgba(0,0,0,0.87);
        }

        input.valid[type=text]:not(.browser-default) {
            border: none;
            box-shadow: none;
        }

        &.card-buttons-edit {
            display: none;
        }

        .datepicker {
            display: none;
        }

        label {
            display: none;
        }

        span {
            display: none;
        }
    }

    .is-editing {

        .textarea.materialize-textarea {
            border-bottom: 1px solid #9e9e9e;
        }

        .input-field {
            margin-top: 1rem;
            margin-bottom: 1rem;
        }

        input[type=text] {
            border-bottom: 1px solid #9e9e9e;
        }

        &.card-buttons-edit {
            display: block;
        }

        .datepicker {
            display: block;
        }

        label {
            display: inline-block;
            color: rgba(0,0,0,0.54)
        }

        span {
            display: inline-block;
        }
    }

    .card-buttons-edit button:not(:last-child) {
        margin-right: 10px;
    }

    .card-wrapper {
        display: flex;
        justify-content: space-between;
    }

    .card-fields {
        padding-right: 20px;
        flex-grow: 1;
    }

    .content-hidden {
        width: 0.01px;
        height: 0.01px;
        overflow: hidden;
        margin: 0 !important;
    }

    .hide {
        display: none;
    }

    .input-field {
        margin: 0;
    }

    .helper-text.invalid {
        color: #F44336
    }

</style>