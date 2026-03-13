import React from 'react'
import { useLocation } from 'react-router'


function useBreadCrumbs() {
  let location = useLocation()
  let crumbs = location.pathname.split("/").filter(x => x != "");
  return crumbs;
}

export default useBreadCrumbs