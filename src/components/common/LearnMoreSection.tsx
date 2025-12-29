const mockLearnMoreData = {
    title: "Want to Learn More?",
    description:
        "We’d love to hear from you. Whether you have questions about our products, want to collaborate, or are interested in supporting our mission, our team is here to help.",
    buttonText: "Contact Us",
};

const LearnMoreSection = ({ data = mockLearnMoreData }) => {
    return (
        <section className="w-full mx-auto xl:py-12 md:py-8 py-4 px-4 sm:px-6 lg:px-14 text-center">
            <div className="max-w-7xl mx-auto bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 py-10">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">{data.title}</h2>
                    <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
                        {data.description}
                    </p>
                </div>
                <button className="bg-black text-white font-medium py-3 px-8 rounded-full hover:bg-gray-900 transition">
                    {data.buttonText}
                </button>
            </div>
        </section>
    );
};

export default LearnMoreSection;