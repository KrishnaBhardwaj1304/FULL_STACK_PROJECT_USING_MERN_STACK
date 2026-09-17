# FULL_STACK_PROJECT_USING_MERN_STACK

🥐 Sweet Crust Bakery

> A full-stack artisan bakery platform for browsing handcrafted treats, ordering online, and managing a bakery's daily operations.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)
- [Order Flow](#order-flow)

## About the Project

Sweet Crust Bakery brings the neighborhood bakery experience online. Customers can explore a richly filterable menu, customize their basket, choose delivery or pickup, pay securely, and follow every stage of an order. Bakers get a dedicated dashboard for managing the menu and moving orders through the baking queue.

The interface uses a warm artisan look, with cream, amber, terracotta, and cinnamon tones paired with **Playfair Display** and **Plus Jakarta Sans** typography.

## Features

### Customer experience

- Browse breads, pastries, cakes, cookies, savory items, or the complete menu.
- Filter products by dietary needs: vegan, gluten-free, vegetarian, and organic.
- Search the catalog instantly and open a quick view for ingredients, allergens, and dietary details.
- Add items with a custom quantity selector and receive instant basket updates.
- See a live subtotal, 8% tax calculation, and delivery or free counter-pickup options.
- Create an account, save an address, and review previous orders.
- Track orders through an animated baking-progress timeline.

### Baker dashboard

- Sign in through a separate baker/admin portal.
- Monitor revenue, order totals, and the live baking queue.
- Progress orders from **Received** to **Baking**, then **Ready for Pickup / Out for Delivery**, and finally **Completed**.
- Add new menu items with an image URL, price, and dietary tags—or remove existing items.

### Payments

- Accept secure card payments with Stripe.
- Use Stripe test keys for development, or run checkout in the included test-card simulation mode when keys are not configured.

## Built With

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB / MongoDB Atlas |
| Authentication | JWT with customer and admin access controls |
| Payments | Stripe
