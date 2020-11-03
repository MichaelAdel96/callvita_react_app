import './App.css';

import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      initial_title: '',
      initial_description: ''
    };
  }

  componentDidMount() {
    this.getTasks()
  }

  getTasks() {
    axios.get("https://localhost:8080/api/tasks",
      { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
      let data = response.data
      if (data.success)
        this.setState({ tasks: data.data })
      this.state.tasks.forEach(function (element) {
        element.edit = false;
      });
    }, (error) => {
      console.log(error);
    });
  }

  editTask(myTask) {
    axios.put("https://localhost:8080/api/tasks", myTask,
      { headers: { 'Content-Type': 'application/json' }, params: { 'id': myTask.id } }
    ).then((response) => {
      let data = response.data
      if (data.success)
        this.setState({ tasks: data.data })
      this.state.tasks.forEach(function (element) {
        element.edit = false;
      });
    }, (error) => {
      console.log(error);
    });
  }

  edit(id) {
    this.state.tasks.forEach(function (element) {
      element.edit = false;
    });
    let tasks = this.state.tasks
    let myTask = tasks.find((element) => element.id === id)
    myTask.edit = true;
    this.setState({ tasks: tasks, initial_title: myTask.title, initial_description: myTask.description })
  }

  cancel(id) {
    let tasks = this.state.tasks
    let myTask = tasks.find((element) => element.id === id)
    myTask.edit = false;
    this.setState({ tasks: tasks })
  }

  save(id) {
    let tasks = this.state.tasks
    let myTask = tasks.find((element) => element.id === id)
    myTask.edit = false;
    myTask.title = this.state.initial_title;
    myTask.description = this.state.initial_description;
    this.editTask(myTask)
  }

  deleteTask(id) {
    axios.delete("https://localhost:8080/api/tasks",
      { headers: { 'Content-Type': 'application/json' }, params: { 'id': id } }
    ).then((response) => {
      let data = response.data
      if (data.success)
        this.setState({ tasks: data.data })
      this.state.tasks.forEach(function (element) {
        element.edit = false;
      });
    }, (error) => {
      console.log(error);
    });
  }

  editTitle(event, id) {
    this.setState({ initial_title: event.target.value })
  }

  editDescription(event, id) {
    this.setState({ initial_description: event.target.value })
  }

  render() {

    let tasks = []
    for (const [index, value] of this.state.tasks.entries()) {
      if (value.edit) {
        tasks.push(
          <div key={index} id={value.id} className="coloumn">
            <div className="card">
              <div className="field-container">
                <input className="field-input" name="inputTitle" type="text"
                  value={this.state.initial_title} onChange={(e) => this.editTitle(e, value.id)}></input>
                <label className="field-placeholder" htmlFor="inputTitle">Title</label>
              </div>
              <hr />
              <div className="field-container">
                <input className="field-input" name="inputDescription" type="text"
                  value={this.state.initial_description} onChange={(e) => this.editDescription(e, value.id)}></input>
                <label className="field-placeholder" htmlFor="inputDescription">Description</label>
              </div>
              <button onClick={() => this.cancel(value.id)} style={{ backgroundColor: '#f0ad4e' }}>Cancel</button>
              <button onClick={() => this.save(value.id)} style={{ backgroundColor: '#5cb85c' }}>Save</button>
            </div>
            <br></br>
          </div>
        )
      } else {
        tasks.push(
          <div key={index} id={value.id} className="coloumn">
            <div className="card">
              <h2>{value.title}</h2>
              <hr />
              <p>{value.description}</p>
              <button onClick={() => this.edit(value.id)} style={{ backgroundColor: '#292b2c' }}>Edit</button>
              <button onClick={() => this.deleteTask(value.id)} style={{ backgroundColor: '#d9534f' }}>Delete</button>
            </div>
            <br></br>
          </div>
        )
      }
    }

    return (
      <div className="background">
        <h1 className="Header">Task Panel</h1>
        <div className="container">
          <div className="row"></div>
          {tasks}
        </div>
      </div>
    )
  }

}

export default App;