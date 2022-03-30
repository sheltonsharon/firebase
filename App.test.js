import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

const unmockedFetch = global.fetch;

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([{ name: "Sharon", value: "10" }]),
    });
});

afterAll(() => {
  global.fetch = unmockedFetch;
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

test("name field becomes empty when submit button is clicked", () => {
  const { getByTestId } = render(<App />);
  const btnEl = getByTestId("btn");
  fireEvent.click(btnEl);
  // const alertMock = jest.spyOn(window, "alert");
  const nameEl = getByTestId("name");
  expect(nameEl.value).toBe(""); //alert will be poppin man..Check that as well
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
