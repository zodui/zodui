import './tdesign.scss'
import 'tdesign-react/esm/style/index.js'
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClearIcon,
  DeleteIcon,
  LinkIcon,
  MoreIcon,
  RollbackIcon
} from 'tdesign-icons-react'
import { Button, Slider, Textarea } from 'tdesign-react/esm'

import { registerController, registerIcon } from '../components'
import { registerBaseComp } from '../components/base'

initIcons: {
  registerIcon('Add', AddIcon)
  registerIcon('More', MoreIcon)
  registerIcon('Link', LinkIcon)
  registerIcon('Clear', ClearIcon)
  registerIcon('Delete', DeleteIcon)
  registerIcon('Prepend', props => <RollbackIcon style={{
    transform: 'rotate(90deg)'
  }} />)
  registerIcon('Append', props => <RollbackIcon style={{
    transform: 'rotate(-90deg)'
  }} />)
  registerIcon('ArrowUp', ArrowUpIcon)
  registerIcon('ArrowDown', ArrowDownIcon)
}

initComponents: {
  registerBaseComp('Button', ({ theme, ...props }) => <Button
    theme={({
      info: 'default',
      error: 'danger',
      warning: 'warning',
      success: 'success',
    } as const)[theme]}
    {...props}
  />)

  registerController('Number.Slider', Slider)
  registerController('String.TextArea', props => <Textarea
    autosize={{
      minRows: 1,
    }}
    {...props}
  />)
}
