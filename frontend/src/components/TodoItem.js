import React from "react";

export const TodoItem = ({ todo, key, onDelete, subscription }) => {
  const imgsource = "/logo192.png";
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div className="box">
              <h4>{todo.title}</h4>
              <p>{todo.desc}</p>
            </div>
          </div>
          {!!subscription && (<div className="col-sm-4">
            <div className="box">
              <img
                src={imgsource}
                style={{ width: "200px", height: "200px" }}
                alt="Example"
              />
            </div>
          </div>)}
          <div className="col-sm-4">
            <div className="box">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  onDelete(todo);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
