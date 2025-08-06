const express = require('express');
// const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// app.use(cors());
const axios = require('axios');

const myJson = "/json-api";
const myTodo = "/todo-";
const myTodos = "/todos-";

var todos = [];

var sortedtodos = [];

const data = [
    {
        id: 1,
        name: 'Usman',
        email: 'usman@gmail.com'
    },
    {
        id: 2,
        name: 'Saleh',
        email: 'saleh@gmail.com'
    },
];

    app.get('/user', (req,res)=>{
    var userId = parseInt(req.query.id);
    console.log(`Value of userId: ${userId} and isNaN: ${isNaN(userId)}`);

    if(userId != null && !isNaN(userId)){
        const userData = data.find(u => u.id == userId);
        if(userData != null){
            res.json({user: userData})
        }else{
            res.status(404).json({message: "User Not Found"})
        }
    }else{
        res.status(401).json({message: "Please provide User Id"});
    }
})

app.get('/get-self-medication', async(req, res)=>{
    const url = "https://apidb.dvago.pk/AppAPIV3/GetSelfMedication"
    try{
      const response = await axios.get(url);
      res.json({
        message: "Received data of medication",
        theftData: response.data.Data
      })
    }catch(err){
      console.log("Error of getting data: ", err);
    }

});

app.get(myJson, (req, res) => {
  res.json(
  {
    message: "Users retrieved successfully",
    myUsers: data
  }
  );
});

app.post(myJson, (req, res) => {
  try {
    const { name, email } = req.body;

    console.log("Response body coming from front end: ", req.body);
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
        error: "Missing required fields"
      });
    }
    
    const newUser = {
      id: data.length + 1,
      name: name,
      email: email
    };
    
    // Add to data array
    data.push(newUser);
    
    res.status(201).json({
      message: "User added successfully",
      newUser: newUser,
      totalUsers: data.length
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error adding user",
      error: error.message
    });
  }
});
app.put(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!name || !email) {
      return res.status(400).json({
        message: "PUT requires all fields (name and email)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }
    
    // Replace the entire user object
    const updatedUser = {
      id: userId,
      name: name,
      email: email
    };
    
    data[userIndex] = updatedUser;
    
    res.json({
      message: "User completely replaced (PUT)",
      updatedUser: updatedUser,
      note: "PUT replaced the entire resource with new data"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

app.patch(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!name && !email) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }
    
    // Get current user data
    const currentUser = data[userIndex];
    
    const updatedUser = {
      ...currentUser,
      ...(name && { name: name }),
      ...(email && { email: email })
    };
    
    data[userIndex] = updatedUser;
    
    return res.json({
      message: "User partially updated (PATCH)",
      updatedUser: updatedUser,
      changes: {
        name: name ? `Changed from "${currentUser.name}" to "${name}"` : "No change",
        email: email ? `Changed from "${currentUser.email}" to "${email}"` : "No change"
      },
      note: "PATCH updated only the provided fields, keeping other fields unchanged"
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

// TO-DO POST API !!!!!!!!!

app.post(`${myTodo}create`,(req,res)=>{
try{
  const {title, description} = req.body;

  if(!title || !description){
    return res.status(400).json({
      message: "Cannot put data both fields are required",
      error: "Required fields cannot be sent empty"
    });
  }

  const newTodo = {
      id:  todos.length + 1,
      title: title,
      description: description
  }

  todos.push(newTodo);

  return res.status(201).json({
    message: "Todo added successfully",
    updatedTodo: todos
  });
  

  
}catch(err){
  return res.status(500).json({
    message: "Cannot add to-do",
    error: err
  });
}
});

// TO-DO PUT API !!!!!!!!!

app.put(`${myTodo}update/:id`,(req,res)=>{
  try{

  const todoId = req.params.id;

  const {title, description} = req.body;
  const index = todos.findIndex(t => t.id == todoId);

  if(index === -1){
   return res.status(400).json({
      message: "Cannot find to-do",
      error: "Wrong id"
    });
  }

  if(!title || !description){
  return  res.status(401).json({
      message: "All fields are required in PUT API",
      error: "Missing required fields"
    });
  }
  
  const updateTodo = {
    id: todoId,
    title: title,
    description: description
  };

  

  todos[index] = updateTodo;

  return res.status(201).json({
    message: "Updated todo successfully",
    updatedTodo: updateTodo
  });

  

  }catch(error){
  return res.status(500).json({
      message: "Cannot update to-do",
      error: error
    });
  }
});

// TO-DO PATCH API !!!!!!!!!

app.patch(`${myTodo}correct/:id`, (req,res)=>{

  try{
  const todoId = req.params.id;
  const {title, description} = req.body;

  const index = todos.findIndex(t => t.id == todoId);

  if(index === -1){
    return res.status(404).json({
      message: "No todo found ",
      error: "Id not correct"
    });
  }

  if(!title && !description){
    return res.status(400).json({
      message: "Patch requires atleast one field for update",
      error: "No data sent for patch"
    });
  }

  const currentTodo = todos[index];

  const updateTodo = {
    ...currentTodo,
    ...(title && {title : title}),
    ...(description && {description : description})
  };

  todos[index] = updateTodo;

  return res.status(201).json({
    message: "To-do patched successfully",
    updatedTodo: updateTodo,
     changes: {
        title: title ? `Changed from "${currentTodo.title}" to "${title}"` : "No change",
        description: description ? `Changed from "${currentTodo.description}" to "${description}"` : "No change"
      },
  });

  }catch(err){
    return res.status(500).json({
      message: "Cannot patch to-do",
      error: err
    });
  }

});

// TO-DO GET-ALL API !!!!!!!!!

app.get(`${myTodo}get-all`, (req,res)=>{
  try{
  return res.status(201).json({
    message: "Here's the whole to-dos data",
    todo: todos
  });
  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error",
      error: err
    })
  }
  
});

// TO-DO GET-ONE OBJECT API !!!!!!!!!

app.get(`${myTodo}get/:id`, (req,res)=>{

  try{
    const todoId = req.params.id;
    const index = todos.findIndex(t=> t.id == todoId);
    if(index === -1){
    return res.status(404).json({
      message: "No todo found ",
      error: "Id not correct"
    });
  }
  return res.status(201).json({
    message: "To-do data which you required",
    todo: todos[index]
  });
  }catch(err){
   return res.status(500).json({
      message: "Internal Server Error",
      error: err
    })
  }
});

// QIST BAZAR APIS !!!!!!!

const qistApi = "https://backend.qistbazaar.pk/api//search-products?keyword=bike&_start=1&_limit=18";
const qistpostApi = "https://backend.qistbazaar.pk/api/user/login";

// QIST BAZAR GET API !!!!!!

app.get('/qist-get-bike', async (req,res)=>{

try{
const response = await axios.get(qistApi);
return res.status(201).json({
  message: "Qist bike data",
  data: response.data.data
});

}catch(error){
  return res.status(500).json({
    message: "Internal Server Error",
    error: error
  })
}

});

// QIST BAZAR POST API !!!!!!

app.post('/qist-post-login', async (req,res)=> {
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(401).json({
        message: "All fields are required",
        error: "Email and password both are required"
      });
    }
    const response = await axios.post(qistpostApi, {
      "email": email,
      "password": password
    });

    console.log("Response body data: ",response.data);

    return res.status(response.status).json({
      note: "Api worked perfectly",
      data: response.data
    });

  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error",
      error: err
    });
  }
})






// TO-DO POST API !!!!!!!!!

app.post(`${myTodos}create`,(req,res)=>{
try{
  const {title, description} = req.body;

  if(!title || !description){
    return res.status(400).json({
      message: "Cannot put data both fields are required",
      error: "Required fields cannot be sent empty"
    });
  }

  const newTodo = {
      id:  sortedtodos.length + 1,
      title: title,
      description: description
  }

  sortedtodos.push(newTodo);

  return res.status(201).json({
    message: "Todo added successfully",
    updatedTodo: sortedtodos
  });
  

  
}catch(err){
  return res.status(500).json({
    message: "Cannot add to-do",
    error: err
  });
}
});

// TO-DO PUT API !!!!!!!!!

app.put(`${myTodos}update/:id`,(req,res)=>{
  try{

  const todoId = req.params.id;

  const {title, description} = req.body;
  const index = sortedtodos.findIndex(t => t.id == todoId);

  if(index === -1){
   return res.status(400).json({
      message: "Cannot find to-do",
      error: "Wrong id"
    });
  }

  if(!title || !description){
  return  res.status(401).json({
      message: "All fields are required in PUT API",
      error: "Missing required fields"
    });
  }
  
  const updateTodo = {
    id: todoId,
    title: title,
    description: description
  };

  

  todos[index] = updateTodo;

  return res.status(201).json({
    message: "Updated todo successfully",
    updatedTodo: updateTodo
  });

  

  }catch(error){
  return res.status(500).json({
      message: "Cannot update to-do",
      error: error
    });
  }
});

// TO-DO PATCH API !!!!!!!!!

app.patch(`${myTodos}correct/:id`, (req,res)=>{

  try{
  const todoId = req.params.id;
  const {title, description} = req.body;

  const index = sortedtodos.findIndex(t => t.id == todoId);

  if(index === -1){
    return res.status(404).json({
      message: "No todo found ",
      error: "Id not correct"
    });
  }

  if(!title && !description){
    return res.status(400).json({
      message: "Patch requires atleast one field for update",
      error: "No data sent for patch"
    });
  }

  const currentTodo = sortedtodos[index];

  const updateTodo = {
    ...currentTodo,
    ...(title && {title : title}),
    ...(description && {description : description})
  };

  todos[index] = updateTodo;

  return res.status(201).json({
    message: "To-do patched successfully",
    updatedTodo: updateTodo,
     changes: {
        title: title ? `Changed from "${currentTodo.title}" to "${title}"` : "No change",
        description: description ? `Changed from "${currentTodo.description}" to "${description}"` : "No change"
      },
  });

  }catch(err){
    return res.status(500).json({
      message: "Cannot patch to-do",
      error: err
    });
  }

});



// TO-DO GET SORTED API USING ID !!!!!!!!!

app.get(`${myTodos}get-sorted-id/:key`, (req,res)=>{
  
  try{
  var key = req.params.key;
    console.log("Value of key: ",key);  
    if(!key){
      return res.status(400).json({
        message: "key is missing",
        note: "Please give asec or desc in url to get data sorted in asecending or descending order",
      });
    }
    
    return res.status(201).json({
    message: "Here's the sorted to-dos data",
    todo: key == "asec" ? sortedtodos.sort((a, b ) => a.id - b.id) : key == "desc" ? sortedtodos.sort((a, b)=> b.id - a.id) : sortedtodos
    });
    

  // return res.status(201).json({
  //   message: "Here's the whole to-dos data",
  //   todo: sortedtodos
  // });

  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error",
      error: err
    })
  }
  
});


// TO-DO GET SORTED API USING ID !!!!!!!!!

app.get(`${myTodos}get-sorted-description/:key`, (req,res)=>{
  
  try{
  var key = req.params.key;
    console.log("Value of key: ",key);  
    if(!key){
      return res.status(400).json({
        message: "key is missing",
        note: "Please give asec or desc in url to get data sorted in asecending or descending order",
      });
    }
    
    return res.status(201).json({
    message: "Here's the sorted to-dos data",
    todo: key == "asec" ? sortedtodos.sort((a, b ) => a.description.localeCompare(b.description)) : key == "desc" ? sortedtodos.sort((a, b)=> b.description.localeCompare(a.description)) : sortedtodos
    });
    

  // return res.status(201).json({
  //   message: "Here's the whole to-dos data",
  //   todo: sortedtodos
  // });

  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error",
      error: err
    })
  }
  
});


// TO-DO GET SEARCHING API USING DESCRIPTION !!!!!!!!!

app.get(`${myTodos}get-search-description`, (req, res) => {
  try {
    const key = req.body.description;
    console.log("Search keyword:", key);

    if (!key) {
      return res.status(400).json({
        message: "Search keyword is missing",
        note: "Please provide a description field in the JSON body",
      });
    }

    const results = sortedtodos.filter(todo =>
      todo.description.toLowerCase().includes(key.toLowerCase())
    );

    console.log("Results found: ", results);

    return res.status(200).json({
      message: `Found ${results.length} matching to-do(s)`,
      results,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
});



// TO-DO GET-ONE OBJECT API !!!!!!!!!

app.get(`${myTodos}get/:id`, (req,res)=>{

  try{
    const todoId = req.params.id;
    const index = sortedtodos.findIndex(t=> t.id == todoId);
    if(index === -1){
    return res.status(404).json({
      message: "No todo found ",
      error: "Id not correct"
    });
  }
  return res.status(201).json({
    message: "To-do data which you required",
    todo: sortedtodos[index]
  });
  }catch(err){
   return res.status(500).json({
      message: "Internal Server Error",
      error: err
    })
  }
});


app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}`);
});

module.exports = app;



// POST APIS OF QIST BAZAAR
// https://backend.qistbazaar.pk/api/user/signup

// email
// : 
// "salehmalik140@gmail.com"
// fullname
// : 
// "Saleh Awan"
// password
// : 
// "vsvLnBq2*.Vnp44"
// phoneNo
// : 
// "03305079162"


// https://backend.qistbazaar.pk/api/user/login
// email
// : 

// password
// : 


// GET
// https://backend.qistbazaar.pk/api//search-products?keyword=bike&_start=1&_limit=18


