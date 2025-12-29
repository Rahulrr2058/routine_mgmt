import Image from "next/image";
import Link from "next/link";
interface IProps {
    latestArticles:{
        id:number,
        category:string,
        title:string
        date: {
            value: string,
            icon: any
        },comments: {
            value: number,
            icon: any
        },
        excerpt:string
        image:string
    }[]
}
const CommonLatestArticle = ({latestArticles}:IProps)=>{
    return (
    <div className="my-12 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Latest Articles</h2>
        <p className="text-base text-gray-500 mb-6 text-center">
            Stay updated with our most recent stories and insights
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
                <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="relative w-full h-48">
                        <Image
                            src="/homepage-img/test.svg"
                            alt={article.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />
                    </div>
                    <div className="p-5">
                    <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-3 uppercase font-medium">
                      {article.category}
                    </span>
                        <div className="text-gray-500 text-sm mb-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        {article.date.icon} {article.date.value}
                      </span>
                            <span className="flex items-center gap-1">
                        {article.comments.icon} {article.comments.value} Comments
                      </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">{article.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
                        <Link href={`/article/${article.id}`}>
                      <span className="text-blue-600 hover:underline text-sm font-medium">
                        Read More →
                      </span>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}
;
export default CommonLatestArticle;