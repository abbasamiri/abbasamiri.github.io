---
layout: post
title:  "Entity in Domain Driven Design"
date:   2021-05-27
comments_id : "3"
description: "In Domain Driven Design, Entity is the concept that its individuality is important. An Entity is a unique thing that its state can be changed. These characteristics make Entity an important building block of Domain Driven Design. In this article I will describe the Entity's characteristics and how they can be implemented in C#"
---

![Entity](/assets/images/article-image-8.jpg)

- [Entity](#entity)
  * [Identity](#identity)
    + [Identity creation strategies](#identity-creation-strategies)
      - [1 - Natural Identifier](#1---natural-identifier)
      - [2 - User provided Identity](#2---user-provided-identity)
      - [3 - Application provided Identity](#3---application-provided-identity)
        * [3.1 - Incremental Numeric Counters](#31---incremental-numeric-counters)
        * [3.2 - GUID](#32---guid)
      - [4 - Entity provided Identity](#4---entity-provided-identity)
      - [5 - Database provided Identity](#5---database-provided-identity)
    + [Value object as Identity type](#value-object-as-identity-type)
  * [Entity and Value Object](#entity-and-value-object)
  * [Anemic Domain Model](#anemic-domain-model)
  * [Do not model the real life](#do-not-model-the-real-life)
  * [Entity construction](#entity-construction)
  * [Validation and Invariants with Specifications](#validation-and-invariants-with-specifications)
  * [Entity and Domain Service](#entity-and-domain-service)
  * [Good things to avoid!](#good-things-to-avoid-)
    + [Memento Pattern](#memento-pattern)
    + [State Pattern](#state-pattern)
  * [Side-Effect-Free Behavior](#side-effect-free-behavior)
  * [Entity base class](#entity-base-class)
  * [Summary](#summary)


# Entity

In *Domain Driven Design*, *Entity* is the concept that its **individuality** is important. An *Entity* is a unique thing that its state can be changed. These characteristics make *Entity* an important building block of *Domain Driven Design*. In this article I will describe the *Entity*'s characteristics and how they can be implemented in C#.

## Identity

> An object defined primarily by its identity is called an ENTITY.
>
> --Eric Evans



*Identity* is a vital part of an *Entity*, without *Identity*, the *Entity* does not exist. *Identity* could be anything inside a system that is unique, it could be a number, string or object. For instance, a person is an *Entity* inside the *Social Security Organization*  system in a country, *the Social Security Number* is the person's *Identity*. It is given to a person when he/she is born. A person's state can be changed, they get married, they get old, their physical appearance changes, but their *Identity* does not change. Another example, your *Bank Account* is an *Entity* inside the *Banking* system, it belongs to you, it never changes, your bank account's balance changes from time to time, but your *Account Number* does not change. 

### Identity creation strategies

#### 1 - Natural Identifier

Sometimes the entity itself has a natural identifier like *Social Security Number*, *National Id Number*, and so on. It is an ideal identity which, if it exists, should be used. Sometimes it is necessary that the *Identity* be verified by the organization that issued the *Identity*. In fact, another system provides this kind of *Identity* and using it, may involve the system to communicate with other systems which increases the complexity. 

#### 2 - User provided Identity

Sometimes the user provides the *Identity* and the system should evaluate it to be unique to the entire system. Do you remember your first email registration? you provided your email address and the email system evaluated it to be unique. 

#### 3 - Application provided Identity

Sometimes the application provides the *Identity* like *Incremental Numeric Counters* or *GUID*.

##### 3.1 - Incremental Numeric Counters

*Incremental Numeric Counters* is a global component over the application whose responsibility is to generate a number per request, this number is incremental. In this scenario we should consider that the application would be distributed, so every node of the application generates the number individually which causes the non-unique *Identity* on the whole. To prevent the problem the last number should be saved somewhere safe and all nodes of the application used this number to generate a new one and replace the old number with a new one. It would be a complicated scenario because the component falls into [*race condition*](https://en.wikipedia.org/wiki/Race_condition).

##### 3.2 - GUID

[*GUID*](https://en.wikipedia.org/wiki/Universally_unique_identifier) is an ideal solution for *Application provided Identity*, there is no *race condition* and the uniqueness of the *Identity* is always guaranteed.

#### 4 - Entity provided Identity

Sometimes the *Entity* itself provides the *Identity* by joining attributes that are never changed and the combination is unique. For instance, a location in the globe has *Latitude* and *Longitude* that are never changed and the combination is unique, joining those two attributes can be an ideal *Identity*.

````csharp
public class Location
{
    public Location(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public string Id => $"{Latitude}-{Longitude}";
    public double Latitude { get; }
    public double Longitude { get; }
    ....
}
````



#### 5 - Database provided Identity

Sometimes developers prefer that the database generates the *Identity* for an *Entity*. It mostly happens when an *Entity* inserted into a table and an auto-generated field generates a value that is unique inside the table, it could be easy to implement, but the *Identity* generation postpones to when the *Entity* is persisted. If timing of *Identity* generation matters, this method should be considered carefully. Imagine that you create a new *Entity*, before it persisted, the *Entity* does not exist, you can not do anything with it, for instance, you can not have more than one entity into a collection because they are not distinguishable or you can not use *Domain Events* because the entity has not any *Identity*. These considerations may completely change your domain model's design.

In this method, we should distinguish between *Natural Primary Key* and *Surrogate Primary Key*. A *Natural Primary Key* is a column or set of columns that already exist in the table (e.g. they are attributes of the entity within the data model) and uniquely identify a record in the table. . A *Surrogate Primary Key* is a system generated (could be GUID, sequence, etc.) value with no business meaning that is used to uniquely identify a record in a table. 

For more information about *Natural Primary Key* and *Surrogate Primary Key* take a look at [Surrogate Key vs Natural Key Differences and When to Use in SQL Server](https://www.mssqltips.com/sqlservertip/5431/surrogate-key-vs-natural-key-differences-and-when-to-use-in-sql-server/).



### Value object as Identity type

The nature of [*Value objects*](https://abbasamiri.github.io/2021/03/21/value_object_in_domain_driven_design.html) makes them ideal *Identity*'s type, its Immutability is the most important aspect of *Identity*.

Consider the `Location` *Entity*. We can push the *Identity* type into the `GeoLocation` *Value Object*.

````csharp
public class GeoLocation : ValueObject
{
    public GeoLocation(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public override string ToString() => $"{Latitude}-{Longitude}";
    public double Latitude { get; }
    public double Longitude { get; }
    ...
}
````



````csharp
public class Location : Entity<GeoLocation>
{
    public GeoLocation(GeoLocation id)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public GeoLocation Id => id.ToString();
    public string Country { get; }
    public string Province { get; }
    public string City { get; }
    ....
}
````



## Entity and Value Object

*Entities* have some attributes that hold the entity's state. These attributes should be *descriptive*. An object’s attribute is descriptive if it has a clear and concise definition. For instance, consider the *Entity* below:

````csharp
public class Foo : Entity
{
    public decimal Price {set; get;}
    ...  	
}
````

The `Price` is not descriptive because it is just a number, it does not tell you about its currency, is it USD or Euro or something else? a better definition could be something like this:

```csharp
public class Foo
{
    public Money Price {set; get;}
}
public class Money 
{
    public decimal Price {set; get;}
    public string Currency {set; get;}
}
```

`Money` is a *Value Object* which describes the `Price` type.

Using *Value Objects* in a descriptive way prevents [Primitive Obsession](https://wiki.c2.com/?PrimitiveObsession) code smell (a code smell is a hint that something has gone wrong somewhere in your code). *Primitive Obsession* is using primitive data types to represent domain ideas.

Pushing behavior into *Value Objects* makes an *Entity* focused and more understandable.



## Anemic Domain Model

> The basic symptom of an Anemic Domain Model is that at first blush it looks like the real thing. There are objects, many named after the nouns in the domain space, and these objects are connected with the rich relationships and structure that true domain models have. The catch comes when you look at the behavior, and you realize that there is hardly any behavior on these objects, making them little more than bags of getters and setters. Indeed often these models come with design rules that say that you are not to put any domain logic in the the domain objects. Instead there are a set of service objects which capture all the domain logic, carrying out all the computation and updating the model objects with the results. These services live on top of the domain model and use the domain model for data.
>
> -- [AnemicDomainModel](https://www.martinfowler.com/bliki/AnemicDomainModel.html)



*Entities* suffer from *AnemicDomainModel* if the designer thinks about an *Entity* as a bunch of data. In this way there are no or a few methods inside the object to change the *Entity*'s state. This kind of mindset comes from *Database Design* in which everything is data and an application or a stored procedure is responsible for CRUD operations.

*Object oriented design* needs a different mentality, the designer should think about the behaviors of an object and define attributes to support the behaviors. One method that helps a designer to reach a certain level of this mentality is defining the attribute's setter of an object as `private` then writing methods to change the state based on domain rules. Let's explain the method with code.

````csharp
public class Person : Entity
{
    public string LastName {set;get;}
    public string FirstName {set;get;}
    public Date DateOfBirth {set;get;}
}
````

This class ,obviously, suffers from the *Anemic Domain Model*. If an application wants to change the `LastName`, it should do that by changing the `LastName` directly. The better version would be something like this:

````csharp
public class Person : Entity
{
    public string LastName {get;}
    public string FirstName {get;}
    public Date DateOfBirth {get;}
  
    public Person(string firstName, string lastName, Date dateOfBirth)
    {
        SetLastName(lastName);
        SetFirstName(firstName);
        SetDateOfBirth(dateOfBirth);
    }
  
    public void SetLastName(string lastName) 
    {
        LastName = lastName;
    }
    ... 
}
````

In this way the logic of the `Person` is inside the object and the application does not involve in the details of changing the object's state rules. For the complicated *Entities* that encapsulate business rules, preventing *Anemic Domain Model* results in great improvement in *Domain Model* and increases clarity and maintainability.



## Do not model the real life

Every application has several use-cases and all components in the *Domain Model* are responsible to serve the use-cases. There is always a tendency to model a concept in the *Domain Model* from the general concept of the *Entity*. In most cases  it does not help and pollutes the *Entity* with behaviors that would not be used. We should just consider the behaviors that our use-cases need, For instance, imagine the *Customer* entity in the Banking system.

````csharp
public class Person : Entity
{
    public string Id {get;}
    public string FirstName {get;}
    public string LastName {get;}
    public bool MarriageStatus {get;}
    public Color EyesColor {get;}
    ...
}
````

Of course, every person has the `MarriageStatus` and `EyesColor`, but the Banking system does not need this information, putting these behaviors inside the entity is useless. We should be aware that use-case is king, *Domain Model* should serve the use-cases.

In this way, we should remember the *[You aren't gonna need it](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)* principle.



## Entity construction

Every *Entity* should have a method or methods to initialize an *Entity* with the given data. Normally the Application Layer constructs the *Entity* to serve a use-case. The construction can be implemented with class constructor or [Factory method](https://en.wikipedia.org/wiki/Factory_method_pattern#:~:text=In%20class%2Dbased%20programming%2C%20the,object%20that%20will%20be%20created.)s.

The method you choose to construct an *Entity* has two main responsibilities:

1. Initialize the Entity's state
2. Validating initial values and invariants.

Let's consider the example below:

````csharp
public class Person : Entity<Guid>
{
    public string LastName {get;}
    public string FirstName {get;}
    public Date DateOfBirth {get;}
  
    public Person(Guid id, string firstName, string lastName, Date dateOfBirth)
    {
        Id = id;
        SetLastName(lastName);
        SetFirstName(firstName);
        SetDateOfBirth(dateOfBirth);
    }
  
    public void SetLastName(string lastName) 
    {
        if (string.IsNullOrEmpty) 
	{
	    throw new DomainException("The LastName can not be null or empty.");
        }

        if (string.Lenth > 30) 
	{
            throw new DomainException("The LastName length can not be more than 30 characters.");
        }
      
        LastName = lastName;
    }
    ... 
}
````

As you can see, the `Constructor` initializes the *Entity* and the methods validate the input to put the *Entity* in a valid state.



## Validation and Invariants with Specifications 

The *Specification* pattern could be useful for validation and invariants, it also helps us to put the *Entity*'s behavior out of it.

The *Specification* pattern encapsulates a specific concept, logic or strategy in a single class which increases testability and enhances expressiveness.

Imagine that you have a website that people can register themselves into your website, A person who want to register should have eligible to be accepted into your website, the eligibility is based on some rules, for instance, the person should have a valid  email address and a valid bank account, these two rules can be implemented in to specification class.



````csharp
public class ValidEmailAddressSpecification : ISpecification
{
  
}
````

 

````csharp
public class ValidBankAccountSpecification : ISpecification
{
  
}
````

So, before creating an account for a user these two rules should be passed.

````csharp
public class User 
{
  ...
}
````

````csharp
var validEmailAddressSpecification = new ValidEmailAddressSpecification();
var ValidBankAccountSpecification = new ValidBankAccountSpecification();

if (validEmailAddressSpecification && ValidBankAccountSpecification) {
  // create the user.
} 
else 
{
  // notify the user that he/she is not eligible.
}
````

## Entity and Domain Service

Sometimes there is an operation that involves more than one Entity and you are not sure which Entity owns the operation, it is a sign that we need a *Domain Service*.

Domain Services are stateless domain operations which push the entity's behavior out of it.

Imagine that we have two Entities in a *Domain Model* called `Person` and `Task` and we have an operation that assigns a *Task* to a *Person*. Which Entity owns the Task? It seems to me neither the `Person` nor the `Task` owns the operation and we need a *Domain Service*, Let's call it `PersonTaskOperation`.

```csharp
public interface IPersonTaskOperation
{
    void AssignTaskToPerson(Person person, Task task);
}

```

## Good things to avoid!

Design Patterns are good things, they can resolve the complex problem with best practices, but sometimes we should prevent using them, even if it is applicable in DDD. The question is "Why?".

Design patterns have many boilerplates and they increase the complexity, domain masters are not developers, they may not understand those patterns which makes a great problem. Let's  take a look at some Design patterns  that can be used in a Domain Model, but should not be used.

### Memento Pattern

> Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
>
> -- [Memento](https://www.dofactory.com/net/memento-design-pattern)

This is interesting. This pattern helps us to avoid setters and getters which indirectly avoid *AnemicDomainModel*, but take a look at its class diagram.

![Memento](/assets/images/article-image-9.gif)

What are those things? Originator, Memento, Caretaker, are they business's concepts? Of course not. They pollute our Domain Model. A wise man said "Do not create problems to solve a problem", are we solving a problem and creating other ones? Imagine hundreds of those objects in your Domain Model. We should remember that we are going to **Tackling Complexity in the Heart of Software**, not to increase it.



### State Pattern

> Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.
>
> -- [State](https://www.dofactory.com/net/state-design-pattern)



That is interesting too. State Pattern allows us to control Entity's life cycle. In the lifetime of an Entity, its state changes and the State Pattern helps us to manage it.

Let's take a look at its class diagram.

![state](/assets/images/article-image-10.gif)

Imagine Entity's state with this pattern. Too many boilerplates must be implemented. Like the Memento Pattern, using State Pattern pollutes the Domain Model with objects that Domain masters may not understand.

You may ask me "Are you telling us that *Gang of Four* were wrong?", of course not ,developers should use those patterns in the *infrastructure* which is excellent, but not in the Domain Model.



## Side-Effect-Free Behavior

> A method of an object can be designed as a *Side-Effect-Free Function*.  A *function* is an operation of an object that produces output but without modifying its own state. Since no modification occurs when executing a specific operation, that operation is said to be side-effect free. 
>
> -- [Side-Effect-Free Behavior](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/ch06lev2sec6.html)



Inside an entity, operations can be categorized in Command and Query. Commands are operations that change the internal state of an entity and Queries are operations that do some calculations and return the result without changing the internal state of the entity. Joining these two operations could be problematic in some situations. In this way the concept of Side-Effect-Free comes into DDD.

Consider that you have the Entity below:

````csharp
public class Person : Entity<Guid>
{
  ...

  public void SetSalary(decimal salary) 
  {
      Salary = salary;
  }

  public decimal GetSalary() 
  {
      if (Salary > MaximumSalary) 
      {
          Salary = MaximumSalary
      }
      return Salary;
  }
}
````

a better version could be something like this:

````csharp
public class Person : Entity<Guid>
{
  ...

  public void SetSalary(decimal salary) 
  {
      if (Salary > MaximumSalary) 
      {
          throw new DomainException("The salary is greater than maximum salary.");
      }
      Salary = salary;
  }

  public decimal GetSalary() 
  {
      return Salary;
  }
}
````

## Entity base class

It would be a good idea to inherit Entities from an abstract base class. As you can see in the class below, some common characteristics of Entity are provided which makes a nice uniformity in a Domain Model.

````csharp
public abstract class Entity<TIdentity>
{
    public TIdentity Id { get; protected set; }

    public bool IsTransient()
    {
        return Id.Equals(default(TIdentity));
    }

    protected bool Equals(Entity<TIdentity> other)
    {
        return EqualityComparer<TIdentity>.Default.Equals(Id, other.Id);
    }

    public override int GetHashCode()
    {
        return EqualityComparer<TIdentity>.Default.GetHashCode(Id);
    }

    public static bool operator ==(Entity<TIdentity> left, Entity<TIdentity> right)
    {
        return left?.Equals(right) ?? Equals(right, null);
    }

    public static bool operator !=(Entity<TIdentity> left, Entity<TIdentity> right)
    {
        return !(left == right);
    }
}
````



## Summary

In Domain Driven Design, Entity is one of the important building blocks which should be considered carefully. Understanding the characteristics of Entity can help the designer to design proper Entities inside a Domain Model.

