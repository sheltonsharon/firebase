import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import App from "./App";
import React from "react";

const unmockedFetch = global.fetch;
const unmockedAlert = global.alert;
beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([{ name: "Sharon", value: "10" }]),
    });
  global.alert = jest.fn();
});

afterAll(() => {
  global.fetch = unmockedFetch;
  global.alert = unmockedAlert;
});

test("renders the component properly along with the heading", () => {
  const { getByTestId } = render(<App />);
  const headerEl = getByTestId("header");
  expect(headerEl.textContent).toBe("---Data retrieved---");
});

test("name label is rendered correctly", () => {
  render(<App />);
  screen.getByLabelText("Name:");
});

test("value label is rendered correctly", () => {
  render(<App />);
  screen.getByLabelText("value:");
});

test("name textbox is rendered and is empty initially", () => {
  const { getByTestId } = render(<App />);
  const nameEl = getByTestId("name");
  expect(nameEl.value).toBe("");
});

test("value textbox is rendered and is empty initially", () => {
  const { getByTestId } = render(<App />);
  const valueEl = getByTestId("value");
  expect(valueEl.value).toBe("");
});

test("button renders with submit text", () => {
  const { getByTestId } = render(<App />);
  const btnEl = getByTestId("btn");
  expect(btnEl.textContent).toBe("Submit");
});

test("changing value of name field works correctly", () => {
  const { getByTestId } = render(<App />);
  const nameEl = getByTestId("name");
  fireEvent.change(nameEl, {
    target: {
      value: "a",
    },
  });
  expect(nameEl.value).toBe("a");
});

test("changing value of value field works correctly", () => {
  const { getByTestId } = render(<App />);
  const valueEl = getByTestId("value");
  fireEvent.change(valueEl, {
    target: {
      value: "1",
    },
  });
  expect(valueEl.value).toBe("1");
});

test("name field becomes empty when submit button is clicked", async () => {
  const { getByTestId } = render(<App />);
  const btnEl = getByTestId("btn");
  const nameEl = getByTestId("name");
  const valueEl = getByTestId("value");
  fireEvent.change(nameEl, {
    target: {
      value: "a",
    },
  });
  fireEvent.change(valueEl, {
    target: {
      value: "1",
    },
  });
  expect(screen.getByLabelText("Name:").value).toBe("a");
  fireEvent.click(btnEl);
  expect(await screen.getByLabelText("Name:").value).toBe("");
});

test("if value field is empty when clicking submit button, alert will be called", async () => {
  const { getByTestId } = render(<App />);
  const btnEl = getByTestId("btn");
  const nameEl = getByTestId("name");
  const valueEl = getByTestId("value");
  fireEvent.change(nameEl, {
    target: {
      value: "a",
    },
  });
  expect(screen.getByLabelText("Name:").value).toBe("a");
  fireEvent.click(btnEl);
  expect(global.alert).toHaveBeenCalledTimes(1);
});

test("fetches data on mount and displays it on the screen", async () => {
  await act(async () => render(<App />));
  expect(screen.getByText("Name: Sharon && value: 10")).toBeInTheDocument();
});

test("fetched data on click makes the name field to be updated with its corresponding name", async () => {
  let component;
  await act(async () => {
    component = render(<App />);
  });
  const nameEl = component.getByTestId("name");
  const fetchedEl = component.getByTestId("fetched_individual_data");
  fireEvent.click(fetchedEl);
  expect(nameEl.value).toBe("Sharon");
});

test("fetched data on click makes the value field to be updated with its corresponding value", async () => {
  let component;
  await act(async () => {
    component = render(<App />);
  });
  const valueEl = component.getByTestId("value");
  const fetchedEl = component.getByTestId("fetched_individual_data");
  fireEvent.click(fetchedEl);
  expect(valueEl.value).toBe("10");
});

test("deleting works perfectly", async () => {
  let component;
  await act(async () => {
    component = render(<App />);
  });
  const trashEl = component.getByTestId("trash");
  expect(screen.getByText("Name: Sharon && value: 10")).toBeInTheDocument();
  fireEvent.click(trashEl);
  expect(
    await screen.findByText("Name: Sharon && value: 10")
  ).not.toBeInTheDocument();
});
