import { useEffect, useState } from "react";
import "./App.css";
function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function App() {
  const cookieName = "searchHistoryCookie";
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const searchHistoryCookie = readCookie(cookieName);

    if (searchHistoryCookie) {
      searchHistoryCookie.split(",").forEach((search) => {
        setSuggestions((oldSuggestions) => [...oldSuggestions, search]);
      });
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const cookieExpiresInDays = 10;

    const searchHistoryCookie = readCookie(cookieName);

    if (!searchHistoryCookie) {
      const searchHistory = [searchInput];

      setCookie(cookieName, searchHistory, cookieExpiresInDays);
      setSuggestions((oldSuggestions) => [...oldSuggestions, searchInput]);
    } else {
      const cookieContent = searchHistoryCookie?.split(",");

      const isNotPresent = cookieContent.indexOf(searchInput) === -1;

      if (isNotPresent) {
        cookieContent.push(searchInput);
        setCookie(cookieName, cookieContent.toString(), cookieExpiresInDays);
        setSuggestions((oldSuggestions) => [...oldSuggestions, searchInput]);
      }
    }
  };
  return (
    <div className="App">
      <div className="search">
        <form onSubmit={onSubmit}>
          <input
            list="suggestions"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />

          <datalist id="suggestions">
            {suggestions?.map((s, index) => {
              return <option value={s} key={index}></option>;
            })}
          </datalist>

          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
}
