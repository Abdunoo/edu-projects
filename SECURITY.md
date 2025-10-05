# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the Educational Management System seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed

### How to Report

**Email**: Send details to the project maintainer (create a private security advisory on GitHub)

**Include**:
1. Description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact
4. Suggested fix (if any)
5. Your contact information

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will send you regular updates about our progress
- **Timeline**: We aim to address critical vulnerabilities within 7 days
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Developers

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as a template
   - Generate strong, random secrets for production

2. **Dependencies**
   - Regularly update dependencies
   - Run `npm audit` to check for vulnerabilities
   - Review security advisories

3. **Authentication**
   - Use strong password hashing (bcrypt)
   - Implement proper JWT token management
   - Use HTTP-only cookies for refresh tokens
   - Implement rate limiting

4. **Database**
   - Use parameterized queries (Drizzle ORM handles this)
   - Implement proper access controls
   - Regular backups
   - Encrypt sensitive data

5. **API Security**
   - Validate all inputs
   - Implement CORS properly
   - Use HTTPS in production
   - Implement rate limiting
   - Add request size limits

### For Deployment

1. **Environment**
   - Use environment variables for all secrets
   - Never hardcode credentials
   - Use secure secret management (e.g., AWS Secrets Manager, HashiCorp Vault)

2. **HTTPS**
   - Always use HTTPS in production
   - Implement HSTS headers
   - Use valid SSL certificates

3. **Database**
   - Use strong database passwords
   - Restrict database access by IP
   - Enable SSL for database connections
   - Regular security updates

4. **Monitoring**
   - Implement logging for security events
   - Monitor for suspicious activity
   - Set up alerts for security issues

## Known Security Considerations

### JWT Tokens

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Refresh tokens stored in HTTP-only cookies
- Tokens are validated on every request

### Password Security

- Passwords hashed with bcrypt
- Minimum password requirements enforced
- No password stored in plain text

### Rate Limiting

- API endpoints are rate-limited
- Prevents brute force attacks
- Configurable limits per endpoint

### Input Validation

- All inputs validated with class-validator and Zod
- SQL injection prevented by Drizzle ORM
- XSS prevention through proper escaping

## Security Updates

We will announce security updates through:

- GitHub Security Advisories
- Release notes
- Project README

## Compliance

This project follows security best practices including:

- OWASP Top 10 guidelines
- Secure coding standards
- Regular security audits

## Questions

If you have questions about security, please open a discussion on GitHub or contact the maintainers.

---

**Thank you for helping keep the Educational Management System secure!**
