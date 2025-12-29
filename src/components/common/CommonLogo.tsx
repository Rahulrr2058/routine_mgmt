import Image from "next/image";
import { useRouter } from "next/navigation";

const CommonLogo = (onclick: any) => {
    const router = useRouter();
    return (
        <Image
            src="/damipasal.png"
            alt="Dami Pasal"

            width={1024}
            height={1024}
            onClick={() => {router.push("/") }}
            className=" w-36 sm:w-40 lg:w-72  object-contain cursor-pointer"
        />
    );
};

export default CommonLogo;
