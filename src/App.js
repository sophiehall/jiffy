import React, { Component } from "react";
// here we import in our loader spinner image
import loader from "./images/loader.svg";

import clearButton from "./images/close-icon.svg";

import Gif from "./Gif";

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {/* if we have results, show the clear button, otherwise show the title */}
    {hasResults ? (
      <img src={clearButton} onClick={clearSearch} />
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {/* here we check whether we have a loading state and render out either our spinner or hintText based on that, using a ternary operator (if/else) */}
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      hintText: "",
      // we have an array of gifs
      gifs: []
    };
  }

  // We want a function that searches the giphy api using fetch and puts the search term into the query url
  // then we can do something with the results

  // we can also write async methods into our components
  // that let us use the asyn/await style of function
  searchGiphy = async searchTerm => {
    // first we try our fetch
    this.setState({
      // here we set our loading state to be true
      // and this will show the sponner at the bottom
      loading: true
    });
    try {
      // here we use the await keyword to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=E5qJKTcdN9vm5b4lSuwKAuiE9oqPYkRC&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`
      );
      // here we convert our raw response into json data
      // const [data] gets the .data part of our response
      const { data } = await response.json();

      // here we check if the array of results is empty
      // if it is we will throw an error which will stop the
      // code here and handle it in the catch area

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      // here we add a random result from our images
      const randomGif = randomChoice(data);

      console.log(data);
      console.log({ randomGif });

      this.setState((prevState, props) => ({
        ...prevState,
        // here we use our spread to take the previous gifs
        // spread them out, then add our new random gif on to the end
        gifs: [...prevState.gifs, randomGif],
        // we turn off our loading spinner again
        loading: false,
        hintText: `Hit enter to search more ${searchTerm}`
      }));

      // if our fetch fails, we catch it down here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error);
    }
  };

  // with create react app we can write our methods as arrow functions
  // meaning we don't need the constructor and bind
  handleChange = event => {
    const { value } = event.target;
    // by setting the searchTerm in our state and also using that on the input as the value, we have created what is called a controlled iput
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      //  and then we ovcerwrite the ones we want after
      searchTerm: value,
      // we set the hint text only when we have more than 2 characters in our inpout, otherwise we makeit an empty string
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ""
    }));
  };

  handleKeyPress = event => {
    const { value } = event.target;
    // when we have two or more characters in our search box
    // and we have also pressed eneter, we want to run a search
    if (value.length > 2 && event.key === "Enter") {
      // alert(`search for ${value}`);
      // here we call our searchGiphy function using the search term
      this.searchGiphy(value);
    }
  };

  // here we reset our state by clearing everything out and making it default again (like in our original state)
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: "",
      hintText: "",
      gifs: []
    }));
    // here we grab the input and then focus the cursor back into it
    this.textInput.focus();

  };

  render() {
    // const searchTerm - this.state.searchTerm
    const { searchTerm, gifs } = this.state;
    // here we set a variable to see if we have any gifs
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">
          {/* our stack of gig images */}

          {/* Here we loop over our array of gif images from our state
          and we create multiple videos from it */}

          {this.state.gifs.map(gif => (
            // we spread out all of our properties onto our Gif component
            <Gif {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type something..."
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        {/* Here we pass our UserHint all of our state using a spread */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
