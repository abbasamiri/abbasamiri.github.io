---
layout: post
title:  "Context Map"
date:   2021-09-17
comments_id : "6"
description: "Context Map is the important part of Domain Driven Design. It demonstrates the integration points and the flow of data between Bounded Contexts. Bounded Contexts are not independent. In fact, a system cannot exist without the interaction between its components."
---

![](/assets/images/article-image-15.jpg)

*Context Map* is the important part of *Domain Driven Design*. It demonstrates the integration points and the flow of data between *Bounded Context*s. *Bounded Context*s are not independent. In fact, a system cannot exist without the interaction between its components. In this article I will describe the *Context Map*.

A *Context Map* defines a relationship between two *Bounded Context*. The relationship is influenced by the present state of the domain, technical and organizational concerns.     

The relationship between *Bounded Context*s causes the relationship between teams.

The touchpoints between *Bounded Context*s are called *Contracts*. The *Contracts* can be categorized into eight types: 

1. [Partnership](#Partnership)
2. [Shared Kernel](#Shared Kerne)
3. [Customer-Supplier](#Customer-Supplier)
4. [Conformist](#Conformist)
5. [Anticorruption Layer](#Anticorruption Layer)
6. [Open Host Service](#Open Host Service)
7. [Published Language](#Published Language)
8. [Separate Ways](#Separate Ways)



![](/assets/images/article-image-16.png)





## Partnership

This kind of integration is mostly based on connection between teams. They cooperate together to have a clear contract that defines the connection between the *Bounded Contexts*.



![](/assets/images/article-image-17.png)



To achieve the *Partnership* goal's, the **communication** and **synchronization** between teams is crucially important. 



## Shared Kernel

This kind of integration is based on sharing part of the *Domain Model* which defines the contract between two *Bounded Context*.



![](/assets/images/article-image-18.png)



To achieve the *Shared Kernel* goal's, the **commitment** and **synchronization** between teams is crucially important.



## Customer-Supplier

This kind of integration is based on providing services from one *Bounded Context* (*Supplier* or *Upstream*) to another *Bounded Context* (*Customer* or *Downstream*).



![](/assets/images/article-image-19.png)



The *Customer* always depends on the services that the *Supplier* provides and the *Supplier* promises to provide all needs of the *Customer*.



## Conformist

This kind of integration is like the *Customer-Supplier*, but the *Supplier* does not promise to provide *Customer*'s needs. 



![](/assets/images/article-image-20.png)

This kind of relationship mostly happens when the *Supplier* (Upstream context) is not able to collaborate with the *Customer* (Downstream context) and the *Customer* needs to conform to the *Supplier*. For instance, The *Supplier* is a third-party component.



## Anticorruption Layer

This kind of integration is based on the fact that two different *Bounded Context* may have different *Ubiquitous Language* and/or different modeling techniques. This differentiation in the context of integration may leads to adaptation that causes corruption in  the *Bounded Context*. To prevent the corruption, *Anticorruption Layer* can be used.



![](/assets/images/article-image-21.png)



*Anticorruption layer* contains **translation logic**, there is **no business logic**.



## Open Host Service

This kind of integration provides clearly defined, explicit contracts for multiple consumers.



![](/assets/images/article-image-22.png)



When a *Bounded Context* has a relationship with multiple *Bounded Context*; it can provide an *Open Host Service* that prevents other *Bounded Context*s from having their own *Anticorruption Layer*.



![](/assets/images/article-image-23.png)



## Published Language

This kind of integration provides a language from Upstream to describe and formalize the details of integration in which Downstream can use it. *Published Language* often used alongside the *Open Host Service*. 



![](/assets/images/article-image-24.png)



*Published Language* is like a document of the service(s) that Upstream provides for Downstream; this kind of document makes a lower disruption from Downstream to Upstream.

*Published Language* can be defined with XML Schema or JSON Schema.



## Separate Ways

This kind of integration can be used when the cost of other integrations are not affordable; technical and/or political complexities could be reasons to choose this method. In this way the integration could be designed in a *Separate Ways* like integration via user interface.



![](/assets/images/article-image-25.png)

## Summary

*Context map* is a concept that represents the system's *Bounded Context*s and integrations between them. There are several methods of integration which also represent the relationship between teams that are responsible for *Bounded Context*s. It is important to choose an appropriate method of integration in the Domain Model.

