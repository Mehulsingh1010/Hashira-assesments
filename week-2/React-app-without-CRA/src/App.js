import React, { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };
  return (
    <div>
      React app without CRA <br/>
      <button onClick={increment}>Increment</button>
      {counter}
    </div>
  );
};

export default App;