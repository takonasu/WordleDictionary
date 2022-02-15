import React from "react";
import "bulma/css/bulma.css";

type HeaderProps = {
  title: string;
};

export default (props: HeaderProps) => {
  return (
    <header className="hero is-dark is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{props.title}</h1>
        </div>
      </div>
    </header>
  );
};
