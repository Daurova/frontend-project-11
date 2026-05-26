import * as yup from 'yup'

const urlSchema = yup.string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')


export const validateUrl = (url, existingFeeds) => {
    const schemaWithDuplicateCheck = urlSchema.test(
        'unique',
        'RSS уже существует',
        (value)=>{
            if(!value) return true
            const isDuplicate = existingFeeds.some(feed=> feed.url===value)
            return !isDuplicate
        }
    )

  return schemaWithDuplicateCheck.validate(url)
}

