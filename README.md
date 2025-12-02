# Backend-Youtube
Backend based youtube structure and notes why we need this file and function 
for my feasibility and ease how higher company structure their projects

What is asyncHandler?
asyncHandler is a higher-order function.
A higher-order function is a function that takes another function as an argument and possibly returns a new function.

Why is asyncHandler needed?
In Express.js, if an asynchronous function throws an error, you need to explicitly pass that error to the next function for the Express error-handling middleware to catch it. Without this, your server might crash or not handle the error properly.

Different Variations 

Version 1: The normal function
const asyncHandler = () => {};
This is a simple function 

Version 2: The higher-order function
const asyncHandler = (func) => {
  return () => {};
};
Takes a function (func) as an argument.
Returns a new function.

Version 3: The higher-order async function
const asyncHandler = (func) => {
  return async () => {};
};
Same as above, but the returned function is asynchronous (async).
Used when the inner function (func) involves asynchronous operations.
