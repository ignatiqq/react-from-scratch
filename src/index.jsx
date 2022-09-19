import ReactDOM from "./React/ReactDOM";

/** @jsx ReactDOM.createElement */

const element = (
  <div>
    <div className="div-hello">
      <h1 style="color: green;">Hello World</h1>
      <h2>Hello H2!</h2>
    </div>
  </div>
);

window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#root');
  ReactDOM.render(element, root);
});
