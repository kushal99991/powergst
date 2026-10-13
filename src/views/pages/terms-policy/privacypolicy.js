// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Alert, Card, Button, CardHeader, CardTitle, CardBody, CardText, Table } from 'reactstrap'
import power from '@src/assets/images/logo/powerlogo.png'
import './terms.css'


const privacypolicy = () => {

    return (
        <Fragment>
      
      <Card>
            {/* <CardHeader>
              <CardTitle tag='h4'>Introduction and Terms of Use</CardTitle>
            </CardHeader> */}
             <div style={{ boxShadow: '0 4px 24px #22292f1a', padding: '10px', position: 'fixed', width: '100%', backgroundColor: '#fff' }} >
              <h1 className='text-center'><span className='float-start d-flex'><img src={power} width={100} height={30}></img></span>Privacy Policy<span className='float-end d-flex'><a href='/' className='btn btn-danger'>Login</a></span></h1>
              
              </div><br></br><br></br><br></br>
            <CardBody>
            
            
              <CardText className='mb-2 pb-1'>

              This privacy policy sets out how Generic Tech Corp uses and protects any information that you give Generic Tech Corp when you use this website. Generic Tech Corp committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.<br></br><br></br>
              Generic Tech Corp may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. <br></br><br></br>
              By signing the agreement you allow the business to send communication over any communication platforms namely SMS, Voice, RCS and it's likes
               </CardText>
             
              <h5>What We Collect</h5>
              
              <CardText className='mb-2 pb-1'>

                <ul>
                  <li>Name and job title</li>
                  <li>Contact information including email address</li>
                  <li>Demographic information such as postcode, preferences and interests</li>
                  <li>Other information relevant to customer surveys and/or offers</li>
                </ul>
          </CardText>
           
              <h5>The data which might be collected by 3rd party</h5>
             
              <CardText className='mb-2 pb-75'>
              We use third party services for providing and improving the Service. They may collect information used to identify you. Here are the links to privacy policy of these third party service:
              <br></br><ul>
              <li><a href='https://privacy.microsoft.com/en-us/privacystatement'  target="_blank">Microsoft</a></li>
                <li><a href="https://policies.google.com/privacy" target="_blank">Google</a></li>
                <li><a href="https://aws.amazon.com/privacy/" target="_blank">AWS</a></li>
                <li><a href='https://firebase.google.com/support/privacy' target="_blank">Google Firebase</a></li>
               
               

                </ul>              
              
              
              </CardText>
              <h5>What we do with the information we gather</h5>
              
              <CardText className='mb-2 pb-1'>
              <ul>
                <li>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons: Internal record keeping.</li>
                <li>We may use the information to improve our products and services.</li>
                <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
              </ul>
              
              
              
              </CardText>

              <h5>Security</h5>
              
              <CardText className='mb-2 pb-1'>
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
             </CardText>
           
              <h5>How we use cookies</h5>
              
              <CardText className='mb-2 pb-1'>
              A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences. We use traffic log cookies to identify which pages are being used. This helps us analyse data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.<br></br><br></br>
              Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.<br></br><br>
              </br>
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
           </CardText>
           <h5 className='mt-3'>Links to other websites</h5>
              {/* <ul className='ps-25 ms-1'>
                <li>You have rights to use our product for your personal or client project.</li>
                <li>You can modify our product as per your needs and use it for your personal or client project.</li>
              </ul> */}
              <CardText className='mb-2 pb-75'>
             
              Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.              
               </CardText>

      



           <h5>Controlling your personal information</h5>
              
              <CardText className='mb-2 pb-1'>
              You may choose to restrict the collection or use of your personal information in the following ways:
Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes
if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at support@example.com
We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please write to Generic Tech Corp, 403, Ashirwad Complex, Nr. Mithakhali six roads, Mithakhali, Navrangpura, Ahmedabad-380006, INDIA.
If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.              
              
              </CardText>



           <h5>Contacting Us</h5>
              
              <CardText className='mb-2 pb-1'>


              If there are any questions regarding this privacy policy you may contact us using the information below:<br></br><br></br>

              Generic Tech Corp Pvt Ltd.<br></br>
11, 4th Floor,Ashirwad Complex,<br></br>
Sardar Patel Seva Samaj,<br></br>
Nr. Mithakhali six roads, Navrangpura,<br></br>
Ahmedabad-380006, INDIA<br></br>

Tel: +91 983 983 0986<br></br>
(10 AM to 6 PM IST)<br></br>

Email Us:<br></br>
support@example.com<br></br>
                         </CardText>

                                   
           
            </CardBody>
          </Card>
        </Fragment>
      )
}

export default privacypolicy

