import { Carousel } from '@mantine/carousel';


const testimonials = [
    {
        quote:
            'The pashmina shawl I purchased from Himalayan Peaks is truly exceptional. The craftsmanship is outstanding, and knowing my purchase supported local artisans makes it even more special.',
        name: 'Sarah Johnson',
        location: 'New York, USA',
        image: '/homepage-img/test.svg',
    },
    {
        quote:
            "I've been collecting Thangka art for years, and the piece I purchased from Himalayan Peaks is among the finest in my collection. The attention to detail is remarkable.",
        name: 'James Chen',
        location: 'Toronto, Canada',
        image: '/homepage-img/test.svg',
    },
    {
        quote:
            'The colors and texture of the pashmina are exquisite. I highly recommend Himalayan Peaks to anyone seeking authentic Himalayan crafts.',
        name: 'Ava Patel',
        location: 'London, UK',
        image: '/homepage-img/test.svg',
    },
    {
        quote:
            "I'm impressed by the fast shipping and eco-friendly packaging. The product is top-notch.",
        name: 'Liam Nguyen',
        location: 'Melbourne, Australia',
        image: '/homepage-img/test.svg',
    },
    {
        quote:
            'The colors  of the pashmina are exquisite. I highly recommend Himalayan Peaks to anyone seeking authentic Himalayan crafts.',
        name: 'Ava Patel',
        location: 'London, UK',
        image: '/homepage-img/test.svg',
    },
    {
        quote:
            "I'm impressed by the fast shipping and eco-friendly packaging. The product is top-notch.",
        name: 'Liam Nguyen',
        location: 'Melbourne, Australia',
        image: '/homepage-img/test.svg',
    },
];

const TestimonialsSection = () => {
    // Group testimonials in pairs
    const grouped = [];
    for (let i = 0; i < testimonials.length; i += 2) {
        grouped.push(testimonials.slice(i, i + 2));
    }

    return (
        <section className="max-w-7xl mx-auto ">
            <div className="text-center ">
                <h2 className="sm:text-4xl  text-xl font-bold text-gray-900">What Our Customers Say</h2>
                <p className="text-gray-600 md:text-base text-sm mt-2">Hear from people who have experienced our products</p>
            </div>

            <Carousel
                slideSize="100%"
                height="auto"
                align="start"
                slideGap="lg"
                controlsOffset="xs"
                loop
                withIndicators={true}
                withControls={false} // Arrows are already disabled
                styles={{
                    indicator: {
                        width: 15, // Smaller size (adjust as needed, e.g., 6, 10)
                        height: 15, // Same as width to keep it circular
                        backgroundColor: 'gray',
                        borderRadius: '100%', // Already circular, kept for clarity
                        '&[data-active]': {
                            backgroundColor: 'blue',
                        },
                    },
                }}
            >
                {/* Your Carousel.Slide components here */}

                {grouped.map((pair, index) => (
                    <Carousel.Slide key={index}>
                        <div className="grid grid-cols-1 md:grid-cols-1 sm:gap-8 sm:px-8 sm:py-14 gap-4 px-4 ">
                            {pair.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl shadow-md sm:p-8 p-4 flex flex-col gap-4"
                                >
                                    <p className="md:text-lg text-sm text-gray-800 italic">"{item.quote}"</p>
                                    <div className="flex items-center mt-2">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <p className="font-bold sm:text-base text-sm text-gray-900">{item.name}</p>
                                            <p className="text-gray-600 sm:text-sm text-xs">{item.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Carousel.Slide>
                ))}
            </Carousel>

        </section>
    );
};

export default TestimonialsSection;