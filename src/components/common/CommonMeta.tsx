import Head from "next/head";

const CommonMeta = (props: any) => {
  return (
    <>
      {props && (
        <Head>
          <title className={"capitalize"}>{`${
            props.title || "Dami Pasal"
          }`}</title>
          <meta property="og:title" content={props?.title || "Damipasal"} />
          <meta
            property="og:description"
            content={
              props?.description ||
              "Dami Pasal is an ecommerce platform dedicated to bringing authentic Nepalese cultural products to the global market while supporting local businesses and preserving traditional craftsmanship."
            }
          />
          <meta property="og:image" content={props?.image || "/favicon.png"} />
        </Head>
      )}
    </>
  );
};

export default CommonMeta;
