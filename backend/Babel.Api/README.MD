# Backend Architecture and Current Implementation

## Overview

The backend is an ASP.NET Core Web API written in C# and organized as a modular monolith. The project is structured to keep related functionality grouped within independent modules while still running as a single application. Each module contains its own domain models, application logic, infrastructure components, and API endpoints. This structure supports clean separation of concerns, testability, and the ability to evolve individual features without affecting unrelated parts of the system.

Entity Framework Core (EF Core) is used as the ORM. SQLite is currently configured as the development database because it requires no external setup and stores data locally in a single file. EF Core migrations are enabled and stored directly inside the Babel.Api project.

---

# Project Structure

Directory structure (simplified):

```
backend/
└── Babel.Api/
      Controllers/
      Data/
      Migrations/
      Models/
      Modules/
          Users/
              Api/
              Application/
              Domain/
              Infrastructure/
      appsettings.json
      Program.cs
      babel.db
```

### Controllers

The Controllers directory contains the API endpoints exposed to the frontend or clients. Controllers are intentionally kept thin: they receive HTTP requests, perform basic validation, and delegate the main work to application services.

### Data

Contains `AppDbContext`, the EF Core database context. It defines the tables (via DbSet properties) and maintains the link between the application code and the SQLite database.

### Migrations

Contains automatically generated EF Core migration files. These represent the history of schema changes and allow the database to be brought to the correct state using `dotnet ef database update`.

### Models

Contains simple domain entities that represent the data stored in the database. These are mapped by EF Core and appear as tables in the SQLite database.

### Modules

Each folder under `Modules` represents a feature module. A module contains its own:

* Domain classes (enterprise logic, core entities)
* Application layer (service interfaces, service implementations, DTOs)
* Infrastructure layer (repositories, EF configuration, data access)
* API layer (controllers for that module)

Modules are self-contained, which enforces clear boundaries and reduces coupling.

Currently, the `Users` module contains:

* Domain: The User entity and any core user-related logic.
* Application: The UserService and interfaces defining user-related operations.
* Infrastructure: Data access implementation (via EF Core) specific to users.
* Api: The UsersController, which exposes user-related routes.

---

# Program.cs and Dependency Injection

Dependency injection is used throughout the project. Services and DbContext instances are registered in `Program.cs` so that controllers and other services can request them through constructor injection. When a new module introduces a new service or repository, it must be registered here to be available to the rest of the system.

Example of key registrations:

* `AddDbContext<AppDbContext>(...)` registers the EF Core database context.
* `AddScoped<IUserService, UserService>()` registers a user service implementation for the Users module.

This pattern keeps the system loosely coupled and allows unit testing through interface substitution.

---

# Database Implementation

The backend uses SQLite through EF Core. The configuration uses a connection string in `appsettings.json`:

```
"ConnectionStrings": {
    "DefaultConnection": "Data Source=babel.db"
}
```

When a migration is created (`dotnet ef migrations add <Name>`), EF generates schema change files inside the `Migrations` directory. Running `dotnet ef database update` applies these migrations and creates or updates the local SQLite database file named `babel.db`.

The database file lives in the root of the Babel.Api project so that it is included in versioning and accessible during development.

---

# Modular Monolith Principles Used in This Project

The project follows a modular monolith structure rather than a traditional layered monolith. In this approach:

1. Each module owns its domain logic.
2. Modules expose functionality through well-defined interfaces or their API controllers.
3. Cross-module communication goes through services or interfaces, not direct database context access.
4. Business logic lives in the Application layer, not in controllers or infrastructure.

This structure improves maintainability, reduces tight coupling, and keeps the codebase scalable as it grows. If the project ever needs to move toward microservices, modules can be extracted without major restructuring.

---

# Interaction Between Backend Modules and the Frontend

The backend exposes REST endpoints through module-specific controllers. The frontend interacts with the system exclusively through these endpoints. The typical request flow is:

1. The client issues an HTTP request to a module’s controller.
2. The controller calls an application service.
3. The service contains the business logic and may call repositories through the infrastructure layer.
4. The repository interacts with EF Core to perform database operations via the DbContext.
5. Data is returned back up to the controller and then to the client as JSON.

This structure ensures that the backend enforces business rules internally while allowing the frontend to operate with simple HTTP requests.

---

# Guidelines for Maintaining a Clean Modular Structure

1. All business logic should be placed in module services, not in controllers.
2. Database access should occur only in repositories within the Infrastructure layer.
3. Domain models should not be polluted with DTOs or API-specific concerns.
4. Each module should depend on abstractions (interfaces), not implementations.
5. Cross-module interaction should always go through interfaces or application services, never through direct DbContext access.
6. The root project (`Babel.Api`) should only serve as the application shell, hosting the DI container, database configuration, and API startup pipeline.

---

# Summary

The backend now has a functional EF Core setup with SQLite, migrations, domain models, and a correctly structured modular monolith architecture. This provides a scalable, maintainable foundation for building additional features such as authentication, language modules, lessons, and user progress tracking. The structure encourages clean boundaries, proper separation of concerns, and straightforward future expansion.
