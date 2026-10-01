// ** Icons Import
import { DownloadCloud,  Book} from 'react-feather'

export default [
  {
    id: 'download-gstin',
    title: 'Download all data from GSTIN',
    icon: <DownloadCloud />,
    // disable:true,
    children: [
      {
        id: 'requestotp',
        title: 'Request OTP',
        icon: <Book />,
        navLink: '/download-gstin/request-otp'
      },
      {
        id: 'panGSTR1',
        title: 'GSTR 1 Download',
        icon: <Book />,
        navLink: '/download-gstin/gstr1-filed-data?gstr1=2'
      },
      {
        id: 'panGSTR3B',
        title: 'GSTR 3B Download',
        icon: <Book />,
        navLink: '/download-gstin/gstr3b-filed-data?gstr3b=2'
      },
      {
        id: 'pangst1',
        title: 'GSTR 2B Download',
        icon: <Book />,
        navLink: '/download-gstin/panbased-gstr2b'
      },
      {
        id: 'pangst2',
        title: 'GSTR 2A Download',
        icon: <Book />,
        navLink: '/download-gstin/panbased-gstr2a'
      },


      {
        id: 'panGSTR6',
        title: 'GSTR 6 Download',
        icon: <Book />,
        navLink: '/download-gstin/gstr6-filed-data?gstr6=2'
      },
      {
        id: 'panGSTR6A',
        title: 'GSTR 6A Download',
        icon: <Book />,
        navLink: '/download-gstin/gstr6a-filed-data?gstr6a=2'
      },
      // {
      //   id: 'panITC04',
      //   title: 'ITC 04 Download',
      //   icon: <Book />,
      //   navLink: '/download-gstin/itc04-filed-data?itc04=2'
      // },
      // {
      //   id: 'panIFF',
      //   title: 'IFF Download',
      //   icon: <Book />,
      //   navLink: '/download-gstin/iff-filed-data?iff=2',
      // },
      // {
      //   id: 'pangst4',
      //   title: 'GSTR 4A Download',
      //   icon: <Book />,
      //   navLink: '/download-gstin/pan-based-gstr4a'
      // },
      // {
      //   id: 'panGSTR9',
      //   title: 'GSTR 9 Download',
      //   icon: <Book />,
      //   navLink: '/download-gstin/gstr9-filed-data?gstr9=2'
      // },
      {
        id: 'view-All',
        title: 'View All',
        navLink: '/download-gstin'
       }
    ]
  }
]
