import Head from "next/head";
import Logo from "@/assets/images/logo.png";
const CommonHead = (props: any) => {
  return (
    <Head>
      <title className={"capitalize"}>{`${
        props.title || "Dami Pasal | Homepage"
      }`}</title>
    </Head>
  );
};

export default CommonHead;
