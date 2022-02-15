import React from "react";
import "bulma/css/bulma.css";

type CardProps = {
  name: string;
};

export default (props: CardProps) => {
  return <div className="notification is-dark ">単語：{props.name}</div>;
};
