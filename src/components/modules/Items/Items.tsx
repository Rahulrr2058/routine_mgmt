    "use client";

    import { useEffect, useState } from "react";
    import { useRouter } from "next/router";
    import {
        Title,
        Text,
        Image,
        Button,
        Tabs,
        Select,
        NumberInput,
        Modal,
    } from "@mantine/core";
    import { useDisclosure } from "@mantine/hooks";
    import { HandHeart, Shield, SunIcon, Truck } from "lucide-react";
    import { getCookie } from "cookies-next";
    import { showNotification } from "@mantine/notifications";
    import { APIGetProductDetailsBySlug } from "@/apis/getDetails";
    import WhyChooseUS from "@/components/common/WhyChooseUS";
    import GoogleLoginButton from "@/components/common/GoogleLoginButton";
    import "@mantine/core/styles.css";
    import { createCartAPI } from "@/apis/product";
    import KurtiSizeChart from "@/components/common/KurtiSizeChart";
    import HowToMeasure from "@/components/common/HowToMeasure";
    import { APIGetSecondaryImage } from "@/apis/SecondaryImage";
    import showNotify from "@/utils/notify";
    import { GetRequest } from "@/plugins/https";
    import FeaturedProducts from "@/components/common/featuredProducts";
import {useAppDispatch,useAppSelector} from "@/redux/hook";
    import {addToCart} from "@/redux/slice/cartSlice";


    const whyChooseUsData = {
        title: "Why Choose Us",
        subtitle:
            "We pride ourselves on bringing you the finest Nepalese cultural products",
        data: [
            {
                icon: <SunIcon size={40} fill="black" />,
                title: "Authentic Products",
                description:
                    "All our products are 100% authentic, sourced directly from skilled Nepalese artisans.",
            },
            {
                icon: <Truck size={40} fill="black" />,
                title: "Cultural Heritage",
                description:
                    "We preserve Nepal’s rich traditions by showcasing handcrafted cultural treasures.",
            },
            {
                icon: <HandHeart size={40} />,
                title: "Sustainable Practices",
                description:
                    "Our products are made with eco-friendly materials and ethical craftsmanship.",
            },
            {
                icon: <Shield size={40} fill="black" />,
                title: "Fast Delivery",
                description:
                    "Enjoy quick and reliable shipping to bring Nepal’s finest to your doorstep.",
            },
        ],
    };



    const ProductPage: React.FC = () => {
        const router = useRouter();
        const { id: slug } = router.query;
        const dispatch = useAppDispatch();
        const { status, error } = useAppSelector((state) => state.cart); // Access cart state
        const [size, setSize] = useState<string | null>("Medium");
        const [color, setColor] = useState<string | null>(null);
        const [quantity, setQuantity] = useState<number>(1);
        const [details, setDetails] = useState<any>({});
        const [secondaryImage, setSecondaryImage] = useState<any>([]);
        const [recommendedProducts, setRecommendedProducts] = useState<any>([]);
        const [activeImage, setActiveImage] = useState<any>("");
        const [opened, { open, close }] = useDisclosure(false);
        const [sizeGuideOpened, { open: openSizeGuide, close: closeSizeGuide }] =
            useDisclosure(false);
        const [howToMeasureOpened, { open: openHowToMeasure, close: closeHowToMeasure }] =
            useDisclosure(false);
        const [modalSize, setModalSize] = useState<string | number>("50%");

        useEffect(() => {
            const handleResize = () => {
                const width = window.innerWidth;
                if (width < 640) setModalSize("100%"); // sm screen
                else if (width < 1024) setModalSize("80%"); // md screen
                else setModalSize("50%"); // lg+
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        const fetchDetails = async () => {
            if (!slug) return;
            try {
                const res = await APIGetProductDetailsBySlug(slug);
                setDetails(res.data[0]);
                if (res.data[0]?.productColors?.length > 0) {
                    setColor(res.data[0].productColors[0].id);
                }
                if (res.data[0]?.productSizes?.length > 0) {
                    setSize(res.data[0].productSizes[0].id);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                showNotify("error", "Failed to load product details");
            }
        };

        const fetchSecondaryImage = async () => {
            if (!details?.id) return;
            try {
                const res = await APIGetSecondaryImage(details.id);
                setSecondaryImage(res.data || []);
            } catch (error) {
                console.error("Error fetching secondary image:", error);
                showNotify("error", "Failed to load secondary images");
            }
        };

        const fetchRecommendedProducts = async () => {
            if (!details?.id) return;
            try {
                const res = await GetRequest(`/menu-item/${details.id}/recommendations`);
                setRecommendedProducts(res.data || []);
            } catch (error) {
                showNotify("error", "Failed to load recommended products");
            }
        };

        useEffect(() => {
            fetchDetails();
        }, [slug]);

        useEffect(() => {
            fetchSecondaryImage();
            fetchRecommendedProducts();
        }, [details]);

        const mainImage = details?.productImage;
        const secondaryImages = secondaryImage.map((img: any) => img.imageUrl);
        const combinedImages = [mainImage, ...secondaryImages];

        const pricing = details?.pricingLists?.[0];
        const minQuantity = pricing?.minRange || 1;
        const maxQuantity = pricing?.maxRange || 10;

        const originalPrice = pricing?.price || 0;
        const discountPercent = pricing?.discountPercent || 0;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);

        const handleAddToCart = async () => {
            try {
                const token = getCookie("token");
                if (!token) {
                    open();
                    return;
                }

                if (!details) {
                    showNotify("error", "Product not found");
                    return;
                }

                const selectedPricing = details.pricingLists.find(
                    (p: any) => p.minRange <= quantity && p.maxRange >= quantity
                );

                if (!selectedPricing) {
                    showNotify("error", "Quantity must be within the valid range");
                    return;
                }

                const payload = {
                    product: details.id,
                    qty: quantity,
                    pricingTypeId: selectedPricing.pricingType.id,
                    orderNote: "",
                    ProductSize: size || "",
                 ProductColor: String(color || ""),
                };

                await dispatch(
                    addToCart({
                        shoppingType: "individual",
                        payload,
                    })
                ).unwrap();

            } catch (error) {
                console.error("Error creating cart:", error);
                showNotify("error", "Failed to add to cart");
            }
        };

        return (
            <div>

            <div className="py-4 sm:py-8 px-4 sm:px-6 lg:px-36 max-w-6xl  mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 lg:mx-14 xl:mx-20">
                    {/* Product images section */}
                    <div className="col-span-1 sm:col-span-1 lg:col-span-3 ">
                        <div className="flex flex-col sm:flex-row gap-4 ">
                            {/* Thumbnail list */}
                            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[500px] sm:w-[80px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 order-2 sm:order-1">
                                {combinedImages.map((img: string, idx: number) => (
                                    <Image
                                        key={idx}
                                        src={img}
                                        alt={`Thumbnail ${idx + 1} for ${details?.productName || "product"}`}
                                        radius="sm"
                                        className={`cursor-pointer border rounded-md object-cover w-[60px] h-[80px] flex-shrink-0 ${
                                            img === activeImage ? "border-black" : "border-transparent"
                                        }`}
                                        width={60}
                                        height={80}
                                        fit="cover"
                                        onClick={() => setActiveImage(img)}
                                    />
                                ))}
                            </div>

                            {/* Main image */}
                            <div className="flex items-center justify-center flex-1 order-1 sm:order-2">
                                <Image
                                    radius="lg"
                                    src={activeImage || details?.productImage || ""}
                                    alt={details?.productName || "Product Image"}
                                    fit="cover"
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] object-cover"
                                />
                            </div>
                        </div>
                    </div>

                   <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-2">
  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
    <Title order={2} className="text-xl sm:text-2xl font-bold text-gray-800">
      {details?.productName || "Traditional Thangka Painting"}
      <p className="font-semibold text-lg text-gray-500">
        By {details?.brand?.brandName}
      </p>
    </Title>

    <Text className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
      ${discountedPrice.toFixed(2)}{" "}
      {discountPercent > 0 && (
        <span className="line-through text-gray-500 text-base sm:text-lg">
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </Text>

    {/* Size Selector & Guides */}
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
      {/* Size Selector */}
      <div className="flex flex-col">
        <Text size="sm" className="mb-2 font-medium text-gray-800">
          Size
        </Text>
        <Select
          value={size}
          onChange={setSize}
          data={
            details?.productSizes?.map((s: any) => ({
              value: s.id,
              label: s.name,
            })) || [
              { value: "Small", label: "Small" },
              { value: "Medium", label: "Medium" },
              { value: "Large", label: "Large" },
            ]
          }
          placeholder="Select size"
          className="w-32 sm:w-40"
        />
      </div>

      {/* Guides */}
      <div className="flex items-center gap-4 sm:gap-6">
        <span
          className="cursor-pointer text-black hover:text-blue-800 underline font-medium transition text-sm sm:text-base"
          onClick={openSizeGuide}
        >
          Size Guide
        </span>
        <span
          className="cursor-pointer text-[#CB8C32] hover:text-blue-800 underline font-medium transition text-sm sm:text-base"
          onClick={openHowToMeasure}
        >
          How to Measure
        </span>
      </div>
    </div>

    {/* Modals */}
    <Modal opened={sizeGuideOpened} onClose={closeSizeGuide} centered size={modalSize}>
      <KurtiSizeChart />
    </Modal>
    <Modal opened={howToMeasureOpened} onClose={closeHowToMeasure} centered size={modalSize}>
      <HowToMeasure />
    </Modal>

    {/* Color Selector */}
    <div>
      <Text size="sm" className="mb-2 font-medium text-gray-800">
        Color
      </Text>
      <div className="flex gap-2 flex-wrap">
        {details?.productColors?.map((c: any) => (
          <div
            key={c.id}
            title={c.name}
            onClick={() => setColor(c.id)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
              color === c.id ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hexCode || "#ccc" }}
          />
        ))}
      </div>
    </div>

    {/* Quantity */}
    <div>
      <Text size="sm" className="mb-2 font-medium text-gray-800">
        Quantity
      </Text>
      <NumberInput
        value={quantity}
        onChange={(value) => setQuantity(Number(value))}
        min={minQuantity}
        max={maxQuantity}
        className="w-20 sm:w-24"
      />
    </div>

    {/* Buttons */}
    <div className="flex gap-4 pt-4">
      <Button
        variant="outline"
        color="black"
        size="md"
        className="flex-1 text-sm sm:text-base"
        disabled={details?.stock === 0}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  </div>
</div>

                </div>
                <Tabs defaultValue="description" className="mt-6 sm:mt-8">
                    <Tabs.List>
                        <Tabs.Tab value="description">Description</Tabs.Tab>
                        <Tabs.Tab value="specifications">Specifications</Tabs.Tab>
                        <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                        <Tabs.Tab value="shipping">Shipping</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="description" pt="xs">
                        <Text
                            size="sm"
                            className="prose text-gray-700 text-sm sm:text-base"
                            dangerouslySetInnerHTML={{
                                __html: details?.description || "No description available.",
                            }}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="specifications" pt="xs">
                        <Text size="sm" className="text-gray-700 text-sm sm:text-base">
                            - Material: {details?.fabric || "Not specified"}
                            <br />- Fabric Weight: {details?.fabricWeight || "Not specified"}
                            <br />- Fit: {details?.fit || "Not specified"}
                            <br />- Handcrafted in Nepal
                        </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="reviews" pt="xs">
                        <Text size="sm" className="text-gray-700 text-sm sm:text-base">
                            No reviews available yet.
                        </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="shipping" pt="xs">
                        <Text size="sm" className="text-gray-700 text-sm sm:text-base">
                            - Ships worldwide from Nepal
                            <br />
                            - Estimated delivery: 7-14 business days
                            <br />- Free shipping on orders over $200
                        </Text>
                    </Tabs.Panel>
                </Tabs>
                <Modal
                    opened={opened}
                    onClose={close}
                    title="Sign In Required"
                    centered
                    size="sm"
                >
                    <GoogleLoginButton handleModal={close} />


                </Modal>



            </div>
                {recommendedProducts.length > 0 && (


                    <FeaturedProducts
                        title="You May Also Like"
                        products={recommendedProducts}
                        description={"Match your Outfit with our top-rated products."}
                    />
                )
                }
                <div className="mt-6 sm:mt-8">
                    <WhyChooseUS
                        title={whyChooseUsData.title}
                        subtitle={whyChooseUsData.subtitle}
                        data={whyChooseUsData.data || []}
                    />
                </div>
            </div>
        );
    };

    export default ProductPage;