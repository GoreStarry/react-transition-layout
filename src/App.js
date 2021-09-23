import React from "react";
import * as Components from "./lib.js";

function App() {
  return (
    <div className="App">
      <h1>All Lib Components</h1>
      <a href="./storybook">Go Stroybook</a>
      {Object.values(Components).map((Component) => {
        return (
          <div>
            <Component />
          </div>
        );
      })}
    </div>
  );
}

export default App;
