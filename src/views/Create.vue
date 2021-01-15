<template>
  <div class="row">
    <div class="col s8 offset-s2">
      <h1 class="title-1 center">Создать задачу</h1>
      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input 
            id="title" 
            type="text" 
            class="validate mod-card-title" 
            v-model.trim="title"
            :class="{invalid: $v.title.$dirty && !$v.title.required}"
          />
          <label for="title">Имя</label>
          <span 
            class="helper-text" 
            data-error="Введите имя"
            v-if="$v.title.$dirty && !$v.title.required"
          >Введите имя</span>
        </div>
        <div class="input-field">
          <div class="chips" ref="chips"></div>
        </div>
        <div class="input-field">
          <input type="text" class="datepicker" ref="datepicker">
        </div>
        <div class="input-field">
            <textarea 
              id="description" 
              class="materialize-textarea" 
              data-length="2048" 
              v-model="description"
              :class="{invalid: ($v.description.$dirty && !$v.description.required) || ($v.description.$dirty && !$v.description.maxLength)}"
            ></textarea>
            <label for="description">Описание</label>
            <span class="character-counter" style="float: right; font-size: 12px;">{{description.length}}/{{$v.description.$params.maxLength.max}}</span>
            <span 
              class="helper-text" 
              data-error="Введите описание"
              v-if="$v.description.$dirty && !$v.description.required"
            >Введите краткое описание задачи</span>
            <span 
              class="helper-text" 
              data-error="Длина описания не должна превышать 2048 символов"
              v-else-if="$v.description.$dirty && !$v.description.maxLength"
            >Длина описания не должна превышать {{$v.description.$params.maxLength.max}} символов</span>
        </div>
        <div class="input-field">
            <button class="btn waves-effect waves-light indigo darken-2" type="submit" name="action">Добавить
              <i class="material-icons right">send</i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators"
import { v4 } from "uuid"


export default {
  name: 'create',
  data: () => ({
    title: '',
    description: '',
    chips: null,
    datePicker: null
  }),
  validations: {
    title: {required},
    description: {required, maxLength: maxLength(2048)}
  },
  mounted() {
    this.chips = M.Chips.init(this.$refs.chips, {
      placeholder: 'Добавьте теги'
    });

    this.datePicker = M.Datepicker.init(this.$refs.datepicker, {
      format: 'dd.mm.yyyy',
      defaultDate: new Date(),
      setDefaultDate: true
    });
  },
  methods: {
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      
      const task = {
        id: v4(),
        title: this.title,
        description: this.description,
        tags: this.chips.chipsData,
        date: this.datePicker.date,
        status: 'active'
      }

      this.$store.dispatch('createTask', task)
      this.title = ''
      this.description = ''
      this.$v.$reset()
      this.$message('Задача успешно добавлена!')
      this.$router.push('/list')
    }
  },
  destroyed() {
    if (this.chips && this.chips.destroy) {
      this.chips.destroy()
    }

    if (this.datePicker && this.datePicker.destroy) {
      this.datePicker.destroy()
    }
  }
}
</script>
