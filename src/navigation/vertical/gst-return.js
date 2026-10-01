// ** Icons Import
import { Home, Book } from "react-feather";


export default [
  {
    id: "gst-returns",
    title: "GST Returns",
    icon: <Home />,
    children: [
      {
        id: "gstr1-sales",
        title: "GSTR 1",
        icon: <Book />,
        navLink: "/gst-returns/gstr1-sales",
      },

      {
        id: "gstr3b",
        title: "GSTR 3B",
        icon: <Book />,
        navLink: "/gst-returns/gstr3b",
      },

      {
        id: "gstr2b",
        title: "GSTR 2B",
        icon: <Book />,
        navLink: "/gst-returns/gstr2b-summary",
      },

      {
        id: "gstr2a",
        title: "GSTR 2A",
        icon: <Book />,
        navLink: "/gst-returns/gstr2a",
      },
      {
        id: "gstr6",
        title: "GSTR 6",
        icon: <Book />,
        navLink: "/gst-returns/gstr6",
      },
      {
        id: "iff",
        title: "IFF",
        icon: <Book />,
        navLink: "/gst-returns/IIF",
      },
      {
        id: "itc-returns",
        title: "ITC 04",
        icon: <Book />,
        navLink: "/gst-returns/itc-returns",
      },
      // {
      //   id: "cmp08",
      //   title: "CMP 08",
      //   icon: <Book />,
      //   navLink: "/gst-returns/cmp08",
      // },
      // {
      //   id: "gstr4a",
      //   title: "GSTR 4A",
      //   icon: <Book />,
      //   navLink: "/gst-returns/gstr4a",
      // },
      // {
      //   id: "gstr9",
      //   title: "GSTR 9",
      //   icon: <Book />,
      //   navLink: "/gst-returns/gstr9",
      // },
      {
        id: 'view-All',
        title: 'View All',
        navLink: '/gst-returns'
       }
    ],
  },
];
