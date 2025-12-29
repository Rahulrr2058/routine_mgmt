import { Loader } from "@mantine/core";
import CommonLogo from "./CommonLogo";
import Image from "next/image";

function CommonLoader({ type }: { type?: string }) {
    return (
        <section className="flex items-center justify-center fixed inset-0 bg-white z-50">
            {type === "pageLoader" ? (
                <div className="h-[60vh] flex items-center justify-center w-full">
                    <Loader />
                </div>
            ) : (
                <Image
                    src="/homepage-img/glowktm-logo.svg"
                    alt="GlowKtm"
                    width={1024}
                    height={1024}
                    className="h-[16rem] w-[16rem] pl-5 object-contain"
                />
            )}
        </section>
    );
}

export default CommonLoader;