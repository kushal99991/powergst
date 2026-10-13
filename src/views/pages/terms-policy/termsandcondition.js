// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Alert, Card, Button, CardHeader, CardTitle, CardBody, CardText, Table } from 'reactstrap'
import power from '@src/assets/images/logo/powerlogo.png'
import './terms.css'


const termsandcondition = () => {

  return (
    <Fragment>

      <Card> <div style={{ boxShadow: '0 4px 24px #22292f1a', padding: '10px', position: 'fixed', width: '100%', backgroundColor: '#fff' }} >
        <h1 className='text-center'><span className='float-start d-flex'><img src={power} width={100} height={30}></img></span>Terms of use<span className='float-end d-flex'><a href='/' className='btn btn-danger'>Login</a></span></h1>

      </div><br></br><br></br><br></br>
        {/* <h1 className='text-center'>Terms of Use</h1><br></br> */}
        <CardHeader>

          <CardTitle tag='h4'><b>END USER SOFTWARE LICENSE AGREEMENT
            Welcome to Power GST – powered by Generic Tech Corp</b></CardTitle>
        </CardHeader>
        <CardBody>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>Thanks for using our products and services (“Services”). The Services are provided by Generic Tech Corp located at 101, Tech Park, Sector 5, Demo Business Center, Demo City -400 001, India</li>
              <li>IMPORTANT: READ THIS AGREEMENT (“AGREEMENT”) CAREFULLY. IT IS A LEGAL CONTRACT GOVERNING YOUR USE OF SOFTWARE, CERTAIN SERVICES PROVIDED BY Generic Tech Corp AND USE OF CERTAIN PERSONALLY IDENTIFIABLE INFORMATION. BY CLICKING THE “ACCEPT”, “ACTIVATE” OR SIMILAR OPTION OR INSTALLING OR USING THE ACCOMPANYING SOFTWARE PRODUCT, YOU (ON BEHALF OF YOURSELF AND/OR THE COMPANY OR LEGAL ENTITY ON WHOSE DEVICE THE SOFTWARE IS INSTALLED):</li>
              <li>AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS, INCLUDING THE TERMS AND CONDITIONS REFERENCED IN SECTION 4.</li>
              <li>AGREE THAT Generic Tech Corp MAY COLLECT AND USE CERTAIN INFORMATION RELATED TO YOUR USE OF THE SOFTWARE OR THE SERVICES, AS EXPLAINED IN DETAIL IN SECTION 8 BELOW, AND IN OUR PRIVACY POLICY AND OUR FAIR PROCESSING NOTICE.</li>
              <li>YOU MAY NOT ACCEPT THIS AGREEMENT IF YOU ARE NOT AT LEAST 18 YEARS OF AGE AND, IN ANY EVENT, OF A LEGAL AGE TO FORM A BINDING CONTRACT. FOR INDIVIDUALS WHO ARE UNDER AGE 18, A PARENT OR LEGAL GUARDIAN MUST ACCEPT THIS AGREEMENT ON YOUR BEHALF AND MUST PROVIDE PERMISSION TO YOU TO USE THE SOFTWARE OR THE SERVICES. IF YOU ARE UNDER 18 YEARS OF AGE, YOU ARE NOT AUTHORIZED TO USE THE SOFTWARE OR SERVICES. IF YOU ACCEPT THIS AGREEMENT, YOU REPRESENT THAT YOU HAVE THE CAPACITY TO BE BOUND BY IT.</li>
              <li>If you do not wish to agree to these terms or use the Software, please click “DECLINE” or “CANCEL” or “BACK” or any similar option. If applicable, you may obtain a refund of the purchase price as follows:</li>
              <li>If you purchased a Subscription, follow the instructions at <span style={{ color: 'blue' }}>gst.example.com</span> and contact us with your refund request within Three (3) days from Subscription date. The credit will be refunded into your bank account within forty five (45) days following your refund request.</li>
              <li>If you purchased the Software from a third party vendor, please contact your vendor with a refund request;</li>
              <li>Generic Tech Corp may change this Agreement at any time and may notify you about such change. You may be required to read and accept such changes of this Agreement to continue to use the Software. You are not required to accept these terms or any change or update of these terms but, unless and until you do, you will not be authorized to use the Software or the Services and the Software may not install or activate. Your continuing use of the Software constitutes your acceptance of any such change to this Agreement.</li>
              <li>NOTICE: THE SOFTWARE MAY CONTAIN A “TIME OUT” FEATURE THAT WILL RENDER THE SOFTWARE INOPERATIVE AT THE END OF THE TERM (AS DEFINED BELOW).</li>
            </ul>


          </CardText>

          <h5>1. Definitions.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>“Validity of Term” means 365 days from the date of the Subscription and/or as may be specified at the time of renewal, if any.</li>
              <li>“Privacy Policy” means the Generic Tech Corp privacy policy available at https://gst.example.com/login as updated from time to time.</li>
              <li>“Renewal Term” has the meaning ascribed to it by Section 3.1 of this Agreement.</li>
              <li>“Third Party Terms and Conditions” means any third party terms and conditions governing the use of Third Party Materials.</li>
            </ul>
          </CardText>
          <h5>2. License Grant; Related Provisions.</h5>

          <CardText className='mb-2 pb-75'>
            <ul>
              <li>Grant of License. Generic Tech Corp, subject to the terms and conditions of this Agreement, hereby grants you a non-exclusive and non-transferable license during the applicable Term to use the Software only in executable or object code form and to receive and to use the Services, as applicable, solely for Authorized Purposes and in accordance with the Applicable Conditions and Technical Specifications. Without limiting the foregoing, (i) if you received the Software in combination with a Device, this license grants you to right to use the Software solely in conjunction with the applicable Device in accordance with the Applicable Conditions and Technical Specifications; and (ii) if you received the Software in combination with any other software or services, this license grants you the right to use the Software solely in conjunction with the applicable unit of software or the applicable services in accordance with the Applicable Conditions and Technical Specifications.</li>
              <li>Support Services: Generic Tech Corp supports to its registered licenses through email- support@example.com and
                +91 00000 00000 shall be available during 11:00 A.M. to 6:00 PM (Monday to Friday excluding National Holidays). Services are at its discretion of Generic Tech Corp</li>
              <li>Limitations. You shall not, and shall not permit any third party to, (i) copy the Software for any purpose other than as reasonably necessary to use the same as contemplated by this Agreement and for un-installed/off-line copies, (ii) install the Software on more Devices than the specified quantity authorized by the Applicable Conditions and the Technical Specifications, (iii) use any license number supplied by Generic Tech Corp in connection with Software on more than one (1) Device at any time unless expressly authorized by Generic Tech Corp, (iv) disclose any license number to any party other than Generic Tech Corp or Generic Tech Corp designated representatives in order to obtain support services in respect of the Software, (v) publish or otherwise make available to third parties the Software or any license number or use the same other than for Authorized Purposes, (vi) except as expressly authorized by law, reverse engineer, disassemble, decompile, translate, reconstruct, transform or extract the Software or any portion of the Software, (vii) except as expressly authorized by law, change, modify or otherwise alter the Software, (viii) resell, distribute, broadcast, transmit, communicate, transfer, pledge, rent, share or sublicense the Software and the Services (ix) grant any third party access to or use of the Software on a service bureau, timesharing, subscription service or application service provider or other similar basis, or (x) defeat or circumvent, attempt to defeat or circumvent, or authorize or assist any third party in defeating or circumventing controls on the installation or use of copies of the Software, (xi) install the Software on any operating system not supported by Generic Tech Corp, or (xii) remove any copyright, trademark or other proprietary notices from the Software. ANY USE OF THE SOFTWARE OR THE SERVICES OTHER THAN AS EXPRESSLY AUTHORIZED OR EXPRESSLY PROHIBITED BY THIS SECTION 2, CONSTITUTES A MATERIAL BREACH OF THIS AGREEMENT AND MAY VIOLATE APPLICABLE COPYRIGHT LAWS.</li>
              <li>Generic Tech Corp Installer. Generic Tech Corp, in connection with your installation of the Software, may offer you the option to employ the Generic Tech Corp Installer which may contain certain Third Party Materials. Such Third Party Materials are supplied by third parties and are subject to the Third Party Terms and Conditions and any relevant license agreements, terms of use, terms of service, privacy policies and other conditions established by those third parties. Please read those conditions carefully before accepting them. You agree that Generic Tech Corp is not responsible for the content or performance of any such Third Party Materials, does not warrant or endorse any such Third Party Materials or assume or have any liability whatsoever to you or any third party with respect to such Third Party Materials. If you access, download or use such Third Party Materials, you do so entirely at your own risk.</li>
              <li>Updates. Generic Tech Corp, from time to time during the Term, may provide Updates to the Software. Updates will be deemed Software for all purposes under this Agreement. You agree that you must download and permit installation of Updates when available in order to obtain maximum benefit from the Software. In no event shall Generic Tech Corp have any obligation to provide you with Updates during the Term or following expiration or termination of the Term, and Generic Tech Corp in its sole discretion may terminate Updates for any version of the Software other than the most current version, or Updates supporting use of Software in connection with any versions of operating systems, email programs, browser programs and other software other than the most current version.</li>
              <li>Customer Comments. Generic Tech Corp welcomes your comments concerning the Services and/or the Software, including notice that you have experienced a Software failure, error or other malfunction and suggestions for additional or different features and functions. Please send us your comments and suggestions using the web form located at www.example.com. Generic Tech Corp shall have no obligation to respond or act on any such comments or suggestions, but you grant Generic Tech Corp a perpetual, transferrable, sub licensable, irrevocable, fully paid-up, royalty-free, worldwide right and license under your intellectual property rights (if any) to copy, modify, display, perform, retain, distribute and implement your comments and suggestions in the Software, the Services and other products and services offered by Generic Tech Corp, its Affiliates, and their respective licensors, licensees, successors and assigns</li>

            </ul>



          </CardText>
          <h5>Renewals, Termination.</h5>

          <ul>
            <li>Renewals. Generic Tech Corp, prior to the conclusion of the applicable Term, may offer you the opportunity to extend the licenses granted by this Agreement at Generic Tech Corp then-current renewal price. You may accept any such offer by following the directions set forth in the offer, at which time the term of the Agreement will be extended for the applicable period.</li>
            <li>Termination. Generic Tech Corp, in addition to such other rights as may be available at law in equity or otherwise, shall be entitled to terminate the license granted by this Agreement without liability for convenience on five (5) days’ prior notice.</li>
            <li>Effect of Termination. On the expiration or termination of this Agreement, you shall cease using the Software or the Services, Generic Tech Corp may cease making Updates available to you, and the Software may cease functioning. Sections 1, 2, 3, 4, 5, 6, 7, 8, 9 will survive the expiration or termination of this Agreement.</li>



          </ul>

          <h5>4. Additional Terms.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>You hereby agree that Software and the Services may contain links to certain Third Party Materials for which Generic Tech Corp is not responsible. You further agree and confirm that you have reviewed and accepted the Third Party Terms and Conditions, specific to the applicable Third Party Materials. Generic Tech Corp disclaims any liability or warranty in relation to any Third Party Materials and Third Party Terms and Conditions.</li>
            </ul>

          </CardText>

          <h5>5. Ownership.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>Generic Tech Corp reserves all rights in the Software and Services not expressly granted by this Agreement. All copyrights, trademarks and other conceivable intellectual property rights in and to the Software and Services (including, but not limited to, other data files, images appearing in the Software and screen displays as well as any and all documentation relating to the Software) are owned by Generic Tech Corp or its licensors, and are protected by INDIAN and foreign copyright laws, international treaties and other applicable laws. Any copy of the Software you are permitted to create pursuant to this Agreement must contain the entire copyright notice and other notices included with the original copy of the Software.</li>
              <li>Any trade names, trademarks, service marks, logos, domain names or other distinctive brand features used with, on or relating to any third party products or services including Third Party Materials ("Third Party Marks") available on or through the Software, or Services are the property of the third party providers or their respective licensors. Unless you have been expressly authorized in writing by such third party providers or their respective licensors, you will not use, and have no rights in, any Third Party Marks. You agree that you will not use any trade name, trade mark, service mark, logo, domain name, or other distinctive brand feature of any company, entity or organization in any manner that is likely or intended to cause confusion as to the owner or authorized user of such names, marks, logos or features. Generic Tech Corp disclaims any liability or warranty in relation to any Third Party Marks.</li>

            </ul>
          </CardText>
          <h5 className='mt-3'>Limitation of Liability.</h5>
          {/* <ul className='ps-25 ms-1'>
                <li>You have rights to use our product for your personal or client project.</li>
                <li>You can modify our product as per your needs and use it for your personal or client project.</li>
              </ul> */}
          <CardText className='mb-2 pb-75'>
            <ul>
              <li>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL Generic Tech Corp OR ITS SUPPLIERS OR RESELLERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, PUNITIVE OR SPECIAL DAMAGES WHATSOEVER, WITHOUT REGARD TO CAUSE OR THEORY OF LIABILITY, OR ANY DAMAGES (WHETHER DIRECT OR INDIRECT) INCURRED FOR LOSS OF BUSINESS, PROFITS OR REVENUE, LOSS OF PRIVACY, LOSS OF USE OF ANY DEVICE OR SOFTWARE INCLUDING THE SOFTWARE, COSTS OF PROCURING SUBTITUTE OR REPLACEMENT GOODS AND SERVICES, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION OR OTHER PECUNIARY LOSS ARISING OUT OF THIS AGREEMENT OR THE SOFTWARE AND/OR SERVICES PROVIDED HEREUNDER, EVEN IF Generic Tech Corp HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. Generic Tech Corp WILL NOT BE LIABLE FOR ANY UNAUTHORIZED ACCESS TO, OR ANY CORRUPTION, ERASURE, THEFT, DESTRUCTION, ALTERATION, INADVERTENT DISCLOSURE OR LOSS OF DATA, INFORMATION OR CONTENT TRANSMITTED, RECEIVED OR STORED ON ITS SYSTEMS REGARDLESS OF THE CAUSE. IN NO EVENT SHALL Generic Tech Corp LIABILITY RELATED TO THE SOFTWARE AND/OR SERVICES EXCEED THE LESSER OF (I) THE FEES YOU ACTUALLY PAID FOR THE SOFTWARE AND/OR SERVICES, AND (II) THE Generic Tech Corp SUGGESTED RETAIL PRICE FOR THE SOFTWARE AND/OR SERVICES AS OF THE DATE YOU RECEIVED IT.</li>

            </ul>
          </CardText>





          <h5>Indemnification.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>You agree to indemnify, defend and hold harmless Generic Tech Corp, its Affiliates and their respective partners, directors, officers, employees and agents, licensors, representatives from and against all losses, expenses, damages and costs, including reasonable attorneys' fees, resulting from your use of the Software or Services or any violation of this Agreement by you, including but not limited to any breach or alleged breach of any of your representations, warranties, obligations or undertakings hereunder. Generic Tech Corp reserves the right to assume, at its sole expense, the exclusive defense and control of any matter subject to indemnification by you, in which event you will fully cooperate with Generic Tech Corp in asserting any available defenses.</li>
            </ul>

          </CardText>



          <h5>8. Privacy and Security.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>General. You agree that Generic Tech Corp may collect and share with its Affiliates and certain third parties certain information regarding the users of the Software and/or the Services, including certain personally identifiable information as well as certain information from the user’s Device, including certain information about your Device software and hardware such as your IP address, MAC address, operating system, information about the Software and its installed features. The Software and/or the Services may utilize such aforementioned information in order that product recommendations and important service messages may be communicated directly to your Device. Generic Tech Corp may also share your email address and personal information with selected Generic Tech Corp partners, distributors or resellers so they can contact you to provide you with local technical, licensing and customer support. Generic Tech Corp reserves the right to monitor your usage of the Software and location to ensure compliance with the terms of this Agreement. You hereby consent to Generic Tech Corp collection and use of such information, as well as direct communication of product and service messages to your Device and agree that Generic Tech Corp collection and use of such information will be further governed by the Generic Tech Corp Privacy Policy.</li>
              <li>Registration Information. In order to activate the Software and/or the Services, you, or a third party you have authorized to do so on your behalf, may be required to register with Generic Tech Corp over the Internet or by telephone. As a material condition for Generic Tech Corp to grant the licenses contemplated by this Agreement, you represent that the registration information you or the authorized third party provide to Generic Tech Corp is accurate and complete as of the date you register and, NOTWITHSTANDING ANY PROVISION OF THE Generic Tech Corp PRIVACY POLICY, YOU CONSENT DURING THE TERM OF THIS AGREEMENT AND FOR 1 YEAR THEREAFTER (OR FOR AS LONG AS PERMITTED BY APPLICABLE LAW) TO (i) Generic Tech Corp SHARING YOUR CONTACT INFORMATION WITH ITS AFFILIATES, DISTRIBUTORS, RESELLERS AND OTHER BUSINESS PARTNERS, AND (ii) USE OF THAT CONTACT INFORMATION BY Generic Tech Corp, ITS AFFILIATES, DISTRIBUTORS, RESELLERS AND OTHER BUSINESS PARTNERS TO PRESENT YOU WITH INFORMATION THAT MIGHT BE RELEVANT TO YOU, INCLUDING OFFERS OF SOFTWARE, SERVICES AND OTHER PRODUCTS.</li>

            </ul>


          </CardText>

          <h5>8.3 Fair Processing Notice.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>This Fair Processing Notice and our Privacy Policy is Generic Tech Corp is a commitment to protecting your privacy. Generic Tech Corp protects your information from unauthorized use or loss and will only pass certain of your personally identifiable information to our business partners, to fulfill your requirements or where we are required to do so by law. The information we collect from you may be used by Generic Tech Corp Affiliates worldwide, including countries that may have less stringent data privacy laws than your country.</li>
              <li>The information Generic Tech Corp and the Software and/or Services collect from your Device is utilized in product and to transmit messages to your Device or to generate e-mail marketing. You may opt-out of e-mail marketing at any time by clicking the relevant link in the e-mail message or contact customer support at www.example.com.</li>

            </ul>
          </CardText>

          <h5>9. Miscellaneous.</h5>

          <CardText className='mb-2 pb-1'>
            <ul>
              <li>Complete Agreement. This Agreement, including its Applicable Conditions, Technical Specifications, Privacy Policy, Fair Processing Notice, Service Terms and other documents referred to in this Agreement, constitutes the complete Agreement between the parties and supersedes all previous communications and representations or agreements, either oral or written, with respect to the subject matter hereof.</li>
              <li>Amendments, Waiver. Unless specified otherwise in this Agreement, this Agreement may not be modified or changed in whole or in part, in any manner. Generic Tech Corp failure to insist upon or enforce strict performance of any provision of this Agreement shall not be construed as a waiver of any provision or right.</li>
              <li>Severability. The parties desire and intend that all of the provisions of this Agreement be enforceable to the fullest extent permitted by law. If any provision of this Agreement or the application thereof to any person or circumstances is, to any extent, construed to be illegal, invalid or unenforceable, in whole or in part, then such provision will be construed in a manner to permit its enforceability under applicable law to the fullest extent permitted by law. In any such case, the remaining terms of this Agreement or the application thereof to any person or circumstance, other than those that have been held illegal, invalid or unenforceable, will remain in full force and effect.</li>
              <li>Governing Law. This Agreement will be governed by the Indian laws .</li>
              <li>No Third Party Beneficiaries. This Agreement is intended solely for the benefit of you and Generic Tech Corp and/or its Affiliates. No person not a party to this Agreement may bring a cause of action pursuant to this Agreement as a third party beneficiary hereof.</li>
              <li>Language. This Agreement was originally prepared in the English language. Although Generic Tech Corp may provide one or more translations for your convenience, the English version will control in the case of any conflict or discrepancy. Customer support is available in the English language and Generic Tech Corp may possibly offer you Customer support in certain local languages.</li>
              <li>Internet connection. You agree that certain Software may require an active and stable connection to the Internet in order to function. It is therefore your responsibility to ensure that you have at all times an active and stable Internet connection.</li>
              <li>Product names. Generic Tech Corp reserves the right to change the name of its Software products in its sole discretion from time to time.</li>
              <li>Assignment. You may not assign your rights or obligations under this Agreement without the prior written consent of Generic Tech Corp. Generic Tech Corp may assign this Agreement at any time in its sole discretion without any prior written consent from you.</li>
            </ul>

          </CardText>


        </CardBody>
      </Card>
    </Fragment>
  )
}

export default termsandcondition

termsandcondition