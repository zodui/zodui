# Zod UI React

## Support

### Role

#### Builtin

* number
  * input
  * slider
  * [ ] rate
  * [ ] progress
* string
  * input
  * link
  * textarea
  * date
  * [ ] color
  * [ ] code:${language}
* boolean
  * switch
  * [ ] radio
  * [ ] card
* union
  * select
  * radio
    * inline
    * [ ] inline-border
    * [ ] inline-button
* Date
  * base
    * datetime
    * select
  * panel
* list
  * [ ] tuple
    * base
    * wrap
    * nowrap
    * [ ] link
    * [ ] 2
      * [ ] range
        * datetime
        * [ ] number
      * [ ] slider
        * [ ] datetime
        * number
    * [ ] 3
      * [ ] color
        * rgb
        * hsl
  * array
    * base
    * wrap
    * nowrap
    * [ ] sortable
    * [ ] array boolean
    * [ ] list
    * [ ] step
    * [ ] tab
    * [ ] transfer
    * [ ] More Operate
      * [ ] Up
      * [ ] Down
      * [ ] Reset
      * [ ] Custom Operate
  * [ ] string, boolean
    * [ ] select-multiple
    * [ ] checkbox
    * [ ] checkbox-inline
    * [ ] tag-input
    * [ ] tree
    * [ ] cascader
      * [ ] single
      * [ ] multiple
      * [ ] panel
* object
  * [ ] base
  * [ ] dialog
  * [ ] drawer
  * [ ] dict
  * [ ] record
  * [ ] tree
    Tree = Dict<boolean | const (string | number) | Tree>
    * [ ] single
    * [ ] multiple
* Map
* Set
* Buffer
* Blob
* Regexp

### External
