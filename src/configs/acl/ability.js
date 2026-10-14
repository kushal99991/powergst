import { Ability } from '@casl/ability'
import { initialAbility } from './initialAbility'
import { globleVariable } from '../globalVariable';
import  localFunction from '../getLocalFunction'
import  sessionFunction from '../getSessionFunction'

//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
const users = localFunction.getLocalValue(globleVariable.userData ,  true) 

const userData =  JSON.parse(users)
const existingAbility = userData ? userData.ability : null

export default new Ability(existingAbility || initialAbility)
