// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import { AppState } from "../../../store";
import { setMenuOpen, userLoggedIn } from "../../../actions";
import { menuGroups } from "./utils";
import { IMenuItem } from "./types";
import {
  BucketsIcon,
  DashboardIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  TraceIcon,
  UsersIcon,
  VersionIcon,
} from "../../../icons";
import { ErrorResponseHandler } from "../../../common/types";
import { clearSession } from "../../../common/utils";
import LicenseIcon from "../../../icons/LicenseIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import HealIcon from "../../../icons/HealIcon";
import WatchIcon from "../../../icons/WatchIcon";
import OperatorLogo from "../../../icons/OperatorLogo";
import ConsoleLogo from "../../../icons/ConsoleLogo";
import history from "../../../history";
import api from "../../../common/api";
import AccountIcon from "../../../icons/AccountIcon";
import DiagnosticsIcon from "../../../icons/DiagnosticsIcon";
import DocumentationIcon from "../../../icons/DocumentationIcon";
import LogsIcon from "../../../icons/LogsIcon";
import SettingsIcon from "../../../icons/SettingsIcon";
import StorageIcon from "../../../icons/StorageIcon";
import TenantsOutlinedIcon from "../../../icons/TenantsOutlineIcon";
import MenuIcon from "@material-ui/icons/Menu";

import clsx from "clsx";
import { ChevronLeft } from "@material-ui/icons";

const drawerWidth = 245;

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      paddingTop: 25,
      marginBottom: 30,
      paddingLeft: 45,
      transition: theme.transitions.create("paddingLeft", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      "& img": {
        width: 120,
      },
      "& .MuiIconButton-root": {
        color: "#ffffff",
        float: "right",
      },
    },
    logoClosed: {
      paddingTop: 25,
      marginBottom: 0,
      paddingLeft: 34,
      transition: theme.transitions.create("paddingLeft", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      "& .MuiIconButton-root": {
        color: "#ffffff",
      },
    },
    logoSvg: {
      width: 40,
    },
    logoSvgClosed: {
      width: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuList: {
      "& .active": {
        color: "#fff",
        backgroundBlendMode: "multiply",
        background:
          "transparent linear-gradient(90deg, rgba(0, 0, 0, 0.14) 0%, #00000000 100%) 0% 0% no-repeat padding-box",
        "& .MuiSvgIcon-root": {
          color: "white",
        },
        "& .MuiTypography-root": {
          color: "#fff",
          fontWeight: "bold",
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        maxWidth: 16,
      },
      "& .MuiListItemIcon-root": {
        minWidth: 36,
      },
      "& .MuiTypography-root": {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.8)",
      },
      "& .MuiListItem-gutters": {
        paddingRight: 0,
        fontWeight: 300,
      },
      "& .MuiListItem-root": {
        padding: "2px 0 2px 16px",
        marginLeft: 36,
        height: 50,
        width: "calc(100% - 30px)",
      },
    },
    menuDivider: {
      backgroundColor: "#1C3B64",
      marginRight: 36,
      marginLeft: 36,
      marginBottom: 0,
      height: 1,
    },
    extraMargin: {
      "&.MuiListItem-gutters": {
        marginLeft: 5,
      },
    },
    groupTitle: {
      color: "#fff",
      fontSize: 10,
      textTransform: "uppercase",
      fontWeight: 700,
      marginBottom: 3,
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      justifyContent: "space-between",
    },
    subTitleMenu: {
      fontWeight: 700,
      marginLeft: 10,
      "&.MuiTypography-root": {
        fontSize: 13,
        color: "#fff",
      },
    },
    selectorArrow: {
      marginRight: 20,
      marginTop: 1,
      display: "inline-block",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "4px 4px 0 4px",
      borderColor:
        "rgba(255, 255, 255, .29) transparent transparent transparent",
      transform: "rotateZ(0deg)",
      transitionDuration: "0.2s",
    },
    selectorArrowOpen: {
      transform: "rotateZ(180deg)",
    },
    //new
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      background:
        "transparent linear-gradient(90deg, #073052 0%, #081C42 100%) 0% 0% no-repeat padding-box !important",
      boxShadow: "0px 3px 7px #00000014",
      "& .MuiPaper-root": {
        backgroundColor: "inherit",
      },
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: 115,
      [theme.breakpoints.up("sm")]: {
        width: 115,
      },
      "& .logo": {
        background: "red",
      },
      "& .MuiListItem-root": {
        padding: "2px 0 2px 16px",
        marginLeft: 36,
        height: 50,
        width: "48px",
        transition: theme.transitions.create("marginLeft", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        "& .MuiListItemText-root": {
          display: "none",
        },
      },
    },
    logoIcon: {
      float: "left",
      "& svg": {
        fill: "white",
        width: 120,
      },
    },
    logoIconClosed: {
      color: "white",
      marginLeft: 11,
    },
  });

interface IMenuProps {
  classes: any;
  userLoggedIn: typeof userLoggedIn;
  pages: string[];
  operatorMode: boolean;
  distributedSetup: boolean;
  sidebarOpen: boolean;
  setMenuOpen: typeof setMenuOpen;
}

const Menu = ({
  userLoggedIn,
  classes,
  pages,
  operatorMode,
  distributedSetup,
  sidebarOpen,
  setMenuOpen,
}: IMenuProps) => {
  const logout = () => {
    const deleteSession = () => {
      clearSession();
      userLoggedIn(false);
      localStorage.setItem("userLoggedIn", "");

      history.push("/login");
    };
    api
      .invoke("POST", `/api/v1/logout`)
      .then(() => {
        deleteSession();
      })
      .catch((err: ErrorResponseHandler) => {
        console.log(err);
        deleteSession();
      });
  };

  let menuItems: IMenuItem[] = [
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/buckets",
      name: "Buckets",
      icon: <BucketsIcon />,
    },

    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/users",
      name: "Users",
      icon: <UsersIcon />,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/groups",
      name: "Groups",
      icon: <GroupsIcon />,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/account",
      name: "Service Accounts",
      icon: <AccountIcon />,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/policies",
      name: "IAM Policies",
      icon: <IAMPoliciesIcon />,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/settings",
      name: "Settings",
      icon: <SettingsIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/logs",
      name: "Logs",
      icon: <LogsIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/watch",
      name: "Watch",
      icon: <WatchIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/trace",
      name: "Trace",
      icon: <TraceIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/heal",
      name: "Heal",
      icon: <HealIcon />,
      fsHidden: distributedSetup,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/health-info",
      name: "Diagnostic",
      icon: <DiagnosticsIcon />,
    },

    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: "/tenants",
      name: "Tenants",
      icon: <TenantsOutlinedIcon />,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: "/storage",
      name: "Storage",
      icon: <StorageIcon />,
    },
  ];

  const allowedPages = pages.reduce((result: any, item: any) => {
    result[item] = true;
    return result;
  }, {});

  const documentation: IMenuItem = {
    group: "License",
    type: "item",
    component: NavLink,
    to: "/documentation",
    name: "Documentation",
    icon: <DocumentationIcon />,
    forceDisplay: true,
  };

  // Append the license page according to the allowedPages
  if (allowedPages.hasOwnProperty("/tenants")) {
    menuItems.push(
      {
        group: "Operator",
        type: "item",
        component: NavLink,
        to: "/license",
        name: "License",
        icon: <LicenseIcon />,
      },
      {
        ...documentation,
        group: "Operator",
        onClick: (
          e:
            | React.MouseEvent<HTMLLIElement>
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLDivElement>
        ) => {
          e.preventDefault();
          window.open(
            `https://docs.min.io/?ref=${operatorMode ? "op" : "con"}`,
            "_blank"
          );
        },
      }
    );
  } else {
    menuItems.push(
      {
        group: "License",
        type: "item",
        component: NavLink,
        to: "/license",
        name: "License",
        icon: <LicenseIcon />,
      },
      {
        ...documentation,
        group: "License",
        onClick: (
          e:
            | React.MouseEvent<HTMLLIElement>
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLDivElement>
        ) => {
          e.preventDefault();
          window.open(
            `https://docs.min.io/?ref=${operatorMode ? "op" : "con"}`,
            "_blank"
          );
        },
      }
    );
  }

  const allowedItems = menuItems.filter(
    (item: any) =>
      (allowedPages[item.to] || item.forceDisplay || item.type !== "item") &&
      item.fsHidden !== false
  );

  return (
    <React.Fragment>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: sidebarOpen,
            [classes.drawerClose]: !sidebarOpen,
          }),
        }}
      >
        <div
          className={clsx({
            [classes.logo]: sidebarOpen,
            [classes.logoClosed]: !sidebarOpen,
          })}
        >
          {sidebarOpen && (
            <span className={classes.logoIcon}>
              {operatorMode ? <OperatorLogo /> : <ConsoleLogo />}
            </span>
          )}
          {!sidebarOpen && (
            <div className={classes.logoIconClosed}>
              <VersionIcon />
            </div>
          )}
          <IconButton
            onClick={() => {
              if (sidebarOpen) {
                setMenuOpen(false);
              } else {
                setMenuOpen(true);
              }
            }}
          >
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </div>
        <List className={classes.menuList}>
          {menuGroups.map((groupMember, index) => {
            const filterByGroup = (allowedItems || []).filter(
              (item: any) => item.group === groupMember.group
            );

            const countableElements = filterByGroup.filter(
              (menuItem: any) => menuItem.type !== "title"
            );

            if (countableElements.length === 0) {
              return null;
            }

            return (
              <React.Fragment key={`menuElem-${index.toString()}`}>
                <Divider className={classes.menuDivider} />
                {filterByGroup.map((page: IMenuItem) => {
                  switch (page.type) {
                    case "item": {
                      return (
                        <ListItem
                          key={page.to}
                          button
                          onClick={page.onClick}
                          component={page.component}
                          to={page.to}
                          className={
                            page.extraMargin ? classes.extraMargin : null
                          }
                        >
                          {page.icon && (
                            <Tooltip title={page.name}>
                              <ListItemIcon>{page.icon}</ListItemIcon>
                            </Tooltip>
                          )}
                          {page.name && <ListItemText primary={page.name} />}
                        </ListItem>
                      );
                    }
                    case "title": {
                      return (
                        <ListItem
                          key={page.name}
                          component={page.component}
                          className={classes.subTitleMenu}
                        >
                          {page.name}
                        </ListItem>
                      );
                    }
                    default:
                      return null;
                  }
                })}
              </React.Fragment>
            );
          })}
          <Divider className={classes.menuDivider} />
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  sidebarOpen: state.system.sidebarOpen,
  operatorMode: state.system.operatorMode,
  distributedSetup: state.system.distributedSetup,
});

const connector = connect(mapState, { userLoggedIn, setMenuOpen });

export default connector(withStyles(styles)(Menu));
