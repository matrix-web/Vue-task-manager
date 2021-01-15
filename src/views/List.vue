<template>
    <div class="row">
        <div class="col s12">
            <h1 class="title-1 center">Список задач</h1>
            <div class="input-field col s12">
                <select ref="select" v-model="filter" v-if="tasks.length" @change="filterItems">
                    <option disabled value="">Выберите один из фильтров</option>
                    <option v-for="option in options" :key="option.value" :value="option.value">{{option.title}}</option>
                </select>
                <table class="striped table-tasks" v-if="tasks.length">
                    <thead>
                        <tr>
                            <th class="content-center">#</th>
                            <th class="content-center">Имя</th>
                            <th class="content-center">Описание</th>
                            <th class="content-center">Статус</th>
                            <th class="content-center">Дата</th>
                            <th class="content-center">Редактировать</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(task, index) in items" :key="task.id">
                            <td class="content-center"><strong>{{index + 1}}</strong></td>
                            <td>{{task.title}}</td>
                            <td class="td-description">
                                <div class="text">
                                    {{task.description}}
                                </div>
                            </td>
                            <td class="content-center"><span class="badge white-text" :class="task.statusClass">{{task.status}}</span></td>
                            <td class="content-center">{{task.date | dateFilter}}</td>
                            <td class="content-center">
                                <router-link :to="/task/ + task.id" class="waves-effect waves-light btn-small indigo darken-2">
                                    <i class="material-icons left button-icon-m-0">edit</i>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="center message-text" v-else><strong>Список задач пуст </strong>  <router-link to="/">создать задачу?</router-link></p>
                
                <Paginate
                    v-model="page"
                    :page-count="pageCount"
                    :click-handler="pageChangeHandler"
                    :prev-text="'Назад'"
                    :next-text="'Вперед'"
                    :container-class="'pagination'"
                    :page-class="'waves-effect'"
                    :class="{'pagination-hidden': pageCount <= 1}"
                />
            </div>
        </div>
    </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'


export default {
    name: 'list',
    mixins: [paginationMixin],
    data: () => ({
        select: null,
        options: [
            {title: 'Все', value: 'all'},
            {title: 'Активные', value: 'active'},
            {title: 'Завершенные', value: 'complete'},
            {title: 'Просроченные', value: 'outdated'}
        ],
        filter: '',
        filtered: false,
        filterTasks: []
    }),
    computed: {
        tasks() {
            return this.$store.getters.tasks.map(task => Object.assign(task, {statusClass: task.status === 'active' ? 'status-active' : task.status === 'complete' ? 'status-complete' : 'status-outdated'}))
        }
    },
    mounted() {
        this.select = M.FormSelect.init(this.$refs.select)
        this.filterTasks = this.tasks
        this.setup(this.filterTasks)
    },
    methods: {
        setup(tasks) {
            this.setupPagination(tasks)
        },
        filterItems() {
            this.filterTasks = this.tasks
            this.filterTasks = this.filterTasks.filter(task => {
                if (!this.filter || this.filter === 'all') {
                    return true
                }

                return task.status === this.filter
            })
            this.setup(this.filterTasks)
        }
    },
    destroyed() {
        if (this.select && this.select.destroy) {
            this.select.destroy()
        }
    }
}
</script>

<style lang="scss" scoped>
    .table-tasks {
        margin-bottom: 2.6rem;
    }
    .td-description {
        max-width: 350px;
    }

    .text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .content-center {
        text-align: center;
    }

    .status-active {
        background-color: #4caf50;
    }

    .status-complete {
        background-color: #616161;
    }

    .status-outdated {
        background-color: #f44336;
    }

    .dropdown-content li > a, .dropdown-content li > span {
        color: #303f9f !important;
    }

    .select-hidden {
        display: none;
    }

    .message-text {
        margin-top: 3rem;
    }

    .pagination-hidden {
        display: none;
    }

</style>