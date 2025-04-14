const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'resumebuilder')));

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'));
        }
    }
});

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'web.html'));
});

app.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'about-us.html'));
});

app.get('/resume-builder', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'resume-builder.html'));
});

app.get('/ats-checker', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'ats-checker.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'signup.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'profile.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'forgot-password.html'));
});

app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'reset-password.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'resumebuilder', 'contact.html'));
});

// ATS Checker endpoint
app.post('/api/check-ats', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';
        const filePath = req.file.path;

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else {
            const result = await mammoth.extractRawText({ path: filePath });
            text = result.value;
        }

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        // Basic ATS scoring logic
        const score = calculateATSScore(text);
        const suggestions = generateSuggestions(text, score);

        res.json({
            score: score,
            suggestions: suggestions
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

function calculateATSScore(text) {
    let score = 0;
    const criteria = {
        // Keywords and Skills (25 points)
        hasKeywords: {
            weight: 25,
            check: () => {
                const keywords = [
                    'experience', 'skills', 'education', 'work', 'project', 
                    'achievement', 'certification', 'expertise', 'proficiency',
                    'knowledge', 'qualification', 'degree', 'diploma', 'training'
                ];
                const foundKeywords = keywords.filter(keyword => 
                    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
                );
                return (foundKeywords.length / keywords.length) * 25;
            }
        },

        // Formatting and Structure (20 points)
        hasFormatting: {
            weight: 20,
            check: () => {
                let formattingScore = 0;
                // Check for proper section headings
                if (/\b(Experience|Education|Skills|Projects|Certifications)\b/i.test(text)) {
                    formattingScore += 5;
                }
                // Check for bullet points or numbered lists
                if (/(•|-\s|\d+\.)/.test(text)) {
                    formattingScore += 5;
                }
                // Check for proper spacing
                if (/\n\n|\n\s*\n/.test(text)) {
                    formattingScore += 5;
                }
                // Check for consistent formatting
                if (!/([A-Z]{2,}|[a-z]{2,})/.test(text)) {
                    formattingScore += 5;
                }
                return formattingScore;
            }
        },

        // Contact Information (10 points)
        hasContactInfo: {
            weight: 10,
            check: () => {
                let contactScore = 0;
                // Check for email
                if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
                    contactScore += 4;
                }
                // Check for phone
                if (/(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/.test(text)) {
                    contactScore += 3;
                }
                // Check for location
                if (/\b(address|location|city|state|country)\b/i.test(text)) {
                    contactScore += 3;
                }
                return contactScore;
            }
        },

        // Action Verbs and Achievements (20 points)
        hasActionVerbs: {
            weight: 20,
            check: () => {
                const actionVerbs = [
                    'developed', 'managed', 'led', 'created', 'implemented',
                    'designed', 'analyzed', 'improved', 'increased', 'decreased',
                    'trained', 'mentored', 'coordinated', 'executed', 'launched'
                ];
                const foundVerbs = actionVerbs.filter(verb => 
                    new RegExp(`\\b${verb}\\b`, 'i').test(text)
                );
                return (foundVerbs.length / actionVerbs.length) * 20;
            }
        },

        // Quantifiable Results (15 points)
        hasQuantifiableResults: {
            weight: 15,
            check: () => {
                let resultsScore = 0;
                // Check for percentages
                if (/\d+%/.test(text)) {
                    resultsScore += 5;
                }
                // Check for monetary values
                if (/\$\d+[KMB]?/.test(text)) {
                    resultsScore += 5;
                }
                // Check for other metrics
                if (/\d+\s*(million|thousand|users|clients|projects|team members)/i.test(text)) {
                    resultsScore += 5;
                }
                return resultsScore;
            }
        },

        // Professional Summary (10 points)
        hasProfessionalSummary: {
            weight: 10,
            check: () => {
                let summaryScore = 0;
                // Check for summary section
                if (/\b(summary|objective|profile)\b/i.test(text)) {
                    summaryScore += 5;
                }
                // Check for professional tone
                if (/\b(professional|experienced|skilled|expert|proficient)\b/i.test(text)) {
                    summaryScore += 5;
                }
                return summaryScore;
            }
        }
    };

    // Calculate total score
    Object.values(criteria).forEach(criterion => {
        score += criterion.check();
    });

    return Math.min(Math.round(score), 100);
}

function generateSuggestions(text, score) {
    const suggestions = [];

    // Keywords and Skills suggestions
    if (score < 25) {
        suggestions.push('Add more relevant keywords related to your experience and skills');
        suggestions.push('Include specific technical skills and certifications');
    }

    // Formatting suggestions
    if (score < 45) {
        suggestions.push('Improve formatting by adding proper section headings');
        suggestions.push('Use bullet points or numbered lists for better readability');
        suggestions.push('Add proper spacing between sections');
    }

    // Contact information suggestions
    if (score < 55) {
        suggestions.push('Include your complete contact information (email, phone, location)');
    }

    // Action verbs suggestions
    if (score < 75) {
        suggestions.push('Use more action verbs to describe your achievements');
        suggestions.push('Start bullet points with strong action verbs');
    }

    // Quantifiable results suggestions
    if (score < 90) {
        suggestions.push('Add specific numbers and metrics to your achievements');
        suggestions.push('Include percentages, revenue numbers, or other measurable results');
    }

    // Professional summary suggestions
    if (score < 100) {
        suggestions.push('Add a strong professional summary at the top of your resume');
        suggestions.push('Use more professional and industry-specific language');
    }

    // General suggestions based on overall score
    if (score < 60) {
        suggestions.push('Consider using a professional resume template');
        suggestions.push('Proofread your resume for grammar and spelling errors');
    }

    return suggestions;
}

// Error handling for 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'resumebuilder', 'web.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 