# HIPAA Data Retention and Deletion Policy

**Metzler Foundations**  
**Effective Date:** November 16, 2025  
**Last Updated:** November 16, 2025  
**Version:** 1.0

---

## Table of Contents

1. [Purpose and Scope](#purpose-and-scope)
2. [Legal Basis](#legal-basis)
3. [Data Classification](#data-classification)
4. [Retention Schedules](#retention-schedules)
5. [Data Deletion Procedures](#data-deletion-procedures)
6. [Data Minimization](#data-minimization)
7. [Archival Procedures](#archival-procedures)
8. [Audit and Compliance](#audit-and-compliance)
9. [Policy Exceptions](#policy-exceptions)

---

## 1. Purpose and Scope

### 1.1 Purpose

This Data Retention and Deletion Policy establishes the procedures for retaining, archiving, and deleting Protected Health Information (PHI) and other sensitive data in compliance with HIPAA, 42 CFR Part 2, and other applicable regulations.

### 1.2 Scope

This policy applies to:

- All PHI collected, stored, or processed by Metzler Foundations
- All electronic and physical records containing sensitive information
- All systems, databases, and storage media
- All employees, contractors, and third parties handling organization data

---

## 2. Legal Basis

### 2.1 HIPAA Requirements

- **45 CFR § 164.316(b)(2)(i)**: Implement policies and procedures for retention and destruction of PHI
- **45 CFR § 164.530(j)**: Maintain PHI for minimum necessary period
- **Privacy Rule**: PHI may be retained no longer than necessary for authorized purposes

### 2.2 42 CFR Part 2 Requirements

- Substance use disorder records must be retained according to state laws
- Consent revocation does not affect retention requirements
- Records must be maintained for required periods even after consent withdrawal

### 2.2 State Laws

- Colorado records retention requirements
- Nonprofit organization record-keeping obligations
- Tax and financial record retention

---

## 3. Data Classification

### 3.1 Protected Health Information (PHI)

Any information that identifies an individual and relates to:

- Past, present, or future physical or mental health condition
- Healthcare services provided to the individual
- Past, present, or future payment for healthcare
- Information that could be used to identify the individual

### 3.2 Sensitive Personal Information

- Full names, addresses, phone numbers
- Social Security Numbers (not stored)
- Emergency contact information
- Application details and special requirements

### 3.3 Operational Data

- Audit logs and access records
- Consent records and authorizations
- Application and approval records
- Financial and payment records

### 3.4 Public Data

- Anonymized impact metrics
- General program information
- Policy documents (redacted as needed)

---

## 4. Retention Schedules

### 4.1 PHI Retention Requirements

| Data Type                  | Retention Period                    | Legal Basis             | Storage Method     |
| -------------------------- | ----------------------------------- | ----------------------- | ------------------ |
| **Beneficiary Records**    | 7 years after last contact          | HIPAA Privacy Rule      | Encrypted database |
| **Application Records**    | 7 years after application           | State nonprofit laws    | Encrypted database |
| **Consent Records**        | 7 years after expiration/revocation | 42 CFR Part 2, HIPAA    | Encrypted database |
| **Emergency Contact Info** | 7 years after program completion    | HIPAA minimum necessary | Encrypted database |

### 4.2 Operational Records

| Data Type            | Retention Period | Legal Basis         | Storage Method     |
| -------------------- | ---------------- | ------------------- | ------------------ |
| **Audit Logs**       | 7 years          | HIPAA Security Rule | Encrypted database |
| **Access Records**   | 7 years          | HIPAA Security Rule | Encrypted database |
| **Incident Reports** | 7 years          | HIPAA Breach Rule   | Encrypted database |
| **Training Records** | 7 years          | HIPAA Security Rule | Encrypted database |

### 4.3 Financial Records

| Data Type               | Retention Period | Legal Basis                | Storage Method       |
| ----------------------- | ---------------- | -------------------------- | -------------------- |
| **Tax Records**         | 7 years          | IRS requirements           | Secure cloud storage |
| **Payment Records**     | 7 years          | Nonprofit regulations      | Encrypted database   |
| **Financial Audits**    | Permanent        | Nonprofit bylaws           | Secure cloud storage |
| **Scholarship Records** | 7 years          | Tax exemption requirements | Encrypted database   |

### 4.4 Legal and Compliance Records

| Data Type                         | Retention Period          | Legal Basis         | Storage Method       |
| --------------------------------- | ------------------------- | ------------------- | -------------------- |
| **Breach Notifications**          | Permanent                 | HIPAA Breach Rule   | Encrypted database   |
| **Business Associate Agreements** | 7 years after termination | HIPAA Privacy Rule  | Secure cloud storage |
| **Privacy Policies**              | Permanent                 | HIPAA Privacy Rule  | Secure cloud storage |
| **Security Assessments**          | 7 years                   | HIPAA Security Rule | Secure cloud storage |

---

## 5. Data Deletion Procedures

### 5.1 Automated Deletion

- Database triggers automatically schedule deletion based on retention policies
- Scheduled jobs run weekly to identify and process expired records
- Manual review required for records approaching expiration

### 5.2 Secure Deletion Methods

- **Database Records**: PostgreSQL `DELETE` with audit logging
- **File Storage**: Secure erase using DoD 5220.22-M standard
- **Backups**: Automated expiration and secure deletion
- **Physical Media**: Secure shredding or degaussing

### 5.3 Deletion Process

1. **Identification**: Automated scan identifies records past retention period
2. **Review**: Compliance officer reviews for legal holds or ongoing investigations
3. **Notification**: Affected individuals notified 30 days before deletion (if applicable)
4. **Deletion**: Secure deletion with audit logging
5. **Verification**: Post-deletion verification and audit trail update

### 5.4 Consent-Based Deletion

- Individuals may request deletion of their data under certain conditions
- Exceptions apply for legal requirements, ongoing care, or payment disputes
- Process documented and subject to approval by Privacy Officer

---

## 6. Data Minimization

### 6.1 Collection Principles

We collect only the minimum necessary information required for:

- Program eligibility determination
- Service delivery and coordination
- Legal and regulatory compliance
- Quality improvement and evaluation

### 6.2 Data We Do NOT Collect or Store

- Social Security Numbers (temporary verification only)
- Full date of birth (age verification only)
- Detailed medical histories (unless required for eligibility)
- Financial account information (processed by third parties)

### 6.3 Data We Encrypt at Rest

- All PHI fields in database
- Emergency contact information
- Special requirements and notes
- Audit log details and changes

---

## 7. Archival Procedures

### 7.1 Archival Criteria

Records are archived when:

- Required for ongoing legal proceedings
- Subject to audit or investigation
- Part of long-term research or evaluation
- Required by state or federal law

### 7.2 Archival Storage

- Encrypted, immutable storage
- Access restricted to authorized personnel only
- Metadata includes retention rationale
- Regular integrity checks performed

### 7.3 Archival Access

- Access logged and auditable
- Requires approval from Privacy Officer
- Limited to minimum necessary personnel
- Subject to same security controls as active data

---

## 8. Audit and Compliance

### 8.1 Regular Audits

- **Monthly**: Automated scans for expired data
- **Quarterly**: Manual review of retention schedules
- **Annually**: Comprehensive retention policy audit
- **As Needed**: Investigations or legal requests

### 8.2 Audit Trails

All retention and deletion activities are logged including:

- Date and time of action
- User performing action
- Records affected
- Reason for retention/deletion
- Approval documentation

### 8.3 Compliance Monitoring

- Automated alerts for policy violations
- Regular reporting to Privacy Officer
- Annual certification of compliance
- Integration with HIPAA compliance program

---

## 9. Policy Exceptions

### 9.1 Legal Holds

Data retention may be extended when:

- Subject to ongoing litigation
- Part of government investigation
- Required by court order or subpoena
- Necessary for regulatory compliance

### 9.2 Emergency Situations

In emergency situations, the Privacy Officer may authorize:

- Temporary retention extensions
- Suspension of automated deletion
- Alternative storage arrangements

### 9.3 Research and Evaluation

Data may be retained longer for:

- Approved research protocols
- Program evaluation studies
- Quality improvement initiatives
- With proper IRB approval and consent

---

## Implementation Details

### Automated Retention System

```sql
-- Example: Automated cleanup trigger
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete expired beneficiary records (7 years)
  DELETE FROM beneficiaries
  WHERE created_at < NOW() - INTERVAL '7 years'
  AND id NOT IN (
    SELECT DISTINCT beneficiary_id
    FROM applications
    WHERE status IN ('active', 'pending')
  );

  -- Log deletion activity
  INSERT INTO audit_log (action, resource_type, purpose)
  VALUES ('DELETE', 'beneficiaries', 'Automated retention policy cleanup');
END;
$$ LANGUAGE plpgsql;
```

### Manual Review Process

1. System identifies records approaching expiration
2. Compliance team reviews for exceptions
3. Privacy Officer approves deletion
4. Automated deletion occurs
5. Audit trail updated

---

## Contact Information

**Privacy Officer:** privacy@metzlerfoundations.org | (555) 123-4567  
**Compliance Officer:** compliance@metzlerfoundations.org | (555) 123-4568  
**IT Security Officer:** security@metzlerfoundations.org | (555) 123-4569

---

## Revision History

| Version | Date              | Description             | Author          |
| ------- | ----------------- | ----------------------- | --------------- |
| 1.0     | November 16, 2025 | Initial policy creation | Compliance Team |

---

**This policy ensures compliance with HIPAA, 42 CFR Part 2, and Colorado privacy laws while protecting patient rights and organizational interests.**

**Approved by:**  
Privacy Officer: \***\*\*\*\*\*\*\***\_\_\_\***\*\*\*\*\*\*\*** Date: **\*\***\_\_\_**\*\***  
Executive Director: \***\*\*\*\*\*\*\***\_\***\*\*\*\*\*\*\*** Date: **\*\***\_\_\_**\*\***
