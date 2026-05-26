# Security Policy

The Vidya team takes the security of this project seriously. Because Vidya is used by children, we treat every security report — no matter how small — as a priority.

## Supported versions

Vidya is a continuously deployed web application. Only the code currently on `main` (deployed at https://vidya-quest.vercel.app) receives security updates. There are no released versions to back-port to.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Report vulnerabilities privately via **either** of the following:

1. **GitHub Private Vulnerability Reporting** (preferred) —
   Go to <https://github.com/ekansh-tb/vidya/security/advisories/new> and open a draft advisory. This keeps the report private until a fix is ready.
2. **Email** — `mailme@ekanshjain.com` with the subject line `[vidya security]`. Please use plain text. If you need encryption, request the maintainer's PGP key in the first message and we will exchange keys before details.

### What to include

To help us triage quickly, please provide:

- A description of the issue and its potential impact
- Steps to reproduce — minimal proof-of-concept code or curl commands if possible
- The affected component (API route, client view, dependency, etc.)
- Your assessment of severity (Critical / High / Medium / Low)
- Whether you have already disclosed this to anyone else, and if so, when

## What to expect

| Timeline    | What happens                                                                          |
| ----------- | ------------------------------------------------------------------------------------- |
| < 48 hours  | Acknowledgement that we received your report.                                         |
| < 7 days    | Initial assessment and triage. We confirm whether we can reproduce.                   |
| < 30 days   | A fix is developed, reviewed, and deployed for Critical / High severity issues.       |
| < 90 days   | Public disclosure via GitHub Security Advisory, with credit to the reporter (if they consent). |

If we disagree that an issue is a vulnerability, we will explain why. If a fix will take longer than the timelines above, we will tell you and explain the constraint.

## Scope

In scope:

- The web application at https://vidya-quest.vercel.app
- All code in this repository
- Direct dependencies declared in `package.json`

Out of scope (please do not report these as security issues):

- Vulnerabilities in third-party services (Vercel, Anthropic API, Clerk, Supabase) — report those to the respective vendors
- Issues that require physical access to a user's unlocked device
- Social engineering attacks
- Reports from automated scanners with no demonstrated impact
- Missing security headers without a concrete exploit
- Self-XSS, denial-of-service via excessive resource use without amplification, or anything requiring a man-in-the-middle on the victim's local network

## Safe harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to comply with this policy
- Avoid privacy violations, data destruction, and service degradation
- Do not access or modify data that does not belong to them
- Give us reasonable time to fix the issue before any public disclosure

## Recognition

With your permission, we credit reporters in the GitHub Security Advisory and in release notes. We do not currently have a monetary bug bounty program.
