import { get, set } from '@dlb/dim/utils/idb-keyval';
import { NextPage } from 'next';
import { useEffect } from 'react';

const IDB: NextPage = () => {
	useEffect(() => {
		(async () => {
			// const db = Database.getInstance();
			// db.books.put({
			// 	id: 1,
			// 	name: 'Under the Dome',
			// 	author: 'Stephen King',
			// 	categories: ['sci-fi', 'thriller'],
			// });
			// const sciFiBooks = await db.books
			// 	.where('categories')
			// 	.equals('sci-fi')
			// 	.toArray();
			// console.log(sciFiBooks);

			// db.allModCombinations.put({
			// 	key: '000000000000-0',
			// 	value: [],
			// });
			// db.allModCombinations.put({
			// 	key: '010000000000-0',
			// 	value: [[0]],
			// });
			// db.allModCombinations.put({
			// 	key: '010000000000-1',
			// 	value: [[1], [0]],
			// });
			// const derp = await db.allModCombinations.get('010000000000-1');

			// console.log(derp);
			set('000000000000-0', []);
			set('010000000000-0', [[0]]);
			set('010000000000-1', [[1], [0]]);
			const derp = await get('010000000000-1');
			console.log(derp);
		})();

		return () => {
			// cleanup
		};
	}, []);

	return <div>idb</div>;
};

export default IDB;
