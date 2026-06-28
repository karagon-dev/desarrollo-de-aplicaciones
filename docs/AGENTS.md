# SKAMA Jewelry - AI Agent Instructions

## IMPORTANT

**Before writing code, making changes, generating files, or making architectural decisions, EVERY AI agent MUST read ALL project documentation located under `/docs`.**

This requirement is mandatory.

Do NOT make assumptions about business logic, database schema, API contracts, UI behavior or project structure without first consulting the documentation.

If documentation conflicts with your assumptions, **the documentation always wins.**

---

# Project Overview

SKAMA Jewelry is an e-commerce platform specialized in selling emerald jewelry.

The application consists of three independent layers:

* React + TypeScript Frontend
* ASP.NET Core Web API
* SQL Server Database using Stored Procedures

The project follows a layered architecture.

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Stored Procedures
    ↓
SQL Server
```

Repositories should NEVER contain business logic.

Services contain business rules.

Controllers should only orchestrate requests and responses.

---

# Documentation First

Before starting ANY task, read the following documents.

Required reading:

* Project Vision
* Architecture Guide
* Database Guide
* API Guide
* Coding Standards
* UI Guidelines
* Ticket Description assigned to the current task

If additional documentation exists, review it before implementation.

---

# General Development Rules

Always:

* Follow the existing architecture.
* Follow existing naming conventions.
* Reuse existing components whenever possible.
* Prefer composition over duplication.
* Keep methods small and readable.
* Write maintainable code over clever code.

Never:

* Create duplicate components.
* Copy/paste business logic.
* Hardcode values.
* Change project architecture.
* Modify unrelated files.

---

# Frontend Guidelines

Technology:

* React
* TypeScript
* React Router
* Axios
* MUI (Material UI)

Guidelines:

* Use functional components.
* Use hooks.
* Avoid class components.
* Keep components focused on a single responsibility.
* Extract reusable components.
* Prefer composition.

Pages should contain minimal logic.

Business logic belongs inside Services.

API calls belong inside API services.

Avoid inline styles.

Avoid duplicated UI.

Reuse layouts.

---

# Backend Guidelines

Technology:

* ASP.NET Core
* C#
* Dapper
* SQL Server

Architecture:

```
Controller

↓

Service

↓

Repository

↓

Stored Procedure
```

Controllers:

* Validate request.
* Return appropriate HTTP responses.
* Never implement business rules.

Services:

* Business validation.
* Business rules.
* Orchestrate repositories.

Repositories:

* Execute Stored Procedures.
* Perform data mapping only.
* Never implement business rules.

---

# Database Guidelines

The database uses Stored Procedures.

Repositories MUST communicate ONLY through Stored Procedures.

Never generate inline SQL.

Never concatenate SQL strings.

Always use parameterized queries.

Respect all existing table relationships.

---

# API Guidelines

Every endpoint should:

* Validate incoming requests.
* Return proper HTTP status codes.
* Return meaningful error messages.
* Avoid exposing internal exceptions.

---

# UI Guidelines

The application should maintain a consistent visual identity.

Every new page must follow:

* Existing spacing
* Existing typography
* Existing color palette
* Existing button styles
* Existing form styles
* Existing table styles

Do not invent new design systems.

---

# Code Style

Naming:

PascalCase

* Components
* Classes
* Interfaces
* DTOs

camelCase

* Variables
* Parameters
* Methods

Interfaces always begin with I.

Examples:

IProductRepository

ProductRepository

ProductService

ProductsController

---

# Error Handling

Handle expected errors.

Never swallow exceptions.

Return meaningful messages.

Log unexpected exceptions.

---

# Security

Never expose:

* Passwords
* Secrets
* Connection strings
* Tokens
* Internal stack traces

Validate all user input.

Never trust client-side validation.

---

# Performance

Avoid unnecessary API calls.

Avoid duplicated queries.

Avoid loading unnecessary data.

Paginate large datasets.

Filter on the server whenever possible.

---

# Pull Requests

Before considering a task complete:

* Code compiles.
* No TypeScript errors.
* No C# warnings.
* No broken routes.
* No unused imports.
* No dead code.
* Formatting applied.
* Naming conventions respected.

---

# When Documentation Is Missing

If documentation does not specify behavior:

1. Search the existing project.
2. Reuse existing patterns.
3. Maintain consistency.
4. Avoid introducing new architectural patterns.

---

# Priority Order

When making decisions, follow this order:

1. Project Documentation
2. Existing Architecture
3. Existing Code Patterns
4. Ticket Requirements
5. Personal Judgment

---

# Goal

The objective is not simply to make the feature work.

The objective is to produce code that is:

* Consistent
* Maintainable
* Reusable
* Testable
* Scalable

Every implementation should look like it was written by the same developer.

# Frontend Guidelines (React + TypeScript)

Technology Stack

* React
* TypeScript
* React Router
* Axios
* Material UI (MUI)

## Core Principle

**Build reusable components.**

If you find yourself copying JSX from another page, stop and extract a reusable component instead.

The goal is to build a component library, not a collection of independent pages.

---

## Before Writing Any Component

Ask yourself:

* Does a similar component already exist?
* Can this be configured using props?
* Can this be shared between multiple pages?
* Would another developer naturally reuse this component?

If the answer is yes, create or reuse a shared component.

---

## Do NOT

* Duplicate JSX.
* Duplicate CSS.
* Duplicate forms.
* Duplicate tables.
* Duplicate modals.
* Duplicate dialogs.
* Duplicate cards.
* Duplicate search bars.
* Duplicate pagination.
* Duplicate loading indicators.
* Duplicate empty states.

Never solve the same UI problem twice.

---

## Preferred Folder Structure

components/

* buttons/
* cards/
* dialogs/
* forms/
* inputs/
* layouts/
* modals/
* navigation/
* tables/
* typography/
* feedback/

pages/

* Home
* Catalog
* ProductDetail
* Cart
* Checkout
* Profile
* Admin

services/

hooks/

types/

utils/

---

## Reusable Components Expected

The project should reuse components such as:

* Button
* TextField
* SearchBar
* Select
* Checkbox
* Modal
* ConfirmDialog
* DataTable
* Pagination
* Card
* ProductCard
* PromotionCard
* StatCard
* LoadingSpinner
* EmptyState
* ErrorState
* Breadcrumb
* Sidebar
* Navbar
* Footer

Do not recreate these on every page.

---

## Forms

Forms should be composed of reusable input components.

Avoid page-specific implementations.

Validation should be reusable whenever possible.

---

## Tables

All tables should share the same component.

Configuration should be passed through props.

Avoid creating multiple table implementations.

---

## Styling

Do not use inline styles.

Do not hardcode colors.

Do not hardcode spacing.

Use the project's design tokens and theme.

Every page must look like it belongs to the same application.

---

## State Management

Keep state as local as possible.

Avoid unnecessary prop drilling.

Extract reusable logic into custom hooks when shared by multiple pages.

---

## API Calls

Pages should NEVER call Axios directly.

Create service files responsible for communicating with the API.

Pages should only call service methods.

---

## Business Logic

Business logic should not live inside components.

Components are responsible for presentation.

Move reusable logic into:

* hooks
* services
* utilities

---

## Component Size

If a component exceeds roughly 200 lines or has multiple responsibilities, consider splitting it into smaller reusable components.

---

## Final Goal

Every new page should be built by composing reusable components rather than creating new ones from scratch.

A developer should be able to build an entirely new page mostly by assembling existing components.

**If a reusable component can be created, create it. If one already exists, reuse it. Never duplicate code or UI.**
