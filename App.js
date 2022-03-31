import "./App.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import logo from "./trash.png";
import deleteFetch from "./Functions/deleteFetch";

function App() {
  const [state, setState] = useState({ name: "", value: "" });
  const [data, setData] = useState([]);
  let val = data.map((x) => (
    <div className="result" key={nanoid()}>
      <p
        className="data"
        data-testid="fetched_individual_data"
        onClick={() => {
          setState({ name: x.name, value: x.value });
        }}
      >
        Name: {x.name} && value: {x.value}
      </p>
      <img
        src={logo}
        alt="bin"
        className="bin"
        data-testid="trash"
        onClick={() => deleteData(x.name)}
      />
    </div>
  ));

  async function deleteData(name) {
    await deleteFetch(name);
    setData((old) => old.filter((x) => x.name !== name));
  }

  function createOrUpdate() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    };
    fetch("http://localhost:5000/create", requestOptions)
      .then((response) => response.json())
      .then(async (data) => setData(await fetching()));
    setState({ name: "", value: "" });
  }

  async function fetching() {
    const res = await fetch("http://localhost:5000/");
    const json = await res.json();
    return json;
  }

  useEffect(async () => {
    const data = await fetching();
    setData(data);
  }, []);

  return (
    <div className="App">
      <label>
        Name:
        <input
          type="text"
          data-testid="name"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </label>
      <label>
        value:
        <input
          type="text"
          data-testid="value"
          value={state.value}
          onChange={(e) => setState({ ...state, value: e.target.value })}
        />
      </label>
      <button
        onClick={() => {
          if (state.name !== "" && state.value !== "") {
            createOrUpdate();
          } else {
            alert("One or two input fields are empty");
          }
        }}
        data-testid="btn"
      >
        Submit
      </button>
      <div>
        <h3 data-testid="header">---Data retrieved---</h3>
        {val}
      </div>
    </div>
  );
}

export default App;
