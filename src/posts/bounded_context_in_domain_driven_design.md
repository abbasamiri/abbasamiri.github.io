---
tags: post
layout: layouts/post.njk
title:  "Bounded Context in Domain Driven Design"
permalink: "posts/bounded-context-in-domain-driven-design/"
date:   2021-07-30
comments_id : "4"
description: "A Domain is what an organization does to carry out its business. A Domain normally has some subdomains that work together to perform some tasks that run the business. The main goal of Domain Driven Design is to model the Domain in the way that it can be implemented by software. Every subdomain has specific functions that are different from functions in other subdomains. It is logical to think about those functions separately to understand them correctly. Understanding the Domain leads to designing the Domain Model. The next step is to segregate the domain model into a concept that is called Bounded Context."
---

![](/assets/images/article-image-11.jpg)




> Bounded Context is a central pattern in Domain-Driven Design. It is the focus of DDD's strategic design section which is all about dealing with large models and teams. DDD deals with large models by dividing them into different Bounded Contexts and being explicit about their interrelationships.
>
> -- [Martin Fowler](https://martinfowler.com/bliki/BoundedContext.html)



A *Domain* is what an organization does to carry out its business. A *Domain* normally has some subdomains that work together to perform some tasks that run the business. The main goal of *Domain Driven Design* is to model the *Domain* in the way that it can be implemented by software. Every subdomain has specific functions that are different from functions in other subdomains. It is logical to think about those functions separately to understand them correctly. 

Understanding the *Domain* leads to designing the *Domain Model*. The next step is to segregate the *Domain Model* into a concept that is called *Bounded Context*.

*Bounded Context* is an area in the *Domain Model* that everything inside it is related to the area. *Bounded Context* is created semantically in *Problem Space* and transformed to the *Solution Space*.  



> **Problem domain** (or **problem space**) is an engineering term referring to all information that defines the problem and constrains the solution (the constraints being part of the problem). It includes the goals that the problem owner wishes to achieve, the context within which the problem exists, and all rules that define essential functions or other aspects of any solution product. It represents the environment in which a solution will have to operate, as well as the problem itself.
>
> -- [Problem Domain](https://wiki.c2.com/?ProblemDomain)

 

> The **solution domain** defines the abstract environment where the solution is developed. 
>
> -- [Solution domain](https://wiki.c2.com/?SolutionDomain)



Inside the *Bounded Context* there is a language that developers and domain experts can understand, it is called *Ubiquitous Language*. Everything inside the *Bounded Context* should be named based on the language. 

There are two famous methods to help us to define *Bounded Context*

1. Event-Storming (I will describe this method in a dedicated article).
2. Finding *Functional Cohesion*.

let's consider an example from Microsoft site: [Using domain analysis to model microservices](https://docs.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

**Note:** We will use *Functional Cohesion* to find out *Bounded Context*s in the example.

The *Domain* is described below: 



> Fabrikam, Inc. is starting a drone delivery service. The company manages a fleet of drone aircraft. Businesses register with the service, and users can request a drone to pick up goods for delivery. When a customer schedules a pickup, a backend system assigns a drone and notifies the user with an estimated delivery time. While the delivery is in progress, the customer can track the location of the drone, with a continuously updated ETA.
>
> This scenario involves a fairly complicated domain. Some of the business concerns include scheduling drones, tracking packages, managing user accounts, and storing and analyzing historical data. Moreover, Fabrikam wants to get to market quickly and then iterate quickly, adding new functionality and capabilities. The application needs to operate at cloud scale, with a high service level objective (SLO). Fabrikam also expects that different parts of the system will have very different requirements for data storage and querying. All of these considerations lead Fabrikam to choose a microservices architecture for the Drone Delivery application.



Interesting idea! Right? I love to receive my package by a drone, like *[The Fifth Element](https://en.wikipedia.org/wiki/The_Fifth_Element)* movie when Bruce Willis gets his lunch from a flying ship.

![](/assets/images/article-image-12.jpg)



Let's take a look at the domain diagram.  

![domain diagram](/assets/images/article-image-12.svg)



It is the big picture of the whole system or may I say the *Domain*.

What is the most important part of the *Domain*? The one in the center: **Shipping**. Right?

It is called the *Core*, everything else exists to support the *Core*.

There is some definition of every part of the *Domain*. Let's take a look at them.



> - **Shipping** is placed in the center of the diagram, because it's core to the business. Everything else in the diagram exists to enable this functionality.
> - **Drone management** is also core to the business. Functionality that is closely related to drone management includes **drone repair** and using **predictive analysis** to predict when drones need servicing and maintenance.
> - **ETA analysis** provides time estimates for pickup and delivery.
> - **Third-party transportation** will enable the application to schedule alternative transportation methods if a package cannot be shipped entirely by drone.
> - **Drone sharing** is a possible extension of the core business. The company may have excess drone capacity during certain hours, and could rent out drones that would otherwise be idle. This feature will not be in the initial release.
> - **Video surveillance** is another area that the company might expand into later.
> - **User accounts**, **Invoicing**, and **Call center** are subdomains that support the core business.



So far so good, now we have our *Problem Space*.

The next step is distilling information from the *Problem Space* to build a *Domain Model* that responds to the use-cases. This process is called *Knowledge crunching*. After *Knowledge crunching*, the team should reach a certain level of a common language which is called *Ubiquitous Language*.

Remember that we are not going to model the real world characteristics of drones such as maintenance history, mileage, age, model number, performance characteristics, and so on. In fact, we are going to design a system to respond to the use case's needs. It is time to divide the *Problem Space* into *Bounded Contexts*. 

*Functional cohesion* could be a method to define *Bounded Context*. It means that we could put subdomains that are closely related to each other to a specific *Bounded Context*. Based on *Functional cohesion* we could define seven *Bounded Context*s.

|      | Bounded Context            | Sub-domains                                         |
| ---- | -------------------------- | --------------------------------------------------- |
| 1    | Accounts                   | Accounts, Loyalty, User Rating                      |
| 2    | Shipping                   | Shipping, Invoicing, Returns                        |
| 3    | Video surveillance         | Video surveillance                                  |
| 4    | Drone management           | Drone management, Drone Repair, Predictive analysis |
| 5    | Call center                | Call center                                         |
| 6    | Third-party transportation | Third party                                         |
| 7    | Drone sharing              | Drone sharing                                       |



![Bounded Context Diagram](/assets/images/article-image-13.svg)



*Functional cohesion* helped us to define our *Bounded context*s. We should remember that designing a *Domain Model* is an evolving process, this design could be altered when we go further and be aware of other constraints and business rules.

**Note:** The solid lines between the *Bounded context*s are the subject of *Context Map* which demonstrates the integration points and the flow of data between *Bounded Context*s. 

**Note:** Name the *Bounded Context*s based on *Ubiquitous Language*.

Different teams are responsible for different *Bounded contexts*, but the important thing is all teams should understand the big picture and be aligned with the goal of the business. Teams are independent as their *Bounded contexts* are. The collaboration between teams is based on *Context Map*.

Let's choose one of our *Bounded context*s and go through it to discover more. Let's choose the important one: *Shipping*.     



## Shipping Bounded context

The  Shipping bounded context must handle the following use-cases:

1. A customer can request a drone to pick up goods from a business that is registered with the drone delivery service.
2. The sender generates a tag (barcode or RFID) to put on the package.
3. A drone will pick up and deliver a package from the source location to the destination location.
4. When a customer schedules a delivery, the system provides an ETA based on route information, weather conditions, and historical data.
5. When the drone is in flight, a user can track the current location and the latest ETA.
6. Until a drone has picked up the package, the customer can cancel a delivery.
7. The customer is notified when the delivery is completed.
8. The sender can request delivery confirmation from the customer, in the form of a signature or fingerprint.
9. Users can look up the history of a completed delivery.



Based on these use-cases we can identify essential building blocks of the Domain Model in the Bounded Context:

| Entity                                                       | Aggregate                                        | Value Object                                             | Domain Event                       | Domain service            |
| ------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------- | ---------------------------------- | ------------------------- |
| Delivery <br />Package <br />Drone <br />Account <br />Confirmation <br />Notification <br />Tag | Delivery <br />Package <br />Drone <br />Account | Location <br />ETA <br />PackageWeight <br />PackageSize | DroneStatus <br />DeliveryTracking | Scheduler<br />Supervisor |

As you can see, all words are understandable for both developers and domain experts. It is part of the *Ubiquitous Language*.

Let's go through one of the entities: `Delivery`.

 

![delivery entity](/assets/images/article-image-14.png)



You can see *Ubiquitous Language* in the definition of `Delivery` too.



## Summary

*Bounded Context* is an important part of *Domain Driven Design* which is the artifact of dividing a large model into smaller ones. The transition from *Problem Space* to *Solution Space* starts with defining *Bounded Context*s. Inside The *Bounded Context*, *Entities*, *Aggregates*, *Value Objects*,  *Domain Events*,  *Domain Services*, based on *Ubiquitous Language* build the model. Defining a clear boundary around a *Bounded Context* is the key to having a good Domain Model.

