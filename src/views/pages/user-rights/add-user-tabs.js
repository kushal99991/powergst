// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'
import AddUserAccountDetails from './add-user-account-detail'
import UserAccountVerificationDetails from './add-user-account-verification'

// ** Steps


const AddUserTabs = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'account-details',
      title: 'Account Details',
      subtitle: 'Enter Your Account Details.',
      content: <AddUserAccountDetails stepper={stepper}/>
    },
    {
      id: 'account-verification',
      title: 'Account Verification',
      subtitle: 'Verify Your Account',
      content: <UserAccountVerificationDetails stepper={stepper} />
    },
    {
      id: 'client-selection',
      title: 'Client Selection',
      subtitle: 'Assign Client',
      content: <UserAccountVerificationDetails stepper={stepper} />
    },
    {
      id: 'assign-rights',
      title: 'Assign Rights',
      subtitle: 'Assign Rights To User',
      content: <UserAccountVerificationDetails stepper={stepper} />
    },
    // {
    //   id: 'step-address',
    //   title: 'Address',
    //   subtitle: 'Add Address',
    //   content: <Address stepper={stepper} />
    // },
    // {
    //   id: 'social-links',
    //   title: 'Social Links',
    //   subtitle: 'Add Social Links',
    //   content: <SocialLinks stepper={stepper} />
    // }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)}  ref={ref} steps={steps} />
    </div>
  )
}

export default AddUserTabs
