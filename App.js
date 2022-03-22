import "./App.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState({ name: "", value: "" });
  const [data, setData] = useState([]);
  let val = data.map((x) => (
    <h4 key={nanoid()}>
      Name: {x.name} && value:{x.value}
    </h4>
  ));

  function sendToBackend() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    };
    fetch("http://localhost:5000/create", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div className="App">
      <label>
        Name:
        <input
          type="text"
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </label>
      <label>
        value:
        <input
          type="text"
          onChange={(e) => setState({ ...state, value: e.target.value })}
        />
      </label>
      <input type="submit" onClick={sendToBackend} />
      <div>
        <h3>---Data retrieved---</h3>
        {val}
      </div>
    </div>
  );
}

export default App;
