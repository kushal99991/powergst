// ** Router imports
import { lazy, useState, useEffect } from "react";
// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";
// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "../utility/Utils";
// ** GetRoutes
import { getRoutes } from "./routes";
import { globleVariable } from "../configs/globalVariable";

// ** Components
const Error = lazy(() => import("../views/pages/misc/Error"));
const Login = lazy(() => import("../views/pages/authentication/Login"));
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));

// ** Default Route
const DefaultRoute = "/dashboard/company";

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);

  const getHomeRoute = () => {
    const user = localStorage.getItem(globleVariable.userId);
    if (user) {
      return getHomeRouteForLoggedInUser();
    } else {
      return "/login";
    }
  };

  //   const flag = sessionStorage.getItem(globleVariable.isCompany)=="false";
  // if(flag){
  //   const container = document.getElementById('gst-returnsabcd');
  //   if(container){
  //     container.style.display="none"
  //   }

  //   const container1 = document.getElementById('download-gstinabcd');
  //   if(container1){
  //     container1.style.display="none"
  //   }
  //   const container2 = document.getElementById('recoabcd');
  //   if(container2){
  //     container2.style.display="none"
  //   }
  // }else{
  //   const container = document.getElementById('gst-returnsabcd');
  //   if(container){
  //     container.style.display="block"
  //   }

  //   const container1 = document.getElementById('download-gstinabcd');
  //   if(container1){
  //     container1.style.display="block"
  //   }
  //   const container2 = document.getElementById('recoabcd');
  //   if(container2){
  //     container2.style.display="block"
  //   }
  // }

  const routes = localStorage.getItem(globleVariable.userId)
    ? useRoutes([
        {
          path: "/",
          index: true,
          element: <Navigate replace to={getHomeRoute()} />,
        },
        {
          path: "/login",
          // element: <BlankLayout />,
          element: <Navigate replace to={getHomeRoute()} />,
          // children: [{ path: '/login', element: <Login /> }]
        },
        {
          path: "/auth/not-auth",
          element: <BlankLayout />,
          children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
        },
        {
          path: "*",
          element: <BlankLayout />,
          children: [{ path: "*", element: <Error /> }],
        },
        ...allRoutes,
      ])
    : useRoutes([
        {
          path: "/",
          index: true,
          element: <Navigate replace to={getHomeRoute()} />,
        },
        {
          path: "/login",
          element: <BlankLayout />,
          // element: <Navigate replace to={getHomeRoute()} />
          children: [{ path: "/login", element: <Login /> }],
        },
        {
          path: "/auth/not-auth",
          element: <BlankLayout />,
          children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
        },
        {
          path: "*",
          element: <BlankLayout />,
          children: [{ path: "*", element: <Error /> }],
        },
        ...allRoutes,
      ]);

  return routes;
};

export default Router;
