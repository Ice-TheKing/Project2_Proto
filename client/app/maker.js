const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoCity").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  
  return false;
};

const handleDeleteClick = (e) => {
  DeleteDomo(e);
};

const DeleteDomo = (e) => {
  let csrfToken = $("#_csrf").val();
  
  // console.dir(e.target.name);
  let currentDomo = {
    name: e.target.name,
    _csrf: csrfToken,
  };
  
  sendAjax('POST', '/deleteDomo', currentDomo, function() {
    loadDomosFromServer();
  });
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
      <label htmlFor="city">Home City: </label>
      <input id="domoCity" type="text" name="city" placeholder="Domo City"/>
      <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
  );
};

const changePassWindow = (props) => {
  //return (
  //  <form id="changePassForm" name="changePassForm"
  //        onSubmit={handleChangePass}
  //        action="/changePass"
  //        method="POST"
  //        className="mainForm"
  //    >
  //    <label htmlFor="newPass">New Password: </label>
  //    <input id="pass" type="password" name="pass" placeholder="password" />
  //    <label htmlFor="pass2">New Password: </label>
  //    <input id="pass2" type="password" name="pass2" placeholder="retype password" />
  //    <input type="hidden" name="_csrf" value={props.csrf} />
  //    <input className="formSubmit" type="submit" value="Change Password" />
  //  </form>      
  //);
};

const handleChangePass = (e) => {
  e.preventDefault();
  
  // will fill in once changePassWindow actually works
  
  return false;
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
        <h3 className="domoCity"> City: {domo.city} </h3>
        <input type="submit" value="Delete Domo" name={domo.name} onClick={handleDeleteClick} />
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoList domos={[]} />, document.querySelector("#domos")
  );
  
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
