import { useState, CSSProperties } from "react";

function Testloader() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#19d6006f");

  return (
    <div className="sweet-loading">
      <button onClick={() => setLoading(!loading)}>Toggle Loader</button>
      <input
        value={color}
        onChange={(input) => setColor(input.target.value)}
        placeholder="Color of the loader"
      />
    </div>
  );
}

export default Testloader;