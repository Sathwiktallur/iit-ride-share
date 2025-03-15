# Student Ride Share

## Overview

Student Ride Share is a web application designed to help students at IIT Indore connect and share rides. The platform allows students to offer rides, request to join rides, and communicate with each other for convenient and cost-effective travel.

## Features

- User authentication and registration
- Create and manage ride offers
- Request to join rides
- Accept or decline ride requests
- Real-time chat between ride participants
- Rate and review rides
- View booking history

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data-fetching library for React
- **date-fns**: Modern JavaScript date utility library
- **lucide-react**: Icon library for React

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Typed superset of JavaScript
- **WebSocket**: Real-time communication protocol
- **express-session**: Session middleware for Express
- **jsonwebtoken**: JSON Web Token implementation

### Database

- **SQLite**: Lightweight, disk-based database

### Tools

- **Vite**: Next-generation frontend tooling
- **tsx**: TypeScript execution environment
- **ESLint**: Linting utility for JavaScript and TypeScript
- **Prettier**: Code formatter

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node package manager, which comes with Node.js.
- **Git**: Version control system. You can download it from [git-scm.com](https://git-scm.com/).

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/dushyanththeman/IITI-ps1.git
    cd IITI-ps1
    ```

2. **Install backend dependencies**:
    ```sh
    npm install
    ```

3. **Install frontend dependencies**:
    ```sh
    cd client
    npm install
    cd ..
    ```

### Running the Application

1. **Start the backend server**:
    ```sh
    npm run dev
    ```

2. **Start the frontend development server**:
    ```sh
    cd client
    npm run dev
    ```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:


DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=your_jwt_secret
Database Setup<vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'>
</vscode_annotation><vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'> </vscode_annotation>1. Run database migrations: sh     npm run migrate     

Usage
1.Register: Create a new account using your IIT Indore email.
2.Login: Log in to your account.
3.Create Ride: Offer a ride by providing details such as source, destination, departure time, and available seats.
4.Request to Join: Browse available rides and request to join a ride.
5.Manage Requests: If you are a ride creator, accept or decline join requests.
6.Chat: Use the real-time chat feature to communicate with ride participants.
7.Rate and Review: After completing a ride, rate and review your experience.
8.View Booking History: Check your booking history to see all the rides you have offered or joined.


Future Enhancements

1.Enhanced User Profiles: Allow users to add more details to their profiles, such as profile pictures, bio, and contact information.
2.Ride History: Provide users with a history of all the rides they have offered or joined.
3.Notifications: Implement a notification system to alert users about new ride requests, ride status updates, and messages.
4.Payment Integration: Integrate a payment gateway to facilitate secure payments between ride participants.
5.Map Integration: Integrate a map service to show the route of the ride and nearby ride offers.
6.Mobile App: Develop a mobile application for easier access and better user experience on mobile devices.
7.Admin Dashboard: Create an admin dashboard to manage users, rides, and monitor the platform's activity.
Contributing


Contributions are welcome! Please follow these steps to contribute:

1.Fork the repository:

2.Go to the repository on GitHub and click the "Fork" button.
Clone your forked repository:
git clone https://github.com/your-username/IITI-ps1.git
cd IITI-ps1

3.Create a new branch:
git checkout -b feature/your-feature-name
Make your changes:

4.Implement your feature or fix the bug.
Commit your changes:
git add .
git commit -m 'Add some feature'

4.Push to the branch:
git push origin feature/your-feature-name

5.Open a pull request:
Go to the repository on GitHub and click the "New pull request" button.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or inquiries, please contact ddushyanths@gmail.com


**Demo Video Link**

https://drive.google.com/drive/folders/1qfY31P7ZM47Icf2r6Q_TPhT2ZaxSiCRq



