# HIPAA Security Risk Assessment

**Metzler Foundations**  
**Assessment Date:** November 16, 2025  
**Assessment Period:** Annual Review  
**Version:** 1.0

**Prepared by:** Compliance Officer  
**Reviewed by:** Privacy Officer, IT Security Officer  
**Approved by:** Executive Director

---

## Executive Summary

This Security Risk Assessment evaluates the potential risks and vulnerabilities to the confidentiality, integrity, and availability of Protected Health Information (PHI) at Metzler Foundations. The assessment follows HIPAA Security Rule requirements (45 CFR § 164.308(a)(1)(ii)(A)) and identifies security measures necessary to reduce risks to a reasonable and appropriate level.

### Key Findings

- **Overall Risk Level:** Low to Moderate
- **Critical Assets Identified:** PHI database, audit logs, consent records
- **Primary Threats:** Unauthorized access, data breaches, insider threats
- **Implemented Safeguards:** Comprehensive (audit logging, encryption, access controls)
- **Residual Risk:** Acceptable with current controls

### Risk Assessment Methodology

This assessment follows NIST SP 800-30 guidelines and evaluates risks across three dimensions:

1. **Threat Likelihood** (1-5 scale)
2. **Impact Severity** (1-5 scale)
3. **Current Safeguards** effectiveness

---

## 1. Organization Overview

### 1.1 Business Description

Metzler Foundations is a Colorado-based nonprofit organization providing housing scholarships for individuals recovering from substance use disorders. The organization collects and processes PHI to determine eligibility and coordinate housing placement.

### 1.2 Data Environment

- **PHI Volume:** Low (beneficiary records, consent forms)
- **Data Types:** Personal identifiers, health status, emergency contacts
- **Storage:** Encrypted PostgreSQL database (Supabase)
- **Users:** Staff, partners, beneficiaries (authenticated access only)
- **Third Parties:** Supabase, Stripe, Google Workspace

### 1.3 Regulatory Requirements

- HIPAA Security Rule (45 CFR Part 164, Subpart C)
- 42 CFR Part 2 (Substance Use Disorder Records)
- Colorado Privacy Act
- Nonprofit governance standards

---

## 2. Risk Assessment Methodology

### 2.1 Risk Formula

```
Risk Score = (Threat Likelihood × Impact Severity) - Safeguard Effectiveness
```

### 2.2 Risk Levels

- **Very High:** 16-25 points
- **High:** 11-15 points
- **Moderate:** 6-10 points
- **Low:** 1-5 points
- **Very Low:** 0 points

### 2.3 Assessment Scope

- All electronic systems containing PHI
- Physical security of data storage locations
- Administrative processes for data handling
- Third-party service providers

---

## 3. Identified Assets and Systems

### 3.1 Critical Assets

| Asset                  | Description                                 | Sensitivity | Location              |
| ---------------------- | ------------------------------------------- | ----------- | --------------------- |
| **PHI Database**       | Beneficiary records, consents, applications | High        | Supabase (Cloud)      |
| **Audit Logs**         | Access and modification records             | High        | Supabase (Cloud)      |
| **Application Forms**  | User-submitted PHI data                     | High        | SvelteKit application |
| **Email Systems**      | PHI communications                          | Medium      | Google Workspace      |
| **Payment Processing** | Financial transaction data                  | Medium      | Stripe                |

### 3.2 Supporting Systems

| System                      | Purpose              | PHI Exposure | Risk Level |
| --------------------------- | -------------------- | ------------ | ---------- |
| **Supabase Database**       | Primary data storage | High         | Low        |
| **SvelteKit Application**   | User interface       | Medium       | Low        |
| **Google Workspace**        | Email/communication  | Medium       | Low        |
| **Stripe**                  | Payment processing   | Low          | Low        |
| **Development Environment** | Code repositories    | Low          | Medium     |

---

## 4. Threat Analysis

### 4.1 External Threats

#### Threat: Unauthorized Network Access

- **Likelihood:** 3/5 (Moderate - web application exposure)
- **Impact:** 5/5 (Critical - full PHI compromise)
- **Safeguards:** 4/5 (Strong - encryption, access controls, monitoring)
- **Risk Score:** (3×5) - 4 = **11** (High)
- **Mitigations:** Multi-factor authentication, encrypted transmission, regular security updates

#### Threat: Phishing/Social Engineering

- **Likelihood:** 4/5 (High - common attack vector)
- **Impact:** 4/5 (High - credential compromise)
- **Safeguards:** 3/5 (Moderate - basic training, email filters)
- **Risk Score:** (4×4) - 3 = **13** (High)
- **Mitigations:** Enhanced staff training, email security, MFA requirements

#### Threat: Malware/Ransomware

- **Likelihood:** 2/5 (Low - limited user base)
- **Impact:** 5/5 (Critical - data encryption/loss)
- **Safeguards:** 4/5 (Strong - endpoint protection, backups)
- **Risk Score:** (2×5) - 4 = **6** (Moderate)
- **Mitigations:** Regular backups, endpoint security, access restrictions

### 4.2 Internal Threats

#### Threat: Unauthorized Access by Staff

- **Likelihood:** 2/5 (Low - role-based controls)
- **Impact:** 5/5 (Critical - insider access)
- **Safeguards:** 5/5 (Excellent - RBAC, audit logging)
- **Risk Score:** (2×5) - 5 = **5** (Low)
- **Mitigations:** Role-based access, audit logging, background checks

#### Threat: Accidental Data Exposure

- **Likelihood:** 3/5 (Moderate - human error possible)
- **Impact:** 4/5 (High - unintended disclosure)
- **Safeguards:** 4/5 (Strong - training, system controls)
- **Risk Score:** (3×4) - 4 = **8** (Moderate)
- **Mitigations:** Staff training, system warnings, access controls

### 4.3 Technical Threats

#### Threat: Database Compromise

- **Likelihood:** 1/5 (Very Low - Supabase security)
- **Impact:** 5/5 (Critical - all PHI at risk)
- **Safeguards:** 5/5 (Excellent - enterprise-grade security)
- **Risk Score:** (1×5) - 5 = **0** (Very Low)
- **Mitigations:** Enterprise hosting, encryption, regular security audits

#### Threat: Application Vulnerabilities

- **Likelihood:** 2/5 (Low - modern framework)
- **Impact:** 4/5 (High - data exposure)
- **Safeguards:** 4/5 (Strong - secure coding, updates)
- **Risk Score:** (2×4) - 4 = **4** (Low)
- **Mitigations:** Code reviews, dependency updates, security testing

### 4.4 Environmental Threats

#### Threat: Natural Disaster/Data Center Failure

- **Likelihood:** 1/5 (Very Low - cloud redundancy)
- **Impact:** 4/5 (High - service disruption)
- **Safeguards:** 5/5 (Excellent - multi-region redundancy)
- **Risk Score:** (1×4) - 5 = **-1** (Very Low)
- **Mitigations:** Cloud redundancy, disaster recovery plans

---

## 5. Vulnerability Assessment

### 5.1 Technical Vulnerabilities

#### Vulnerability: Weak Passwords

- **Severity:** Medium
- **Likelihood:** Low
- **Impact:** High
- **Status:** Mitigated (password requirements, MFA)
- **Recommendation:** Regular password audits

#### Vulnerability: Unencrypted Data Transmission

- **Severity:** High
- **Likelihood:** None
- **Impact:** Critical
- **Status:** Mitigated (HTTPS, TLS 1.3)
- **Recommendation:** Annual certificate validation

#### Vulnerability: Outdated Software

- **Severity:** Medium
- **Likelihood:** Low
- **Impact:** High
- **Status:** Mitigated (automated updates)
- **Recommendation:** Monthly patch management

### 5.2 Administrative Vulnerabilities

#### Vulnerability: Insufficient Training

- **Severity:** Medium
- **Likelihood:** Medium
- **Impact:** High
- **Status:** Partially Mitigated (basic training program)
- **Recommendation:** Comprehensive HIPAA training program

#### Vulnerability: Inadequate Policies

- **Severity:** Low
- **Likelihood:** Low
- **Impact:** Medium
- **Status:** Mitigated (comprehensive policies)
- **Recommendation:** Annual policy reviews

### 5.3 Physical Vulnerabilities

#### Vulnerability: Unsecured Workstations

- **Severity:** Medium
- **Likelihood:** Low
- **Impact:** Medium
- **Status:** Mitigated (remote work policies)
- **Recommendation:** Device encryption requirements

---

## 6. Current Safeguards Evaluation

### 6.1 Administrative Safeguards

| Safeguard               | Implementation      | Effectiveness | Compliance        |
| ----------------------- | ------------------- | ------------- | ----------------- |
| **Security Management** | Documented policies | High          | Compliant         |
| **Risk Analysis**       | Annual assessments  | High          | Compliant         |
| **Sanction Policy**     | Written procedures  | High          | Compliant         |
| **Information Access**  | Role-based controls | High          | Compliant         |
| **Security Training**   | Annual training     | Medium        | Needs Enhancement |
| **Incident Response**   | Documented plan     | High          | Compliant         |

### 6.2 Physical Safeguards

| Safeguard                | Implementation      | Effectiveness | Compliance        |
| ------------------------ | ------------------- | ------------- | ----------------- |
| **Facility Access**      | Remote work model   | High          | Compliant         |
| **Workstation Security** | Device management   | Medium        | Needs Enhancement |
| **Device Security**      | Encryption required | High          | Compliant         |

### 6.3 Technical Safeguards

| Safeguard                 | Implementation               | Effectiveness | Compliance        |
| ------------------------- | ---------------------------- | ------------- | ----------------- |
| **Access Control**        | Supabase RLS + RBAC          | High          | Compliant         |
| **Audit Controls**        | Comprehensive logging        | High          | Compliant         |
| **Integrity**             | Data validation + encryption | High          | Compliant         |
| **Transmission Security** | TLS 1.3 + VPN                | High          | Compliant         |
| **Emergency Access**      | Emergency procedures         | Medium        | Needs Enhancement |

---

## 7. Risk Treatment Plan

### 7.1 High Priority Risks

#### Risk: Phishing/Social Engineering (Score: 13)

**Treatment Strategy:** Risk Mitigation

- **Actions:**
  - Implement advanced email security (SPF, DKIM, DMARC)
  - Conduct quarterly phishing awareness training
  - Deploy endpoint protection with anti-phishing
  - Implement zero-trust access controls
- **Timeline:** Immediate (within 30 days)
- **Responsible:** IT Security Officer
- **Cost:** Medium

#### Risk: Unauthorized Network Access (Score: 11)

**Treatment Strategy:** Risk Mitigation

- **Actions:**
  - Implement Web Application Firewall (WAF)
  - Regular penetration testing
  - Multi-factor authentication for all accounts
  - Network segmentation
- **Timeline:** Within 60 days
- **Responsible:** IT Security Officer
- **Cost:** Medium

### 7.2 Moderate Priority Risks

#### Risk: Accidental Data Exposure (Score: 8)

**Treatment Strategy:** Risk Mitigation

- **Actions:**
  - Enhanced staff training program
  - Implement data loss prevention (DLP) tools
  - Regular security awareness communications
  - Automated alerts for suspicious activity
- **Timeline:** Within 90 days
- **Responsible:** Compliance Officer
- **Cost:** Low

#### Risk: Malware/Ransomware (Score: 6)

**Treatment Strategy:** Risk Mitigation

- **Actions:**
  - Deploy advanced endpoint protection
  - Implement backup encryption
  - Regular security assessments
  - Incident response testing
- **Timeline:** Within 90 days
- **Responsible:** IT Security Officer
- **Cost:** Medium

### 7.3 Low Priority Risks

#### Risk: Application Vulnerabilities (Score: 4)

**Treatment Strategy:** Risk Mitigation

- **Actions:**
  - Implement automated security testing
  - Regular code security reviews
  - Dependency vulnerability scanning
  - Secure development practices
- **Timeline:** Within 180 days
- **Responsible:** Development Team
- **Cost:** Low

---

## 8. Residual Risk Assessment

After implementing the recommended risk treatments, residual risk levels are expected to be:

| Risk Category             | Current Level | Expected Level | Confidence |
| ------------------------- | ------------- | -------------- | ---------- |
| **External Threats**      | High          | Low            | High       |
| **Internal Threats**      | Low           | Very Low       | High       |
| **Technical Threats**     | Low           | Very Low       | High       |
| **Environmental Threats** | Very Low      | Very Low       | High       |

**Overall Residual Risk:** Low (Acceptable)

---

## 9. Compliance Status

### 9.1 HIPAA Security Rule Requirements

| Requirement            | Status       | Evidence                   |
| ---------------------- | ------------ | -------------------------- |
| **Risk Analysis**      | ✅ Compliant | This document              |
| **Risk Management**    | ✅ Compliant | Treatment plan implemented |
| **Sanction Policy**    | ✅ Compliant | Documented procedures      |
| **Information Access** | ✅ Compliant | RBAC implemented           |
| **Security Training**  | 🟡 Partial   | Needs enhancement          |
| **Incident Response**  | ✅ Compliant | Breach response plan       |
| **Contingency Plan**   | ✅ Compliant | Backup/recovery procedures |
| **Evaluation**         | ✅ Compliant | Annual assessments         |

### 9.2 42 CFR Part 2 Compliance

| Requirement           | Status       | Evidence                  |
| --------------------- | ------------ | ------------------------- |
| **Confidentiality**   | ✅ Compliant | Consent-based disclosures |
| **Security**          | ✅ Compliant | Technical safeguards      |
| **Audit Controls**    | ✅ Compliant | Comprehensive logging     |
| **Intake Procedures** | ✅ Compliant | Documented processes      |

---

## 10. Monitoring and Review

### 10.1 Ongoing Monitoring

- **Automated:** Security information and event management (SIEM)
- **Monthly:** Vulnerability scans and log reviews
- **Quarterly:** Risk assessment updates
- **Annually:** Comprehensive security risk assessment

### 10.2 Review Triggers

This assessment will be reviewed and updated when:

- Significant changes to systems or processes occur
- New threats or vulnerabilities are identified
- Security incidents occur
- Regulatory requirements change
- Annual review cycle (minimum)

### 10.3 Reporting

- **Quarterly:** Risk assessment status to board
- **Annually:** Comprehensive risk assessment report
- **As Needed:** Incident-related updates

---

## 11. Signatures and Approval

**This Security Risk Assessment has been reviewed and approved:**

**Compliance Officer:** ****\*\*\*\*****\_\_\_****\*\*\*\***** Date: **\*\***\_\_\_**\*\***  
**IT Security Officer:** ****\*\*\*\*****\_\_\_****\*\*\*\***** Date: **\*\***\_\_\_**\*\***  
**Privacy Officer:** ****\*\*\*\*****\_\_\_****\*\*\*\***** Date: **\*\***\_\_\_**\*\***  
**Executive Director:** ****\*\*\*\*****\_\_\_****\*\*\*\***** Date: **\*\***\_\_\_**\*\***

---

## Appendices

### Appendix A: Risk Scoring Methodology

### Appendix B: Detailed Threat Models

### Appendix C: Safeguards Inventory

### Appendix D: Third-Party Risk Assessments

---

**This document is confidential and contains sensitive security information. Unauthorized distribution is prohibited.**
