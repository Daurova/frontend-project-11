import { state } from "./state";
import { validateUrl } from "./validator";

export const addRssFeed = (url) => {

    console.log('🟢🟢🟢 model.addRssFeed ВЫЗВАНА с url:', url);
  console.log('🟢 Тип аргумента url:', typeof url);
  console.log('🟢 Длина url:', url.length);
    state.form.isValid = true
    state.form.errorMessage =''
    state.form.isSubmitting = true
    return validateUrl(url, state.feeds)
      .then(()=>{
    console.log('УСПЕХ');


        const newFeed = {
            id: Date.now(), 
            url: url,
            title: `RSS Feed ${url}`
        }

        state.feeds.push(newFeed)

        state.form.url = ''
        state.form.isValid = true
        state.form.errorMessage = ''
        state.form.isSubmitting = false
        state.form.isSuccess = true
        console.log('RSS добавлен:', newFeed);

        setTimeout(()=>{
            state.form.isSuccess = false
        }, 2000)
    })
    .catch((e)=>{
        state.form.isValid = false
        state.form.errorMessage = e.message
        state.form.isSubmitting = false

        console.error('Ошибка валидации', e.message)
    }) 
}