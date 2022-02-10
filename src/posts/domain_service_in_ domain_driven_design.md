---
tags: post
layout: layouts/post.njk
title:  "Domain Service in Domain Driven Design"
permalink: "posts/domain-service-in-domain-driven-design/"
date:   2022-01-04
comments_id : "4"
description: "Domain Service is a concept in Domain Model that fulfills a domain-specific task. Domain Service is stateless and normally act like a orchestration component for entities or encapsulate business policies."
---

![Photo by <a href="https://unsplash.com/@mwaldy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maryline Waldy</a> on <a href="https://unsplash.com/@mwaldy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>](/assets/images/article-image-26.jpg)

Domain Service is a concept in Domain Model that fulfills a domain-specific task. Domain Service is stateless and normally act like a orchestration component for entities or encapsulate business policies. In this article I will describe Domain Service and how they can be implemented in C#.

## Concept

> Sometimes, it just isn’t a thing .
>
> -- Eric Evans

Sometimes there is an operation in the Domain Model that does not have any place to go. You can not conceptually find an Entity or a Value Object that the operation belongs to it. In this situation we need to build a place for the operation. This place is called Domain Service. 

Imagine that you have two Entities; User and Task and an operation: Assign a Task to a User. Where the operation goes?

The first choice maybe putting the operation inside to one of those entities. As Eric Evans mentioned in his book: It is a common mistake because you gradually slipping toward procedural programming and the object loses its conceptual clarity and becomes hard to understand or refactor.

Th second choice maybe putting the operation into an application service as a use-case. It is an another mistake because the business leaks into the application layer.

The last choice is creating an object named `AssignmentService` and put the operation inside it which is a correct choice in DDD context.

THe object is responsible to apply all operation related to the User and assignment.

````csharp 
class AssignmentService {
    public void AddAssignmentToUser(User user, Assignment assignment) {}
    public IEnumerable<Assignment> GetUserAssignments(User user) {}
    public void RemoveUserAssignment(User user, Assignment assignment) {}
    public User WhatUserHasAssignment(Assignment assignment) {}
}
````

As you can see the object operations', do something in infrastructure like saving data to the database or quering the database; so, it is an infrastructural component and should be an `interface` that the infrastructure implements it. In fact, Domain Services are always exposed as an interface to expose a set of cohesive operations in the form of a contract. 

````csharp 
interface IAssignmentService {
    void AddAssignmentToUser(User user, Assignment assignment);
    IEnumerable<Assignment> GetUserAssignments(User user);
    void RemoveUserAssignment(User user, Assignment assignment);
    User WhatUserHasAssignment(Assignment assignment);
}
````

The benefit of Domain Service is to decouple the user from assignment and keep the bussiness inside the Domain Model.


## Chracteristics
Domain Service has three chracteristics.

>A good SERVICE has three characteristics.
>    1. The operation relates to a domain concept that is not a natural
>part of an ENTITY or VALUE OBJECT.
>    1. The interface is defined in terms of other elements of the domain
>model.
>    1. The operation is stateless.
> 
> -- Eric Evans

Let's go through these characteristics. 

The first one describes Domain Service as not natural part of an Entity or Value Object; so, what is natural part? It depends on how you see a Entity or Value Object in a Domain Model. They represent concepts in the business which have conceptual bounderies. Imagine a talk between you and domain experts. You asked them to describe a User. They replied that "A User is an individual in the system that may have assignments". The "may have" is important in the context that asignments are not a natural part of a user.


The second one describes Domain Service as an interface that other elements in the Domain Model need; in this way a Domain Service acts as a coordinator that bring the different elements into a harmonious or efficient relationship.

The third one describes Domain Service as a stateless object. A stateless object does not hold any data. It just consisits of couple of methods.

## Source of confusion
The term *Service* has different meaning in the different contexts. 

In the Service Oriented Architecture (SOA), service is a component that enables clients to interact with a complex business system.

Application Service is a component that uses Domain Model to accomplish a specific task. Sometimes it is difficult to distinguish between Application and Domain Services. The key point is that application service should not involve in the business rules. Let's consider the example that Eric Evans has mentioned in his book. 

>A bank might have an application that sends an e-mail to a customer when an account balance falls below a specific threshold. The interface that encapsulates the e-mail system, and perhaps alternate means of notification, is a SERVICE in the infrastructure layer.

In the example, the Application Service is responsible for ordering the notification and The Domain Service is responsible to determine if the account balance falls below a specific threshold or not. As you can see the Application Service does not involve in the business.


## Domain service as a contract  
Sometimes a concept in Domain Model can not be implemented purely in Domain Model; it needs some infrastructural capabilities. In other words, the concept is a infrastructural component. Domain Service act like contract between Domain Model and infrastructure. For instance, assigning a task to a user needs database to do its job. Inthis way the `IAssignmentService` acts like a contract.


## Domain Service and Anemic Domain Model
Pushing too much logic into a Domain Service leads to have Anemic Domain Model. 


>The basic symptom of an Anemic Domain Model is that at first blush it looks like the real thing. There are objects, many named after the nouns in the domain space, and these objects are connected with the rich relationships and structure that true domain models have. The catch comes when you look at the behavior, and you realize that there is hardly any behavior on these objects, making them little more than bags of getters and setters. Indeed often these models come with design rules that say that you are not to put any domain logic in the the domain objects. Instead there are a set of service objects which capture all the domain logic, carrying out all the computation and updating the model objects with the results. These services live on top of the domain model and use the domain model for data.
>
> -- [Martin Fowler](https://martinfowler.com/bliki/AnemicDomainModel.html)



## Summary

Domain Service fulfills a domain-specific task. It does not hold data and mostly is a infrastructural component. Domain Service, SOA service and Application Service have close defintion that is a point of confusion. It is important to be careful about pushing ligic into the Domain Service that cause having Anemic Domain Model. Domain Service can make the Domain Model clean and more understandable.

