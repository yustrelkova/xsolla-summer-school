import React from 'react';
import './App.css';
import Select from 'react-select'

const customStyles = {
  container: base => ({
    ...base,
    flex: 2,
    backgroundColor: 'black',
    flexDirection: 'column-reverse'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}


class EventImage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: this.props.title,
      day: this.props.day,
      image: this.props.image
    }
  }
  render(){
    return(
      <div
        class='MainContentImage'
        style={{backgroundImage: "url(" + this.state.image + ")"}}
      >
        <div class='MainContentImageDay'>
        {this.state.day}
        </div>
        
        <div class="MainContentImageEmpty" />

        <div class='MainContentImageTitle'>
        <div class='MainContentImageTitleText'>
          <h1>{this.state.title}</h1>
        </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    const events = require('./events.json')
    events.forEach(elem => {
      const splittedDate = elem.date.split('.')
      elem.month = splittedDate[1]
      elem.day = splittedDate[0]
    })
    const cityOptions = Array.from(
      new Set(events.map(event => event.city))
    ).map(
      city => ({value: city, label: city})
    ).concat([{value: 'All', label: 'All'}])
    const months = [
      'January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September',
      'October', 'November', 'December'
    ]
    const monthsOptions = months.map((month, num) => (
      {value: num + 1, label: month}
    )).concat([{value: 'All', label: 'All'}])
    
    this.filterEvents = this.filterEvents.bind(this)
    this.state = {
      events: events,
      cityOptions: cityOptions,
      monthsOptions: monthsOptions,
      selectedMonth: "All",
      selectedCity: "All",
      eventsToRender: events
    }
  }
  
  filterEvents(selectedCity, selectedMonth){
    console.log(selectedCity, selectedMonth)
    const filtered = this.state.events.filter(event =>
      (selectedCity === "All" || selectedCity === event.city) &&
      (selectedMonth === "All" || selectedMonth === event.month)
    )
    return filtered 
  }
  render(){
    console.log(this.state.eventsToRender)
  return (
    <div className="App">    
        <div class="Main"> 
          <div id="main-title">
            <h1>Event Listing</h1>
          </div>
          <div id="main-choose">
            <p>City</p>
            <Select
              defaultValue={{label: "All", value: "All"}}
              styles={customStyles}
              options={this.state.cityOptions}
              isSearchable={false}
              width={'1px'}
              onChange={option => {
                this.setState({
                eventsToRender: this.filterEvents(option.value, this.state.selectedMonth),
                selectedCity: option.value
                })
                this.forceUpdate();
              }
            }
            />
          <p>Month</p>
          <Select
            defaultValue={{label: "All", value: "All"}}
            styles={customStyles}
            options={this.state.monthsOptions}
            isSearchable={false}
            width={'1px'}
            onChange={option => this.setState({
              eventsToRender: this.filterEvents(this.state.selectedCity, option.value),
              selectedMonth: option.value
            })}
          />
          <div style={{flex: 8}}></div>
          </div>
          <div id="main-content">
            {
              
              this.state.eventsToRender.map(event =>
                <EventImage
                  key={event.id}
                  title={event.name}
                  day={event.day}
                  image={event.image}
                />
              )
              
            }
            
          </div>
        </div>
      </div>
    );
  }
}
export default App;
