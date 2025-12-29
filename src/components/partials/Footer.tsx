import { ApiRetrieveActiveCategory } from "@/apis/category";
import showNotify from "@/utils/notify";
import { TextInput } from "@mantine/core";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  categoryName: string;
}

const CommonFooter = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getActiveCategories = async () => {
    try {
      const response = await ApiRetrieveActiveCategory();
      if (response?.status === 200) {
        setCategories(response?.data);
      }
    } catch (error: any) {
      showNotify("error", error);
    }
  };

  useEffect(() => {
    getActiveCategories();
  }, []);
  const footerData = {
    about: {
      title: "About Us",
      description:
        "Dami Pasal is an ecommerce platform dedicated to bringing authentic Nepalese cultural products to the global market while supporting local businesses and preserving traditional craftsmanship.",
      socialIcons: [
        {
          name: "Facebook",
          icon: <Facebook />,
          link: "https://www.facebook.com/damipasaldotcom/",
        },
        {
          name: "Instagram",
          icon: <Instagram />,
          link: "https://www.instagram.com/damipasaldotcom",
        },
        // { name: "Twitter", icon: <Twitter />, link: "" },
        // { name: "Pinterest", icon: <Linkedin />, link: "" },
      ],
    },
    quickLinks: {
      title: "Quick Links",
      links: [
        "Home",
        "Shop",
        "About Us",
        // "Blog",
        "Shipping & Returns",
        "Privacy Policy",
        "Terms & Conditions",
      ],
    },
    categories: {
      title: "Categories",
      links: [
        "Men’s Wear",
        "Women’s Wear",
        "Pashmina Shawls",
        "Accessories",
        "Puja Essentials",
      ],
    },
    contact: {
      title: "Contact Us",
      info: [
        {
          icon: <MapPin />,
          text: " Unicorn Dr, South Riding, VA, United States",
          link: "https://www.google.com/maps/place/42468+Unicorn+Dr,+South+Riding,+VA+20152,+USA/@38.9177306,-77.5366612,17z/data=!3m1!4b1!4m6!3m5!1s0x89b64195cdbd5d4f:0x16531d35117665ba!8m2!3d38.9177306!4d-77.5340863!16s%2Fg%2F11c4jt53hh?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
        },
        {
          icon: <Phone />,
          text: "+977-1-4123456",
          link: "tel:+97714123456",
        },
        {
          icon: <Mail />,
          text: "info@damipasal.com",
          link: "mailto:info@damipasal.com",
        },
        {
          icon: <Clock />,
          text: "Monday - Saturday: 10am - 7pm",
        },
      ],
    },

    copyright: "© 2025 Dami Pasal. All Rights Reserved.",
  };

  return (
    <div className={"flex-none"}>
      {/* Newsletter Section for xs and md+ screens */}
      {/*<div className="text-center text-white bg-[#770000] p-24 space-y-4 hidden sm:block md:hidden">*/}
      {/*  <p className={"font-bold text-3xl"}>Subscribe to Our Newsletter</p>*/}
      {/*  <p className={"text-md"}>*/}
      {/*    Stay updated with our latest products, artisan stories, and exclusive*/}
      {/*    offers.*/}
      {/*  </p>*/}
      {/*  <div className="flex justify-center items-center pr">*/}
      {/*    <TextInput*/}
      {/*      radius={"xl"}*/}
      {/*      className={"w-[25rem]"}*/}
      {/*      placeholder={"Your Email Address"}*/}
      {/*      variant={"filled"}*/}
      {/*      styles={{*/}
      {/*        input: {*/}
      {/*          backgroundColor: "white",*/}
      {/*          color: "black",*/}
      {/*          "&::placeholder": {*/}
      {/*            color: "black",*/}
      {/*          },*/}
      {/*        },*/}
      {/*      }}*/}
      {/*      rightSection={*/}
      {/*        <div*/}
      {/*          className={*/}
      {/*            "bg-footer h-[36px] flex items-center text-center px-5 rounded-r-full text-xs font-bold text-white"*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <p className={"text-center"}>Subscribe</p>*/}
      {/*        </div>*/}
      {/*      }*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Newsletter Section for sm screens */}
      {/* <div className="text-center text-white bg-secondary py-16 space-y-4 md:hidden block">
        <p className={"font-bold text-3xl"}>Subscribe to Our Newsletter</p>
        <div className="flex justify-center items-center pr-8">
          <TextInput
            radius={"xl"}
            className={"w-[15rem]"}
            placeholder={"Your email address"}
            variant={"filled"}
            styles={{
              input: {
                backgroundColor: "white",
                color: "black",
                "&::placeholder": {
                  color: "gray",
                },
              },
            }}
            rightSection={
              <div
                className={
                  "bg-gray-800 h-[36px] flex items-center text-center px-5 rounded-r-full text-xs font-bold text-white"
                }
              >
                <p className={"text-center"}>Subscribe</p>
              </div>
            }
          />
        </div>
      </div> */}

      {/* Mobile Layout (visible only on xs screens) */}
      <div
        className="bg-footer text-white font-lexend py-10 md:px-4 px-8 md:hidden block"
        // Hidden on sm and above
      >
        <div className="space-y-8">
          {/* About Us */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">
              {footerData.about.title}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {footerData.about.description}
            </p>
            <div className="flex space-x-3">
              {footerData.about.socialIcons.map((social, index) => (
                <a
                  key={index}
                   href={social?.link}
                  className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition"
                >
                  {social?.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category?.id}>
                  <a
                    href={`/marketplace?categoryId=${category?.id}`}
                    className="text-white/80 text-sm hover:text-white transition"
                  >
                    {category?.categoryName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">
              {footerData.contact.title}
            </h3>
            <ul className="space-y-2">
              {footerData.contact.info.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-white/80 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Original Layout (visible on sm and above) */}
      <div
        className="bg-footer text-white font-lexend py-10 px-4 md:block hidden"
        // Visible on sm and above
      >
        <div className="max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 gap-6">
          {/* About Us */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">
              {footerData.about.title}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {footerData.about.description}
            </p>
            <div className="flex space-x-3">
              {footerData.about.socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.link || "#"}
                  target="_blank"
                  className="p-2 rounded-full bg-gray-400 text-white hover:text-white hover:bg-gray-600 transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {/*<div>*/}
          {/*  <h3 className="text-white font-bold uppercase mb-4">*/}
          {/*    {footerData.quickLinks.title}*/}
          {/*  </h3>*/}
          {/*  <ul className="space-y-2">*/}
          {/*    {footerData.quickLinks.links.map((link, index) => (*/}
          {/*      <li key={index}>*/}
          {/*        <a*/}
          {/*          href="#"*/}
          {/*          className="text-white/80 text-sm hover:text-white transition"*/}
          {/*        >*/}
          {/*          {link}*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*    ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category?.id}>
                  <a
                    href={`/marketplace?categoryId=${category?.id}`}
                    className="text-white/80 text-sm hover:text-white transition"
                  >
                    {category?.categoryName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          {/* Contact Us */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">
              {footerData.contact.title}
            </h3>
            <ul className="space-y-2">
              {footerData.contact.info.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-white/80 text-sm hover:text-white transition"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </a>
                  ) : (
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-white/80 text-sm border-t  border-gray-400 pt-4">
          {footerData.copyright}
        </div>
      </div>
    </div>
  );
};

export default CommonFooter;
