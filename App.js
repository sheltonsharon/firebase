import "./App.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import logo from "./trash.png";

function App() {
  const [state, setState] = useState({ name: "", value: "" });
  const [data, setData] = useState([]);
  let val = data.map((x) => (
    <div className="result">
      <p
        key={nanoid()}
        className="data"
        onClick={() => {
          console.log(x);
          setState({ name: x.name, value: x.value });
        }}
      >
        Name: {x.name} && value:{x.value}
      </p>
      <img
        src={logo}
        alt="bin"
        key={nanoid()}
        className="bin"
        onClick={() => deleteData(x.name)}
      />
    </div>
  ));

  function deleteData(name) {
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:5000/${name}`, requestOptions)
      .then((response) => response.json())
      .then((data) => fetching());
  }

  function sendToBackend() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    };
    if (state.name === "" || state.value === "") {
      alert("One or two input fields are empty");
      return;
    }
    fetch("http://localhost:5000/create", requestOptions)
      .then((response) => response.json())
      .then((data) => fetching());
    setState({ name: "", value: "" });
  }

  function fetching() {
    console.log("fetching...");
    fetch("http://localhost:5000/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }

  useEffect(() => {
    fetching();
  }, []);

  return (
    <div className="App">
      <label>
        Name:
        <input
          type="text"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </label>
      <label>
        value:
        <input
          type="text"
          value={state.value}
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

