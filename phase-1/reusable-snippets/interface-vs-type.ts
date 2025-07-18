/*
In TypeScript, both type and interface can define object 
shapes, but they serve slightly different purposes. 

Interfaces are typically used to define contracts, 
especially when working with classes or when you need 
to extend a type. 

Types, on the other hand, are more flexible and can 
handle complex operations like unions and intersections.
*/


interface User {
    id: number;
    name: string;
  }

  type User_ = {
    id: number;
    name: string;
  }


/* Key Takeaway: Use interface for object shapes 
  and extensibility (e.g., via extends), and type 
  for more complex type manipulations.*/
/*

In TypeScript, unions and intersections are ways to 
combine or work with multiple types. They’re powerful 
tools that help you define more complex or flexible 
data structures.

Unions (|)
A union lets you define a type that can be one of 
several possible types. Think of it as an "or" relationship. 
For example, if you want a variable to be either a string 
or a number, you use the | symbol:

let value: string | number;
value = "hello";  // This is fine
value = 42;       // This is fine too
value = true;     // Error! Boolean isn’t part of the 
// union
Here, value can be a string or a number, but not both
 at the same time. Unions are great when something can 
 take different forms—like a function that accepts either
  a string or a number as an argument.

Intersections (&)
An intersection combines multiple types into one type 
that has all their properties. Think of it as an "and" 
relationship. For example, if you have two interfaces, 
Person and Employee, you can create a type that includes 
everything from both using &:


interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type StaffMember = Person & Employee;

const staff: StaffMember = {
  name: "Alice",      // Required from Person
  employeeId: 1234,   // Required from Employee
};
Here, StaffMember must have both a name (from Person) 
and an employeeId (from Employee). Intersections are 
useful when you need to merge properties from different 
types into one.

Types vs. Interfaces: Why Are Types More Flexible?
In TypeScript, there are two main ways to define custom 
types: types (using the type keyword) and interfaces. 
When I say "types are more flexible and can handle complex 
operations like unions and intersections," I mean that the 
type keyword lets you do things that interface can’t do 
directly.

What Types Can Do
You define a type with the type keyword, and it’s 
super versatile. For example:

Unions: type StringOrNumber = string | number;
Intersections: type PersonAndEmployee = Person & Employee;
Even more advanced stuff, like creating a type based 
on conditions or transforming other types.
Here’s an example of a type using a union:

type Status = "success" | "error" | "loading";
let currentStatus: Status = "success";  // Works
currentStatus = "error";                // Works
currentStatus = "done";                 // Error! 
"done" isn’t in the union
And here’s an intersection with a type:

type NamedWorker = Person & Employee;
Because type can handle unions, intersections, 
and other fancy type tricks, it’s considered more flexible.

What Interfaces Can Do
An interface, on the other hand, is mostly used 
to define the shape of an object—like what properties 
it has. For example:

interface Car {
  brand: string;
  year: number;
}
Interfaces can’t directly define unions 
like string | number. You’d get an error if you tried this:

// Invalid!
interface StringOrNumber = string | number;  // Error
However, interfaces can handle something like intersections
 by extending other interfaces (more on that below). 
 So, while interfaces are great for defining object 
 structures, they’re not as flexible as types for 
 operations like unions.

Interfaces Extending Types and Working with Classes
You also asked about "interface just extends types 
and can be used to add or define more data in the 
class." Let’s clear this up.

Extending with Interfaces
Interfaces can extend other interfaces to add 
more properties. This is similar to an intersection, 
but it’s done with the extends keyword. For example:


interface Animal {
  species: string;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  species: "Canine",       // From Animal
  breed: "Golden Retriever" // From Dog
};
Here, Dog extends Animal, meaning it inherits 
species and adds breed. This is a way to build 
on existing definitions.

One small correction to your question: interfaces 
don’t directly "extend types" in the sense of 
extending a type definition. They extend other 
interfaces. However, a type can include an interface 
in a union or intersection, like this:

type AnimalOrPerson = Animal | Person;
Interfaces and Classes
Interfaces are also super useful with classes. 
You can use an interface to define what a class
 must include by implementing it. For example:


interface Printable {
  print(): void;
}

class Document implements Printable {
  print() {
    console.log("Printing document...");
  }
}
Here, the Printable interface says "any class that 
implements me must have a print method." The Document 
class follows this rule, so it’s valid. This is what I 
think you mean by "define more data in the class"—interfaces
 let you enforce a structure that a class must follow, and 
 you can extend interfaces to add more requirements.

Putting It All Together
Unions (|): Let a value be one of several types 
(e.g., string | number).
Intersections (&): Combine types so a value has all their 
properties (e.g., Person & Employee).
Types: More flexible because they can define unions, 
intersections, and more complex things. Use type for 
these operations.
Interfaces: Great for defining object shapes and 
extending them with extends. They’re also used with 
classes via implements, but they can’t do unions directly.
  */