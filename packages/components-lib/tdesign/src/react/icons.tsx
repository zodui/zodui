import { definePlugin } from '@zodui/core'
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

export const IconsOfTDesignComponentsLibForReact = definePlugin('TDesign.React.Renders', ctx => {
  const ctxFgt = ctx.framework('react')
  ctxFgt
    .defineIcon('Add', AddIcon)
    .defineIcon('More', MoreIcon)
    .defineIcon('Link', LinkIcon)
    .defineIcon('Clear', ClearIcon)
    .defineIcon('Delete', DeleteIcon)
    .defineIcon('Prepend', props => <RollbackIcon style={{ transform: 'rotate(90deg)' }} {...props} />)
    .defineIcon('Append', props => <RollbackIcon style={{ transform: 'rotate(-90deg)' }} {...props} />)
    .defineIcon('ArrowUp', ArrowUpIcon)
    .defineIcon('ArrowDown', ArrowDownIcon)
})
