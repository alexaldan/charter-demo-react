import { render } from "@testing-library/react";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Pagination from "./component/Pagination";
import RestaurantContainer from "./component/RestaurantContainer";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [display, setDisplay] = useState([]);
  const [genres, setGenres] = useState([]);
  const [states, setStates] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterCheck, setFilterCheck] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  //Refs
  const formRef = useRef();

  //Get Current Post
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  useEffect(() => {
    fetchApi();
  }, []);

  let fetchApi = () => {
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "YOUR API KEY!!!",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setRestaurants(data.sort((a, b) => (a.name > b.name ? 1 : -1)));
        setDisplay(data.sort((a, b) => (a.name > b.name ? 1 : -1)));
        getGenre(data);
      });
  };

  let getGenre = (data) => {
    let genreArr = data.map((restaurant) => {
      return restaurant.genre;
    });

    let stateArr = data.map((restaurant) => {
      return restaurant.state;
    });

    setStates(stateArr);

    let strArr = genreArr.toString().trim().split(",");

    var uniqGenres = [...new Set(strArr)];
    setGenres(uniqGenres);
  };

  let listGenres = () => {
    return genres.map((genre) => <option value={genre}>{genre}</option>);
  };

  let listStates = () => {
    return states.map((state) => <option value={state}>{state}</option>);
  };

  let filterList = () => {
    if (selectedGenre && selectedState) {
      let displayRestaurants = restaurants.filter(
        (restaurant) =>
          restaurant.genre.includes(selectedGenre) &&
          restaurant.state === selectedState
      );
      setDisplay(displayRestaurants);
    } else if (selectedGenre && !selectedState) {
      let displayRestaurants = restaurants.filter((restaurant) =>
        restaurant.genre.includes(selectedGenre)
      );
      setDisplay(displayRestaurants);
    } else if (selectedState && !selectedGenre) {
      let displayRestaurants = restaurants.filter(
        (restaurant) => restaurant.state === selectedState
      );
      setDisplay(displayRestaurants);
    } else if (!selectedState && !selectedGenre) {
      setDisplay(restaurants);
    }
  };

  let search = (value, e) => {
    e.preventDefault();
    let displayItem = filterCheck
      ? display.filter(
          (item) =>
            item.name.toLowerCase().includes(value) ||
            item.city.toLowerCase().includes(value) ||
            item.genre.toLowerCase().includes(value)
        )
      : restaurants.filter(
          (item) =>
            item.name.toLowerCase().includes(value) ||
            item.city.toLowerCase().includes(value) ||
            item.genre.toLowerCase().includes(value)
        );

    setDisplay(displayItem);
    setCurrentPage(1);
    setPostsPerPage(10);

    formRef.current.reset();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let renderComponents = () => {
    if (!display.length) {
      return <h1>Not result found</h1>;
    } else {
      return (
        <div className="components">
          <RestaurantContainer
            restaurants={display.slice(indexOfFirstPost, indexOfLastPost)}
          />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={restaurants.length}
            paginate={paginate}
          />
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="filter__section">
        <select onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          {listGenres()}
        </select>
        <select onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">All States</option>
          {listStates()}
        </select>
        <button id="filter__button" onClick={filterList}>
          Filter
        </button>
        <br />
        <input
          type="checkbox"
          id="scales"
          name="scales"
          checked={filterCheck}
          onChange={(e) => {
            setFilterCheck(!filterCheck);
          }}
        />
        <label>Filter ON/OFF</label>
        <form action="" ref={formRef}>
          <input
            type="text"
            placeholder="Search.."
            onChange={(e) =>
              setSearchInput(e.target.value.trim().toLowerCase())
            }
          />{" "}
          <button
            onClick={(e) => {
              search(searchInput, e);
            }}
          >
            Search
          </button>
        </form>
      </div>
      {renderComponents()}
    </div>
  );
}

export default App;
