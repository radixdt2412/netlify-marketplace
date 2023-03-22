# **MarketPlace**

# Microservices in Nodejs:
This project is basic demo of Microservices in Nodejs, Along with API gatway. In this project we have 5 Microservices, as slisted below
- Authentication
- Order
- Store
- Product
- Common
- Expiration

# Project Struture 
```.
└── backend
    ├── service
    │    ├── src
    │    │   ├── database
    │    │   ├── domain
    │    │   ├── events
    │    │   ├── model
    │    │   ├── routes
    │    │   ├── middleware
    │    │   ├── app.ts
    │    │   ├── index.ts
    │    │   └── nats-wrapper.ts
    │    ├── package.json
    │    ├── tsconfig.json
    │    └── Dockerfile
    └── skaffold.yaml
```

# Node module download command
    npm install

# Running the server
    skaffold dev
