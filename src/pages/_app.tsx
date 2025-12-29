import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { Provider } from "react-redux";

// Extend AppProps to support getLayout
type NextPageWithLayout = AppProps["Component"] & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();
    const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

    return (
        <main>

                <MantineProvider>
                    <Notifications />
                    <div>{getLayout(<Component {...pageProps} />)}</div>
                </MantineProvider>
        </main>
    );
}
