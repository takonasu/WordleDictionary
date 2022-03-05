import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import Card from './components/Card';
import Header from './components/Header';

const Main = () => {
	type WordList = {
		place: number;
		word: string;
	};

	const [wordleData, setWordleData] = useState<Array<string>>(['now loading...']);
	const [greenWordList, setGreenWordList] = useState<Array<WordList>>([]);
	const [yellowWordList, setYellowWordList] = useState<Array<WordList>>([]);
	const [blockWordList, setBlockWordList] = useState<Array<string>>([]);

	const greenTextInput: Array<React.RefObject<HTMLInputElement>> = [
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null)
	];

	const yellowTextInput: Array<React.RefObject<HTMLInputElement>> = [
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null)
	];

	const blockTextInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetch('./data/wordles.json', { method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				setWordleData(data);
			});
	}, []);

	const addWords = () => {
		const newGreenWordList = [...greenWordList];
		const newYellowWordList = [...yellowWordList];
		let newBlockWordList = [...blockWordList];
		greenTextInput.forEach((elm, index) => {
			if (elm.current && elm.current.value !== '') {
				newGreenWordList.push({ place: index, word: elm.current.value });
				elm.current.value = '';
			}
		});
		yellowTextInput.forEach((elm, index) => {
			if (elm.current && elm.current.value !== '') {
				newYellowWordList.push({ place: index, word: elm.current.value });
				elm.current.value = '';
			}
		});
		if (blockTextInput.current && blockTextInput.current.value !== '') {
			newBlockWordList = newBlockWordList.concat(Array.from(blockTextInput.current.value));
			blockTextInput.current.value = '';
		}
		// 黒文字リストに緑色の文字が存在する場合はその文字を黒文字リストから消す
		newBlockWordList = newBlockWordList.filter((elm1) =>
			newGreenWordList.map((elm2) => elm2.word).every((elm3) => elm3 !== elm1)
		);
		// 黒文字リストに黄色の文字が存在する場合はその文字を黒文字リストから消す
		newBlockWordList = newBlockWordList.filter((elm1) =>
			newYellowWordList.map((elm2) => elm2.word).every((elm3) => elm3 !== elm1)
		);
		setGreenWordList(newGreenWordList);
		setYellowWordList(newYellowWordList);
		setBlockWordList(newBlockWordList);
	};

	const checkRule = (word: string) => {
		const oneword = Array.from(word);
		// 各場所から黄色文字をはじく
		let test1 = !yellowWordList.some((elm) => elm.place === 0 && elm.word === oneword[0]);
		let test2 = !yellowWordList.some((elm) => elm.place === 1 && elm.word === oneword[1]);
		let test3 = !yellowWordList.some((elm) => elm.place === 2 && elm.word === oneword[2]);
		let test4 = !yellowWordList.some((elm) => elm.place === 3 && elm.word === oneword[3]);
		let test5 = !yellowWordList.some((elm) => elm.place === 4 && elm.word === oneword[4]);
		// 黄色文字を全てその単語は含んでいるか(場所についてはtest1-5で考慮しているのでtest6は場所を考慮しない)
		let test6 = yellowWordList.map((elm) => elm.word).every((elm) => word.includes(elm));
		// ブラックリストにある文字を含む単語はじく
		let test7 = blockWordList.every((elm) => !oneword.includes(elm));
		// 緑色の文字を必ずその場所に含む
		let test8 = greenWordList.every((elm) => elm.word === oneword[elm.place]);
		return test1 && test2 && test3 && test4 && test5 && test6 && test7 && test8;
	};

	const viewWordLists = wordleData
		.filter((elm) => checkRule(elm))
		.map((word, index) => <Card name={word} key={index} />);

	return (
		<div>
			<Header title="Wordle辞書" />
			<main className="has-background-light">
				<section className="section">
					<div className="container">
						<article className="message">
							<div className="message-body">
								<p>緑と黄色い文字の欄には半角英語一文字ずつ，場所に気を付けて入れてください．空欄でも構わないです．</p>
								<p>黒い文字の欄には文字を一気に入れることができます．（一文字ずつでなくてもOK）</p>
								<p>
									お問い合わせ：
									<a href="https://twitter.com/ITF_tako">@ITF_tako</a>
								</p>
								<p>パワ－</p>
							</div>
						</article>
						<section className="section">
							<div className="container">
								<label className="label">緑色の文字</label>
								{greenTextInput.map((elm, index) => {
									return (
										<input
											key={'input' + index}
											className="input is-primary"
											type="text"
											ref={elm}
											placeholder=""
											maxLength={1}
											style={{ width: '15%', margin: '0 2.5% 0 2.5%' }}
										/>
									);
								})}
							</div>
							<div className="container">
								<label className="label">黄色の文字</label>
								{yellowTextInput.map((elm, index) => {
									return (
										<input
											key={'input' + index}
											className="input is-warning"
											type="text"
											ref={elm}
											placeholder=""
											maxLength={1}
											style={{ width: '15%', margin: '0 2.5% 0 2.5%' }}
										/>
									);
								})}
							</div>
							<div className="container">
								<label className="label">黒色の文字</label>
								<input
									className="input"
									type="text"
									placeholder=""
									ref={blockTextInput}
									style={{ width: '95%', marginLeft: '2.5%' }}
								/>
							</div>
							<div className="has-text-right">
								<button className="button is-dark" style={{ marginTop: '1rem' }} onClick={() => addWords()}>
									追加
								</button>
							</div>
						</section>
						<article className="message">
							<div className="message-header">入力された文字一覧</div>
							<div className="message-body ">
								<label className="label">緑色の文字</label>
								{greenWordList.map((elm) => {
									return (
										<div>
											<p>
												位置：{elm.place}, 文字：{elm.word}
											</p>
										</div>
									);
								})}
								<label className="label">黄色の文字</label>
								{yellowWordList.map((elm) => {
									return (
										<div>
											<p>
												位置：{elm.place}, 文字：{elm.word}
											</p>
										</div>
									);
								})}
								<label className="label">黒色の文字</label>

								<div>
									<p>
										文字：
										{blockWordList.map((elm) => {
											return <span>{elm},</span>;
										})}
									</p>
								</div>
							</div>
						</article>
						<section className="section">
							<label className="label">検索結果：{viewWordLists.length}件</label>
							{viewWordLists}
						</section>
					</div>
				</section>
			</main>
		</div>
	);
};

ReactDOM.render(<Main />, document.getElementById('root'));
