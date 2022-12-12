import { gql } from 'graphql-request';
import sortNewsByImage from './sortNewsByImage';
const fetchNews = async (
	category?: Category | string,
	keywords?: string,
	isDynamic?: boolean
) => {
	// graphQL query
	const query = gql`
		query MyQuery(
			$access_key: String!
			$categories: String!
			$keywords: String
		) {
			myQuery(
				access_key: $access_key
				categories: $categories
				countries: "us,gb,vn "
				sort: "published_desc"
				keywords: $keywords
			) {
				pagination {
					count
					limit
					offset
					total
				}
				data {
					author
					category
					country
					description
					image
					language
					published_at
					source
					title
					url
				}
			}
		}
	`;
	// Fetch function w/ next 13
	const res = await fetch(
		'https://altos.stepzen.net/api/austere-gorilla/__graphql',
		{
			method: 'POST',
			cache: isDynamic ? 'no-cache' : 'default',
			next: isDynamic ? { revalidate: 0 } : { revalidate: 10000 },
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
			},
			body: JSON.stringify({
				query,
				variables: {
					access_key: process.env.ACCESS_KEY,
					categories: category,
					keywords: keywords,
				},
			}),
		}
	);
	console.log('LOADING NEW DATA FROM API FOR CATEGORY -> ', category, keywords);
	const newsResponse = await res.json();
	// sort function
	const news = sortNewsByImage(newsResponse.data.myQuery);

	return news;
	// return results
};

export default fetchNews;

// "http://api.mediastack.com/v1/news?access_key=e14a9d71d4990a32a206f1784b4ed142&sources=business,sports"
