# OMDb Movie App

This is a responsive React application that allows users to search movies via the [OMDb API](https://www.omdbapi.com/), view details, save favorites, and manage a personal list.

The application is hosted on Vercel, where it can be accessed using this [link](https://omdb-movie-app-eta.vercel.app/).

## Features

- Movie search by title
- Saved list and favorites management with Redux
- Favorite toggle with local storage persistence
- Routing with detailed Movie view on `/movies/:movieId`


## Tech Stack

- React + TypeScript + Vite
- Mantine UI Components
- Redux Toolkit
- Axios
- React Router

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/framie/OMDb-Movie-App.git
cd app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root with the following:

```
VITE_OMDB_API_KEY=your_omdb_api_key_here
```

You can get a free API key at: [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)

### 4. Run the App

```bash
npm run dev
```

The app should now be running at: [http://localhost:5173](http://localhost:5173)
