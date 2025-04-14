# Resumify - Modern Resume Builder

A modern resume builder application with ATS optimization and beautiful UI/UX.

## Features

- Modern and responsive design
- ATS-friendly resume creation
- Real-time preview
- Multiple resume templates
- User authentication
- Profile management
- Resume analytics

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resumify.git
cd resumify
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=resumify
JWT_SECRET=your_jwt_secret
```

4. Set up the database:
```bash
mysql -u your_username -p
CREATE DATABASE resumify;
exit;
```

5. Run database migrations:
```bash
node database/migrate.js
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
resumify/
├── resumebuilder/          # Frontend files
│   ├── web.html           # Main HTML file
│   ├── styles.css         # Main CSS file
│   ├── animations.js      # Animation logic
│   └── main.js           # Core functionality
├── server.js              # Express server
├── database/             # Database related files
├── config/               # Configuration files
├── ats/                  # ATS checker module
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 