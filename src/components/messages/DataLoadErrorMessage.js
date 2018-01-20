import React from 'react'
import { Message, Icon } from 'semantic-ui-react'

const DataLoadErrorMessage = (props) => {
  return (
    <Message warning>
      <p><Icon name='warning' />
      <b>Ошибка загрузки данных {props.dataTitle}</b></p>
      <p><u>Попробуйте следующее:</u></p>
      <p>1. Обновить страницу</p>
      <p>2. Заново войти в систему</p>
      <p>3. Если ошибка сохранится, сообщите Администратору</p>
      <p>4. Возможно, нарушены права доступа</p>
    </Message>
  )
}
export default DataLoadErrorMessage
