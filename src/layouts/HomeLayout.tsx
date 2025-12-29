import React, { useState } from "react";

import {
  Burger,
  Button,
  Combobox,
  Modal,
  TextInput,
  Image,
  Drawer,
} from "@mantine/core";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Star,
  Trash,
} from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import CommonFooter from "@/components/partials/Footer";
import { useRouter } from "next/router";
import CommonButton from "@/components/common/CommonButton";
import CommonLogo from "@/components/common/CommonLogo";
import Navbar from "@/components/partials/Navbar";
import CommonMeta from "@/components/common/CommonMeta";
import CommonHead from "@/components/common/CommonHead";
import CommingSoon from "@/components/modules/CommingSoon/ComminSoon";

const Layout: React.FC<any> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpen, { open, close }] = useDisclosure(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  return (
    <>
      <CommonMeta />
      <main className={"flex flex-col min-h-screen"}>
         <Navbar />
         <section className={"flex-1"}>{children}</section>

        {/*<CommingSoon />*/}
        <CommonFooter />
      </main>
    </>
  );
};

export default Layout;
