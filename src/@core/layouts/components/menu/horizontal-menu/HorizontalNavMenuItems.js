// ** Menu Components Imports
import HorizontalNavMenuLink from './HorizontalNavMenuLink'
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup'
import {
  resolveHorizontalNavMenuItemComponent as resolveNavItemComponent,
} from '@layouts/utils'

const HorizontalNavMenuItems = props => {

  // const menus = sessionStorage.getItem('c')
  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink
  }

  // ** Render Nav Items
  const RenderNavItems = props?.items?.map((item, index) => {
 
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return  <TagName item={item} index={index} key={item.id} {...props} /> // canViewMenuGroup(item) &&
    }
    return  <TagName item={item} index={index} key={item.id} {...props} /> // canViewMenuItem(item) &&
  })

  return RenderNavItems
}

export default HorizontalNavMenuItems
