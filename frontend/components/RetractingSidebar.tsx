"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Home,
  LogOut,
  Monitor,
  ShoppingCart,
  Tag,
  UsersRound,
  Menu,
  X,
  ContactRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";

export const RetractingSidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [role, setRole] = useState<string | undefined>();
  
  useEffect(() => {
    // Ensure role is set on the client side
    if (reduxUser) {
      setRole(reduxUser.roles[0]?.name);
    }
  }, [reduxUser]);// Extract the role name from the roles array

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {   
    dispatch(logoutUser());
    router.push("/authentication/sign-in");
  };

  const handleTabClick = (title: string) => {
    if (title === "Logout") {
      handleLogout();
    } else {
      setSelected(title);
      if (role === "ADMIN" && title === "Analytics") {
        setSelected("Analytics");
        router.push(`/dashboard/admin/activity-logs/${reduxUser?.id}`);
      } else if (title === "Dashboard") {
        setSelected("Dashboard");
        router.push(`/dashboard/user/${reduxUser?.id}`);
      } else if (title === "Home") {
        setSelected("Home");
        router.push("/");
      } else if (title === "Users") {
        setSelected("Users");
        router.push("/dashboard/admin/users");
      }
      else {
        console.log("Title:" +title) // Default case
      }
    }
    setIsOpen(false);
  };

  const menuItems = getMenuItems(role);

  return (
    <>
      <motion.nav
        layout
        className="hidden lg:block fixed top-0 h-screen shrink-0 border-r border-zinc-300 bg-zinc-200 dark:bg-zinc-950 p-2 md:w-64 transition-all duration-300 z-10"
        style={{ width: open ? "225px" : "60px" }}
      >
        <TitleSection open={open} />
        <div className="space-y-1">
          {menuItems.map(({ Icon, title, notifs }) => (
            <Option
              key={title}
              Icon={Icon}
              title={title}
              selected={selected}
              setSelected={() => handleTabClick(title)}
              open={open}
              notifs={notifs}
            />
          ))}
        </div>
        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="p-2 text-white">
          <Menu />
        </button>
        {isOpen && (
          <div className={`fixed top-0 right-0 w-full h-full bg-zinc-100 dark:bg-zinc-950 bg-opacity-90 z-50 flex flex-col p-4 transition-opacity duration-300 opacity-100 pointer-events-auto`}>
            <div className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 opacity-100`}></div>
            <button onClick={toggleMenu} className="text-zinc-700 dark:text-zinc-400 text-2xl self-start mb-4 z-10">
              <X /><span className="sr-only">Close Menu</span>
            </button>
            <div className="flex flex-col space-y-4 text-zinc-800 dark:text-zinc-300 z-10">
              {menuItems.map(({ Icon, title, notifs }) => (
                <Option
                  key={title}
                  Icon={Icon}
                  title={title}
                  selected={selected}
                  setSelected={() => handleTabClick(title)}
                  open={true}
                  notifs={notifs}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const getMenuItems = (role: string | undefined) => {
  if (role === "ADMIN") {
    return [
      { Icon: Home, title: "Home" },
      { Icon: ContactRound, title: "Dashboard" },
      { Icon: DollarSign, title: "Sales", notifs: 3 },
      { Icon: Monitor, title: "View Site" },
      { Icon: ShoppingCart, title: "Products" },
      { Icon: Tag, title: "Tags" },
      { Icon: BarChart, title: "Analytics" },
      { Icon: UsersRound, title: "Users" },
      { Icon: LogOut, title: "Logout" },
    ];
  } else if (role === "USER") {
    return [
      { Icon: Home, title: "Home" },
      { Icon: ContactRound, title: "Dashboard" },
      { Icon: ShoppingCart, title: "My Products" },
      { Icon: Tag, title: "My Tags" },
      { Icon: Monitor, title: "View Site" },
      { Icon: LogOut, title: "Logout" },
    ];
  } else {
    return []; // Default case, no items
  }
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
}: {
  Icon: React.FC;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  notifs?: number;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title ? "bg-indigo-300 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-200" : "text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      }`}
    >
      <motion.span layout className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.span>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded bg-indigo-500 text-xs text-white px-1"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-3 border-b border-zinc-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-zinc-400 dark:hover:bg-zinc-700">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-500">TomIsLoading</span>
              <span className="block text-xs text-zinc-700 dark:text-zinc-400">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <ChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => (
  <motion.div
    layout
    className="grid h-10 w-10 shrink-0 place-content-center rounded-md bg-indigo-600 text-white"
  >
    Logo
  </motion.div>
);

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((prev) => !prev)}
      className="absolute bottom-0 left-0 right-0 border-t border-zinc-300 transition-colors hover:bg-zinc-400 dark:hover:bg-zinc-100"
    >
      <div className="flex items-center p-2">
        <motion.span layout className="grid h-10 w-10 place-content-center text-lg text-zinc-700">
          <ChevronRight className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </motion.span>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default RetractingSidebar;
