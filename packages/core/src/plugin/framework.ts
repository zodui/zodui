export interface Framework<K extends FrameworksKeys> {
  defineIcon(): Framework<K>
  defineComp<
    Type extends string,
  >(
    type: Type,
    func: (props: any) => any,
  ): Framework<K>
  defineCtrl(): Framework<K>
  defineView(): Framework<K>
  defineStructure(): Framework<K>
}

export interface Frameworks {
  [key: string]: Framework<string>
}

export type FrameworksKeys = keyof Frameworks
