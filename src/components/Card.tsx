import React from 'react';
import 'bulma/css/bulma.css';

type CardProps = {
	name: string;
};

const card = (props: CardProps) => {
	return <div className="notification is-dark ">単語：{props.name}</div>;
};

export default card;
