import React from "react";
import RestaurantCard from "./RestaurantCard";
import "../App.css";

export default function RestaurantContainer({ restaurants }) {
  let resturantMapping = () => {
    // restaurants.sort((a,b)=> a.name > b.name ? 1:-1)
    //Sort by name in alphabetical and map function
    return restaurants.map((restaurant) => {
      return <RestaurantCard restaurant={restaurant} key={restaurant.id} />;
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Telephone</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>{resturantMapping()}</tbody>
      </table>
    </div>
  );
}
