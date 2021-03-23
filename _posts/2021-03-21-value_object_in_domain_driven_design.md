---
layout: post
title:  "Value Object in Domain Driven Design"
date:   2021-03-21
comments_id : "2"
description: "Value object is one of the Domain Driven Design's building blocks which makes the design more clean and understandable. Value objects declare entity's properties expressive, explicit and descriptive with strong encapsulation. These characteristics make them pain free and easy to use a building block of DDD.  In this article I will describe these characteristics and how to implement value objects in C#"
---
![value-object-image-1](/assets/images/article-image-6.jpg)
- [Value Objects](#value-objects)
  - [Characteristics](#characteristics)
    - [Descriptive](#descriptive)
    - [Conceptual Whole](#conceptual-whole)
    - [Immutability](#immutability)
    - [Replaceability](#replaceability)
    - [Identity-Less](#identity-less)
    - [Attribute‐Based Equality](#attributebased-equality)
    - [Behavior‐Rich](#behaviorrich)
    - [Combinable](#combinable)
    - [Self‐Validating](#selfvalidating)
  - [Implementation](#implementation)
    - [Method One](#method-one)
    - [Method Two](#method-two)
  - [Persistence](#persistence)
    - [NoSQL](#nosql)
    - [SQL](#sql)
  - [Summary](#summary)

# Value Objects



> Many objects have no conceptual identity. These objects describe some characteristic of a thing.

>-- Eric Evans, Domain-Driven Design



*Value object* is one of the *Domain Driven Design*'s building blocks which makes the design more clean and understandable. *Value objects* declare entity's properties expressive, explicit and descriptive with strong encapsulation. These characteristics make them pain free and easy to use a building block of *DDD*.  In this article I will describe these characteristics and how to implement *value objects* in C#.



## Characteristics

### Descriptive

An *value object* is a descriptive attribute that describes an entity's state. An object's attribute is descriptive if it has a clear and concise definition. For instance, consider the following class:

````csharp
public class Foo
{
    public decimal Price {set; get;}
}
````
The `Price` is not descriptive because it is just a number, it does not tell you about its currency, is it USD or Euro or something else? a better definition could be something like this:

````csharp
public class Foo
{
    public Money Price {set; get;}
}
````

````csharp
public class Money 
{
    public decimal Price {set; get;}
    public string Currency {set; get;}
}
````

`Money` is a *value object* which describes the `Price` type.

Using *value objects* in a descriptive way prevents [Primitive Obsession](https://wiki.c2.com/?PrimitiveObsession) code smell (a code smell is a hint that something has gone wrong somewhere in your code). Primitive Obsession is using primitive data types to represent domain ideas.

Consider the `System.Drawing.Point` and `System.Drawing.Size` in .Net Framework, those types make an attribute in a class, descriptive.

It could be helpful to understand *value objects* in a way that they normally **measure** or **quantify** something. For instance `Age` could be a *value object*. 

### Conceptual Whole

Every attribute in a *value object* is related to others, all attributes together describe the concept that the *value object* represents and provides a cohesive meaning.

*Conceptual Whole* is not just a way for grouping attributes together, the attributes completes each other. For instance, a person's name consists of three attributes: `FirstName`, `LastName` and `MiddleName`, one without others is incomplete and does not represent a person's name.  

[Whole Value Pattern](https://sundin.github.io/patterns/2018/10/04/whole-value-pattern.html)


````csharp
public class PersonName {
    public string FirstName {get; set;}
    public string MiddleName {get; set;}
    public string LastName {get; set;}
    ...
}
````
### Immutability

> In object-oriented and functional programming, an immutable object (unchangeable object) is an object whose state cannot be modified after it is created.
> 
> -- [Wikipedia](https://en.wikipedia.org/wiki/Immutable_object) 

*Immutability* is a powerful aspect of programming languages. *Value object* takes benefit of the aspect to prevent client code to put the *value object* in a invalid state.

*Immutability* forces the *Value object* to have several aspects:

1. *Value objects* do not have any method that changes its state.
2. *Value objects* can not be extended.
3. All fields must be marked read-only.
4. *Value object* have constructor(s) or factory method(s) that initiate the object with its values.

````csharp
public sealed class PersonName
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    public PersonName(string firstName, string middleName, string lastName)
    {
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }
    ...
}
````

````csharp
public sealed class PersonName
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    private PersonName(string firstName, string middleName, string lastName)
    {
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    public static PersonName Create(string firstName, string middleName, string lastName)
    {
        return new PersonName(firstName, middleName, lastName);
    }
}
````

### Replaceability
*Value objects* are immutable, if an entity has a attribute with a type of *value object* and the entity's state changed, based on the attribute, the whole attribute's value must be replaced with a new one. 


### Identity-Less

*Value objects* tell us something about other things. How much *Money* a *Person* has. What is *Position* of a *Car* on a road. *Person* and *Car* have identity, but *Money* and *Position* do not need one, it is the reason that *value objects* are identity-less.   

### Attribute‐Based Equality

*Value objects* are Identity-less, so how do we know that two *value objects* are equal or not?

The answer is, two *value object* are equal if they have the same value.
For instance, two `Money` are equal if they have the same `Amount` and `Currency` or two `PersonName` are equal if they have the same `LastName`  and `MiddleName` and `FirstName`.

````csharp
public sealed class PersonName : IEquatable<PersonName>
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    public PersonName(string firstName, string middleName, string lastName)
    {
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    public bool Equals(PersonName other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return FirstName == other.FirstName && MiddleName == other.MiddleName && LastName == other.LastName;
    }

    public override bool Equals(object obj)
    {
        return ReferenceEquals(this, obj) || obj is PersonName other && Equals(other);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(FirstName, MiddleName, LastName);
    }
}
````
### Behavior‐Rich
*Value objects* should have all methods that are related to its own data. This makes a *value object* behavior-rich and prevents one of the code smells that is called [Feature Envy](https://wiki.c2.com/?FeatureEnvySmell)  (A method accesses the data of another object more than its own data).

For instance, consider the below entity:

````csharp
public class Employee
{
    public PersonName Name { get; set; }

    public string GetFullName()
    {
        return $"{Name.FirstName} {Name.MiddleName} {Name.LastName}";
    }
    ...
}
````

`GetFullName` is *Feature Envy* code smell. It would be better to move the method inside the `PersonName` class.

````csharp
public class PersonName {
    public string FirstName {get; private set;}
    public string MiddleName {get; private set;}
    public string LastName {get; private set;}
    
    public PersonName(string firstName, string middleName, string lastName)
    {
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }
    
    public string getFullName() 
    {
        return $"{FirstName} {MiddleName} {LastName}";
    } 
}
````
### Combinable

In the case that *value object* represents combinable values like numerals or dates, the *value object* should have methods to create new value.

`System.DateTime` is a perfect example of a combinable object in .Net Framework.

```csharp
// Returns the DateTime resulting from adding the given TimeSpan to this DateTime.
public DateTime Add(TimeSpan value);

// Returns the DateTime resulting from adding a fractional number of days to this DateTime.
public DateTime AddDays(double value);

// Returns the DateTime resulting from adding a fractional number of hours to this DateTime.
public DateTime AddHours(double value)
....
```

### Self‐Validating

*Value objects* are instantiated by its constructor(s) or its Factory method(s). These methods are responsible for validating value to prevent *value object* goes into invalid state.

````csharp
public sealed class PersonName
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    public PersonName(string firstName, string middleName, string lastName)
    {
        if (string.IsNullOrEmpty(firstName))
            throw new ArgumentException($"The first name can not be null or empty.");

        if (string.IsNullOrEmpty(middleName))
            throw new ArgumentException($"The middle name can not be null or empty.");

        if (string.IsNullOrEmpty(lastName))
            throw new ArgumentException($"The last name can not be null or empty.");

        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }
    ...
}
````
## Implementation



*Value objects* can be implemented in several ways:

### Method One 

This is a simple and straight method of implementing a *value object*. The most important aspect of this method is:

1. The class should be  `sealed`.
2. Value properties should have no setters.
3. The constructor is responsible for initiating values.
4. The constructor is responsible for validating values.
5. The `Equals` should be overridden.
6. The `GetHashCode` should be overridden.
7. The `ToString` should be overridden.
8. Providing `==` and `!=`  operators make the class more functional.

````csharp
public sealed class PersonName
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    public PersonName(string firstName, string middleName, string lastName)
    {
        if (string.IsNullOrEmpty(firstName))
            throw new ArgumentException($"The first name can not be null or empty.");

        if (string.IsNullOrEmpty(middleName))
            throw new ArgumentException($"The middle name can not be null or empty.");

        if (string.IsNullOrEmpty(lastName))
            throw new ArgumentException($"The last name can not be null or empty.");

        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    public override bool Equals(object? obj)
    {
        if (obj == null || obj.GetType() != GetType())
        {
            return false;
        }
        
        return FirstName == ((PersonName) obj).FirstName &&
            MiddleName == ((PersonName) obj).MiddleName &&
            LastName == ((PersonName) obj).LastName;
    }

    public override int GetHashCode() => HashCode.Combine(FirstName, MiddleName, LastName);

    public override string ToString() => $"{FirstName} {MiddleName} {LastName}";

    public string ToString(string format)
    {
        if (string.IsNullOrEmpty(format)) format = "FML";
            return format.ToUpperInvariant() switch
            {
                "FML" => $"{FirstName} {MiddleName} {LastName}",
                "FL" => $"{FirstName} {LastName}",
                "LF" => $"{LastName} {FirstName}",
                _ => throw new FormatException($"The {format} format string is not supported.")
            };
    }

    public static bool operator ==(PersonName left, PersonName right) => left?.Equals(right) ?? false;

    public static bool operator !=(PersonName left, PersonName right) => !(left == right);

    public static PersonName Create(string firstName, string middleName, string lastName) =>
        new PersonName(firstName, middleName, lastName);
}
````
### Method Two

This method is based on an `abstract` class that provides basic functionality of *value objects*.

For more information about the method, take a look at [Implement value objects](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects).

````csharp
public abstract class ValueObject
{
    protected abstract IEnumerable<object> GetEqualityComponents();

    public override bool Equals(object? obj)
    {
        if (obj == null || obj.GetType() != GetType())
        {
            return false;
        }

        var other = (ValueObject) obj;

        return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    }

    public abstract override string ToString();

    public override int GetHashCode()
    {
        return GetEqualityComponents()
            .Select(x => x != null ? x.GetHashCode() : 0)
            .Aggregate((x, y) => x ^ y);
    }

    public static bool operator ==(ValueObject left, ValueObject right) => left?.Equals(right) ?? false;

    public static bool operator !=(ValueObject left, ValueObject right)
    {
        return !(left == right);
    }
}
````

````csharp
public class PersonName : ValueObject
{
    public string FirstName { get; }
    public string MiddleName { get; }
    public string LastName { get; }

    public PersonName(string firstName, string middleName, string lastName)
    {
        if (string.IsNullOrEmpty(firstName))
            throw new ArgumentException($"The first name can not be null or empty.");

        if (string.IsNullOrEmpty(middleName))
            throw new ArgumentException($"The middle name can not be null or empty.");

        if (string.IsNullOrEmpty(lastName))
            throw new ArgumentException($"The last name can not be null or empty.");

        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return FirstName;
        yield return MiddleName;
        yield return LastName;
    }

    public override string ToString() => $"{FirstName} {MiddleName} {LastName}";

    public string ToString(string format)
    {
        if (string.IsNullOrEmpty(format)) format = "FML";
        return format.ToUpperInvariant() switch
        {
            "FML" => $"{FirstName} {MiddleName} {LastName}",
            "FL" => $"{FirstName} {LastName}",
            "LF" => $"{LastName} {FirstName}",
            _ => throw new FormatException($"The {format} format string is not supported.")
        };
    }
}
````

## Persistence

### NoSQL

Object oriented structures can be easily serialized in NoSQL databases. DDD entities can be modeled as a *document* which most NoSQL databases can understand. *Value objects* can be part of the entity's document. There is no need of Joining-tables, Foreign keys, and so on.

````csharp
public class Employee
{
    public Guid Id {set; private get;}
    public PersonName Name {set; private get;}
    public ReadOnlyCollection<Address> Address {set; private get;}
    ...
}
````

````csharp
public class PersonName {
    public string FirstName {get; private set;}
    public string MiddleName {get; private set;}
    public string LastName {get; private set;}
    ...
}
````

````csharp
public class PersonAddress {
    public string Country {get; private set;}
    public string State {get; private set;}
    public string City {get; private set;}
    public string Address {get; private set;}
    ...
}
````

````json
"Employee": {
    "Id": "...",
    "Name" : {
        "FirstName": "...",
        "MiddleName": "...",
        "LastName": "..."
    },
    "Addresses":[
        {
            "Country": "...",
            "State": "...",
            "City": "...",
            "Address": "..."
        },
        {
            "Country": "...",
            "State": "...",
            "City": "...",
            "Address": "..."
        }
    ]
}
````

### SQL

Object oriented design and database design need different mindsets, principles and strategies. As a database designer, an object is a bunch of data with relations, primary keys, foreign keys, indexes, etc. An object oriented designer considers behavior of an object. Thus, two areas of designs should not be mixed. We should not change our object oriented design for the sake  of database design and vice versa. This separation of concerns will make our design highly flexible and maintainable.

In this way, *value object's* properties are part of ab entity's properties. On one hand, if an entity has one instance of a *value object*, it can be persisted in the entity's table. On the other hand, if an entity has  multiple instances of a *value object*, it can be persisted in a different table with relation to the entity's table.



![value-object-image-2](/assets/images/article-image-7.png)

## Summary

*Value object* is a powerful concept in DDD which makes the domain model expressiveness, clean and more understandable.  *Value objects* have some characteristics which help the designer/developer to detect and implement them easier.  Persistent mechanism of *value object* in SQL or NoSQL data sources are straight and simple. All of these behaviors make the *value object* an important building block of DDD.