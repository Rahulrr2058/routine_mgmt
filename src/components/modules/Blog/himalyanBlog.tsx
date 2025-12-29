"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, Pagination, Tabs } from "@mantine/core";
import CommonHeader from "@/components/common/CommonHeader";
import { IconCalendar, IconMessageCircle, IconUser } from "@tabler/icons-react";
import CommonLatestArticle from "@/components/common/CommonLatestArticle";

// Mock Featured Article

const featuredArticle = {
    title: "The Art of Nepalese Wood Carving: A Centuries-Old Tradition",
    date: { value: "March 15, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
    comments: { value: 24, icon: <IconMessageCircle size={16} stroke={1.5} /> },
    author: { value: "Admin", icon: <IconUser size={16} stroke={1.5} /> },
    excerpt:
        "Dive into the intricate world of Nepalese wood carving, a craft that has adorned temples, palaces, and homes for centuries. Learn about the skilled artisans who maintain this tradition and the symbolism behind their mesmerizing patterns.",
    image: "/images/wood-carving.jpg",
};

// Mock Latest Articles
const latestArticles = [
    {
        id: 1,
        category: "Cultural Heritage",
        title: "The Sacred Art of Thangka",
        date: { value: "February 28, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 15, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "Explore the spiritual significance of Thangka paintings.",
        image: "/images/thangka.jpg",
    },
    {
        id: 2,
        category: "Artisan Stories",
        title: "Pashmina: The Goat Garment Journey",
        date: { value: "March 5, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 12, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "Follow the fascinating process of creating luxurious Pashmina shawls.",
        image: "/images/pashmina.jpg",
    },
    {
        id: 3,
        category: "Craftsmanship",
        title: "Our Singing Bowls with the Master Behind",
        date: { value: "March 12, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 18, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "An intimate interview with Karma Sherpa, a master singing bowl craftsman.",
        image: "/images/singing-bowls.jpg",
    },
    {
        id: 3,
        category: "Craftsmanship",
        title: "Our Singing Bowls with the Master Behind",
        date: { value: "March 12, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 18, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "An intimate interview with Karma Sherpa, a master singing bowl craftsman.",
        image: "/images/singing-bowls.jpg",
    },
    {
        id: 3,
        category: "Craftsmanship",
        title: "Our Singing Bowls with the Master Behind",
        date: { value: "March 12, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 18, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "An intimate interview with Karma Sherpa, a master singing bowl craftsman.",
        image: "/images/singing-bowls.jpg",
    },{
        id: 3,
        category: "Craftsmanship",
        title: "Our Singing Bowls with the Master Behind",
        date: { value: "March 12, 2025", icon: <IconCalendar size={16} stroke={1.5} /> },
        comments: { value: 18, icon: <IconMessageCircle size={16} stroke={1.5} /> },
        excerpt: "An intimate interview with Karma Sherpa, a master singing bowl craftsman.",
        image: "/images/singing-bowls.jpg",
    },
];

export default function HimalayanBlog() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <CommonHeader
                title={"Dami Diaries"}
                description={[
                    "Your Journey Through Nepali Culture.",
                ]}
            />

            {/* Tabs Section */}
            <Tabs
                defaultValue="all"
                variant="pills"
                radius="xl"
                className="my-6"
            >
                <div className="flex justify-center">
                    <Tabs.List className="bg-white flex gap-3 justify-center flex-wrap px-4">
                        {[
                            "All",
                            "Artisan Stories",
                            "Cultural Heritage",
                            "Craftsmanship",
                            "Travel",
                            "Behind the Scenes",
                        ].map((label, i) => (
                            <Tabs.Tab
                                key={i}
                                value={label?.toLowerCase()?.replace(/\s+/g, "-")}
                                className="px-4 py-2 text-sm font-medium text-white data-[active]:bg-black data-[active]:text-white bg-gray-300  rounded-full transition"
                            >
                                {label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </div>

                {/* All Tab Content */}
                <Tabs.Panel value="all" pt="xl">
                    {/* Featured Article */}
                    <section className=" xl:my-12 md:my-4 max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-2 text-center">Featured Article</h2>
                        <p className="text-base text-gray-500 mb-6 text-center">
                            Our most popular story this month
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/homepage-img/test.svg"
                                    alt={featuredArticle.title}
                                    width={500}
                                    height={300}
                                    className="w-full h-full rounded-lg object-cover"
                                    priority
                                />
                                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                  Featured
                </span>
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                                <div className="text-gray-500 text-xs mb-3 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    {featuredArticle.author.icon} {featuredArticle.author.value}
                  </span>
                                    <span className="flex items-center gap-1">
                    {featuredArticle.date.icon} {featuredArticle.date.value}
                  </span>
                                    <span className="flex items-center gap-1">
                    {featuredArticle.comments.icon} {featuredArticle.comments.value} Comments
                  </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">{featuredArticle.excerpt}</p>
                                <Link
                                    href={`/article/${featuredArticle?.title?.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                    <Button
                                        color="dark"
                                        radius="xl"
                                        className="bg-black hover:bg-gray-800 text-white rounded-full w-32 h-12"
                                    >
                                        Read More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                    <CommonLatestArticle latestArticles={latestArticles.slice(0, 3)} />

                    {/* Pagination */}
                    <div className="flex justify-center my-12">
                        <Pagination total={6} color="dark" radius="md" />
                    </div>
                </Tabs.Panel>

                {/* Other Tabs Content (empty for now) */}
                {["artisan-stories", "cultural-heritage", "craftsmanship", "travel", "behind-the-scenes"].map((tab) => (
                    <Tabs.Panel key={tab} value={tab} pt="xl">
                        <CommonLatestArticle latestArticles={latestArticles.slice(0, 6)} />

                        {/* Pagination */}
                        <div className="flex justify-center my-12">
                            <Pagination total={6} color="dark" radius="md" />
                        </div>

                        <section className="xl:my-12 my-4 max-w-6xl mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-2 text-center">Featured Article</h2>
                            <p className="text-base text-gray-500 mb-6 text-center">
                                Our most popular story this month
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/homepage-img/test.svg"
                                        alt={featuredArticle.title}
                                        width={500}
                                        height={300}
                                        className="w-full h-full rounded-lg object-cover"
                                        priority
                                    />
                                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                                     Featured
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col justify-center">
                                    <div className="text-gray-500 text-xs mb-3 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    {featuredArticle.author.icon} {featuredArticle.author.value}
                  </span>
                                        <span className="flex items-center gap-1">
                    {featuredArticle.date.icon} {featuredArticle.date.value}
                  </span>
                                        <span className="flex items-center gap-1">
                    {featuredArticle.comments.icon} {featuredArticle.comments.value} Comments
                  </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 leading-tight">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm">{featuredArticle.excerpt}</p>
                                    <Link
                                        href={`/article/${featuredArticle?.title?.toLowerCase().replace(/\s+/g, "-")}`}
                                    >
                                        <Button
                                            color="dark"
                                            radius="xl"
                                            className="bg-black hover:bg-gray-800 text-white rounded-full w-32 h-12"
                                        >
                                            Read More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>

    );

}
