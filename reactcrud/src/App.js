import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.css";
import joi from "joi-browser";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import getData from "./services/getData";
let endpoint = "http://localhost:4000";
class App extends Component {
  state = {
    data: {
      id: "",
      keyword: ""
    },
    posts: [],
    Should_Match: ["LOVELY", "FANTASTIC", "BRIILIANT", "PERFECT", "PERFECTION"],
    Should_not_match: ["BAD", "NOT PERFECT", "RUDE", "ISSUES", "DISAPPOINTED"]
  };
  schema = {
    id: joi.number().required(),
    keyword: joi
      .string()
      .required()
      .max(50)
  };
  async componentDidMount() {
    const { data } = await getData();
    this.setState({ posts: data });
  }

  add = async e => {
    e.preventDefault();

    const valid = joi.validate(this.state.data, this.schema, {
      abortEarly: false
    });
    if (valid.error) {
      console.log(valid);
      const error = valid.error.details[0].message;
      console.log(error);
      toast.error(error);
      return;
    }

    if (
      !this.state.Should_Match.includes(
        this.state.data.keyword.toUpperCase()
      ) ||
      this.state.Should_not_match.includes(
        this.state.data.keyword.toUpperCase()
      )
    ) {
      toast.error(
        "keywords should be like Lovely,Fantastic,briiliant,perfect,perfection"
      );
      return;
    }
    //insert record in db
    try {
      const result = await axios.post(endpoint + "/post", this.state.data);
      console.log("jhjh", result.data);
      if (result.data == "ID Already registered") {
        toast.error("ID Already registered");
        return;
      }
      this.componentDidMount();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("known error occourred", ex);
      } else {
        console.log("unknown error occourred", ex);
      }
    }


  };
  setValues = e => {
    const tempvalue = e.currentTarget.value;
    const tempid = e.currentTarget.id;
    const tempstate = this.state.data;
    tempstate[tempid] = tempvalue;
    this.setState({ data: tempstate });
  };
  clickedForDelete = async e => {
    try {
      console.log("got request for ", e);
      const result = await axios.post(endpoint + "/delete", e);
      this.componentDidMount();
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("known error occourred", ex);
      } else {
        console.log("unknown error occourred", ex);
      }
    }
  };
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <form>
          <div class="container form-control">
            <div class="row">
              <div class="col">
                <input
                  class="form-control"
                  id="id"
                  placeholder="ID"
                  style={{
                    margin: "2px"
                  }}
                  onChange={this.setValues}
                />
              </div>
              <div class="col">
                <input
                  class="form-control"
                  id="keyword"
                  placeholder="keyword"
                  style={{
                    margin: "2px"
                  }}
                  onChange={this.setValues}
                />
              </div>
              <div class="col">
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={this.add}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Keyword</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(p => (
              <tr key={p._id}>
                <th scope="row">{p._id}</th>
                <td>{p.keyword}</td>

                <td>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    onClick={() => this.clickedForDelete(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
