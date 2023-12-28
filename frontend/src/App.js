import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Todos } from "./components/Todos";
import { Footer } from "./components/Footer";
import { AddTodo } from "./components/AddTodo";
// import Nav from "./components/Nav";
// import WelcomePage from "./pages/Homepage";
import { useKeycloak } from "@react-keycloak/web";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus"

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [todos, setTodos] = useState([]);
  const [subscription, setSubscription] = useState(false);
  const [clientSec, setclientSecret] = useState("");

  const addsubscription = () => {
    setSubscription(true);
    const addsub = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/addsub", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          console.log('Added Subscription')
        } else {
          console.error("Data retrivation failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if(keycloak.authenticated) addsub();
  }

  const getclientSecret = () => {

    const cliente = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/pay", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          console.log('Intent Received');
          const data = await response.json();
          console.log(data.clientSecret);
          setclientSecret(data.clientSecret);
        } else {
          console.error("Intenet retrivation failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if(keycloak.authenticated) cliente();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/gettodo", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          console.log("Data retrived successfully");
          const data = await response.json();
          console.log(data);
          let initTodo = data.todo;
          setTodos(initTodo);
          setSubscription(data.subscription);
        } else {
          console.error("Data retrivation failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      //   console.log(keycloak.authenticated);
      //   console.log(keycloak.token);
    };
    if (keycloak.authenticated) fetchData();
    getclientSecret();
  }, []);

  const onDelete = (todo) => {
    console.log("I am ondelete of todo", todo);
    const delData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/deltodo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(todo),
        });

        if (response.ok) {
          console.log("deleted successfully");
          const data = await response.json();
          console.log(data);
        } else {
          console.error("deletion failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      //   console.log(keycloak.authenticated);
      //   console.log(keycloak.token);
    };
    if (keycloak.authenticated) delData();

    setTodos(
      todos.filter((e) => {
        return e !== todo;
      })
    );
    // console.log("deleted", todos)
    // localStorage.setItem("todos", JSON.stringify(todos));
  };

  const addTodo = (title, desc) => {
    console.log("I am adding this todo", title, desc);
    let sno;
    if (todos.length > 0) {
      sno = todos[todos.length - 1].sno + 1;
    } else {
      sno = 0;
    }
    const myTodo = {
      sno: sno,
      title: title,
      desc: desc,
    };

    setTodos([...todos, myTodo]);

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/addtodo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(myTodo),
        });

        if (response.ok) {
          console.log("Form submitted successfully!");
          const data = await response.json();
          console.log(data);
        } else {
          console.error("Form submission failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      //   console.log(keycloak.authenticated);
      //   console.log(keycloak.token);
    };
    if (keycloak.authenticated) fetchData();

    console.log(myTodo);
  };

  return (
    <div>
      {/* <Nav /> */}
      <BrowserRouter>
        <Header
          title="My Todos List"
          searchBar={false}
          subscription={subscription}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddTodo addTodo={addTodo} subscription={subscription} />
                <Todos
                  todos={todos}
                  onDelete={onDelete}
                  subscription={subscription}
                />
              </>
            }
          />
          {!(clientSec === '') && (<Route
            exact
            path="/makepayment"
            element = {<Payment clientSecret = {clientSec}/>}
          />)}
          <Route
            exact
            path="/paymentdone"
            element = {<PaymentStatus addsub = {addsubscription}/>}
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
