import CommonHeader from "@/components/common/CommonHeader";
import TestimonialsSection from "@/components/common/TestimonalSection";
import LearnMoreSection from "@/components/common/LearnMoreSection";
import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { Carousel } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import CommonHead from "@/components/common/CommonHead";

// Interfaces for aboutData structure
interface Content {
  paragraph: string;
}

interface Image {
  src: string;
  alt: string;
}

interface Social {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

interface TeamMember {
  name: string;
  title: string;
  description: string;
  image: string;
  social: Social;
}

interface Metric {
  value: string;
  label: string;
}

interface Button {
  text: string;
  url: string;
}

interface Impact {
  title: string;
  subtitle: string;
  metrics: Metric[];
  description: string;
  button: Button;
}

interface AboutData {
  title: string;
  description: string;
  content: Content[];
  image: Image;
  team: TeamMember[];
  impact: Impact;
}

// Mock data
const aboutData: AboutData = {
  title: "Our Story",
  description: "How our journey began in the heart of the Himalayas",
  content: [
    {
      paragraph:
        "Welcome to Dami Pasal! In Nepali, 'Dami' means awesome, genuine, and of the highest quality — and that’s exactly what we stand for. At Dami Pasal, we’re more than just a clothing brand; we’re a bridge between timeless Nepali heritage and modern fashion. Every piece we create carries the spirit of our culture, the craftsmanship of skilled local artisans, and the essence of authenticity. Our mission is to deliver clothing that not only looks good but also tells a story of tradition, pride, and originality.",
    },
    {
      paragraph:
        "Proudly based in Nepal, we work directly with passionate artisans and makers to bring you clothing that blends style, comfort, and cultural depth. From the heart of the Himalayas to the streets around the world, our collections represent the resilience, creativity, and soul of Nepali craftsmanship. At Dami Pasal, we believe in sustainable fashion, fair trade, and giving our customers the very best. Whether you’re looking for everyday wear or statement pieces, our products are designed to make you feel unique, confident, and truly ‘dami’.",
    },
  ],
  image: {
    src: "/homepage-img/test.svg",
    alt: "Artisan with traditional instruments",
  },
  team: [
    {
      name: "Adarsh Pokharel",
      title: "Founder & CEO",
      description:
        "Former mountain guide with a passion for preserving Nepalese cultural heritage.",
      image: "/homepage-img/test.svg",
      social: {
        linkedin: "https://linkedin.com/in/adarsh-pokharel",
        twitter: "https://twitter.com/adarshpokharel",
      },
    },
    {
      name: "Maya Gurung",
      title: "Director of Artisan Relations",
      description:
        "Expert in traditional Nepalese crafts and advocate for women artisans.",
      image: "/homepage-img/test.svg",
      social: {
        linkedin: "https://linkedin.com/in/maya-gurung",
        instagram: "https://instagram.com/mayagurung",
      },
    },
    {
      name: "Tenzin Norgay",
      title: "Head of Operations",
      description:
        "Logistics expert ensuring products reach our global customers safely.",
      image: "/homepage-img/test.svg",
      social: {
        linkedin: "https://linkedin.com/in/tenzin-norgay",
        facebook: "https://facebook.com/tenzinnorgay",
      },
    },
  ],
  impact: {
    title: "Our Social Impact",
    subtitle: "How your purchase makes a difference",
    metrics: [
      {
        value: "200+",
        label: "Artisans Supported",
      },
      {
        value: "15",
        label: "Communities Reached",
      },
      {
        value: "3",
        label: "Schools Built",
      },
      {
        value: "85%",
        label: "Revenue to Artisans",
      },
    ],
    description:
      "From building schools and water systems to providing healthcare access and vocational training, your purchase directly contributes to improving the lives of our artisan partners and their communities.",
    button: {
      text: "Learn More About Our Impact",
      url: "/impact",
    },
  },
};

// Interface for CommonHeader props (based on usage)
interface CommonHeaderProps {
  title: string;
  description: string[];
}

// Assume TestimonialsSection and LearnMoreSection have no required props
interface TestimonialsSectionProps {}
interface LearnMoreSectionProps {}

const AboutUs: React.FC = () => {
  return (
    <>
      <CommonHead title={"Damipasal | About us"} />
      <div className=" bg-white">
        <CommonHeader
          title="About Dami Pasal"
          description={["Taking the Nepali heritage out to the world."]}
        />

        <section className="max-w-7xl mx-auto lg:py-16 px-4 sm:px-6  py-4 md:py-10 lg:px-8">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl xl:text-4xl font-bold text-center text-gray-900">
              {aboutData.title}
            </h2>
            <h4 className="text-center mt-2 text-gray-600">
              {aboutData.description}
            </h4>
          </div>

          <div className="flex flex-col md:flex-row items-center md:gap-4 gap-4">
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={aboutData.image.src}
                alt={aboutData.image.alt}
                className="w-full  h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
            {/* Text Content */}
            <div className="md:w-1/2   lg:space-y-3 space-y-1  md:space-y-0 text-gray-700  ">
              {aboutData.content.map((item, index) => (
                <p key={index} className=" 2xl:text-base text-xs">
                  {item.paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}

        {/* <section className="max-w-7xl mx-auto   px-4  xl:px-8">
                <div className="xl:mb-12 mb-4 text-center">
                    <h2 className="text-xl sm:text-2xl xl:text-4xl font-bold text-gray-900">Our Team</h2>
                    <h4 className="md:mt-2 text-gray-600">The people behind Himalayan Peaks</h4>
                </div>

                
                <div className="block md:hidden ">
                    <Carousel
                       slideGap={8}
                        slidesToScroll={1}
                       nextControlIcon={<IconArrowRight size={24} />}
                       previousControlIcon={<IconArrowLeft size={24} />}
                       classNames={{
                           control: "bg-black text-white rounded-full top-1/2 -translate-y-1/2 -ml-6 -mr-6",
                           viewport: "relative", 
                       }}
                    >
                        {aboutData.team.map((member, index) => (
                            <Carousel.Slide key={index}>
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center text-center sm:p-6 py-2 mb-2 ">
                                    <img src={member.image} alt={member.name} className="w-full sm:h-64 h-40 object-cover rounded-lg mb-4" />
                                    <h3 className="sm:text-lg  text-base font-semibold text-gray-900">{member.name}</h3>
                                    <p className="sm:text-base text-sm text-gray-600">{member.title}</p>
                                    <p className="md:text-sm  text-xs text-black mt-2">{member.description}</p>
                                    <div className="flex space-x-4 mt-4">
                                        {member.social.linkedin && (
                                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile of ${member.name}`} className="text-gray-600 hover:text-blue-700">
                  <span className="flex items-center justify-center bg-black rounded-full p-1.5">
                    <Linkedin className="sm:w-6 sm:h-6 w-4 h-4 text-white" />
                  </span>
                                            </a>
                                        )}
                                        {member.social.twitter && (
                                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`Twitter profile of ${member.name}`} className="text-gray-600 hover:text-blue-400">
                  <span className="flex items-center justify-center bg-black rounded-full p-1.5">
                    <Twitter className="sm:w-6 sm:h-6 w-4 h-4  text-white" />
                  </span>
                                            </a>
                                        )}
                                        {member.social.instagram && (
                                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram profile of ${member.name}`} className="text-gray-600 hover:text-pink-500">
                  <span className="flex items-center justify-center bg-black rounded-full p-1.5">
                    <Instagram className="sm:w-6 sm:h-6 w-4 h-4  text-white" />
                  </span>
                                            </a>
                                        )}
                                        {member.social.facebook && (
                                            <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook profile of ${member.name}`} className="text-gray-600 hover:text-blue-600">
                  <span className="flex items-center justify-center bg-black rounded-full p-1.5">
                    <Facebook className="sm:w-6 sm:h-6 w-4 h-4  text-white" />
                  </span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </div>

             
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-2">
                    {aboutData.team.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center text-center p-6">
                            <img src={member.image} alt={member.name} className="w-full xl:h-64 h-40  object-cover rounded-lg mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-base text-gray-600">{member.title}</p>
                            <p className="text-sm text-black mt-2">{member.description}</p>
                            <div className="flex space-x-4 mt-4">
                              
                            </div>
                        </div>
                    ))}
                </div>
            </section> */}

        {/*Our Social Impact Section*/}
        {/* <section className="max-w-7xl mx-auto xl:py-16 sm:py-12 py-4 px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center hidden sm:block">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                        {aboutData.impact.title}
                    </h2>
                    <h4 className="mt-2 text-gray-600">{aboutData.impact.subtitle}</h4>
                </div>

                <div className="sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 hidden ">
                    {aboutData.impact.metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                            <p className="text-4xl font-bold text-gray-900">{metric.value}</p>
                            <p className="text-base text-gray-600 mt-2">{metric.label}</p>
                        </div>
                    ))}
                </div>

                <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-8 hidden sm:block">
                    {aboutData.impact.description}
                </p>

                <div className="text-center">
                    <a
                        href={aboutData.impact.button.url}
                        className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Learn more about our social impact"
                    >
                        {aboutData.impact.button.text}
                    </a>
                </div>
            </section> */}

        {/* <TestimonialsSection />
            <LearnMoreSection /> */}
      </div>
    </>
  );
};

export default AboutUs;
