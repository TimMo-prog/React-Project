
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Dropdown, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './page.css';


var isStaff = false;
var isMember = false;
var user_name = '';

export default function App() {
  return (
    <Router>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <Link class="nav-link" to="/" >Authorization</Link>
            </li>
            <li class="nav-item active">
              <Link class="nav-link" to="/courses">Course List</Link>
            </li>
            <li class="nav-item active">
              <Link class="nav-link" to="/addCourse">Add Course</Link>
            </li>
            <li class="nav-item active">
              <Link class="nav-link" to="/registerCourse">Register Course</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact path="/">
              <Authorization />
            </Route>
            <Route path="/courses">
              <Courses />
            </Route>
            <Route path="/addCourse">
              <AddCourse />
            </Route>
            <Route path="/registerCourse">
              <RegisterCourse />
            </Route>
          </Switch>
        </div>
      </nav>
    </Router>

  );
}

//Authorization page
const Authorization = () => {
  const [showLoginForm, setLoginForm] = React.useState(true)
  const [correctPassword, setCorrectPassword] = React.useState(true)
  const logOut = () => {
    setLoginForm(true)
    isStaff = false;
    isMember = false;
    user_name = '';
  }

  const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function usernameChangeHandler(e) {
      setUsername(e.target.value);
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value);
    }

    function MySubmitHandler(e) {
      e.preventDefault();
      const data = { username: username, password: password };

      fetch('ClubManagement/restAccessControl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data[0].message);
          if (data[0].message === 'Staff' || data[0].message === 'Member') {
            setLoginForm(false);
            setCorrectPassword(true);
            if (data[0].message === 'Staff') {
              isStaff = true;
              user_name = username;
            }
            if (data[0].message === 'Member') {
              isMember = true;
              user_name = username;
            }
          } else {
            alert("Wrong Password");
            setCorrectPassword(false);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    return (
      <div id="results" className="search-results">
        <form onSubmit={MySubmitHandler}>
          <h4>Login</h4>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Username: </label>
            <input
              type='text'
              class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
              onChange={usernameChangeHandler}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password: </label>
            <input
              type='password'
              class="form-control" id="exampleInputPassword1"
              onChange={passwordChangeHandler}
            /></div>
          <div class="d-grid gap-2 col-12 mx-auto">
            <button type="submit" class="btn btn-primary">Log in</button>
          </div>
        </form>
      </div>
    )
  }

  const LoginAs = () => {
    return (
      <p id='loginas'>
        You are logged in
      </p>
    )
  }

  const WrongPassword = () => {
    return (
      <div>
        Username and password combination is not valid
      </div>
    )
  }


  const LogoutButton = () => {
    return (
      <div class="d-grid gap-2 col-12 mx-auto">
        <button type="button" class="btn btn-primary" onClick={logOut} >Log out</button>
      </div>
    )
  }

  return (
    <div class="center">
      <div>
        <h2>Club Member Management</h2>
        {correctPassword ? null : <WrongPassword />}
        {showLoginForm ? <LoginForm /> : null}
        {showLoginForm ? null : <LoginAs />}
        {showLoginForm ? null : <LogoutButton />}
      </div>
    </div>
  )
}




//Add course page
const AddCourse = () => {
  const AddCourseForm = () => {
    const [course_name, setcourseName] = useState('')
    const [start_time, setStartTime] = useState(new Date())
    function courseNameChangeHandler(e) {
      setcourseName(e.target.value);
    }

    function MySubmitHandler(e) {
      e.preventDefault();
      const data = { course_name: course_name, year: start_time.getFullYear(), month: start_time.getMonth(), day: start_time.getDay(), hours: start_time.getHours(), minutes: start_time.getMinutes() };
      console.log("data", data);
      fetch('ClubManagement/addCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          if (data[0].message === 'ok') {
          } else {
            console.log("Wrong");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    return (
      <div>

        <form onSubmit={MySubmitHandler}>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Course Name: </label>
            <input
              type='text'
              class="form-control"
              onChange={courseNameChangeHandler}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Course Time: </label>
            <br />
            <DatePicker class="form-control" id="exampleInputPassword1" selected={start_time} onChange={date => setStartTime(date)} showTimeSelect dateFormat="Pp" />
          </div>

          <div class="d-grid gap-2 col-12 mx-auto">
            <button type="submit" class="btn btn-primary">Add Course</button>
          </div>
        </form>
      </div>
    )
  }

  const NotStaff = () => {
    console.log(isStaff)
    return (
      <div class="alert alert-danger" role="alert">
        You are not staff!
      </div>
    )
  }

  return (
    <div class="center">
      <div>
        <h2>Add Course</h2>
        {isStaff ? <AddCourseForm /> : <NotStaff />}
      </div>
    </div>
  )
}






//Register course page
const RegisterCourse = () => {


  const RegisteringCourseForm = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [course, setCourse] = useState('');
    const [chooseACourse, setChooseACourse] = useState(false);

    //Reference: https://react-bootstrap.github.io/components/dropdowns/
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      &#x25bc;
      </a>
    ));

    //Reference: https://react-bootstrap.github.io/components/dropdowns/
    const CustomMenu = React.forwardRef(
      ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <FormControl
              autoFocus
              className="mx-3 my-2 w-auto"
              placeholder="Type to filter..."
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <ul className="list-unstyled">
              {React.Children.toArray(children).filter(
                (child) =>
                  !value || child.props.children.toLowerCase().startsWith(value) || child.props.children.startsWith(value),
              )}
            </ul>
          </div>
        );
      },
    );

    function handleChange(name, e) {
      e.preventDefault();
      setCourse(name);
      setChooseACourse(true);
    }

    function handleSubmit(e) {
      e.preventDefault();
      const data = { member_name: user_name, course_name: course };
      console.log("data", data);
      fetch('ClubManagement/registerCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // var message = JSON.stringify(data);
          // console.log('message:', message);
          // console.log('data[0].message:', data[0].message);
          if (data[0].message === 'ok') {
            console.log("Regitered");
            alert('You registered ' + course + ' course!');

          } else if (data[0].message === 'not member') {
            alert('You are not member!');
          } else {
            console.log("Wrong");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }

    useEffect(() => {
      const fetch = require('node-fetch');
      const fetchAbsolute = require('fetch-absolute');
      const fetchApi = fetchAbsolute(fetch)('http://localhost:3000', { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      fetchApi('/ClubManagement/getAllCourses').then(response => response.json())
        .then((result) => {
          console.log('Hey!');
          setIsLoaded(true);
          setItems(result);
        },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              Select a course
        </Dropdown.Toggle>
            <Dropdown.Menu as={CustomMenu} >
              {items.map(item => (
                <Dropdown.Item eventKey={item.name} onClick={(e) => handleChange(item.name, e)}>{item.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          { chooseACourse ? <h4>You choose {course}</h4> : null}
          <div class="d-grid gap-2 col-12 mx-auto">
            <button type="submit" value="Submit" class="btn btn-primary" >Submit</button>
          </div>
        </form>
      );
    }
  }

  const NotMember = () => {
    return (
      <div class="alert alert-danger" role="alert">
        You are not member!
      </div>
    )
  }

  return (
    <div class='center'>
      <h2>Register Course (Members Only)</h2>
      { isMember ? <RegisteringCourseForm /> : <NotMember />}
    </div>
  );
}



//Course list page
const Courses = () => {


  const NotLogin = () => {
    return (
      <div class="alert alert-danger" role="alert">
        Please login!
      </div>
    )
  }

  return (
    <div class='center'>
      <h2>Course List</h2>
      {(isStaff || isMember) ? <AllCourses /> : <NotLogin />}
    </div>
  );
}


const AllCourses = () => {
  const [alltheCourses, setalltheCourses] = useState(false)

  const CourseButton = () => {
    if (alltheCourses === false) {
      setalltheCourses(true)
    } else {
      setalltheCourses(false)
    }
  }

  const ShowCourses = () => {
    return (
      <div class="d-grid gap-2 col-12 mx-auto">
        <button type="button" class="btn btn-primary" onClick={CourseButton} >Show all the courses</button>
      </div>
    )
  }

  const HideCourses = () => {
    return (
      <div class="d-grid gap-2 col-12 mx-auto">
        <button type="button" class="btn btn-primary" onClick={CourseButton} >Hide all the courses</button>
      </div>
    )
  }

  return (
    <div>
      { alltheCourses ? <HideCourses /> : <ShowCourses />}
      { alltheCourses ? <CourseList /> : null}
    </div>
  );
}


const CourseList = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = require('node-fetch');
    const fetchAbsolute = require('fetch-absolute');
    const fetchApi = fetchAbsolute(fetch)('http://localhost:3000', { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    fetchApi('/ClubManagement/getAllCourses').then(response => response.json())
      .then((result) => {
        console.log('Hey!');
        setIsLoaded(true);
        setItems(result);
      },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div class="list-group">
        <ul id='course-list'>
          {items.map(item => (
            <li key={item.id} class="list-group-item list-group-item-action list-group-item-light">
              <Link to={`/courses/${item.id}`}>{item.name}</Link>
            </li>
          ))}
          <Switch>
            <Route path={`/courses/:courseId`}>
              <CourseDetail />
            </Route>
          </Switch>
        </ul>
      </div>

    );
  }
}

const CourseDetail = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  let { courseId } = useParams();


  useEffect(() => {
    const fetch = require('node-fetch');
    const fetchAbsolute = require('fetch-absolute');
    console.log("topicId", courseId);
    const fetchApi = fetchAbsolute(fetch)('http://localhost:3000', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    console.log(`/ClubManagement/getDetailOfACourse/${courseId}`);
    fetchApi(`/ClubManagement/getDetailOfACourse/${courseId}`).then(response => response.json())
      .then((result) => {
        setIsLoaded(true);
        setItems(result);
      },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  })

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>Course time: {items.time}</div>
    );
  }
}



