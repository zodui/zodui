import './index.scss'

import type { ComposerProps, ComposerRef } from '@zodui/core'
import { AllTypes } from '@zodui/core'
import { classnames, inlineMarkdown, isWhatType, merge } from '@zodui/core/utils'
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import type { Schema } from 'zod'

import type { ItemProps, ItemRef } from './item'
import { Item } from './item'

export interface ListRef extends ComposerRef {
}

export interface ListProps<M extends Schema = any> extends ComposerProps<M> {
  className?: string
}

const prefix = 'zodui-composer-list'

function InnerList<M extends Schema>(props: ListProps<M>, ref: React.ForwardedRef<ListRef>) {
  const {
    model,
    value,
    defaultValue,
    onChange,
    disabled
  } = props
  const def = model._def
  const valueRef = useRef(value ?? defaultValue ?? {})
  const changeValue = useCallback((v: any) => {
    valueRef.current = v
    onChange?.(v)
  }, [onChange])

  const itemRefs = useRef<Record<string, ItemRef>>({})

  useImperativeHandle(ref, () => ({
    async verify() {
      const promises = Object.entries(itemRefs.current).map(([_, ref]) => {
        if (!ref) return Promise.resolve()
        return ref.verify()
      })
      await Promise.all(promises)
      return valueRef.current
    }
  }), [])

  if (isWhatType(def, AllTypes.ZodIntersection)) {
    // TODO resolve ref merge
    return <>
      <List prefix='intersect::left'
            className={props.className}
            disabled={disabled}
            model={def.left}
            value={valueRef.current}
            onChange={async v => changeValue(merge(valueRef.current, v))}
      />
      <List prefix='intersect::right'
            className={props.className}
            disabled={disabled}
            model={def.right}
            value={valueRef.current}
            onChange={async v => changeValue(merge(valueRef.current, v))}
      />
    </>
  }

  return <div className={classnames(prefix, props.className)}>
    <div className={`${prefix}__header`}>
      {def.label && <h2 className={classnames(`${prefix}__label`, {
        // @ts-ignore
        'is-optional': def.typeName === AllTypes.ZodOptional
      })}>
        {def.label}
      </h2>}
      {def.description
        && <pre
          className={`${prefix}__desc inline-md`}
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(def.description) }}
        />}
    </div>
    {isWhatType(def, AllTypes.ZodObject)
      ? Object.entries(def.shape()).map(([key, value]) => <Item
        ref={ele => itemRefs.current[key] = ele}
        key={key}
        uKey={`${props.prefix || ''}.${key}`}
        meta={{
          label: value._def.label || key,
          description: value._def.description
        }}
        model={value}
        disabled={disabled}
        onChange={async v => changeValue({ ...valueRef.current, [key]: v })}
      />)
      : <Item
        ref={ele => itemRefs.current['single'] = ele}
        uKey='single'
        meta={{
          label: model._label || def?.description || model.type,
          description: def.description
        }}
        model={model}
        disabled={disabled}
        value={valueRef.current}
        onChange={changeValue}
      />}
  </div>
}

export const List = forwardRef(InnerList) as unknown as {
  <M extends Schema>(
    props: ListProps<M> & { ref?: React.ForwardedRef<ListRef> }
  ): React.ReactElement
  displayName?: string

  Item: typeof Item
  ItemRef: ItemRef
  ItemProps: ItemProps
}

List.displayName = 'List-Composer'

List.Item = Item

export { Item as ListItem } from './item'
