# Contributing to Project Management Application

Thank you for your interest in contributing to the Project Management Application! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional but recommended)
- Git
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-management-app.git
   cd project-management-app
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/project-management-app.git
   ```

4. Run setup script:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

5. Start development environment:
   ```bash
   docker-compose up -d  # Using Docker
   # OR
   npm run dev           # Manual start
   ```

## Development Process

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, maintainable code
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

## Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Follow ESLint configuration
- Use async/await over callbacks
- Handle errors properly
- Add JSDoc comments for functions

### React

- Use functional components with hooks
- Follow React best practices
- Use PropTypes or TypeScript
- Keep components small and focused
- Use meaningful component names

### Database

- Use migrations for schema changes
- Add proper indexes
- Use transactions where appropriate
- Follow naming conventions (snake_case)

### Naming Conventions

- **Variables**: camelCase
- **Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case
- **Database**: snake_case

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: Maximum 100 characters
- **Comments**: Write clear, concise comments

### Example

```javascript
/**
 * Create a new project
 * @param {Object} projectData - Project information
 * @returns {Promise<Object>} Created project
 */
const createProject = async (projectData) => {
  try {
    const project = await Project.create(projectData);
    logger.info(`Project created: ${project.id}`);
    return project;
  } catch (error) {
    logger.error('Failed to create project:', error);
    throw error;
  }
};
```

## Testing

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/user-service
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Example

```javascript
describe('User Authentication', () => {
  it('should register a new user successfully', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User'
    };

    // Act
    const result = await register(userData);

    // Assert
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(userData.email);
    expect(result.accessToken).toBeDefined();
  });
});
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No unresolved conversations
4. Branch up to date with base branch

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add OAuth 2.0 support
fix(tasks): resolve duplicate task creation bug
docs(readme): update installation instructions
test(projects): add project creation tests
```

## Reporting Bugs

### Before Reporting

- Check existing issues
- Test with latest version
- Reproduce the bug consistently

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 98]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information
```

## Suggesting Enhancements

### Enhancement Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Screenshots, mockups, etc.
```

## Project Structure

```
project-management-app/
├── services/              # Microservices
│   ├── api-gateway/      # GraphQL API Gateway
│   ├── user-service/     # User management
│   ├── project-service/  # Project management
│   ├── task-service/     # Task management
│   └── notification-service/  # Notifications
├── frontend/             # React application
├── scripts/              # Helper scripts
├── docs/                 # Additional documentation
└── tests/                # Integration tests
```

## Resources

- [Project Documentation](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Security Guide](./SECURITY.md)
- [API Documentation](http://localhost:4000/graphql)

## Questions?

Feel free to:
- Open an issue for discussion
- Join our community chat
- Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Project Management Application! 🎉

