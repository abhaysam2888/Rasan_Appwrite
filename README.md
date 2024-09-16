# Rasan Expense Tracker App

This is a **React Native** mobile application integrated with **Appwrite** for backend services. The app allows users to track their expenses and contributions, log in with their phone number, and keep a record of all their expenses and contributions for every month.

## Features

- **Track Expenses**: 
  - Users can record daily expenses with details such as item, price, quantity, category, and date.
  - Each expense is stored in Appwrite for easy retrieval and management.

- **Track Contributions**: 
  - Users can log contributions and keep track of the total contributions made in each month.
  - A new document is automatically created at the start of each month, or the current document is updated within the month.

- **Phone Number Authentication**: 
  - Users can securely log in with their phone number through Appwrite's authentication services.
  
- **Monthly Record Keeping**: 
  - The app keeps track of expenses and contributions for each month with a dedicated route/window to view records.
  - Allows users to go back and view previous months' expenses and contributions with ease.

## Technologies Used

- **React Native**: For building the mobile interface.
- **Appwrite**: Backend as a Service (BaaS) for authentication, database, and storage services.
- **Appwrite Authentication**: Phone number-based authentication to securely log in users.
- **Appwrite Database**: Storing expenses, contributions, and user information.

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/abhaysam2888/rasan-expense-tracker-app.git
   cd expense-tracker-app

